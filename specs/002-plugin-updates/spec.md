# Feature Specification: Plugin Update Commands

**Feature Branch**: `002-plugin-updates`
**Created**: 2025-11-11
**Status**: Draft
**Input**: User description: "add two commands to this plugin. one checks for plugin updates, one checks AND update. do for both official and BRAT plugins."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Check for Plugin Updates (Priority: P1)

As a user, I want to check for updates to my installed plugins (both official and BRAT) so that I know which plugins have new versions available.

**Why this priority**: This is the core, non-destructive functionality that provides immediate value to the user by informing them of available updates.

**Independent Test**: Can be fully tested by running the "check for updates" command and verifying that the output correctly lists plugins with available updates.

**Acceptance Scenarios**:

1. **Given** I have several plugins installed, some with available updates, **When** I run the "check for updates" command, **Then** I should receive a notification listing the plugins that have updates.
2. **Given** I have no plugins with available updates, **When** I run the "check for updates" command, **Then** I should receive a notification indicating that all plugins are up-to-date.

---

### User Story 2 - Update All Plugins (Priority: P2)

As a user, I want to update all my installed plugins (both official and BRAT) with a single command so that I can easily keep my plugins up-to-date.

**Why this priority**: This provides a convenient way for users to act on the information from the update check, but it's a destructive action and depends on the check functionality.

**Independent Test**: Can be tested by running the "update all" command and verifying that the plugins are updated to their latest versions.

**Acceptance Scenarios**:

1. **Given** I have several plugins with available updates, **When** I run the "update all" command, **Then** all plugins with available updates should be updated to their latest versions.
2. **Given** I run the "update all" command, **When** the update process is complete, **Then** I should receive a notification summarizing the results (e.g., which plugins were updated, any failures).

---

### Edge Cases

- What happens when the user is offline? The plugin should handle this gracefully and inform the user.
- If an update for a specific plugin fails, the process will continue with the next plugin and report the failure at the end.
- What happens if a BRAT plugin update fails due to an invalid beta version?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The plugin MUST provide a command to check for updates for all installed community plugins.
- **FR-002**: The update check MUST include plugins installed via BRAT.
- **FR-003**: The plugin MUST provide a command to update all installed plugins with available updates.
- **FR-004**: The update process MUST handle both official community plugins and BRAT plugins.
- **FR-005**: The plugin MUST display the results of the update check as a simple notification with a list of plugins that have updates.
- **FR-006**: The plugin MUST notify the user about the results of the update operation.
- **FR-007**: The plugin MUST update all plugins without individual confirmation.

## Clarifications

### Session 2025-11-11

- Q: How should the results of the update check be displayed to the user? → A: A simple notification with a list of plugins that have updates.
- Q: Should the user be prompted for confirmation before updating each plugin, or should all plugins be updated at once without individual confirmation? → A: No confirmation, just update all plugins.
- Q: What should happen if an update for a specific plugin fails? → A: Continue with the next plugin and report the failure at the end.

## Assumptions

- The user has a stable internet connection for checking and downloading plugin updates.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully check for updates and see a list of plugins with available updates.
- **SC-002**: Users can successfully update all plugins with a single command.
- **SC-003**: The update check command should complete in under 30 seconds for a vault with 100 plugins.
- **SC-004**: The update all command should complete in under 2 minutes for a vault with 100 plugins.
