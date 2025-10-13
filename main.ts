/* eslint-disable no-new */
import * as obsidian from 'obsidian';

interface PluginInfo {
  id: string
  name: string
  manifest: obsidian.PluginManifest
  enabled: boolean
}

interface SearchAction {
  isSearchAction: true
  query: string
}

type SuggestionItem = PluginInfo | SearchAction;

export default class PluginManagerPlugin extends obsidian.Plugin {
  pluginRepoCache: { [key: string]: string } | undefined;
  bratPluginCache: { [key: string]: string } | undefined;

  async onload() {
    // Add command to open plugin manager
    this.addCommand({
      id: 'search',
      name: 'Search plugins',
      callback: () => {
        new PluginManagerModal(this.app, this).open();
      },
    });

    // Add ribbon icon
    this.addRibbonIcon('puzzle', 'Plugin manager', () => {
      new PluginManagerModal(this.app, this).open();
    });
  }

  onunload() {
  }
}

class PluginManagerModal extends obsidian.FuzzySuggestModal<SuggestionItem> {
  plugin: PluginManagerPlugin;

  constructor(app: obsidian.App, plugin: PluginManagerPlugin) {
    super(app);
    this.plugin = plugin;
    this.setPlaceholder('Type to search plugins...');

    const modIcons = obsidian.Platform.isMacOS ? '⌘/⌃' : '⌃';
    this.setInstructions([
      { command: '↵', purpose: 'open settings/search' },
      { command: `${modIcons} ↵`, purpose: 'enable/disable' },
      { command: `${modIcons} D`, purpose: 'uninstall' },
      { command: `${modIcons} C`, purpose: 'copy ID' },
      { command: `${modIcons} O`, purpose: 'open repository' },
    ]);

    this.containerEl.addClass('pm-suggestion-modal');
    const inputEl = this.inputEl;
    if (inputEl.nextElementSibling instanceof HTMLElement) {
      this.updateCounter(inputEl.nextElementSibling);
    }

    const chooser = (this as any).chooser;
    const modifiers: obsidian.Modifier[] = obsidian.Platform.isMacOS ? ['Meta', 'Ctrl'] : ['Ctrl'];

    const enterHandler = (evt: KeyboardEvent) => {
      evt.preventDefault();
      const selectedItem = chooser.values[chooser.selectedItem];
      if (selectedItem && 'id' in selectedItem.item && selectedItem.item.enabled) {
        this.togglePlugin(selectedItem.item).then(() => {
          this.reopenModal();
        });
      }
      return false;
    };

    const dHandler = (evt: KeyboardEvent) => {
      evt.preventDefault();
      const selectedItem = chooser.values[chooser.selectedItem];
      if (selectedItem && 'id' in selectedItem.item && selectedItem.item.enabled) {
        this.uninstallPlugin(selectedItem.item);
      }
      return false;
    };

    const cHandler = (evt: KeyboardEvent) => {
      evt.preventDefault();
      const selectedItem = chooser.values[chooser.selectedItem];
      if (selectedItem && 'id' in selectedItem.item && selectedItem.item.enabled) {
        this.copyPluginId(selectedItem.item);
        this.reopenModal();
      }
      return false;
    };

    const oHandler = (evt: KeyboardEvent) => {
      evt.preventDefault();
      const selectedItem = chooser.values[chooser.selectedItem];
      if (selectedItem && 'id' in selectedItem.item && selectedItem.item.enabled) {
        this.openPluginRepository(selectedItem.item);
        this.reopenModal();
      }
      return false;
    };

    for (const mod of modifiers) {
      this.scope.register([mod], 'Enter', enterHandler);
      this.scope.register([mod], 'd', dHandler);
      this.scope.register([mod], 'c', cHandler);
      this.scope.register([mod], 'o', oHandler);
    }

    const originalSetSuggestions = chooser.setSuggestions.bind(chooser);
    chooser.setSuggestions = (suggestions: obsidian.FuzzyMatch<SuggestionItem>[]) => {
      const query = this.inputEl.value;
      if ((!suggestions || suggestions.length === 0) && query) {
        const searchAction: SearchAction = { isSearchAction: true, query };
        const fakeMatch: obsidian.FuzzyMatch<SearchAction> = { item: searchAction, match: { score: 1, matches: [] } };
        return originalSetSuggestions([fakeMatch]);
      }
      return originalSetSuggestions(suggestions);
    };
  }

  updateCounter(ctaDiv: HTMLElement): void {
    const items = this.getItems();
    const enabledCount = items.filter(p => p.enabled).length;
    const totalCount = items.length;
    ctaDiv.setText(`${enabledCount} / ${totalCount}`);
  }

  getItems(): PluginInfo[] {
    const plugins: PluginInfo[] = [];
    const app = this.app as any;

    // Get all installed plugins
    const allPlugins = app.plugins.manifests;

    for (const pluginId in allPlugins) {
      const manifest = allPlugins[pluginId];
      plugins.push({
        id: pluginId,
        name: manifest.name,
        manifest,
        enabled: !!app.plugins.plugins[pluginId],
      });
    }

    // Sort plugins alphabetically
    plugins.sort((a, b) => a.name.localeCompare(b.name));

    return plugins;
  }

  getItemText(item: SuggestionItem): string {
    if ('isSearchAction' in item) {
      return `Search "${item.query}" in community plugins`;
    }
    return item.name;
  }

  renderSuggestion(item: obsidian.FuzzyMatch<SuggestionItem>, el: HTMLElement): void {
    el.addClass('pm-suggestion-item');
    const suggestion = item.item;

    if ('isSearchAction' in suggestion) {
      const contentDiv = el.createDiv({ cls: 'pm-suggestion-content no-result' });
      obsidian.setIcon(contentDiv, 'search');
      contentDiv.createSpan({ cls: 'pm-suggestion-title' }).setText(`Search "${suggestion.query}" in community plugins`);
    } else {
      const plugin = suggestion;
      const contentDiv = el.createDiv({ cls: 'pm-suggestion-content' });
      const textDiv = contentDiv.createDiv({ cls: 'pm-suggestion-text' });
      const titleDiv = textDiv.createDiv({ cls: 'pm-suggestion-title' });
      const nameSpan = titleDiv.createSpan({ cls: 'plugin-name' });
      nameSpan.setText(plugin.name);
      if (!plugin.enabled) {
        nameSpan.addClass('plugin-disabled');
      }
      const versionSpan = titleDiv.createSpan({ cls: 'pm-suggestion-note plugin-version' });
      versionSpan.setText(`v${plugin.manifest.version}`);
      const descriptionDiv = textDiv.createDiv({ cls: 'pm-suggestion-note plugin-desc' });
      descriptionDiv.setText(plugin.manifest.description || '');
    }
  }

  onChooseSuggestion(item: obsidian.FuzzyMatch<SuggestionItem>, evt: MouseEvent | KeyboardEvent): void {
    const suggestion = item.item;

    if ('isSearchAction' in suggestion) {
      this.close();
      window.open(`obsidian://show-plugin?id=${encodeURIComponent(suggestion.query)}`);
    } else {
      const isCtrl = evt.ctrlKey || (obsidian.Platform.isMacOS && evt.metaKey);
      if (isCtrl) {
        return;
      }
      this.openPluginSettings(suggestion);
    }
  }

  reopenModal(): void {
    // Close and reopen the modal to refresh the list
    setTimeout(() => {
      new PluginManagerModal(this.app, this.plugin).open();
    }, 50);
  }

  onChooseItem(): void {
    // This method is called by the default implementation but we override onChooseSuggestion
    // Keep it for compatibility but the logic is now in onChooseSuggestion
  }

  async togglePlugin(plugin: PluginInfo): Promise<void> {
    const app = this.app as any;

    try {
      if (plugin.enabled) {
        // Disable plugin
        await app.plugins.disablePlugin(plugin.id);
        new obsidian.Notice(`Disabled: ${plugin.name}`);
      } else {
        // Enable plugin
        await app.plugins.enablePlugin(plugin.id);
        new obsidian.Notice(`Enabled: ${plugin.name}`);
      }
    } catch (error) {
      new obsidian.Notice(`Error toggling plugin: ${error.message}`);
    }
  }

  async uninstallPlugin(plugin: PluginInfo): Promise<void> {
    const app = this.app as any;

    try {
      // First disable the plugin if it's enabled
      if (plugin.enabled) {
        await app.plugins.disablePlugin(plugin.id);
      }

      // Uninstall the plugin
      await app.plugins.uninstallPlugin(plugin.id);
      new obsidian.Notice(`Uninstalled: ${plugin.name}`);

      // Close and reopen the modal to refresh the list
      this.close();
      setTimeout(() => {
        new PluginManagerModal(this.app, this.plugin).open();
      }, 100);
    } catch (error) {
      new obsidian.Notice(`Error uninstalling plugin: ${error.message}`);
    }
  }

  openPluginSettings(plugin: PluginInfo): void {
    const app = this.app as any;

    if (!app.setting.pluginTabs.find((tab: any) => tab.id === plugin.id)) {
      return; // Plugin has no settings page
    }

    // Close the modal first
    this.close();

    // Open settings and navigate to the plugin
    app.setting.open();
    app.setting.openTabById(plugin.id);
  }

  copyPluginId(plugin: PluginInfo): void {
    navigator.clipboard.writeText(plugin.id).then(() => {
      new obsidian.Notice(`Copied plugin ID: ${plugin.id}`);
    }).catch(() => {
      new obsidian.Notice('Failed to copy plugin ID');
    });
  }

  openPluginRepository(plugin: PluginInfo): void {
    const open = (repo: string | undefined): void => {
      if (repo) {
        window.open(`https://github.com/${repo}`, '_blank');
      } else {
        new obsidian.Notice('Repository URL not found for this plugin');
      }
    };

    const brat = (this.app as any).plugins.plugins['obsidian42-brat'];
    if (brat) {
      let found = false;
      if (this.plugin.bratPluginCache) {
        const repo = this.plugin.bratPluginCache[plugin.id];
        if (repo) {
          open(repo);
          found = true;
        }
      } else {
        this.plugin.bratPluginCache = {};
        const { pluginList, pluginSublistFrozenVersion } = brat.settings;
        for (const i in pluginList) {
          const p = pluginList[i];
          this.plugin.bratPluginCache[p] = pluginSublistFrozenVersion[i]?.repo;
          if (p === plugin.id) {
            open(this.plugin.bratPluginCache[plugin.id]);
            found = true;
          }
        }
      }
      if (found) {
        return;
      }
    }

    const apiUrl = 'https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json';
    if (this.plugin.pluginRepoCache) {
      const repo = this.plugin.pluginRepoCache[plugin.id];
      open(repo);
    } else {
      fetch(apiUrl).then(response => response.json()).then((data: any[]) => {
        this.plugin.pluginRepoCache = {};
        let found = false;
        for (const p of data) {
          this.plugin.pluginRepoCache[p.id] = p.repo;
          if (p.id === plugin.id) {
            open(p.repo);
            found = true;
          }
        }
        if (!found) {
          new obsidian.Notice('Plugin not found in community plugins list');
        }
      });
    }
  }
}
