// src/lib/table/ColumnProcessor.ts

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  sortKey?: string;
  render?: (value: any, row: any) => string;
  className?: string;
  mobileLabel?: string;
  mobileRender?: (value: any, row: any) => string;
  hideOnMobile?: boolean;
}

export interface TableAction {
  label: string;
  url: string;
  className?: string;
  icon?: string;
}

export interface ProcessedColumnData {
  allColumns: Column[];
  mobileColumns: Column[];
  primaryColumn: Column;
  hasActions: boolean;
}

/**
 * Validates that columns array is properly formatted
 * @param columns - Array of column configurations
 * @returns Validated columns array
 */
export const validateColumns = (columns: any[]): Column[] => {
  if (!Array.isArray(columns) || columns.length === 0) {
    throw new Error('Columns must be a non-empty array');
  }

  return columns.map((col, index) => {
    if (!col.key || !col.label) {
      throw new Error(`Column ${index} must have both 'key' and 'label' properties`);
    }
    return col as Column;
  });
};

/**
 * Filters columns for mobile display (excludes hideOnMobile: true)
 * @param columns - Array of column configurations
 * @returns Filtered columns for mobile
 */
export const getMobileColumns = (columns: Column[]): Column[] => {
  return columns.filter(col => col.hideOnMobile !== true);
};

/**
 * Gets the primary column for titles and main content
 * @param columns - Array of column configurations  
 * @param primaryColumnKey - Optional specific column key to use as primary
 * @returns Primary column configuration
 */
export const getPrimaryColumn = (columns: Column[], primaryColumnKey?: string): Column => {
  if (primaryColumnKey) {
    const found = columns.find(c => c.key === primaryColumnKey);
    if (!found) {
      console.warn(`Primary column '${primaryColumnKey}' not found, using first column`);
      return columns[0];
    }
    return found;
  }
  return columns[0];
};

/**
 * Determines if table should show actions column
 * @param viewUrl - View URL pattern
 * @param editUrl - Edit URL pattern  
 * @param deleteUrl - Delete URL pattern
 * @param customActions - Array of custom actions
 * @param showActions - Explicit show/hide actions flag
 * @returns Whether to show actions column
 */
export const shouldShowActions = (
  viewUrl?: string,
  editUrl?: string, 
  deleteUrl?: string,
  customActions: TableAction[] = [],
  showActions: boolean = true
): boolean => {
  if (!showActions) return false;
  return !!(viewUrl || editUrl || deleteUrl || customActions.length > 0);
};

/**
 * Processes all column-related data for table rendering
 * @param columns - Raw column configurations
 * @param primaryColumnKey - Optional primary column key
 * @param viewUrl - View URL pattern
 * @param editUrl - Edit URL pattern
 * @param deleteUrl - Delete URL pattern  
 * @param customActions - Custom action configurations
 * @param showActions - Show actions flag
 * @returns Processed column data object
 */
export const processColumns = (
  columns: any[],
  primaryColumnKey?: string,
  viewUrl?: string,
  editUrl?: string,
  deleteUrl?: string, 
  customActions: TableAction[] = [],
  showActions: boolean = true
): ProcessedColumnData => {
  const validatedColumns = validateColumns(columns);
  
  return {
    allColumns: validatedColumns,
    mobileColumns: getMobileColumns(validatedColumns),
    primaryColumn: getPrimaryColumn(validatedColumns, primaryColumnKey),
    hasActions: shouldShowActions(viewUrl, editUrl, deleteUrl, customActions, showActions)
  };
};

/**
 * Gets the total number of table columns (data + actions)
 * @param columns - Column configurations
 * @param hasActions - Whether actions column exists
 * @returns Total column count
 */
export const getTotalColumnCount = (columns: Column[], hasActions: boolean): number => {
  return columns.length + (hasActions ? 1 : 0);
};