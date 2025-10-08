# Obsidian Plugin Manager

Manage your Obsidian plugins with ease. This plugin provides a fuzzy search modal to quickly find and manage all your installed plugins.

## Features

- **Quick Search**: Lists all installed plugins in a `FuzzySuggestModal` with fuzzy search
- **Plugin Status**: Shows enabled (✓) and disabled (✗) plugins at a glance
- **Multiple Actions**: Perform various plugin management actions with keyboard shortcuts

## Available Actions

- **Toggle Enable/Disable** (Enter): Enable or disable a plugin
- **Open Plugin Settings** (Ctrl/Cmd + Enter): Jump directly to plugin settings
- **Uninstall** (Ctrl/Cmd + D): Uninstall a plugin
- **Copy Plugin ID** (Ctrl/Cmd + C): Copy the plugin ID to clipboard
- **Open Plugin Repository** (Ctrl/Cmd + O): Open the plugin's repository in your browser

## Usage

1. Click the puzzle icon in the ribbon or use the command palette
2. Type to search for a plugin
3. Use the keyboard shortcuts to perform actions

### Opening the Plugin Manager

- **Ribbon Icon**: Click the puzzle icon in the left sidebar
- **Command Palette**: Search for "Open Plugin Manager"

## Installation

### From Obsidian Community Plugins

1. Open Settings → Community Plugins
2. Search for "Plugin Manager"
3. Click Install, then Enable

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release
2. Create a folder `obsidian-plugin-manager` in your vault's `.obsidian/plugins/` directory
3. Copy the downloaded files into the folder
4. Reload Obsidian
5. Enable the plugin in Settings → Community Plugins

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
