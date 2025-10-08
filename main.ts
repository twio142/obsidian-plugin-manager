/* eslint-disable no-new */
import * as obsidian from 'obsidian';

interface PluginInfo {
  id: string
  name: string
  manifest: obsidian.PluginManifest
  enabled: boolean
}

export default class PluginManagerPlugin extends obsidian.Plugin {
  async onload() {
    // Add command to open plugin manager
    this.addCommand({
      id: 'search',
      name: 'Search plugins',
      callback: () => {
        new PluginManagerModal(this.app).open();
      },
    });

    // Add ribbon icon
    this.addRibbonIcon('puzzle', 'Plugin manager', () => {
      new PluginManagerModal(this.app).open();
    });
  }

  onunload() {
  }
}

class PluginManagerModal extends obsidian.FuzzySuggestModal<PluginInfo> {
  constructor(app: obsidian.App) {
    super(app);
    this.setPlaceholder('Type to search plugins...');
    const mod = obsidian.Platform.isMacOS ? '⌘' : '⌃';
    this.setInstructions([
      { command: '↵', purpose: 'enable/disable' },
      { command: `${mod} ↵`, purpose: 'open settings' },
      { command: `⌃ D`, purpose: 'uninstall' },
      { command: `⌃ C`, purpose: 'copy ID' },
      { command: `⌃ O`, purpose: 'open repository' },
    ]);
    this.containerEl.addClass('pm-suggestion-modal');
    const inputEl = this.inputEl;
    if (inputEl.nextElementSibling instanceof HTMLElement) {
      this.updateCounter(inputEl.nextElementSibling);
    }
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

  getItemText(plugin: PluginInfo): string {
    return plugin.name;
  }

  renderSuggestion(item: any, el: HTMLElement): void {
    el.addClass('pm-suggestion-item');

    const plugin = item.item as PluginInfo;

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

  onChooseSuggestion(item: any, evt: MouseEvent | KeyboardEvent): void {
    const plugin = item.item as PluginInfo;

    // Check for modifier keys
    const isCtrl = evt.ctrlKey || (obsidian.Platform.isMacOS && evt.metaKey);
    const isD = evt instanceof KeyboardEvent && evt.key === 'd';
    const isC = evt instanceof KeyboardEvent && evt.key === 'c';
    const isO = evt instanceof KeyboardEvent && evt.key === 'o';

    if (isCtrl && isD) {
      // Uninstall plugin - this will close and reopen the modal
      this.uninstallPlugin(plugin);
    } else if (isCtrl && isC) {
      // Copy plugin ID - keep modal open by reopening it
      this.copyPluginId(plugin);
      this.reopenModal();
    } else if (isCtrl && isO) {
      // Open plugin repository - keep modal open by reopening it
      this.openPluginRepository(plugin);
      this.reopenModal();
    } else if (isCtrl) {
      // Open plugin settings - this will close the modal
      this.openPluginSettings(plugin);
    } else {
      // Toggle enable/disable - reopen modal to refresh
      this.togglePlugin(plugin).then(() => {
        this.reopenModal();
      });
    }
  }

  reopenModal(): void {
    // Close and reopen the modal to refresh the list
    setTimeout(() => {
      new PluginManagerModal(this.app).open();
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
        new PluginManagerModal(this.app).open();
      }, 100);
    } catch (error) {
      new obsidian.Notice(`Error uninstalling plugin: ${error.message}`);
    }
  }

  openPluginSettings(plugin: PluginInfo): void {
    const app = this.app as any;

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
    const manifest = plugin.manifest;
    let repoUrl = '';

    // Try to construct repository URL from manifest
    if (manifest.authorUrl) {
      repoUrl = manifest.authorUrl;
    }

    if (!repoUrl) {
      // Try to construct from plugin ID
      repoUrl = `https://github.com/search?q=${encodeURIComponent(plugin.id)}`;
    }

    if (repoUrl) {
      window.open(repoUrl, '_blank');
      new obsidian.Notice(`Opening repository: ${plugin.name}`);
    } else {
      new obsidian.Notice('Repository URL not found');
    }
  }
}
