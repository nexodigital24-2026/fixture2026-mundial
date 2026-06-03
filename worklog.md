---
Task ID: 1
Agent: Main Agent
Task: Admin data hidden from login, comprehensive structure report and improvements

Work Log:
- Read all project files to understand current state (page.tsx, tournament-data.ts, Header, Footer, ConfigPanel, API routes, prisma schema)
- Identified security issue: admin credentials (admin@mundial2026.com / admin123) were displayed in the login dialog
- Removed admin credentials from Header.tsx AuthDialog component
- Created new `/api/admin/stats` API endpoint with comprehensive statistics (totalUsers, totalAdmins, totalSimulations, activeUsers, groupSims, knockoutSims, newUsersThisWeek, newSimsThisWeek, recentUsers, topUsers)
- Completely redesigned the AdminPanel component in page.tsx with:
  - Three sub-tabs: Dashboard, Users, System
  - Dashboard: Stats grid with weekly changes, simulation type breakdown with progress bars, top simulators ranking, recent users list
  - Users: User management table with role toggle and delete functionality
  - System: Technical info, security status, database schema visualization
- Verified with Agent Browser: login dialog no longer shows admin credentials, admin panel works correctly with stats API
- All lint checks pass, no compilation errors

Stage Summary:
- Security fix: Admin credentials removed from login form
- New API: /api/admin/stats with comprehensive admin-only statistics
- Redesigned admin panel with 3 tabs (Dashboard/Users/System) and rich data visualization
- Auto-advancement system already works via resolveBracket() function in page.tsx
- Project structure is solid: Next.js 16 + TypeScript + Prisma SQLite + NextAuth + shadcn/ui
