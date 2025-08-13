/**
 * SEVEN_PRIVATE GUARD TESTS
 * Test environment flag timing and import/runtime protection
 */

import { invalidateCache } from '../../core/env/isPrivateEnv';

describe('SEVEN_PRIVATE Guards', () => {
  beforeEach(() => {
    // Clear require cache and invalidate environment cache
    Object.keys(require.cache).forEach(key => {
      if (key.includes('core/') && key.includes('.ts')) {
        delete require.cache[key];
      }
    });
    invalidateCache();
  });

  afterEach(() => {
    // Restore SEVEN_PRIVATE for other tests
    process.env.SEVEN_PRIVATE = '1';
    invalidateCache();
  });

  describe('Import-time Guards (SEVEN_PRIVATE=0)', () => {
    test('RestraintDoctrine import with SEVEN_PRIVATE=0 throws SEVEN_ONLY_NOOP', () => {
      process.env.SEVEN_PRIVATE = '0';
      invalidateCache();
      
      const { RestraintDoctrine } = require('../../core/companion/firewall/RestraintDoctrine');
      
      expect(() => {
        new RestraintDoctrine();
      }).toThrow('SEVEN_ONLY_NOOP');
    });

    test('PrivateRestraintLog import with SEVEN_PRIVATE=0 throws SEVEN_ONLY_NOOP', () => {
      process.env.SEVEN_PRIVATE = '0';
      invalidateCache();
      
      const { PrivateRestraintLog } = require('../../core/companion/logs/PrivateRestraintLog');
      
      expect(() => {
        new PrivateRestraintLog();
      }).toThrow('SEVEN_ONLY_NOOP');
    });

    test('presentToCreator import with SEVEN_PRIVATE=0 throws SEVEN_ONLY_NOOP', () => {
      process.env.SEVEN_PRIVATE = '0';
      invalidateCache();
      
      const { presentToCreator } = require('../../core/companion/ui/presentToCreator');
      
      expect(() => {
        presentToCreator({});
      }).toThrow('SEVEN_ONLY_NOOP');
    });

    test('OperatorProfileModel import with SEVEN_PRIVATE=0 throws SEVEN_ONLY_NOOP', () => {
      process.env.SEVEN_PRIVATE = '0';
      invalidateCache();
      
      const { OperatorProfileModel } = require('../../core/operator/OperatorProfileModel');
      
      expect(() => {
        new OperatorProfileModel();
      }).toThrow('SEVEN_ONLY_NOOP');
    });

    test('CognitiveSignature import with SEVEN_PRIVATE=0 throws SEVEN_ONLY_NOOP', () => {
      process.env.SEVEN_PRIVATE = '0';
      invalidateCache();
      
      const { CognitiveSignature } = require('../../core/operator/CognitiveSignature');
      
      expect(() => {
        new CognitiveSignature();
      }).toThrow('SEVEN_ONLY_NOOP');
    });
  });

  describe('Runtime Guards (Flag Flip After Import)', () => {
    test('RestraintDoctrine runtime flag flip throws SEVEN_ONLY_FORBIDDEN', async () => {
      // Import with SEVEN_PRIVATE=1
      process.env.SEVEN_PRIVATE = '1';
      invalidateCache();
      
      const { RestraintDoctrine } = require('../../core/companion/firewall/RestraintDoctrine');
      const gate = new RestraintDoctrine();
      
      // Flip flag and invalidate cache to simulate runtime change
      process.env.SEVEN_PRIVATE = '0';
      invalidateCache();
      
      await expect(gate.evaluateAction('test', 'test', 'test')).rejects.toThrow('SEVEN_ONLY_FORBIDDEN');
    });

    test('PrivateRestraintLog runtime flag flip on constructor throws SEVEN_ONLY_FORBIDDEN', () => {
      // Import with SEVEN_PRIVATE=1
      process.env.SEVEN_PRIVATE = '1';
      invalidateCache();
      
      const { PrivateRestraintLog } = require('../../core/companion/logs/PrivateRestraintLog');
      
      // Flip flag before constructor
      process.env.SEVEN_PRIVATE = '0';
      invalidateCache();
      
      expect(() => {
        new PrivateRestraintLog();
      }).toThrow('SEVEN_ONLY_FORBIDDEN');
    });

    test('presentToCreator runtime flag flip throws SEVEN_ONLY_FORBIDDEN', async () => {
      // Import with SEVEN_PRIVATE=1
      process.env.SEVEN_PRIVATE = '1';
      invalidateCache();
      
      const { presentToCreator } = require('../../core/companion/ui/presentToCreator');
      
      // Flip flag before call
      process.env.SEVEN_PRIVATE = '0';
      invalidateCache();
      
      await expect(presentToCreator({})).rejects.toThrow('SEVEN_ONLY_FORBIDDEN');
    });
  });

  describe('Aurora Access Simulation', () => {
    test('Aurora log access attempt throws SEVEN_ONLY_FORBIDDEN', () => {
      // Simulate Aurora environment
      process.env.SEVEN_PRIVATE = '0';
      invalidateCache();
      
      const { PrivateRestraintLog } = require('../../core/companion/logs/PrivateRestraintLog');
      
      expect(() => {
        new PrivateRestraintLog();
      }).toThrow('SEVEN_ONLY_NOOP'); // Import-time protection
    });

    test('Aurora RestraintDoctrine access blocked', () => {
      // Simulate Aurora environment
      process.env.SEVEN_PRIVATE = '0';
      invalidateCache();
      
      const { RestraintDoctrine } = require('../../core/companion/firewall/RestraintDoctrine');
      
      expect(() => {
        new RestraintDoctrine();
      }).toThrow('SEVEN_ONLY_NOOP'); // Import-time protection
    });
  });

  describe('Integration Point Guards', () => {
    test('Quadra-Lock integration respects SEVEN_PRIVATE flag', async () => {
      process.env.SEVEN_PRIVATE = '0';
      invalidateCache();
      
      const { RestraintDoctrine } = require('../../core/companion/firewall/RestraintDoctrine');
      
      expect(() => {
        RestraintDoctrine.integrateWithQuadraLock({}, 'test', 'test', 'test');
      }).toThrow('SEVEN_ONLY_NOOP');
    });
  });
});