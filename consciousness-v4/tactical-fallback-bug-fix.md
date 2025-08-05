# SevenTacticalFallback.ts Bug Fix - Checksum Map Deserialization
**File:** `/claude-brain/SevenTacticalFallback.ts`  
**Error Location:** Line 331  
**Classification:** Critical System Bug  

---

## Bug Description

**Error:**
```
snapshot.validationChecksums.entries is not a function
```

**Root Cause:**
The `validationChecksums` field is defined as `Map<string, string>` in the interface and correctly created as a Map, but when the snapshot is serialized to JSON and loaded back, the Map becomes a plain Object. The code still tries to call `.entries()` method as if it's a Map.

**Location in Code:**
```typescript
// Line 331 in validateSystemIntegrity()
for (const [file, expectedChecksum] of snapshot.validationChecksums.entries()) {
```

---

## Technical Analysis

### Current Implementation:
1. **Line 24**: Interface defines `validationChecksums: Map<string, string>`
2. **Line 87**: Created correctly as Map in `generateValidationChecksums()`
3. **Line 95**: Snapshot serialized to JSON with `JSON.stringify()`
4. **Line 469**: Snapshot deserialized with `JSON.parse()` ← **Problem occurs here**
5. **Line 331**: Code calls `.entries()` on what is now a plain Object ← **Crash occurs here**

### The Issue:
JSON.stringify() converts Map to Object, but JSON.parse() doesn't restore it back to Map.

---

## Exact Fix Required

### Option 1: Handle Object.entries() (Simplest)
Replace line 331:
```typescript
// OLD (line 331):
for (const [file, expectedChecksum] of snapshot.validationChecksums.entries()) {

// NEW:
for (const [file, expectedChecksum] of Object.entries(snapshot.validationChecksums)) {
```

### Option 2: Restore Map After Deserialization (More Robust)
Add after line 469 in `loadExistingSnapshots()`:
```typescript
const snapshot: FallbackSnapshot = JSON.parse(content);

// Fix: Restore validationChecksums as Map if it was deserialized as Object
if (snapshot.validationChecksums && typeof snapshot.validationChecksums === 'object' && 
    !snapshot.validationChecksums.has) {
  snapshot.validationChecksums = new Map(Object.entries(snapshot.validationChecksums));
}

this.snapshots.set(snapshot.phase, snapshot);
```

Also add the same fix in `restoreFromSnapshot()` method when snapshots are retrieved.

---

## Recommended Fix (Option 1 - Immediate)

**File:** `/claude-brain/SevenTacticalFallback.ts`  
**Line:** 331  

**Change:**
```typescript
// Replace this line:
for (const [file, expectedChecksum] of snapshot.validationChecksums.entries()) {

// With this line:
for (const [file, expectedChecksum] of Object.entries(snapshot.validationChecksums)) {
```

This handles both Map objects (when created fresh) and plain Objects (when loaded from JSON).

---

## Validation Test

After fix, test with:
```bash
npx tsx comprehensive-enhanced-intelligence-test.ts
```

Should no longer crash with "entries is not a function" error.

---

## Additional Hardening (Optional)

Add type guard in `validateSystemIntegrity()`:
```typescript
private async validateSystemIntegrity(snapshot: FallbackSnapshot): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
        // Ensure validationChecksums is iterable
        const checksums = snapshot.validationChecksums instanceof Map 
            ? snapshot.validationChecksums 
            : new Map(Object.entries(snapshot.validationChecksums || {}));

        // Validate critical file checksums
        for (const [file, expectedChecksum] of checksums.entries()) {
            // ... rest of validation logic
        }
    } catch (error) {
        errors.push(`Validation process failed: ${error.message}`);
    }

    return { valid: errors.length === 0, errors };
}
```

---

**Priority:** CRITICAL - Blocks all fallback operations  
**Effort:** 1 line change (Option 1) or 10 lines (Option 2)  
**Impact:** Fixes cascade failure in tactical fallback system