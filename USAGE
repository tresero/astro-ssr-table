How to Use Astro SSR Table Toolkit
==================================

This guide provides a step-by-step example of how to implement a fully-featured, server-side data table using this library.

1\. The Backend (Page Frontmatter)
----------------------------------

In your Astro page's frontmatter script (---), you will import the SearchSortHelper and use it to process the URL and build your database query.

```
---
// src/pages/my-items/index.astro

// Core Drizzle and helper imports
import { db } from '../../lib/db';
import { myItemsTable, relatedTable } from '../../lib/schema';
import { eq, count } from 'drizzle-orm';
import { SearchSortHelper } from 'astro-ssr-table';
import type { Column } from 'astro-ssr-table';

// Component imports
import Layout from '../../layouts/Layout.astro';
import SearchSortControls from 'astro-ssr-table/components/SearchSortControls.astro';
import Pagination from 'astro-ssr-table/components/Pagination.astro';
import ResponsiveTable from 'astro-ssr-table/components/ResponsiveTable.astro';

// 1. Define the configuration for the helper
const searchSortConfig = {
  searchableFields: [myItemsTable.title, relatedTable.name],
  sortableFields: {
    title: myItemsTable.title,
    createdAt: myItemsTable.createdAt,
  },
  defaultSort: 'createdAt',
  defaultOrder: 'desc',
  pageSize: 25,
};

// 2. Create an instance of the helper
const helper = new SearchSortHelper(searchSortConfig, Astro.url);

// 3. Build your database queries using the helper's output
const searchFilter = helper.getSearchFilter();

// Get total records for pagination
const totalRecordsQuery = db.select({ count: count() })
  .from(myItemsTable)
  .where(searchFilter); // Pass the search filter to the count
const totalRecords = (await totalRecordsQuery)[0].count;

// Get the data for the current page
const itemsQuery = db.select(/*...your fields...*/)
  .from(myItemsTable)
  .where(searchFilter)
  .orderBy(helper.getSortOrder())
  .limit(helper.getPagination().limit)
  .offset(helper.getPagination().offset);
const items = await itemsQuery;

// Get pagination info
const pagination = helper.getPaginationInfo(totalRecords);

// 4. Define the columns for the ResponsiveTable
const columns: Column[] = [
  { 
    key: 'title', 
    label: 'Title', 
    sortable: true, 
    hideOnMobile: false 
  },
  { 
    key: 'createdAt', 
    label: 'Created', 
    sortable: true, 
    hideOnMobile: false,
    render: (value) => value ? new Date(value).toLocaleDateString('en-US') : '—'
  }
];
---
```

2\. The Frontend (Page Template)
--------------------------------

In the HTML section of your page, use the components. The helper and pagination instances from your frontmatter will provide all the necessary props.

```
<Layout title="My Items">
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">My Items</h1>
      </div>

    <SearchSortControls 
      searchTerm={helper.searchTerm}
      searchPlaceholder="Search by title..."
      sortBy={helper.sortParams.sortBy}
      sortOrder={helper.sortParams.sortOrder}
      baseUrl="/my-items"
    />

    <Pagination 
      pagination={pagination} 
      getPageUrl={(page) => helper.getPageUrl(page)} 
    />

    <ResponsiveTable
      data={items}
      columns={columns}
      viewUrl="/my-items/{id}"
      editUrl="/my-items/{id}/edit"
      deleteUrl="/my-items/{id}/delete"
      currentSort={helper.sortParams.sortBy}
      currentOrder={helper.sortParams.sortOrder}
      getSortUrl={(column) => helper.getSortUrl(column)}
    />

    <Pagination 
      pagination={pagination} 
      getPageUrl={(page) => helper.getPageUrl(page)} 
    />
  </div>
</Layout>

```

3\. Styling the Components
--------------------------

This library is "headless," meaning it ships with no default styles. You can apply your own styles by targeting the semantic, prefixed class names.

An optional default theme is also provided. To use it, simply import it in your main layout file:

```
// In src/layouts/Layout.astro
import 'astro-ssr-table/styles.css';
```
