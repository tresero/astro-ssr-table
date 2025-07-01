import { sql, like, asc, desc, SQL, and, or } from 'drizzle-orm';
import type { AnyColumn } from 'drizzle-orm';

export interface SearchSortConfig {
  searchableFields?: AnyColumn[];
  sortableFields?: Record<string, AnyColumn | SQL>;
  defaultSort?: string;
  defaultOrder?: 'asc' | 'desc';
  pageSize?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  startRecord: number;
  endRecord: number;
}

export class SearchSortHelper {
  private config: SearchSortConfig;
  public readonly url: URL;
  public readonly sortParams: { sortBy: string; sortOrder: 'asc' | 'desc'; };
  public readonly searchTerm: string;
  public readonly page: number;
  public readonly pageSize: number;

  constructor(config: SearchSortConfig, url: URL) {
    // --- CORRECTED CONSTRUCTOR LOGIC ---
    // This correctly merges the defaults with the provided config,
    // ensuring no properties are ever undefined.
    const defaults: SearchSortConfig = {
      pageSize: 25,
      defaultOrder: 'asc',
      searchableFields: [],
      sortableFields: {},
    };
    this.config = { ...defaults, ...config };
    
    this.url = url;
    this.searchTerm = url.searchParams.get('search') || '';
    this.page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    this.pageSize = parseInt(url.searchParams.get('pageSize') || this.config.pageSize!.toString());

    const defaultSortKey = Object.keys(this.config.sortableFields!)[0] || '';
    const urlOrder = url.searchParams.get('order');

    this.sortParams = {
      sortBy: url.searchParams.get('sort') || this.config.defaultSort || defaultSortKey,
      sortOrder: (urlOrder === 'asc' || urlOrder === 'desc') ? urlOrder : this.config.defaultOrder!,
    };
  }

  getSearchFilter(): SQL | undefined {
    if (!this.searchTerm || !this.config.searchableFields || this.config.searchableFields.length === 0) {
      return undefined;
    }
    const searchConditions = this.config.searchableFields.map(field =>
      like(field, `%${this.searchTerm}%`)
    );
    return or(...searchConditions);
  }

  getSortOrder(): SQL | undefined {
    if (!this.sortParams.sortBy || !this.config.sortableFields) {
      return undefined;
    }
    const sortColumn = this.config.sortableFields[this.sortParams.sortBy];
    if (!sortColumn) {
      return undefined;
    }
    return this.sortParams.sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);
  }

  getPagination() {
    return {
      limit: this.pageSize,
      offset: (this.page - 1) * this.pageSize,
    };
  }

  getPaginationInfo(totalRecords: number): PaginationInfo {
    const totalPages = Math.ceil(totalRecords / this.pageSize) || 1;
    const currentPage = Math.min(Math.max(1, this.page), totalPages);
    const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * this.pageSize + 1;
    const endRecord = Math.min(currentPage * this.pageSize, totalRecords);

    return {
      currentPage,
      totalPages,
      totalRecords,
      pageSize: this.pageSize,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      startRecord,
      endRecord,
    };
  }

  getPageUrl(page: number): string {
    const params = new URLSearchParams(this.url.searchParams);
    params.set('page', page.toString());
    return `?${params.toString()}`;
  }

  getSortUrl(column: string): string {
    const params = new URLSearchParams(this.url.searchParams);
    const currentOrder = this.sortParams.sortOrder;
    const newOrder = this.sortParams.sortBy === column && currentOrder === 'asc' ? 'desc' : 'asc';

    params.set('sort', column);
    params.set('order', newOrder);
    params.set('page', '1');
    return `?${params.toString()}`;
  }
}