# Quickstart: Testing Highlighted Search Results

**Feature**: Highlight Matched Text in Search Results

## Prerequisites

1.  The plugin must be installed and enabled in Obsidian.
2.  You must have at least one other plugin installed to search for.

## Testing Steps

1.  Open the plugin manager by triggering the command (e.g., via the command palette or a hotkey).
2.  In the search modal that appears, type a partial query that you know will match an installed plugin. For example, if you have "Dataview" installed, type `dv`.
3.  **Verify**: The characters `d` and `v` in the "Dataview" search result should be highlighted (e.g., bold).
4.  Clear the search and type a contiguous query, like `data`.
5.  **Verify**: The substring `Data` in "Dataview" should be highlighted.
6.  Test with a query that has no matches.
7.  **Verify**: No results are shown, and no errors occur.
