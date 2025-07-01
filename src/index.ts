// Export the components
export { default as ResponsiveTable } from './components/ResponsiveTable.astro';
export { default as Pagination } from './components/Pagination.astro';
export { default as SearchSortControls } from './components/SearchSortControls.astro';

// Export the helper class
export { SearchSortHelper } from './lib/SearchSortHelper';

// Export the TypeScript types for users
export type { Column, TableAction } from './lib/ColumnProcessor';