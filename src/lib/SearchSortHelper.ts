export interface SearchSortParams {
  searchTerm: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  pageSize: number;
}

export interface SortHelper {
  getSortUrl: (column: string) => string;
  getSortIndicator: (column: string) => string;
  sortBy: string;
}

export class ReportSearchSort {
  private url: URL;
  private report: any;
  private params: SearchSortParams;

  constructor(url: URL, report: any) {
    this.url = url;
    this.report = report;
    this.params = this.extractParams();
  }

  // Extract search/sort/pagination parameters from URL
  private extractParams(): SearchSortParams {
    return {
      searchTerm: this.url.searchParams.get('search') || '',
      sortBy: this.url.searchParams.get('sort') || this.report.searchConfig?.defaultSort || '',
      sortOrder: this.url.searchParams.get('order') || this.report.searchConfig?.defaultOrder || 'desc',
      page: Math.max(1, parseInt(this.url.searchParams.get('page') || '1')),
      pageSize: parseInt(this.url.searchParams.get('pageSize') || this.report.searchConfig?.pageSize?.toString() || '25')
    };
  }

  // Get current search/sort/pagination parameters
  getParams(): SearchSortParams {
    return this.params;
  }

  // Build URL for sorting by a specific column
  getSortUrl = (column: string): string => {
    const params = new URLSearchParams();
    
    // Preserve all non-sort parameters
    for (const [key, value] of this.url.searchParams) {
      if (!['sort', 'order'].includes(key)) {
        params.set(key, value);
      }
    }
    
    // Toggle sort order if clicking the same column
    const newOrder = this.params.sortBy === column && this.params.sortOrder === 'asc' ? 'desc' : 'asc';
    params.set('sort', column);
    params.set('order', newOrder);
    
    return `?${params.toString()}`;
  };

  // Get sort direction indicator for a column
  getSortIndicator = (column: string): string => {
    if (this.params.sortBy !== column) return '';
    return this.params.sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  // Build URL for pagination
  getPageUrl = (targetPage: number): string => {
    const params = new URLSearchParams();
    
    // Preserve all non-page parameters
    for (const [key, value] of this.url.searchParams) {
      if (!['page'].includes(key)) {
        params.set(key, value);
      }
    }
    
    if (targetPage !== 1) {
      params.set('page', targetPage.toString());
    }
    
    return `?${params.toString()}`;
  };

  // Create sortHelper object for ReportTable component
  createSortHelper(): SortHelper | null {
    if (!this.report.searchConfig) return null;
    
    return {
      getSortUrl: this.getSortUrl,
      getSortIndicator: this.getSortIndicator,
      sortBy: this.params.sortBy
    };
  }

  // Check if report supports search/sort/pagination
  isSearchSortEnabled(): boolean {
    return !!(this.report.searchConfig && this.report.type === 'table');
  }

  // Get search term for display
  getSearchTerm(): string {
    return this.params.searchTerm;
  }

  // Get current sort info for display
  getCurrentSort(): { sortBy: string; sortOrder: string } {
    return {
      sortBy: this.params.sortBy,
      sortOrder: this.params.sortOrder
    };
  }

  // Get result count for search display
  getResultCount(totalRecords: number): number | undefined {
    return this.params.searchTerm ? totalRecords : undefined;
  }
}