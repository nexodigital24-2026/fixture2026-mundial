---
Task ID: 1
Agent: Main
Task: Create Header, Footer, and Config Panel for Mundial 2026 Simulator

Work Log:
- Added Config model to Prisma schema (key-value store for settings)
- Pushed schema changes with `bun run db:push`
- Created API route `/api/admin/config` with GET (public) and POST (admin-only) methods
- Created Header component (`src/components/mundial/Header.tsx`) with sticky header, branding, auth dialog, tournament stats strip
- Created Footer component (`src/components/mundial/Footer.tsx`) with three-column layout, dynamic content, sticky footer behavior
- Created ConfigPanel component (`src/components/mundial/ConfigPanel.tsx`) with tabbed interface for all settings
- Updated main page.tsx to integrate all components with useConfig hook
- Added Config tab visible only to admin users
- Updated next.config.ts with allowedDevOrigins

Stage Summary:
- New files: Header.tsx, Footer.tsx, ConfigPanel.tsx, /api/admin/config/route.ts
- Modified: page.tsx (major refactor), schema.prisma, next.config.ts
- All features verified via curl tests and agent-browser screenshots
- Lint passes clean
