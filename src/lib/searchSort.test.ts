import { describe, it, expect } from 'vitest';
import { SearchSortHelper } from './searchSort';
import type { SearchSortConfig } from './searchSort';
import { getTableColumns } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// --- Mock Schema ---
const mockUsersTable = sqliteTable('users', {
  id: integer('id'),
  name: text('name'),
  email: text('email'),
  createdAt: integer('created_at'),
});

const { name, email, createdAt } = getTableColumns(mockUsersTable);

const mockConfig: SearchSortConfig = {
  searchableFields: [name, email],
  sortableFields: {
    name: name,
    createdAt: createdAt,
  },
  defaultSort: 'createdAt',
  defaultOrder: 'desc',
  pageSize: 10,
};

describe('SearchSortHelper', () => {
  it('should initialize with default values from an empty URL', () => {
    const url = new URL('http://localhost/users');
    const helper = new SearchSortHelper(mockConfig, url);
    expect(helper.sortParams.sortOrder).toBe('desc');
  });

  it('should parse search, sort, and pagination from URL parameters', () => {
    const url = new URL('http://localhost/users?search=jane&sort=name&order=asc&page=3&pageSize=50');
    const helper = new SearchSortHelper(mockConfig, url);
    expect(helper.searchTerm).toBe('jane');
    expect(helper.sortParams.sortBy).toBe('name');
    expect(helper.sortParams.sortOrder).toBe('asc');
  });

  it('should generate a correct Drizzle search filter', () => {
    const url = new URL('http://localhost/users?search=john');
    const helper = new SearchSortHelper(mockConfig, url);
    const filter = helper.getSearchFilter();
    
    expect(filter).toBeDefined();
    // Test that it's a SQL object (has queryChunks property which is common to SQL objects)
    expect(filter).toHaveProperty('queryChunks');
    // Test that it returns undefined when no search term
    const urlNoSearch = new URL('http://localhost/users');
    const helperNoSearch = new SearchSortHelper(mockConfig, urlNoSearch);
    expect(helperNoSearch.getSearchFilter()).toBeUndefined();
  });

  it('should generate a correct Drizzle sort order', () => {
    const url = new URL('http://localhost/users?sort=name&order=asc');
    const helper = new SearchSortHelper(mockConfig, url);
    const order = helper.getSortOrder();
    
    expect(order).toBeDefined();
    // Test that it's a SQL object
    expect(order).toHaveProperty('queryChunks');
    // Test that it returns undefined when sort field doesn't exist
    const urlBadSort = new URL('http://localhost/users?sort=nonexistent&order=asc');
    const helperBadSort = new SearchSortHelper(mockConfig, urlBadSort);
    expect(helperBadSort.getSortOrder()).toBeUndefined();
  });

  it('should calculate pagination info correctly', () => {
    const url = new URL('http://localhost/users?page=2&pageSize=10');
    const helper = new SearchSortHelper(mockConfig, url);
    const pagination = helper.getPaginationInfo(99);
    expect(pagination.totalPages).toBe(10);
    expect(pagination.currentPage).toBe(2);
    expect(pagination.startRecord).toBe(11);
    expect(pagination.endRecord).toBe(20);
    expect(pagination.hasNext).toBe(true);
    expect(pagination.hasPrev).toBe(true);
  });

  it('should handle edge cases for search filter', () => {
    // No searchable fields
    const configNoFields: SearchSortConfig = {
      searchableFields: [],
      sortableFields: { name: name },
    };
    const url = new URL('http://localhost/users?search=test');
    const helper = new SearchSortHelper(configNoFields, url);
    expect(helper.getSearchFilter()).toBeUndefined();
  });

  it('should handle edge cases for sort order', () => {
    // No sortable fields
    const configNoSort: SearchSortConfig = {
      searchableFields: [name],
      sortableFields: {},
    };
    const url = new URL('http://localhost/users?sort=name');
    const helper = new SearchSortHelper(configNoSort, url);
    expect(helper.getSortOrder()).toBeUndefined();
  });

  it('should generate correct pagination URLs', () => {
    const url = new URL('http://localhost/users?search=test&sort=name&order=asc&page=2');
    const helper = new SearchSortHelper(mockConfig, url);
    
    const pageUrl = helper.getPageUrl(3);
    expect(pageUrl).toContain('page=3');
    expect(pageUrl).toContain('search=test');
    expect(pageUrl).toContain('sort=name');
  });

  it('should generate correct sort URLs', () => {
    const url = new URL('http://localhost/users?search=test&sort=name&order=asc&page=2');
    const helper = new SearchSortHelper(mockConfig, url);
    
    const sortUrl = helper.getSortUrl('name');
    expect(sortUrl).toContain('sort=name');
    expect(sortUrl).toContain('order=desc'); // Should flip to desc
    expect(sortUrl).toContain('page=1'); // Should reset to page 1
  });
});