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

---
Task ID: 2
Agent: full-stack-developer
Task: Implement automatic team advancement in knockout bracket

Work Log:
- Added `type BracketRound` import from `@/lib/tournament-data`
- Implemented `resolveBracket` function with full group-to-knockout advancement logic:
  - Step 1: Computes standings for all 12 groups using existing `computeStandings`
  - Step 2: Resolves "1° Grupo X" and "2° Grupo X" slots by mapping group positions to actual teams
  - Step 3: Handles 3rd-place team qualification: ranks all 12 third-place teams (pts → GD → GF), selects top 8, then assigns to bracket paths (ABFJ, CDE, GHI, KLM) using per-path counters
  - Step 4: Processes knockout advancement round-by-round in order (Dieciseisavos → Octavos → Cuartos → Semifinales → 3er Puesto → Final), resolving "Ganador Match N" and "Perdedor Match N" references from previous round results; draws result in no advancement
- Updated `BracketMatchCard` with visual indicators:
  - Green dot (●) next to team name when qualified from group stage (name !== "Por definir")
  - Arrow icon (▶) for match winners indicating advancement
  - Enhanced winner highlight (bg-emerald-900/40, text-emerald-300)
  - Muted text for unresolved teams (text-white/50 vs text-white)
  - Match card border changes to emerald when scores are entered
- Updated `BracketLlavesView` to accept `resolvedBracket: BracketRound[]` prop and use it instead of static `bracketRounds`
- Updated `Home` component to compute `resolvedBracket` via `useMemo(() => resolveBracket(scores, knockoutScores), [scores, knockoutScores])` and pass it to `BracketLlavesView`
- Renamed `as` variable to `as2` in resolveBracket to avoid TypeScript keyword conflict
- Lint passes clean, no runtime errors in dev.log

Stage Summary:
- Modified: src/app/page.tsx (added resolveBracket function, updated BracketMatchCard, BracketLlavesView, and Home component)
- Key feature: Teams automatically populate knockout bracket based on group stage results
- Key feature: Knockout match winners automatically advance to subsequent rounds
- Key feature: Semifinal losers auto-populate 3rd place match
- Key feature: Visual indicators show qualified teams (green dot) and match winners (arrow icon)
- All 3rd-place path assignments handled: ABFJ (2 teams), CDE (2 teams), GHI (2 teams), KLM (2 teams)
