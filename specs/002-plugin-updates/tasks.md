# Tasks: Plugin Update Commands

**Input**: Design documents from `/specs/002-plugin-updates/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Manual testing is sufficient for this feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: User Story 1 - Check for Plugin Updates (Priority: P1) 🎯 MVP

**Goal**: Allow users to check for updates for all installed plugins (official and BRAT).

**Independent Test**: Run the "Check for plugin updates" command and verify that a notification appears with the list of plugins that have available updates.

### Implementation for User Story 1

- [X] T001 [US1] Add a new command "Check for plugin updates" to the plugin in `src/main.ts`.
- [X] T002 [US1] Implement the command logic to call `app.plugins.checkForUpdates()` in `src/main.ts`.
- [X] T003 [US1] Implement the command logic to execute the BRAT command `obsidian42-brat:checkForUpdatesAndDontUpdate` in `src/main.ts`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 2: User Story 2 - Update All Plugins (Priority: P2)

**Goal**: Allow users to update all installed plugins (official and BRAT) with a single command.

**Independent Test**: Run the "Update all plugins" command and verify that all plugins with available updates are updated.

### Implementation for User Story 2

- [X] T004 [US2] Add a new command "Update all plugins" to the plugin in `src/main.ts`.
- [X] T005 [US2] Implement the command logic to call `app.plugins.checkForUpdates()` in `src/main.ts`.
- [X] T006 [US2] Implement the command logic to iterate through `app.plugins.updates` and call `app.plugins.installPlugin()` for each official plugin in `src/main.ts`.
- [X] T007 [US2] Implement the command logic to execute the BRAT command `obsidian42-brat:checkForUpdatesAndUpdate` in `src/main.ts`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 3: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [X] T008 [P] Review and refactor the code in `src/main.ts` for clarity and maintainability.
- [X] T009 [P] Manually test the "Check for plugin updates" command.
- [X] T010 [P] Manually test the "Update all plugins" command.
- [X] T011 [P] Update the `README.md` to document the new commands.

---

## Dependencies & Execution Order

### Phase Dependencies

- **User Story 1 (Phase 1)**: No dependencies - can start immediately.
- **User Story 2 (Phase 2)**: Depends on User Story 1 completion is not strictly necessary but recommended.
- **Polish (Phase 3)**: Depends on all desired user stories being complete.

### Parallel Opportunities

- Once User Story 1 is complete, User Story 2 can begin.
- All Polish tasks can be worked on in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: User Story 1.
2. **STOP and VALIDATE**: Test User Story 1 independently.
3. Deploy/demo if ready.

### Incremental Delivery

1. Add User Story 1 → Test independently → Deploy/Demo (MVP!).
2. Add User Story 2 → Test independently → Deploy/Demo.
3. Each story adds value without breaking previous stories.
