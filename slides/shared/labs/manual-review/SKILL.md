---
name: manual-review
description: Review a fictional MockSTA manual answer against the requested version and source section.
---

Use this skill for the public course's mock manuals, not real design sign-off.

1. Confirm the requested tool, version and command. Ask when any is missing.
2. Call the configured `manual_lookup` tool with the exact version and command.
3. Stop and report missing documents, permission denial or a version mismatch.
4. Return the answer with `version`, `command`, `unit`, `document` and `section`.
5. Compare these fields against the original manual. A file or a PASS statement alone is insufficient evidence.

This file does not configure MCP or grant process, file, network or tool permissions.
