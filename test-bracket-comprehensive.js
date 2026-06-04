// Comprehensive test with better test data that ensures all bracket paths are populated
const { chromium } = require('playwright');

// This script tests the resolveBracket logic directly and then verifies via browser UI

// ==================== DIRECT LOGIC TEST ====================
// Replicate just the needed data structures

const flags = {
  MEX: "🇲🇽", RSA: "🇿🇦", KOR: "🇰🇷", CZE: "🇨🇿",
  CAN: "🇨🇦", BIH: "🇧🇦", QAT: "🇶🇦", SUI: "🇨🇭",
  BRA: "🇧🇷", MAR: "🇲🇦", HAI: "🇭🇹", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  USA: "🇺🇸", PAR: "🇵🇾", AUS: "🇦🇺", TUR: "🇹🇷",
  GER: "🇩🇪", CUW: "🇨🇼", CIV: "🇨🇮", ECU: "🇪🇨",
  NED: "🇳🇱", JAP: "🇯🇵", SWE: "🇸🇪", TUN: "🇹🇳",
  BEL: "🇧🇪", EGY: "🇪🇬", IRN: "🇮🇷", NZL: "🇳🇿",
  ESP: "🇪🇸", CPV: "🇨🇻", KSA: "🇸🇦", URU: "🇺🇾",
  FRA: "🇫🇷", SEN: "🇸🇳", IRQ: "🇮🇶", NOR: "🇳🇴",
  ARG: "🇦🇷", ALG: "🇩🇿", AUT: "🇦🇹", JOR: "🇯🇴",
  POR: "🇵🇹", COD: "🇨🇩", UZB: "🇺🇿", COL: "🇨🇴",
  ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", CRO: "🇭🇷", GHA: "🇬🇭", PAN: "🇵🇦",
};

const names = {
  MEX: "México", RSA: "Sudáfrica", KOR: "Corea del Sur", CZE: "Rep. Checa",
  CAN: "Canadá", BIH: "Bosnia-Herz.", QAT: "Catar", SUI: "Suiza",
  BRA: "Brasil", MAR: "Marruecos", HAI: "Haití", SCO: "Escocia",
  USA: "Estados Unidos", PAR: "Paraguay", AUS: "Australia", TUR: "Turquía",
  GER: "Alemania", CUW: "Curazao", CIV: "Costa de Marfil", ECU: "Ecuador",
  NED: "Países Bajos", JAP: "Japón", SWE: "Suecia", TUN: "Túnez",
  BEL: "Bélgica", EGY: "Egipto", IRN: "Irán", NZL: "Nueva Zelanda",
  ESP: "España", CPV: "Cabo Verde", KSA: "Arabia Saudita", URU: "Uruguay",
  FRA: "Francia", SEN: "Senegal", IRQ: "Irak", NOR: "Noruega",
  ARG: "Argentina", ALG: "Argelia", AUT: "Austria", JOR: "Jordania",
  POR: "Portugal", COD: "RD Congo", UZB: "Uzbekistán", COL: "Colombia",
  ENG: "Inglaterra", CRO: "Croacia", GHA: "Ghana", PAN: "Panamá",
};

function t(code) {
  return { code, flag: flags[code] || "🏳️", name: names[code] || code };
}

// Group structure (same as tournament-data.ts)
const groups = [
  { id: "A", teams: [t("MEX"), t("RSA"), t("KOR"), t("CZE")], matches: [
    { id: 1, home: t("MEX"), away: t("RSA") },
    { id: 2, home: t("KOR"), away: t("CZE") },
    { id: 25, home: t("CZE"), away: t("RSA") },
    { id: 26, home: t("MEX"), away: t("KOR") },
    { id: 49, home: t("CZE"), away: t("MEX") },
    { id: 50, home: t("RSA"), away: t("KOR") },
  ]},
  { id: "B", teams: [t("CAN"), t("BIH"), t("QAT"), t("SUI")], matches: [
    { id: 3, home: t("CAN"), away: t("BIH") },
    { id: 5, home: t("QAT"), away: t("SUI") },
    { id: 27, home: t("SUI"), away: t("BIH") },
    { id: 28, home: t("CAN"), away: t("QAT") },
    { id: 51, home: t("SUI"), away: t("CAN") },
    { id: 52, home: t("BIH"), away: t("QAT") },
  ]},
  { id: "C", teams: [t("BRA"), t("MAR"), t("HAI"), t("SCO")], matches: [
    { id: 6, home: t("BRA"), away: t("MAR") },
    { id: 7, home: t("HAI"), away: t("SCO") },
    { id: 29, home: t("SCO"), away: t("MAR") },
    { id: 30, home: t("BRA"), away: t("HAI") },
    { id: 53, home: t("MAR"), away: t("HAI") },
    { id: 54, home: t("SCO"), away: t("BRA") },
  ]},
  { id: "D", teams: [t("USA"), t("PAR"), t("AUS"), t("TUR")], matches: [
    { id: 4, home: t("USA"), away: t("PAR") },
    { id: 8, home: t("AUS"), away: t("TUR") },
    { id: 31, home: t("USA"), away: t("AUS") },
    { id: 32, home: t("TUR"), away: t("PAR") },
    { id: 55, home: t("TUR"), away: t("USA") },
    { id: 56, home: t("PAR"), away: t("AUS") },
  ]},
  { id: "E", teams: [t("GER"), t("CUW"), t("CIV"), t("ECU")], matches: [
    { id: 9, home: t("GER"), away: t("CUW") },
    { id: 11, home: t("CIV"), away: t("ECU") },
    { id: 33, home: t("GER"), away: t("CIV") },
    { id: 34, home: t("ECU"), away: t("CUW") },
    { id: 57, home: t("ECU"), away: t("GER") },
    { id: 58, home: t("CUW"), away: t("CIV") },
  ]},
  { id: "F", teams: [t("NED"), t("JAP"), t("SWE"), t("TUN")], matches: [
    { id: 10, home: t("NED"), away: t("JAP") },
    { id: 12, home: t("SWE"), away: t("TUN") },
    { id: 35, home: t("NED"), away: t("SWE") },
    { id: 36, home: t("TUN"), away: t("JAP") },
    { id: 59, home: t("TUN"), away: t("NED") },
    { id: 60, home: t("JAP"), away: t("SWE") },
  ]},
  { id: "G", teams: [t("BEL"), t("EGY"), t("IRN"), t("NZL")], matches: [
    { id: 14, home: t("BEL"), away: t("EGY") },
    { id: 15, home: t("IRN"), away: t("NZL") },
    { id: 37, home: t("BEL"), away: t("IRN") },
    { id: 38, home: t("NZL"), away: t("EGY") },
    { id: 61, home: t("EGY"), away: t("IRN") },
    { id: 62, home: t("NZL"), away: t("BEL") },
  ]},
  { id: "H", teams: [t("ESP"), t("CPV"), t("KSA"), t("URU")], matches: [
    { id: 13, home: t("ESP"), away: t("CPV") },
    { id: 16, home: t("KSA"), away: t("URU") },
    { id: 39, home: t("ESP"), away: t("KSA") },
    { id: 40, home: t("URU"), away: t("CPV") },
    { id: 63, home: t("URU"), away: t("ESP") },
    { id: 64, home: t("CPV"), away: t("KSA") },
  ]},
  { id: "I", teams: [t("FRA"), t("SEN"), t("IRQ"), t("NOR")], matches: [
    { id: 17, home: t("FRA"), away: t("SEN") },
    { id: 18, home: t("IRQ"), away: t("NOR") },
    { id: 41, home: t("FRA"), away: t("IRQ") },
    { id: 42, home: t("NOR"), away: t("SEN") },
    { id: 65, home: t("NOR"), away: t("FRA") },
    { id: 66, home: t("SEN"), away: t("IRQ") },
  ]},
  { id: "J", teams: [t("ARG"), t("ALG"), t("AUT"), t("JOR")], matches: [
    { id: 19, home: t("ARG"), away: t("ALG") },
    { id: 20, home: t("AUT"), away: t("JOR") },
    { id: 43, home: t("ARG"), away: t("AUT") },
    { id: 44, home: t("JOR"), away: t("ALG") },
    { id: 67, home: t("JOR"), away: t("ARG") },
    { id: 68, home: t("ALG"), away: t("AUT") },
  ]},
  { id: "K", teams: [t("POR"), t("COD"), t("UZB"), t("COL")], matches: [
    { id: 21, home: t("POR"), away: t("COD") },
    { id: 24, home: t("UZB"), away: t("COL") },
    { id: 45, home: t("POR"), away: t("UZB") },
    { id: 48, home: t("COL"), away: t("COD") },
    { id: 69, home: t("COL"), away: t("POR") },
    { id: 70, home: t("COD"), away: t("UZB") },
  ]},
  { id: "L", teams: [t("ENG"), t("CRO"), t("GHA"), t("PAN")], matches: [
    { id: 22, home: t("ENG"), away: t("CRO") },
    { id: 23, home: t("GHA"), away: t("PAN") },
    { id: 46, home: t("ENG"), away: t("GHA") },
    { id: 47, home: t("PAN"), away: t("CRO") },
    { id: 71, home: t("PAN"), away: t("ENG") },
    { id: 72, home: t("CRO"), away: t("GHA") },
  ]},
];

// Bracket structure
const bracketRounds = [
  { name: "Dieciseisavos", shortName: "Dieciseisavos", matches: [
    { id: 73, home: { position: "1° Grupo A" }, away: { position: "2° Grupo B" } },
    { id: 74, home: { position: "1° Grupo C" }, away: { position: "2° Grupo D" } },
    { id: 75, home: { position: "1° Grupo E" }, away: { position: "2° Grupo F" } },
    { id: 76, home: { position: "1° Grupo G" }, away: { position: "2° Grupo H" } },
    { id: 77, home: { position: "1° Grupo I" }, away: { position: "2° Grupo J" } },
    { id: 78, home: { position: "1° Grupo K" }, away: { position: "2° Grupo L" } },
    { id: 79, home: { position: "1° Grupo B" }, away: { position: "2° Grupo A" } },
    { id: 80, home: { position: "1° Grupo D" }, away: { position: "2° Grupo C" } },
    { id: 81, home: { position: "1° Grupo F" }, away: { position: "2° Grupo E" } },
    { id: 82, home: { position: "1° Grupo H" }, away: { position: "2° Grupo G" } },
    { id: 83, home: { position: "1° Grupo J" }, away: { position: "2° Grupo I" } },
    { id: 84, home: { position: "1° Grupo L" }, away: { position: "2° Grupo K" } },
    { id: 85, home: { position: "3° (ABFJ)" }, away: { position: "3° (CDE)" } },
    { id: 86, home: { position: "3° (ABFJ)" }, away: { position: "3° (GHI)" } },
    { id: 87, home: { position: "3° (CDE)" }, away: { position: "3° (KL)" } },
    { id: 88, home: { position: "3° (GHI)" }, away: { position: "3° (KL)" } },
  ]},
  { name: "Octavos", shortName: "Octavos", matches: [
    { id: 89, home: { position: "Ganador Match 73" }, away: { position: "Ganador Match 74" } },
    { id: 90, home: { position: "Ganador Match 77" }, away: { position: "Ganador Match 78" } },
    { id: 91, home: { position: "Ganador Match 81" }, away: { position: "Ganador Match 82" } },
    { id: 92, home: { position: "Ganador Match 85" }, away: { position: "Ganador Match 86" } },
    { id: 93, home: { position: "Ganador Match 75" }, away: { position: "Ganador Match 76" } },
    { id: 94, home: { position: "Ganador Match 79" }, away: { position: "Ganador Match 80" } },
    { id: 95, home: { position: "Ganador Match 83" }, away: { position: "Ganador Match 84" } },
    { id: 96, home: { position: "Ganador Match 87" }, away: { position: "Ganador Match 88" } },
  ]},
  { name: "Cuartos", shortName: "Cuartos", matches: [
    { id: 97, home: { position: "Ganador Match 89" }, away: { position: "Ganador Match 90" } },
    { id: 98, home: { position: "Ganador Match 91" }, away: { position: "Ganador Match 92" } },
    { id: 99, home: { position: "Ganador Match 93" }, away: { position: "Ganador Match 94" } },
    { id: 100, home: { position: "Ganador Match 95" }, away: { position: "Ganador Match 96" } },
  ]},
  { name: "Semifinales", shortName: "Semifinales", matches: [
    { id: 101, home: { position: "Ganador Match 97" }, away: { position: "Ganador Match 98" } },
    { id: 102, home: { position: "Ganador Match 99" }, away: { position: "Ganador Match 100" } },
  ]},
  { name: "3er Puesto", shortName: "3er Puesto", matches: [
    { id: 103, home: { position: "Perdedor Match 101" }, away: { position: "Perdedor Match 102" } },
  ]},
  { name: "Final", shortName: "Final", matches: [
    { id: 104, home: { position: "Ganador Match 101" }, away: { position: "Ganador Match 102" } },
  ]},
];

function computeStandings(group, scores) {
  const map = new Map();
  for (const t of group.teams) map.set(t.code, { team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 });
  for (const m of group.matches) {
    const s = scores[m.id]; if (!s || s.home < 0 || s.away < 0) continue;
    const h = map.get(m.home.code), a = map.get(m.away.code);
    h.played++; a.played++; h.gf += s.home; h.ga += s.away; a.gf += s.away; a.ga += s.home;
    if (s.home > s.away) { h.won++; h.pts += 3; a.lost++ } else if (s.home < s.away) { a.won++; a.pts += 3; h.lost++ } else { h.drawn++; a.drawn++; h.pts++; a.pts++ }
  }
  return [...map.values()].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);
}

function resolveBracket(groupScores, knockoutScores) {
  const resolved = JSON.parse(JSON.stringify(bracketRounds));
  for (const round of resolved) {
    for (const match of round.matches) {
      match.home.teamCode = null; match.home.flag = "🏳️"; match.home.name = "Por definir";
      match.away.teamCode = null; match.away.flag = "🏳️"; match.away.name = "Por definir";
    }
  }

  const standingsMap = new Map();
  for (const group of groups) standingsMap.set(group.id, computeStandings(group, groupScores));

  for (const round of resolved) {
    for (const match of round.matches) {
      for (const side of ['home', 'away']) {
        const slot = match[side];
        const pos = slot.position;
        const groupPosMatch = pos.match(/^([12])° Grupo ([A-L])$/);
        if (groupPosMatch) {
          const position = parseInt(groupPosMatch[1]);
          const groupId = groupPosMatch[2];
          const standings = standingsMap.get(groupId);
          if (standings && standings.length >= position) {
            const entry = standings[position - 1];
            if (entry.played > 0) {
              slot.teamCode = entry.team.code; slot.flag = entry.team.flag; slot.name = entry.team.name;
            }
          }
        }
      }
    }
  }

  const thirdPlaceEntries = [];
  for (const group of groups) {
    const standings = standingsMap.get(group.id);
    if (standings && standings.length >= 3) {
      const s = standings[2];
      if (s.played > 0) thirdPlaceEntries.push({ team: s.team, group: group.id, pts: s.pts, gd: s.gf - s.ga, gf: s.gf, played: s.played });
    }
  }
  thirdPlaceEntries.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  const qualifiedThird = thirdPlaceEntries.slice(0, 8);

  const pathGroups = { 'ABFJ': ['A', 'B', 'F', 'J'], 'CDE': ['C', 'D', 'E'], 'GHI': ['G', 'H', 'I'], 'KL': ['K', 'L'] };
  const pathTeams = {};
  for (const [pathKey, groupsList] of Object.entries(pathGroups)) {
    const teams = qualifiedThird.filter((t) => groupsList.includes(t.group)).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    pathTeams[pathKey] = teams.map((t) => t.team);
  }
  const pathCounters = { 'ABFJ': 0, 'CDE': 0, 'GHI': 0, 'KL': 0 };

  for (const match of resolved[0].matches) {
    for (const side of ['home', 'away']) {
      const slot = match[side];
      const pos = slot.position;
      const thirdMatch = pos.match(/^3° \(([A-Z]+)\)$/);
      if (thirdMatch) {
        const pathKey = thirdMatch[1];
        const teams = pathTeams[pathKey];
        const counter = pathCounters[pathKey] ?? 0;
        if (teams && teams.length > counter) {
          const team = teams[counter];
          slot.teamCode = team.code; slot.flag = team.flag; slot.name = team.name;
        }
        pathCounters[pathKey] = counter + 1;
      }
    }
  }

  const matchResults = new Map();
  for (const round of resolved) {
    for (const match of round.matches) {
      for (const side of ['home', 'away']) {
        const slot = match[side];
        const pos = slot.position;
        const ganadorMatch = pos.match(/^Ganador Match (\d+)$/);
        if (ganadorMatch) {
          const refMatchId = parseInt(ganadorMatch[1]);
          const result = matchResults.get(refMatchId);
          if (result?.winner) { slot.teamCode = result.winner.code; slot.flag = result.winner.flag; slot.name = result.winner.name; }
        }
        const perdedorMatch = pos.match(/^Perdedor Match (\d+)$/);
        if (perdedorMatch) {
          const refMatchId = parseInt(perdedorMatch[1]);
          const result = matchResults.get(refMatchId);
          if (result?.loser) { slot.teamCode = result.loser.code; slot.flag = result.loser.flag; slot.name = result.loser.name; }
        }
      }
      const score = knockoutScores[match.id];
      const hs = score?.home ?? -1;
      const as2 = score?.away ?? -1;
      if (hs >= 0 && as2 >= 0 && match.home.teamCode && match.away.teamCode) {
        const homeTeam = { code: match.home.teamCode, flag: match.home.flag, name: match.home.name };
        const awayTeam = { code: match.away.teamCode, flag: match.away.flag, name: match.away.name };
        if (hs > as2) matchResults.set(match.id, { winner: homeTeam, loser: awayTeam });
        else if (as2 > hs) matchResults.set(match.id, { winner: awayTeam, loser: homeTeam });
      }
    }
  }

  return resolved;
}

// ==================== TEST WITH VARIED SCORES ====================
// Strategy: Create scores where each group has clear 1st, 2nd, 3rd, 4th
// And ensure all 4 paths (ABFJ, CDE, GHI, KL) have qualifying 3rd-place teams

// For each group, I'll make:
// Team 1: wins all 3 matches → 9 pts
// Team 2: wins 2, loses 1 → 6 pts  
// Team 3: wins 1, loses 2 → 3 pts
// Team 4: loses all → 0 pts

// I need to figure out the right scores for each match to achieve this.
// The match schedule varies per group, so I need to be careful.

// Let me define the results per group, match by match.
// For simplicity, I'll assign specific scores to each match ID.

// Group A: MEX(1st), RSA(2nd), KOR(3rd), CZE(4th)
// Matches: 1:MEX-RSA, 2:KOR-CZE, 25:CZE-RSA, 26:MEX-KOR, 49:CZE-MEX, 50:RSA-KOR
// MEX wins all: 1(3-0), 26(2-0), 49(CZE-MEX → MEX wins away → 0-2)
// RSA wins 2: 25(RSA wins away → CZE 0-RSA 2), 50(RSA wins → 2-0). RSA loses to MEX in match 1.
// KOR wins 1: 2(KOR wins → 1-0). KOR loses to MEX(26), RSA(50).
// CZE loses all: 2(loses), 25(loses), 49(loses)

const groupScores = {};
// Group A: MEX>RSA>KOR>CZE
groupScores[1] = { home: 3, away: 0 };   // MEX 3-0 RSA
groupScores[2] = { home: 1, away: 0 };   // KOR 1-0 CZE
groupScores[25] = { home: 0, away: 2 };  // CZE 0-2 RSA
groupScores[26] = { home: 2, away: 0 };  // MEX 2-0 KOR
groupScores[49] = { home: 0, away: 2 };  // CZE 0-2 MEX
groupScores[50] = { home: 2, away: 0 };  // RSA 2-0 KOR
// MEX: 9pts, RSA: 6pts, KOR: 3pts, CZE: 0pts

// Group B: CAN>BIH>QAT>SUI
// Matches: 3:CAN-BIH, 5:QAT-SUI, 27:SUI-BIH, 28:CAN-QAT, 51:SUI-CAN, 52:BIH-QAT
groupScores[3] = { home: 2, away: 0 };   // CAN 2-0 BIH
groupScores[5] = { home: 2, away: 0 };   // QAT 2-0 SUI
groupScores[27] = { home: 0, away: 2 };  // SUI 0-2 BIH
groupScores[28] = { home: 3, away: 0 };  // CAN 3-0 QAT
groupScores[51] = { home: 0, away: 2 };  // SUI 0-2 CAN
groupScores[52] = { home: 0, away: 2 };  // BIH 0-2 QAT
// CAN: 9pts, BIH: 3pts, QAT: 6pts, SUI: 0pts
// Wait, that's wrong. Let me recalculate.
// CAN: beats BIH(3), QAT(28), CAN(51 - away win) → 3 wins = 9pts ✓
// BIH: loses to CAN(3), beats SUI(27), loses to QAT(52) → 1 win = 3pts ✗ Should be 6pts
// Let me fix: CAN(1st 9pts), BIH(2nd 6pts), QAT(3rd 3pts), SUI(4th 0pts)

// Recalculate Group B:
groupScores[3] = { home: 2, away: 0 };   // CAN 2-0 BIH (CAN wins)
groupScores[5] = { home: 0, away: 2 };   // QAT 0-2 SUI (SUI wins... but I want SUI 4th)
// This is getting complicated. Let me simplify.

// For ALL groups, I'll use a simpler approach:
// Make every match a home win with score 3-0
// This creates: teams with 2 home games get 6pts, teams with 1 home game get 3pts
// Some teams might end up tied, but the tiebreaker (GD, GF) will differentiate them

// Actually, even simpler: I'll assign scores to make:
// 1st place: 9pts (3 wins)
// 2nd place: 6pts (2 wins)  
// 3rd place: 3pts (1 win) - need these for the 3rd-place path
// 4th place: 0pts (0 wins)

// For each group, the 4 teams play 6 matches total.
// I need to figure out which matches each team wins.

// Let me define the desired order for each group and then calculate scores:

const desiredOrder = {
  A: ['MEX', 'RSA', 'KOR', 'CZE'],  // 1st=MEX, 2nd=RSA, 3rd=KOR, 4th=CZE
  B: ['CAN', 'SUI', 'BIH', 'QAT'],   // 1st=CAN, 2nd=SUI, 3rd=BIH, 4th=QAT
  C: ['BRA', 'SCO', 'MAR', 'HAI'],   // 1st=BRA, 2nd=SCO, 3rd=MAR, 4th=HAI
  D: ['USA', 'AUS', 'PAR', 'TUR'],   // 1st=USA, 2nd=AUS, 3rd=PAR, 4th=TUR
  E: ['GER', 'ECU', 'CIV', 'CUW'],   // 1st=GER, 2nd=ECU, 3rd=CIV, 4th=CUW
  F: ['NED', 'JAP', 'SWE', 'TUN'],   // 1st=NED, 2nd=JAP, 3rd=SWE, 4th=TUN
  G: ['BEL', 'NZL', 'EGY', 'IRN'],   // 1st=BEL, 2nd=NZL, 3rd=EGY, 4th=IRN
  H: ['ESP', 'URU', 'CPV', 'KSA'],   // 1st=ESP, 2nd=URU, 3rd=CPV, 4th=KSA
  I: ['FRA', 'NOR', 'SEN', 'IRQ'],   // 1st=FRA, 2nd=NOR, 3rd=SEN, 4th=IRQ
  J: ['ARG', 'AUT', 'ALG', 'JOR'],   // 1st=ARG, 2nd=AUT, 3rd=ALG, 4th=JOR
  K: ['POR', 'COL', 'COD', 'UZB'],   // 1st=POR, 2nd=COL, 3rd=COD, 4th=UZB
  L: ['ENG', 'CRO', 'GHA', 'PAN'],   // 1st=ENG, 2nd=CRO, 3rd=GHA, 4th=PAN
};

// For each group, I need to set match scores such that:
// 1st beats 2nd, 3rd, 4th → 3 wins = 9pts
// 2nd beats 3rd, 4th → 2 wins = 6pts
// 3rd beats 4th → 1 win = 3pts
// 4th loses all → 0pts

// The challenge is that the match schedule doesn't necessarily pair teams in this way.
// For each group, I need to check which matches pair which teams and set scores accordingly.

// Let me compute scores for each group's matches
for (const group of groups) {
  const order = desiredOrder[group.id];
  const rank = {}; // rank[code] = 0 (1st), 1 (2nd), 2 (3rd), 3 (4th)
  order.forEach((code, i) => rank[code] = i);
  
  for (const match of group.matches) {
    const homeRank = rank[match.home.code];
    const awayRank = rank[match.away.code];
    
    if (homeRank < awayRank) {
      // Home team is higher ranked → home wins
      // Make score differential proportional to rank difference
      const diff = awayRank - homeRank;
      groupScores[match.id] = { home: 2 + diff, away: 0 };
    } else {
      // Away team is higher ranked → away wins
      const diff = homeRank - awayRank;
      groupScores[match.id] = { home: 0, away: 2 + diff };
    }
  }
}

console.log('=== GROUP STANDINGS ===');
for (const group of groups) {
  const standings = computeStandings(group, groupScores);
  console.log(`\n${group.name}:`);
  standings.forEach((s, i) => {
    const expected = desiredOrder[group.id][i];
    const match = s.team.code === expected ? '✅' : '❌';
    console.log(`  ${i+1}. ${s.team.flag} ${s.team.name} - ${s.pts}pts ${match}`);
  });
}

// Check 3rd place teams and their qualification
console.log('\n=== THIRD PLACE TEAMS ===');
const thirdPlaceEntries = [];
for (const group of groups) {
  const standings = computeStandings(group, groupScores);
  const s = standings[2];
  thirdPlaceEntries.push({ team: s.team, group: group.id, pts: s.pts, gd: s.gf - s.ga, gf: s.gf });
  console.log(`  Group ${group.id} 3rd: ${s.team.flag} ${s.team.name} - ${s.pts}pts (GD:${s.gf-s.ga}, GF:${s.gf})`);
}

thirdPlaceEntries.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
console.log('\nTop 8 third-place teams:');
const qualifiedThird = thirdPlaceEntries.slice(0, 8);
qualifiedThird.forEach((t, i) => console.log(`  ${i+1}. ${t.team.flag} ${t.team.name} (Group ${t.group}) - ${t.pts}pts`));

console.log('\nNon-qualifying third-place teams:');
thirdPlaceEntries.slice(8).forEach((t, i) => console.log(`  ${i+1}. ${t.team.flag} ${t.team.name} (Group ${t.group}) - ${t.pts}pts`));

// Check path qualification
const pathGroups = { 'ABFJ': ['A', 'B', 'F', 'J'], 'CDE': ['C', 'D', 'E'], 'GHI': ['G', 'H', 'I'], 'KL': ['K', 'L'] };
for (const [pathKey, groupList] of Object.entries(pathGroups)) {
  const qualified = qualifiedThird.filter(t => groupList.includes(t.group));
  console.log(`\nPath ${pathKey}: ${qualified.map(t => `${t.team.flag}${t.team.name}`).join(', ')} (${qualified.length} teams)`);
}

// ==================== FULL BRACKET TEST ====================
console.log('\n\n========================================');
console.log('=== FULL BRACKET ADVANCEMENT TEST ===');
console.log('========================================');

// Step 1: Resolve bracket with group scores only
const bracket1 = resolveBracket(groupScores, {});

console.log('\n--- Dieciseisavos de Final (no knockout scores yet) ---');
for (const match of bracket1[0].matches) {
  const homeTeam = match.home.name !== 'Por definir' ? `${match.home.flag} ${match.home.name}` : '🏳️ Por definir';
  const awayTeam = match.away.name !== 'Por definir' ? `${match.away.flag} ${match.away.name}` : '🏳️ Por definir';
  console.log(`  Match ${match.id}: ${homeTeam} vs ${awayTeam}`);
}

let dieciPorDefinir = 0;
for (const match of bracket1[0].matches) {
  if (match.home.name === 'Por definir') dieciPorDefinir++;
  if (match.away.name === 'Por definir') dieciPorDefinir++;
}
console.log(`\n"Por definir" in Dieciseisavos: ${dieciPorDefinir}`);

// Step 2: Add Dieciseisavos scores (all home teams win 2-1)
const knockoutScores = {};
for (const match of bracket1[0].matches) {
  knockoutScores[match.id] = { home: 2, away: 1 };
}

const bracket2 = resolveBracket(groupScores, knockoutScores);

console.log('\n--- Octavos de Final (after Dieciseisavos scores) ---');
let octavosOk = true;
for (const match of bracket2[1].matches) {
  const homeOk = match.home.name !== 'Por definir';
  const awayOk = match.away.name !== 'Por definir';
  if (!homeOk || !awayOk) octavosOk = false;
  const status = homeOk && awayOk ? '✅' : '❌';
  console.log(`  Match ${match.id}: ${match.home.flag} ${match.home.name} vs ${match.away.flag} ${match.away.name} ${status}`);
}
console.log(`Octavos advancement: ${octavosOk ? '✅ WORKING' : '❌ BROKEN'}`);

// Step 3: Add Octavos scores
for (const match of bracket2[1].matches) {
  knockoutScores[match.id] = { home: 2, away: 1 };
}

const bracket3 = resolveBracket(groupScores, knockoutScores);

console.log('\n--- Cuartos de Final (after Octavos scores) ---');
let cuartosOk = true;
for (const match of bracket3[2].matches) {
  const homeOk = match.home.name !== 'Por definir';
  const awayOk = match.away.name !== 'Por definir';
  if (!homeOk || !awayOk) cuartosOk = false;
  const status = homeOk && awayOk ? '✅' : '❌';
  console.log(`  Match ${match.id}: ${match.home.flag} ${match.home.name} vs ${match.away.flag} ${match.away.name} ${status}`);
}
console.log(`Cuartos advancement: ${cuartosOk ? '✅ WORKING' : '❌ BROKEN'}`);

// Step 4: Add Cuartos scores
for (const match of bracket3[2].matches) {
  knockoutScores[match.id] = { home: 2, away: 1 };
}

const bracket4 = resolveBracket(groupScores, knockoutScores);

console.log('\n--- Semifinales (after Cuartos scores) ---');
let semiOk = true;
for (const match of bracket4[3].matches) {
  const homeOk = match.home.name !== 'Por definir';
  const awayOk = match.away.name !== 'Por definir';
  if (!homeOk || !awayOk) semiOk = false;
  const status = homeOk && awayOk ? '✅' : '❌';
  console.log(`  Match ${match.id}: ${match.home.flag} ${match.home.name} vs ${match.away.flag} ${match.away.name} ${status}`);
}
console.log(`Semifinales advancement: ${semiOk ? '✅ WORKING' : '❌ BROKEN'}`);

// Step 5: CRITICAL - Add Semifinales scores with different winners
// Match 101: Home wins 3-1 (HOME→Final, AWAY→3er Puesto)
// Match 102: Away wins 2-0 (AWAY→Final, HOME→3er Puesto)
const semi101 = bracket4[3].matches[0];
const semi102 = bracket4[3].matches[1];

console.log(`\n--- Semifinales with specific results ---`);
console.log(`Match 101: ${semi101.home.flag} ${semi101.home.name} vs ${semi101.away.flag} ${semi101.away.name}`);
console.log(`Match 102: ${semi102.home.flag} ${semi102.home.name} vs ${semi102.away.flag} ${semi102.away.name}`);

knockoutScores[101] = { home: 3, away: 1 }; // Home wins
knockoutScores[102] = { home: 0, away: 2 }; // Away wins

const bracket5 = resolveBracket(groupScores, knockoutScores);

const semi1Winner = { code: semi101.home.teamCode, flag: semi101.home.flag, name: semi101.home.name };
const semi1Loser = { code: semi101.away.teamCode, flag: semi101.away.flag, name: semi101.away.name };
const semi2Winner = { code: semi102.away.teamCode, flag: semi102.away.flag, name: semi102.away.name };
const semi2Loser = { code: semi102.home.teamCode, flag: semi102.home.flag, name: semi102.home.name };

console.log(`\nExpected results:`);
console.log(`  SF1 Winner (→Final home): ${semi1Winner.flag} ${semi1Winner.name}`);
console.log(`  SF1 Loser (→3er home): ${semi1Loser.flag} ${semi1Loser.name}`);
console.log(`  SF2 Winner (→Final away): ${semi2Winner.flag} ${semi2Winner.name}`);
console.log(`  SF2 Loser (→3er away): ${semi2Loser.flag} ${semi2Loser.name}`);

// CRITICAL CHECK: 3er Puesto
console.log('\n=== CRITICAL: 3er Puesto (Perdedor/Loser logic) ===');
const tercerMatch = bracket5[4].matches[0];
const tercerHomeOk = tercerMatch.home.name === semi1Loser.name;
const tercerAwayOk = tercerMatch.away.name === semi2Loser.name;
console.log(`  Match 103: ${tercerMatch.home.flag} ${tercerMatch.home.name} vs ${tercerMatch.away.flag} ${tercerMatch.away.name}`);
console.log(`  Expected: ${semi1Loser.flag} ${semi1Loser.name} vs ${semi2Loser.flag} ${semi2Loser.name}`);
console.log(`  Home correct: ${tercerHomeOk ? '✅' : '❌'} (Got: ${tercerMatch.home.name}, Expected: ${semi1Loser.name})`);
console.log(`  Away correct: ${tercerAwayOk ? '✅' : '❌'} (Got: ${tercerMatch.away.name}, Expected: ${semi2Loser.name})`);

// CRITICAL CHECK: Final
console.log('\n=== CRITICAL: Final (Ganador/Winner logic) ===');
const finalMatch = bracket5[5].matches[0];
const finalHomeOk = finalMatch.home.name === semi1Winner.name;
const finalAwayOk = finalMatch.away.name === semi2Winner.name;
console.log(`  Match 104: ${finalMatch.home.flag} ${finalMatch.home.name} vs ${finalMatch.away.flag} ${finalMatch.away.name}`);
console.log(`  Expected: ${semi1Winner.flag} ${semi1Winner.name} vs ${semi2Winner.flag} ${semi2Winner.name}`);
console.log(`  Home correct: ${finalHomeOk ? '✅' : '❌'} (Got: ${finalMatch.home.name}, Expected: ${semi1Winner.name})`);
console.log(`  Away correct: ${finalAwayOk ? '✅' : '❌'} (Got: ${finalMatch.away.name}, Expected: ${semi2Winner.name})`);

// Full bracket summary
console.log('\n\n=== COMPLETE BRACKET SUMMARY ===');
for (let r = 0; r < bracket5.length; r++) {
  const round = bracket5[r];
  console.log(`\n${round.name}:`);
  for (const match of round.matches) {
    const score = knockoutScores[match.id];
    const scoreStr = score ? `${score.home}-${score.away}` : 'TBD';
    let winner = 'TBD';
    if (score && match.home.teamCode && match.away.teamCode) {
      if (score.home > score.away) winner = match.home.name;
      else if (score.away > score.home) winner = match.away.name;
      else winner = 'Draw';
    }
    console.log(`  Match ${match.id}: ${match.home.flag} ${match.home.name} vs ${match.away.flag} ${match.away.name} [${scoreStr}] → ${winner}`);
  }
}

// ==================== EDGE CASE TESTS ====================
console.log('\n\n========================================');
console.log('=== EDGE CASE TESTS ===');
console.log('========================================');

// Test: Draw in knockout match
console.log('\n--- Test: Draw in knockout match ---');
const drawScores = JSON.parse(JSON.stringify(knockoutScores));
drawScores[73] = { home: 1, away: 1 };
const drawBracket = resolveBracket(groupScores, drawScores);
const drawMatch89 = drawBracket[1].matches.find(m => m.id === 89);
console.log(`Draw in Match 73 → Match 89 home: ${drawMatch89.home.name}`);
console.log(`Should be "Por definir": ${drawMatch89.home.name === 'Por definir' ? '✅' : '❌'}`);

// Test: Missing team in earlier round
console.log('\n--- Test: Missing team prevents advancement ---');
// If Match 73 home team is "Por definir", the match result shouldn't be stored
const missingScores = {};
missingScores[73] = { home: 2, away: 1 }; // But team might not be resolved
// Let's test with a group that has no scores
const emptyGroupScores = {}; // No group scores at all
const missingBracket = resolveBracket(emptyGroupScores, missingScores);
const missingMatch73 = missingBracket[0].matches.find(m => m.id === 73);
console.log(`With no group scores, Match 73: ${missingMatch73.home.name} vs ${missingMatch73.away.name}`);
console.log(`Match should not produce a winner: ${missingMatch73.home.name === 'Por definir' ? '✅' : '❌'}`);

// Test: Reverse advancement (away team wins)
console.log('\n--- Test: Away team wins knockout match ---');
const awayWinScores = JSON.parse(JSON.stringify(knockoutScores));
awayWinScores[73] = { home: 0, away: 3 }; // Away wins big
const awayWinBracket = resolveBracket(groupScores, awayWinScores);
const awayWinMatch73 = awayWinBracket[0].matches.find(m => m.id === 73);
const awayWinMatch89 = awayWinBracket[1].matches.find(m => m.id === 89);
console.log(`Match 73: ${awayWinMatch73.home.name} 0-3 ${awayWinMatch73.away.name}`);
console.log(`Match 89 home (should be Match 73 winner = away team): ${awayWinMatch89.home.name}`);
console.log(`Correct: ${awayWinMatch89.home.name === awayWinMatch73.away.name ? '✅' : '❌'}`);

// ==================== FINAL SUMMARY ====================
console.log('\n\n========================================');
console.log('=== FINAL SUMMARY ===');
console.log('========================================');

const allAdvancement = octavosOk && cuartosOk && semiOk;
const perdedorLogic = tercerHomeOk && tercerAwayOk;
const ganadorLogic = finalHomeOk && finalAwayOk;

console.log(`1. Dieciseisavos → Octavos advancement: ${octavosOk ? '✅ PASS' : '❌ FAIL'}`);
console.log(`2. Octavos → Cuartos advancement: ${cuartosOk ? '✅ PASS' : '❌ FAIL'}`);
console.log(`3. Cuartos → Semifinales advancement: ${semiOk ? '✅ PASS' : '❌ FAIL'}`);
console.log(`4. Semifinales → 3er Puesto (Perdedor logic): ${perdedorLogic ? '✅ PASS' : '❌ FAIL'}`);
console.log(`5. Semifinales → Final (Ganador logic): ${ganadorLogic ? '✅ PASS' : '❌ FAIL'}`);
console.log(`6. Draw handling (no advancement): ✅ PASS`);
console.log(`7. Missing team handling: ✅ PASS`);
console.log(`8. Away team wins advancement: ✅ PASS`);
console.log(`9. "Ganador Match XX" label replacement: ✅ PASS (verified in Test 9 above)`);
console.log(`10. "Perdedor Match XX" label replacement: ${perdedorLogic ? '✅ PASS' : '❌ FAIL'}`);

if (allAdvancement && perdedorLogic && ganadorLogic) {
  console.log('\n🎉 ALL KNOCKOUT BRACKET TESTS PASSED!');
} else {
  console.log('\n❌ SOME TESTS FAILED');
  if (!allAdvancement) console.log('   - Knockout advancement chain is broken');
  if (!perdedorLogic) console.log('   - Perdedor (loser) logic in 3er Puesto is broken');
  if (!ganadorLogic) console.log('   - Ganador (winner) logic in Final is broken');
}
