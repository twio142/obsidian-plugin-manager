# Obsidian Plugin Manager

Manage your Obsidian plugins with ease.

## Features

- **Quick Search**: Lists all installed plugins in a fuzzy search modal
- **Multiple Actions**: Perform various actions with keyboard shortcuts
- **Search for more**: If no match is found, search the community plugins registry
- Support plugins managed by [BRAT](https://github.com/TfTHacker/obsidian42-brat)

### Available Actions

| Action   | Shortcut    |
|--------------- | --------------- |
| Open settings / Search for more | Enter   |
| Enable / disable   | Ctrl/Cmd + Enter   |
| Uninstall plugin   | Ctrl/Cmd + D   |
| Copy plugin ID   | Ctrl/Cmd + C   |
| Open plugin repository   | Ctrl/Cmd + O   |

## Commands

This plugin provides the following commands that can be accessed from the command palette (Cmd/Ctrl + P):

- **Plugin Manager: Search plugins**: Opens the plugin manager modal to search and manage your plugins.
- **Plugin Manager: Check for plugin updates**: Checks for available updates for all your installed plugins (including BRAT plugins).
- **Plugin Manager: Update all plugins**: Updates all plugins that have an available update.

## Installation

Install via BRAT or manually.

## Development

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Development mode with auto-rebuild
npm run dev
```

## License

MIT
