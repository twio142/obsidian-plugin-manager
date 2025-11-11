# Implementation Plan: Plugin Update Commands

**Branch**: `002-plugin-updates` | **Date**: 2025-11-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-plugin-updates/spec.md`

## Summary

This feature adds two commands to the plugin: one to check for plugin updates and another to check for and apply updates. This will be done for both official and BRAT plugins, using the built-in Obsidian APIs and BRAT's own commands to handle the updates and notifications.

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: obsidian (API)
**Storage**: N/A
**Testing**: Manual testing
**Target Platform**: Obsidian (Desktop)
**Project Type**: Single project
**Performance Goals**: Update check command should complete in under 30 seconds for a vault with 100 plugins. Update all command should complete in under 2 minutes for a vault with 100 plugins.
**Constraints**: Must not cause Obsidian to crash or behave unexpectedly.
**Scale/Scope**: Should handle a vault with at least 100 plugins.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **User-Centric Design**: Yes, the proposed feature is designed to be simple and efficient, using keyboard-driven commands as per the project's core principles.
- **Reliability and Stability**: The plan is to use the official `app.plugins.checkForUpdates()` and `app.plugins.installPlugin()` APIs, and the command from the BRAT plugin. This is the most reliable and stable approach. Error handling for failed updates will be crucial.
- **Performance as a Feature**: The performance goals from the spec are explicitly part of this plan. The implementation will be mindful of not blocking the UI thread.
- **Security and Trust**: The feature will only interact with the official Obsidian plugin registry and the BRAT plugin, which are trusted sources. No new security risks are introduced.
- **Maintainability and Extensibility**: The new commands will be implemented in a modular way to allow for future commands to be added easily.

## Project Structure

### Documentation (this feature)

```text
specs/002-plugin-updates/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
```text
# Single project
src/
└── main.ts
```

## Implementation Details

Based on the research and user feedback, the following APIs and command IDs will be used:

- **Check for official plugin updates**: `app.plugins.checkForUpdates()`
- **Install official plugin updates**: `app.plugins.installPlugin()`
- **Check for BRAT plugin updates**: `app.commands.executeCommandById('obsidian42-brat:checkForUpdatesAndDontUpdate')`
- **Update BRAT plugins**: `app.commands.executeCommandById('obsidian42-brat:checkForUpdatesAndUpdate')`

## Complexity Tracking

No violations of the constitution that require justification.