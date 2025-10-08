import { App, FuzzySuggestModal, Plugin, PluginManifest, Notice, Platform } from 'obsidian';

interface PluginInfo {
	id: string;
	name: string;
	manifest: PluginManifest;
	enabled: boolean;
}

export default class PluginManagerPlugin extends Plugin {
	async onload() {
		// Add command to open plugin manager
		this.addCommand({
			id: 'open-plugin-manager',
			name: 'Open Plugin Manager',
			callback: () => {
				new PluginManagerModal(this.app).open();
			}
		});

		// Add ribbon icon
		this.addRibbonIcon('puzzle', 'Plugin Manager', () => {
			new PluginManagerModal(this.app).open();
		});
	}

	onunload() {
	}
}

class PluginManagerModal extends FuzzySuggestModal<PluginInfo> {
	constructor(app: App) {
		super(app);
		this.setPlaceholder('Type to search plugins...');
		this.setInstructions([
			{ command: '↵', purpose: 'toggle enable/disable' },
			{ command: 'ctrl ↵', purpose: 'open settings' },
			{ command: 'ctrl d', purpose: 'uninstall' },
			{ command: 'ctrl c', purpose: 'copy ID' },
			{ command: 'ctrl o', purpose: 'open repository' },
		]);
	}

	getItems(): PluginInfo[] {
		const plugins: PluginInfo[] = [];
		const app = this.app as any;
		
		// Get all installed plugins
		const allPlugins = app.plugins.manifests;
		const enabledPlugins = app.plugins.enabledPlugins;

		for (const pluginId in allPlugins) {
			const manifest = allPlugins[pluginId];
			plugins.push({
				id: pluginId,
				name: manifest.name,
				manifest: manifest,
				enabled: enabledPlugins.has(pluginId)
			});
		}

		// Sort plugins alphabetically
		plugins.sort((a, b) => a.name.localeCompare(b.name));

		return plugins;
	}

	getItemText(plugin: PluginInfo): string {
		const status = plugin.enabled ? '✓' : '✗';
		return `${status} ${plugin.name}`;
	}

	onChooseItem(plugin: PluginInfo, evt: MouseEvent | KeyboardEvent): void {
		// Check for modifier keys
		const isCtrl = evt.ctrlKey || evt.metaKey;
		const isD = evt instanceof KeyboardEvent && evt.key === 'd';
		const isC = evt instanceof KeyboardEvent && evt.key === 'c';
		const isO = evt instanceof KeyboardEvent && evt.key === 'o';

		if (isCtrl && isD) {
			// Uninstall plugin
			this.uninstallPlugin(plugin);
		} else if (isCtrl && isC) {
			// Copy plugin ID
			this.copyPluginId(plugin);
		} else if (isCtrl && isO) {
			// Open plugin repository
			this.openPluginRepository(plugin);
		} else if (isCtrl) {
			// Open plugin settings
			this.openPluginSettings(plugin);
		} else {
			// Toggle enable/disable
			this.togglePlugin(plugin);
		}
	}

	async togglePlugin(plugin: PluginInfo): Promise<void> {
		const app = this.app as any;
		
		try {
			if (plugin.enabled) {
				// Disable plugin
				await app.plugins.disablePlugin(plugin.id);
				new Notice(`Disabled: ${plugin.name}`);
			} else {
				// Enable plugin
				await app.plugins.enablePlugin(plugin.id);
				new Notice(`Enabled: ${plugin.name}`);
			}
		} catch (error) {
			new Notice(`Error toggling plugin: ${error.message}`);
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
			new Notice(`Uninstalled: ${plugin.name}`);
			
			// Close and reopen the modal to refresh the list
			this.close();
			setTimeout(() => {
				new PluginManagerModal(this.app).open();
			}, 100);
		} catch (error) {
			new Notice(`Error uninstalling plugin: ${error.message}`);
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
			new Notice(`Copied plugin ID: ${plugin.id}`);
		}).catch(() => {
			new Notice('Failed to copy plugin ID');
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
			new Notice(`Opening repository: ${plugin.name}`);
		} else {
			new Notice('Repository URL not found');
		}
	}
}
