# Research: Highlighting Fuzzy Matches

**Date**: 2025-10-25

## Objective

Determine the technical approach for highlighting the matched characters in a plugin name within Obsidian's built-in `FuzzySuggestModal`.

## Investigation

1.  **API Analysis**: The `FuzzySuggestModal` class provides a `renderSuggestion` method that is called for each item in the search results.
2.  **Data Object**: This method receives a `FuzzyMatch` object as an argument.
3.  **Match Data**: The `FuzzyMatch` object contains a `match` property. This property holds a `matches` array, which is an array of tuples `[number, number]`. Each tuple represents the start and end index of a matched character segment in the original string.

## Decision

- The implementation will take place inside the `renderSuggestion` method of the `PluginManagerModal` class in `main.ts`.
- The code will access `item.match.matches` to get the array of matched indices.
- A new DOM element (e.g., a `<span>`) will be created to build the highlighted text. The original text will be iterated through, and when a character's index falls within one of the matched ranges, it will be wrapped in a highlighting element (e.g., a `<strong>` tag or a span with a specific CSS class).
- This approach avoids replicating the fuzzy match logic and uses the data directly from the Obsidian API, as required by the specification.

## Alternatives Considered

- **Replicating the fuzzy match logic**: This was rejected as it would be complex, brittle, and likely to diverge from Obsidian's native behavior. The user explicitly forbade this approach.
