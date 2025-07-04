# Astro SSR Table Toolkit

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

A complete toolkit for Astro to create powerful, server-side rendered data tables. Includes helpers and components for server-side pagination, sorting, and full-text search.

Designed for Astro projects using SSR and an SQL-based ORM like Drizzle, this library provides the backend logic and frontend components to build complex data grids with minimal effort.

## Key Features

- **Server-Side Everything**: All pagination, sorting, and searching is handled on the server, making it fast, secure, and scalable for large datasets.
- **Component-Based**: Includes `<ResponsiveTable>`, `<Pagination>`, and `<SearchSortControls>` components for a DRY, maintainable frontend.
- **URL State Management**: Uses a `SearchSortHelper` class to manage the application state directly in the URL's query parameters.
- **Fully Responsive**: The `<ResponsiveTable>` component automatically renders a full data table on desktop and a clean, stacked card list on mobile.
- **Headless & Unstyled**: The components ship with no built-in styling, allowing you to use your own design system (like UnoCSS or Tailwind) by targeting the semantic, prefixed class names. An optional default theme is also provided.

## Installation

```bash
npm install astro-ssr-table

Getting Started
---------------

To see a full implementation guide, please read the USAGE.md file.

Components
----------

-   `<ResponsiveTable />` - The core component for displaying data in a table on desktop and a list on mobile.

-   `<Pagination />` - A complete pagination control with page numbers, next/previous buttons, and a page size selector.

-   `<SearchSortControls />` - A search input and clear button for filtering results.

Helpers
-------

-   **`SearchSortHelper`**: A powerful class that hooks into Astro's `URL` object to manage all state for searching, sorting, and pagination.

-   **`ColumnProcessor`**: A set of utility functions used internally by the `ResponsiveTable` to validate and process column definitions.

Contributing
------------

Contributions, issues, and feature requests are welcome!

1.  Fork the Project

2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)

3.  Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)

4.  Push to the Branch (`git push origin feature/AmazingFeature`)

5.  Open a Pull Request

License
-------

Distributed under the MIT License. See `LICENSE.md` for more information.
