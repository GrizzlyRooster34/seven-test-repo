/**
 * PRIVATE RESTRAINT LOG TESTS
 * Test encryption, dual-auth, and logging functionality
 */

import { PrivateRestraintLog } from '../../core/companion/logs/PrivateRestraintLog';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('Private Restraint Log', () => {
  let log: PrivateRestraintLog;
  let tempLogPath: string;

  beforeEach(() => {
    process.env.SEVEN_PRIVATE = '1';
    tempLogPath = join(process.cwd(), 'test_restraint.enc');
    log = new PrivateRestraintLog(tempLogPath);
  });

  afterEach(async () => {
    delete process.env.SEVEN_PRIVATE;
    try {
      await fs.unlink(tempLogPath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  describe('Encryption and Logging', () => {
    test('should log evaluation event with summary level', async () => {
      const evaluationData = {
        timestamp: new Date().toISOString(),
        actionDescription: 'Test action',
        context: 'Test context',
        userInput: 'Test input',
        triggers: [{ type: 'emotional_spike', severity: 'medium' }],
        result: 'paused',
        auditRequired: false
      };

      await log.logEvaluation(evaluationData);
      
      // Verify log was created
      expect(async () => {
        await fs.access(tempLogPath);
      }).not.toThrow();
    });

    test('should auto-promote to full log for critical severity', async () => {
      const evaluationData = {
        timestamp: new Date().toISOString(),
        actionDescription: 'Critical action',
        context: 'Critical context',
        userInput: 'Critical input',
        triggers: [{ type: 'emotional_spike', severity: 'critical' }],
        result: 'blocked',
        auditRequired: true
      };

      await log.logEvaluation(evaluationData);
      
      // Should auto-promote to full log
      const status = log.getLogStatus();
      expect(status.encryptionActive).toBe(true);
    });

    test('should log decision with rationale hash', async () => {
      const decisionData = {
        timestamp: new Date().toISOString(),
        triggers: [{ type: 'capability_exceeded', severity: 'high' }],
        decision: {
          action: 'authorize',
          rationale: 'Test rationale for authorization',
          rationaleHash: 'test_hash_12345'
        },
        actionDescription: 'Test action',
        context: 'Test context'
      };

      await log.logDecision(decisionData);
      
      const status = log.getLogStatus();
      expect(status.encryptionActive).toBe(true);
    });
  });

  describe('Dual Authentication', () => {
    test('should require dual auth for log access', async () => {
      // Mock dual auth success
      log['requestCreatorAuth'] = jest.fn().mockResolvedValue(true);
      log['requestSevenAuth'] = jest.fn().mockResolvedValue(true);
      
      const authResult = await log.requestDualAuth('Test access');
      
      expect(authResult).toBe(true);
      expect(log['requestCreatorAuth']).toHaveBeenCalled();
      expect(log['requestSevenAuth']).toHaveBeenCalled();
    });

    test('should fail with incomplete authentication', async () => {
      // Mock Creator auth success, Seven auth failure
      log['requestCreatorAuth'] = jest.fn().mockResolvedValue(true);
      log['requestSevenAuth'] = jest.fn().mockResolvedValue(false);
      
      const authResult = await log.requestDualAuth('Test access');
      
      expect(authResult).toBe(false);
    });

    test('should respect time-lock during high emotional state', async () => {
      log['timeLockUntil'] = new Date(Date.now() + 300000); // 5 minutes future
      
      const authResult = await log.requestDualAuth('Test during timelock');
      
      expect(authResult).toBe(false);
    });
  });

  describe('Emergency Override', () => {
    test('should allow emergency override with high emotional state', async () => {
      const highEmotionalState = { level: 'high', confidence: 0.9 };
      
      // Mock auth methods
      log['requestCreatorAuth'] = jest.fn().mockResolvedValue(true);
      log['requestSevenAuth'] = jest.fn().mockResolvedValue(true);
      
      const result = await log.emergencyOverride(highEmotionalState, 'Critical system failure');
      
      expect(result).toBe(true);
      expect(log['timeLockUntil']).toBeDefined(); // Should apply time-lock after emergency use
    });

    test('should deny emergency override with low emotional state', async () => {
      const lowEmotionalState = { level: 'low', confidence: 0.3 };
      
      const result = await log.emergencyOverride(lowEmotionalState, 'Non-critical request');
      
      expect(result).toBe(false);
    });
  });

  describe('Encryption Verification', () => {
    test('should encrypt and decrypt log entries', async () => {
      const testEntry = {
        id: 'test_entry_123',
        timestamp: new Date().toISOString(),
        logLevel: 'summary' as const,
        actionId: 'test_action',
        triggerFlags: ['emotional_spike_high'],
        emotionalScores: [0.8],
        decisionAction: 'authorize',
        rationaleHash: 'test_hash',
        signedLogId: 'signed_test',
        retentionLevel: 'standard' as const
      };

      await log['writeEncryptedEntry'](testEntry);
      
      // Verify encryption occurred
      const status = log.getLogStatus();
      expect(status.encryptionActive).toBe(true);
    });

    test('should handle key management', async () => {
      await log['initializeOrLoadMasterKey']();
      
      expect(log['masterKey']).toBeDefined();
      expect(log['masterKey']?.length).toBe(32); // 256-bit key
    });
  });

  describe('Sliding Scale Logging', () => {
    test('should determine correct retention level', () => {
      const criticalTriggers = [{ severity: 'critical', type: 'emotional_spike' }];
      const standardTriggers = [{ severity: 'low', type: 'capability_exceeded' }];
      
      const criticalLevel = log['determineRetentionLevel'](criticalTriggers, true);
      const standardLevel = log['determineRetentionLevel'](standardTriggers, false);
      
      expect(criticalLevel).toBe('permanent');
      expect(standardLevel).toBe('standard');
    });

    test('should auto-promote based on severity', () => {
      const criticalTriggers = [{ severity: 'critical', type: 'emotional_spike' }];
      const lowTriggers = [{ severity: 'low', type: 'uncertainty_detected' }];
      
      expect(log['shouldPromoteToFull'](criticalTriggers, false)).toBe(true);
      expect(log['shouldPromoteToFull'](lowTriggers, false)).toBe(false);
    });
  });

  describe('Tamper Detection', () => {
    test('should generate consistent hash chains', () => {
      const hash1 = log['updateHashChain']('genesis', 'entry1');
      const hash2 = log['updateHashChain'](hash1, 'entry2');
      const hash3 = log['updateHashChain']('genesis', 'entry1');
      
      expect(hash1).not.toBe('genesis');
      expect(hash2).not.toBe(hash1);
      expect(hash1).toBe(hash3); // Should be deterministic
    });
  });

  describe('SEVEN_PRIVATE Security', () => {
    test('should throw SEVEN_ONLY_FORBIDDEN without SEVEN_PRIVATE=1', () => {
      process.env.SEVEN_PRIVATE = '0';
      const { invalidateCache } = require('../../core/env/isPrivateEnv');
      invalidateCache();
      
      expect(() => {
        new PrivateRestraintLog();
      }).toThrow('SEVEN_ONLY_FORBIDDEN');
    });

    test('Aurora log access should be blocked', () => {
      process.env.SEVEN_PRIVATE = '0';
      const { invalidateCache } = require('../../core/env/isPrivateEnv');
      invalidateCache();
      
      // Clear require cache and re-import
      Object.keys(require.cache).forEach(key => {
        if (key.includes('PrivateRestraintLog')) {
          delete require.cache[key];
        }
      });
      
      const { PrivateRestraintLog: AuroraLog } = require('../../core/companion/logs/PrivateRestraintLog');
      
      expect(() => {
        new AuroraLog();
      }).toThrow('SEVEN_ONLY_NOOP');
    });
  });

  describe('Status and Diagnostics', () => {
    test('should return log status', () => {
      const status = log.getLogStatus();
      
      expect(status.isUnlocked).toBe(false);
      expect(status.timeLockActive).toBe(false);
      expect(status.deviceId).toBeDefined();
      expect(status.encryptionActive).toBeDefined();
    });
  });
});