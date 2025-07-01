import { describe, it, expect } from 'vitest';
import {
  validateColumns,
  getMobileColumns,
  getPrimaryColumn,
  shouldShowActions,
  processColumns
} from './ColumnProcessor';
import type { Column } from './ColumnProcessor';

// Sample data for testing
const sampleColumns: Column[] = [
  { key: 'name', label: 'Name', hideOnMobile: false },
  { key: 'email', label: 'Email', hideOnMobile: true },
  { key: 'role', label: 'Role', hideOnMobile: false },
  { key: 'status', label: 'Status', hideOnMobile: true },
];

describe('ColumnProcessor', () => {

  // Test suite for validateColumns
  describe('validateColumns', () => {
    it('should throw an error for an empty array', () => {
      expect(() => validateColumns([])).toThrow('Columns must be a non-empty array');
    });

    it('should throw an error if a column is missing a key', () => {
      const invalidCols = [{ label: 'Name' }];
      // @ts-ignore
      expect(() => validateColumns(invalidCols)).toThrow("Column 0 must have both 'key' and 'label' properties");
    });
    
    it('should return the same array if all columns are valid', () => {
      expect(validateColumns(sampleColumns)).toEqual(sampleColumns);
    });
  });

  // Test suite for getMobileColumns
  describe('getMobileColumns', () => {
    it('should filter out columns where hideOnMobile is true', () => {
      const mobileCols = getMobileColumns(sampleColumns);
      expect(mobileCols.length).toBe(2);
      expect(mobileCols.map(c => c.key)).toEqual(['name', 'role']);
    });
  });

  // Test suite for getPrimaryColumn
  describe('getPrimaryColumn', () => {
    it('should return the first column by default', () => {
      expect(getPrimaryColumn(sampleColumns)).toBe(sampleColumns[0]);
    });

    it('should return the column specified by primaryColumnKey', () => {
      expect(getPrimaryColumn(sampleColumns, 'role')).toBe(sampleColumns[2]);
    });

    it('should return the first column if the specified key is not found', () => {
      expect(getPrimaryColumn(sampleColumns, 'nonexistent')).toBe(sampleColumns[0]);
    });
  });

  // Test suite for shouldShowActions
  describe('shouldShowActions', () => {
    it('should return false if showActions prop is false', () => {
      expect(shouldShowActions('/view', '/edit', '/delete', [], false)).toBe(false);
    });

    it('should return true if editUrl is provided', () => {
      expect(shouldShowActions(undefined, '/edit')).toBe(true);
    });
    
    it('should return true if customActions are provided', () => {
      expect(shouldShowActions(undefined, undefined, undefined, [{ label: 'Archive', url: '/archive' }])).toBe(true);
    });

    it('should return false if no URLs or custom actions are provided', () => {
      expect(shouldShowActions()).toBe(false);
    });
  });
  
  // Test suite for the main processColumns function
  describe('processColumns', () => {
    it('should process columns correctly and return the full data structure', () => {
      const processed = processColumns(sampleColumns, 'email', '/view', '/edit');
      
      expect(processed.allColumns.length).toBe(4);
      expect(processed.mobileColumns.length).toBe(2);
      expect(processed.primaryColumn.key).toBe('email');
      expect(processed.hasActions).toBe(true);
    });
  });

});