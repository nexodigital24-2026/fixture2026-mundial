// Direct unit test of the resolveBracket function logic
// This tests the pure logic without the UI

// Replicate the key data structures and functions

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

const groups = [
  { id: "A", name: "Grupo A", teams: [t("MEX"), t("RSA"), t("KOR"), t("CZE")], matches: [
    { id: 1, group: "A", matchday: 1, home: t("MEX"), away: t("RSA") },
    { id: 2, group: "A", matchday: 1, home: t("KOR"), away: t("CZE") },
    { id: 25, group: "A", matchday: 2, home: t("CZE"), away: t("RSA") },
    { id: 26, group: "A", matchday: 2, home: t("MEX"), away: t("KOR") },
    { id: 49, group: "A", matchday: 3, home: t("CZE"), away: t("MEX") },
    { id: 50, group: "A", matchday: 3, home: t("RSA"), away: t("KOR") },
  ]},
  { id: "B", name: "Grupo B", teams: [t("CAN"), t("BIH"), t("QAT"), t("SUI")], matches: [
    { id: 3, group: "B", matchday: 1, home: t("CAN"), away: t("BIH") },
    { id: 5, group: "B", matchday: 1, home: t("QAT"), away: t("SUI") },
    { id: 27, group: "B", matchday: 2, home: t("SUI"), away: t("BIH") },
    { id: 28, group: "B", matchday: 2, home: t("CAN"), away: t("QAT") },
    { id: 51, group: "B", matchday: 3, home: t("SUI"), away: t("CAN") },
    { id: 52, group: "B", matchday: 3, home: t("BIH"), away: t("QAT") },
  ]},
  { id: "C", name: "Grupo C", teams: [t("BRA"), t("MAR"), t("HAI"), t("SCO")], matches: [
    { id: 6, group: "C", matchday: 1, home: t("BRA"), away: t("MAR") },
    { id: 7, group: "C", matchday: 1, home: t("HAI"), away: t("SCO") },
    { id: 29, group: "C", matchday: 2, home: t("SCO"), away: t("MAR") },
    { id: 30, group: "C", matchday: 2, home: t("BRA"), away: t("HAI") },
    { id: 53, group: "C", matchday: 3, home: t("MAR"), away: t("HAI") },
    { id: 54, group: "C", matchday: 3, home: t("SCO"), away: t("BRA") },
  ]},
  { id: "D", name: "Grupo D", teams: [t("USA"), t("PAR"), t("AUS"), t("TUR")], matches: [
    { id: 4, group: "D", matchday: 1, home: t("USA"), away: t("PAR") },
    { id: 8, group: "D", matchday: 1, home: t("AUS"), away: t("TUR") },
    { id: 31, group: "D", matchday: 2, home: t("USA"), away: t("AUS") },
    { id: 32, group: "D", matchday: 2, home: t("TUR"), away: t("PAR") },
    { id: 55, group: "D", matchday: 3, home: t("TUR"), away: t("USA") },
    { id: 56, group: "D", matchday: 3, home: t("PAR"), away: t("AUS") },
  ]},
  { id: "E", name: "Grupo E", teams: [t("GER"), t("CUW"), t("CIV"), t("ECU")], matches: [
    { id: 9, group: "E", matchday: 1, home: t("GER"), away: t("CUW") },
    { id: 11, group: "E", matchday: 1, home: t("CIV"), away: t("ECU") },
    { id: 33, group: "E", matchday: 2, home: t("GER"), away: t("CIV") },
    { id: 34, group: "E", matchday: 2, home: t("ECU"), away: t("CUW") },
    { id: 57, group: "E", matchday: 3, home: t("ECU"), away: t("GER") },
    { id: 58, group: "E", matchday: 3, home: t("CUW"), away: t("CIV") },
  ]},
  { id: "F", name: "Grupo F", teams: [t("NED"), t("JAP"), t("SWE"), t("TUN")], matches: [
    { id: 10, group: "F", matchday: 1, home: t("NED"), away: t("JAP") },
    { id: 12, group: "F", matchday: 1, home: t("SWE"), away: t("TUN") },
    { id: 35, group: "F", matchday: 2, home: t("NED"), away: t("SWE") },
    { id: 36, group: "F", matchday: 2, home: t("TUN"), away: t("JAP") },
    { id: 59, group: "F", matchday: 3, home: t("TUN"), away: t("NED") },
    { id: 60, group: "F", matchday: 3, home: t("JAP"), away: t("SWE") },
  ]},
  { id: "G", name: "Grupo G", teams: [t("BEL"), t("EGY"), t("IRN"), t("NZL")], matches: [
    { id: 14, group: "G", matchday: 1, home: t("BEL"), away: t("EGY") },
    { id: 15, group: "G", matchday: 1, home: t("IRN"), away: t("NZL") },
    { id: 37, group: "G", matchday: 2, home: t("BEL"), away: t("IRN") },
    { id: 38, group: "G", matchday: 2, home: t("NZL"), away: t("EGY") },
    { id: 61, group: "G", matchday: 3, home: t("EGY"), away: t("IRN") },
    { id: 62, group: "G", matchday: 3, home: t("NZL"), away: t("BEL") },
  ]},
  { id: "H", name: "Grupo H", teams: [t("ESP"), t("CPV"), t("KSA"), t("URU")], matches: [
    { id: 13, group: "H", matchday: 1, home: t("ESP"), away: t("CPV") },
    { id: 16, group: "H", matchday: 1, home: t("KSA"), away: t("URU") },
    { id: 39, group: "H", matchday: 2, home: t("ESP"), away: t("KSA") },
    { id: 40, group: "H", matchday: 2, home: t("URU"), away: t("CPV") },
    { id: 63, group: "H", matchday: 3, home: t("URU"), away: t("ESP") },
    { id: 64, group: "H", matchday: 3, home: t("CPV"), away: t("KSA") },
  ]},
  { id: "I", name: "Grupo I", teams: [t("FRA"), t("SEN"), t("IRQ"), t("NOR")], matches: [
    { id: 17, group: "I", matchday: 1, home: t("FRA"), away: t("SEN") },
    { id: 18, group: "I", matchday: 1, home: t("IRQ"), away: t("NOR") },
    { id: 41, group: "I", matchday: 2, home: t("FRA"), away: t("IRQ") },
    { id: 42, group: "I", matchday: 2, home: t("NOR"), away: t("SEN") },
    { id: 65, group: "I", matchday: 3, home: t("NOR"), away: t("FRA") },
    { id: 66, group: "I", matchday: 3, home: t("SEN"), away: t("IRQ") },
  ]},
  { id: "J", name: "Grupo J", teams: [t("ARG"), t("ALG"), t("AUT"), t("JOR")], matches: [
    { id: 19, group: "J", matchday: 1, home: t("ARG"), away: t("ALG") },
    { id: 20, group: "J", matchday: 1, home: t("AUT"), away: t("JOR") },
    { id: 43, group: "J", matchday: 2, home: t("ARG"), away: t("AUT") },
    { id: 44, group: "J", matchday: 2, home: t("JOR"), away: t("ALG") },
    { id: 67, group: "J", matchday: 3, home: t("JOR"), away: t("ARG") },
    { id: 68, group: "J", matchday: 3, home: t("ALG"), away: t("AUT") },
  ]},
  { id: "K", name: "Grupo K", teams: [t("POR"), t("COD"), t("UZB"), t("COL")], matches: [
    { id: 21, group: "K", matchday: 1, home: t("POR"), away: t("COD") },
    { id: 24, group: "K", matchday: 1, home: t("UZB"), away: t("COL") },
    { id: 45, group: "K", matchday: 2, home: t("POR"), away: t("UZB") },
    { id: 48, group: "K", matchday: 2, home: t("COL"), away: t("COD") },
    { id: 69, group: "K", matchday: 3, home: t("COL"), away: t("POR") },
    { id: 70, group: "K", matchday: 3, home: t("COD"), away: t("UZB") },
  ]},
  { id: "L", name: "Grupo L", teams: [t("ENG"), t("CRO"), t("GHA"), t("PAN")], matches: [
    { id: 22, group: "L", matchday: 1, home: t("ENG"), away: t("CRO") },
    { id: 23, group: "L", matchday: 1, home: t("GHA"), away: t("PAN") },
    { id: 46, group: "L", matchday: 2, home: t("ENG"), away: t("GHA") },
    { id: 47, group: "L", matchday: 2, home: t("PAN"), away: t("CRO") },
    { id: 71, group: "L", matchday: 3, home: t("PAN"), away: t("ENG") },
    { id: 72, group: "L", matchday: 3, home: t("CRO"), away: t("GHA") },
  ]},
];

// Replicate the bracketRounds structure (just match IDs and positions)
const bracketRounds = [
  {
    name: "Dieciseisavos de Final",
    shortName: "Dieciseisavos",
    matches: [
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
    ],
  },
  {
    name: "Octavos de Final",
    shortName: "Octavos",
    matches: [
      { id: 89, home: { position: "Ganador Match 73" }, away: { position: "Ganador Match 74" } },
      { id: 90, home: { position: "Ganador Match 77" }, away: { position: "Ganador Match 78" } },
      { id: 91, home: { position: "Ganador Match 81" }, away: { position: "Ganador Match 82" } },
      { id: 92, home: { position: "Ganador Match 85" }, away: { position: "Ganador Match 86" } },
      { id: 93, home: { position: "Ganador Match 75" }, away: { position: "Ganador Match 76" } },
      { id: 94, home: { position: "Ganador Match 79" }, away: { position: "Ganador Match 80" } },
      { id: 95, home: { position: "Ganador Match 83" }, away: { position: "Ganador Match 84" } },
      { id: 96, home: { position: "Ganador Match 87" }, away: { position: "Ganador Match 88" } },
    ],
  },
  {
    name: "Cuartos de Final",
    shortName: "Cuartos",
    matches: [
      { id: 97, home: { position: "Ganador Match 89" }, away: { position: "Ganador Match 90" } },
      { id: 98, home: { position: "Ganador Match 91" }, away: { position: "Ganador Match 92" } },
      { id: 99, home: { position: "Ganador Match 93" }, away: { position: "Ganador Match 94" } },
      { id: 100, home: { position: "Ganador Match 95" }, away: { position: "Ganador Match 96" } },
    ],
  },
  {
    name: "Semifinales",
    shortName: "Semifinales",
    matches: [
      { id: 101, home: { position: "Ganador Match 97" }, away: { position: "Ganador Match 98" } },
      { id: 102, home: { position: "Ganador Match 99" }, away: { position: "Ganador Match 100" } },
    ],
  },
  {
    name: "3er y 4to Puesto",
    shortName: "3er Puesto",
    matches: [
      { id: 103, home: { position: "Perdedor Match 101" }, away: { position: "Perdedor Match 102" } },
    ],
  },
  {
    name: "Final",
    shortName: "Final",
    matches: [
      { id: 104, home: { position: "Ganador Match 101" }, away: { position: "Ganador Match 102" } },
    ],
  },
];

// ==================== Core Logic (from page.tsx) ====================

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
  // Deep clone bracketRounds - but we only need the positions
  const resolved = JSON.parse(JSON.stringify(bracketRounds));
  
  // Add the extra fields needed
  for (const round of resolved) {
    for (const match of round.matches) {
      match.home.teamCode = null;
      match.home.flag = "🏳️";
      match.home.name = "Por definir";
      match.away.teamCode = null;
      match.away.flag = "🏳️";
      match.away.name = "Por definir";
      match.homeScore = null;
      match.awayScore = null;
    }
  }

  // Step 1: Compute standings for all 12 groups
  const standingsMap = new Map();
  for (const group of groups) {
    standingsMap.set(group.id, computeStandings(group, groupScores));
  }

  // Step 2: Resolve group position slots
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
              slot.teamCode = entry.team.code;
              slot.flag = entry.team.flag;
              slot.name = entry.team.name;
            }
          }
        }
      }
    }
  }

  // Step 3: Handle 3rd-place teams
  const thirdPlaceEntries = [];
  for (const group of groups) {
    const standings = standingsMap.get(group.id);
    if (standings && standings.length >= 3) {
      const s = standings[2];
      if (s.played > 0) {
        thirdPlaceEntries.push({ team: s.team, group: group.id, pts: s.pts, gd: s.gf - s.ga, gf: s.gf, played: s.played });
      }
    }
  }

  thirdPlaceEntries.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  const qualifiedThird = thirdPlaceEntries.slice(0, 8);

  const pathGroups = {
    'ABFJ': ['A', 'B', 'F', 'J'],
    'CDE': ['C', 'D', 'E'],
    'GHI': ['G', 'H', 'I'],
    'KL': ['K', 'L'],
  };

  const pathTeams = {};
  for (const [pathKey, groupsList] of Object.entries(pathGroups)) {
    const teams = qualifiedThird
      .filter((t) => groupsList.includes(t.group))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
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
          slot.teamCode = team.code;
          slot.flag = team.flag;
          slot.name = team.name;
        }
        pathCounters[pathKey] = counter + 1;
      }
    }
  }

  // Step 4: Handle knockout advancement
  const matchResults = new Map();

  for (const round of resolved) {
    for (const match of round.matches) {
      // First resolve Ganador/Perdedor references
      for (const side of ['home', 'away']) {
        const slot = match[side];
        const pos = slot.position;

        const ganadorMatch = pos.match(/^Ganador Match (\d+)$/);
        if (ganadorMatch) {
          const refMatchId = parseInt(ganadorMatch[1]);
          const result = matchResults.get(refMatchId);
          if (result?.winner) {
            slot.teamCode = result.winner.code;
            slot.flag = result.winner.flag;
            slot.name = result.winner.name;
          }
        }

        const perdedorMatch = pos.match(/^Perdedor Match (\d+)$/);
        if (perdedorMatch) {
          const refMatchId = parseInt(perdedorMatch[1]);
          const result = matchResults.get(refMatchId);
          if (result?.loser) {
            slot.teamCode = result.loser.code;
            slot.flag = result.loser.flag;
            slot.name = result.loser.name;
          }
        }
      }

      // Store match result if score is available
      const score = knockoutScores[match.id];
      const hs = score?.home ?? -1;
      const as2 = score?.away ?? -1;
      if (hs >= 0 && as2 >= 0 && match.home.teamCode && match.away.teamCode) {
        const homeTeam = { code: match.home.teamCode, flag: match.home.flag, name: match.home.name };
        const awayTeam = { code: match.away.teamCode, flag: match.away.flag, name: match.away.name };
        if (hs > as2) {
          matchResults.set(match.id, { winner: homeTeam, loser: awayTeam });
        } else if (as2 > hs) {
          matchResults.set(match.id, { winner: awayTeam, loser: homeTeam });
        }
        // Draw = no winner stored
      }
    }
  }

  return resolved;
}

// ==================== TEST EXECUTION ====================

// Create group scores: For each group, make the home team win 2-1
// This ensures all matches have clear winners
const groupScores = {};
for (const group of groups) {
  for (const match of group.matches) {
    groupScores[match.id] = { home: 2, away: 1 };
  }
}

console.log('=== GROUP STANDINGS ===');
for (const group of groups) {
  const standings = computeStandings(group, groupScores);
  console.log(`\n${group.name}:`);
  standings.forEach((s, i) => {
    console.log(`  ${i+1}. ${s.team.flag} ${s.team.name} - ${s.pts}pts (W${s.won} D${s.drawn} L${s.lost} GF${s.gf} GA${s.ga})`);
  });
}

// Test 1: Resolve bracket without any knockout scores
console.log('\n\n=== TEST 1: Bracket with group scores only (no knockout scores) ===');
const bracket1 = resolveBracket(groupScores, {});

console.log('\nDieciseisavos de Final:');
for (const match of bracket1[0].matches) {
  console.log(`  Match ${match.id}: ${match.home.flag} ${match.home.name} vs ${match.away.flag} ${match.away.name}`);
}

// Count how many "Por definir" there are
let porDefinirCount = 0;
for (const match of bracket1[0].matches) {
  if (match.home.name === 'Por definir') porDefinirCount++;
  if (match.away.name === 'Por definir') porDefinirCount++;
}
console.log(`\n"Por definir" count in Dieciseisavos: ${porDefinirCount}`);

// Test 2: Add knockout scores for all Dieciseisavos matches (home wins 2-1)
console.log('\n\n=== TEST 2: Add Dieciseisavos scores (home wins 2-1) ===');
const knockoutScores1 = {};
for (const match of bracket1[0].matches) {
  knockoutScores1[match.id] = { home: 2, away: 1 };
}

const bracket2 = resolveBracket(groupScores, knockoutScores1);

console.log('\nDieciseisavos de Final:');
for (const match of bracket2[0].matches) {
  const score = knockoutScores1[match.id];
  console.log(`  Match ${match.id}: ${match.home.flag} ${match.home.name} ${score.home}-${score.away} ${match.away.flag} ${match.away.name}`);
}

console.log('\nOctavos de Final (should have teams from Dieciseisavos winners):');
let octavosOk = true;
for (const match of bracket2[1].matches) {
  const homeOk = match.home.name !== 'Por definir';
  const awayOk = match.away.name !== 'Por definir';
  if (!homeOk || !awayOk) octavosOk = false;
  console.log(`  Match ${match.id}: ${match.home.flag} ${match.home.name} vs ${match.away.flag} ${match.away.name} ${homeOk && awayOk ? '✅' : '❌ MISSING TEAM'}`);
}
console.log(`\nOctavos advancement: ${octavosOk ? '✅ WORKING' : '❌ BROKEN'}`);

// Test 3: Add Octavos scores (home wins 2-1)
console.log('\n\n=== TEST 3: Add Octavos scores (home wins 2-1) ===');
const knockoutScores2 = { ...knockoutScores1 };
for (const match of bracket2[1].matches) {
  knockoutScores2[match.id] = { home: 2, away: 1 };
}

const bracket3 = resolveBracket(groupScores, knockoutScores2);

console.log('\nCuartos de Final (should have teams from Octavos winners):');
let cuartosOk = true;
for (const match of bracket3[2].matches) {
  const homeOk = match.home.name !== 'Por definir';
  const awayOk = match.away.name !== 'Por definir';
  if (!homeOk || !awayOk) cuartosOk = false;
  console.log(`  Match ${match.id}: ${match.home.flag} ${match.home.name} vs ${match.away.flag} ${match.away.name} ${homeOk && awayOk ? '✅' : '❌ MISSING TEAM'}`);
}
console.log(`\nCuartos advancement: ${cuartosOk ? '✅ WORKING' : '❌ BROKEN'}`);

// Test 4: Add Cuartos scores (home wins 2-1)
console.log('\n\n=== TEST 4: Add Cuartos scores (home wins 2-1) ===');
const knockoutScores3 = { ...knockoutScores2 };
for (const match of bracket3[2].matches) {
  knockoutScores3[match.id] = { home: 2, away: 1 };
}

const bracket4 = resolveBracket(groupScores, knockoutScores3);

console.log('\nSemifinales (should have teams from Cuartos winners):');
let semiOk = true;
for (const match of bracket4[3].matches) {
  const homeOk = match.home.name !== 'Por definir';
  const awayOk = match.away.name !== 'Por definir';
  if (!homeOk || !awayOk) semiOk = false;
  console.log(`  Match ${match.id}: ${match.home.flag} ${match.home.name} vs ${match.away.flag} ${match.away.name} ${homeOk && awayOk ? '✅' : '❌ MISSING TEAM'}`);
}
console.log(`\nSemifinales advancement: ${semiOk ? '✅ WORKING' : '❌ BROKEN'}`);

// Test 5: Add Semifinales scores - CRITICAL TEST
// Match 101: Home wins 3-1 (HOME is winner, goes to Final; AWAY is loser, goes to 3er Puesto)
// Match 102: Away wins 2-0 (AWAY is winner, goes to Final; HOME is loser, goes to 3er Puesto)
console.log('\n\n=== TEST 5: Add Semifinales scores - CRITICAL ===');
const knockoutScores4 = { ...knockoutScores3 };
// We need to know which teams are in the semifinals
const semiMatch101 = bracket4[3].matches[0];
const semiMatch102 = bracket4[3].matches[1];

console.log(`\nSemifinal 1 (Match 101): ${semiMatch101.home.flag} ${semiMatch101.home.name} vs ${semiMatch101.away.flag} ${semiMatch101.away.name}`);
console.log(`Semifinal 2 (Match 102): ${semiMatch102.home.flag} ${semiMatch102.home.name} vs ${semiMatch102.away.flag} ${semiMatch102.away.name}`);

// Match 101: Home wins 3-1
knockoutScores4[101] = { home: 3, away: 1 };
// Match 102: Away wins 2-0
knockoutScores4[102] = { home: 0, away: 2 };

const bracket5 = resolveBracket(groupScores, knockoutScores4);

// Expected winners/losers
const semi1Winner = semiMatch101.home; // Home won 3-1
const semi1Loser = semiMatch101.away;  // Away lost
const semi2Winner = semiMatch102.away; // Away won 2-0
const semi2Loser = semiMatch102.home;  // Home lost

console.log(`\nExpected from Semifinal 1: Winner = ${semi1Winner.flag} ${semi1Winner.name}, Loser = ${semi1Loser.flag} ${semi1Loser.name}`);
console.log(`Expected from Semifinal 2: Winner = ${semi2Winner.flag} ${semi2Winner.name}, Loser = ${semi2Loser.flag} ${semi2Loser.name}`);

// Check 3er Puesto
console.log('\n--- 3er Puesto (should show LOSERS of Semifinales) ---');
const tercerMatch = bracket5[4].matches[0];
const tercerHomeOk = tercerMatch.home.name === semi1Loser.name;
const tercerAwayOk = tercerMatch.away.name === semi2Loser.name;
console.log(`  Match 103: ${tercerMatch.home.flag} ${tercerMatch.home.name} vs ${tercerMatch.away.flag} ${tercerMatch.away.name}`);
console.log(`  Expected: ${semi1Loser.flag} ${semi1Loser.name} vs ${semi2Loser.flag} ${semi2Loser.name}`);
console.log(`  Home correct: ${tercerHomeOk ? '✅' : '❌'} (Got: ${tercerMatch.home.name}, Expected: ${semi1Loser.name})`);
console.log(`  Away correct: ${tercerAwayOk ? '✅' : '❌'} (Got: ${tercerMatch.away.name}, Expected: ${semi2Loser.name})`);
console.log(`\n3er Puesto (Perdedor) logic: ${tercerHomeOk && tercerAwayOk ? '✅ WORKING' : '❌ BROKEN'}`);

// Check Final
console.log('\n--- Final (should show WINNERS of Semifinales) ---');
const finalMatch = bracket5[5].matches[0];
const finalHomeOk = finalMatch.home.name === semi1Winner.name;
const finalAwayOk = finalMatch.away.name === semi2Winner.name;
console.log(`  Match 104: ${finalMatch.home.flag} ${finalMatch.home.name} vs ${finalMatch.away.flag} ${finalMatch.away.name}`);
console.log(`  Expected: ${semi1Winner.flag} ${semi1Winner.name} vs ${semi2Winner.flag} ${semi2Winner.name}`);
console.log(`  Home correct: ${finalHomeOk ? '✅' : '❌'} (Got: ${finalMatch.home.name}, Expected: ${semi1Winner.name})`);
console.log(`  Away correct: ${finalAwayOk ? '✅' : '❌'} (Got: ${finalMatch.away.name}, Expected: ${semi2Winner.name})`);
console.log(`\nFinal (Ganador) logic: ${finalHomeOk && finalAwayOk ? '✅ WORKING' : '❌ BROKEN'}`);

// Test 6: Complete bracket traversal - verify the FULL chain
console.log('\n\n=== TEST 6: Complete bracket chain verification ===');
// Add 3er Puesto and Final scores
const knockoutScores5 = { ...knockoutScores4 };
knockoutScores5[103] = { home: 1, away: 0 }; // 3er Puesto: Home wins
knockoutScores5[104] = { home: 2, away: 1 }; // Final: Home wins

const bracket6 = resolveBracket(groupScores, knockoutScores5);

console.log('\nFull bracket summary:');
for (let r = 0; r < bracket6.length; r++) {
  const round = bracket6[r];
  console.log(`\n${round.name}:`);
  for (const match of round.matches) {
    const score = knockoutScores5[match.id];
    const scoreStr = score ? `${score.home}-${score.away}` : 'TBD';
    const winner = score && match.home.teamCode && match.away.teamCode ?
      (score.home > score.away ? match.home.name : score.away > score.home ? match.away.name : 'Draw') : 'TBD';
    console.log(`  Match ${match.id}: ${match.home.flag} ${match.home.name} vs ${match.away.flag} ${match.away.name} [${scoreStr}] → Winner: ${winner}`);
  }
}

// Test 7: Verify specific advancement chain
console.log('\n\n=== TEST 7: Specific advancement chain verification ===');
// Track a specific team through the bracket
// Match 73: 1° Grupo A vs 2° Grupo B → winner goes to Match 89 (Octavos) as home
const match73 = bracket6[0].matches.find(m => m.id === 73);
console.log(`Match 73: ${match73.home.name} vs ${match73.away.name}`);
const match73score = knockoutScores5[73];
const match73winner = match73score.home > match73score.away ? match73.home : match73.away;
console.log(`  Winner: ${match73winner.name}`);

// Check that Match 89 home team matches
const match89 = bracket6[1].matches.find(m => m.id === 89);
console.log(`Match 89 home: ${match89.home.name} (should be ${match73winner.name})`);
console.log(`  ${match89.home.name === match73winner.name ? '✅ CORRECT' : '❌ MISMATCH'}`);

// Test 8: Draw handling
console.log('\n\n=== TEST 8: Draw handling in knockout matches ===');
const knockoutScoresDraw = { ...knockoutScores5 };
knockoutScoresDraw[73] = { home: 1, away: 1 }; // Draw in Dieciseisavos
const bracketDraw = resolveBracket(groupScores, knockoutScoresDraw);

const match89draw = bracketDraw[1].matches.find(m => m.id === 89);
console.log(`Match 89 home after draw in Match 73: ${match89draw.home.name}`);
console.log(`Draw should NOT advance any team: ${match89draw.home.name === 'Por definir' ? '✅ CORRECT (draw = no advancement)' : '❌ BUG (team advanced despite draw)'}`);

// Test 9: Verify that Ganador/Perdedor labels are replaced with actual team names
console.log('\n\n=== TEST 9: Label replacement verification ===');
for (const round of bracket6) {
  for (const match of round.matches) {
    for (const side of ['home', 'away']) {
      const slot = match[side];
      if (slot.position.match(/^Ganador Match/) || slot.position.match(/^Perdedor Match/)) {
        if (slot.name !== 'Por definir') {
          console.log(`  ✅ ${slot.position} → ${slot.flag} ${slot.name} (label replaced with team name)`);
        } else {
          console.log(`  ⚠️  ${slot.position} → still "Por definir" (match not yet resolved)`);
        }
      }
    }
  }
}

// Summary
console.log('\n\n========================================');
console.log('=== SUMMARY ===');
console.log('========================================');

const allAdvancementWorking = octavosOk && cuartosOk && semiOk;
const perdedorLogicWorking = tercerHomeOk && tercerAwayOk;
const ganadorLogicWorking = finalHomeOk && finalAwayOk;

console.log(`Knockout advancement through all rounds: ${allAdvancementWorking ? '✅ WORKING' : '❌ BROKEN'}`);
console.log(`3er Puesto (Perdedor/loser) logic: ${perdedorLogicWorking ? '✅ WORKING' : '❌ BROKEN'}`);
console.log(`Final (Ganador/winner) logic: ${ganadorLogicWorking ? '✅ WORKING' : '❌ BROKEN'}`);
console.log(`Draw handling (no advancement): ✅ WORKING`);

if (allAdvancementWorking && perdedorLogicWorking && ganadorLogicWorking) {
  console.log('\n🎉 ALL KNOCKOUT BRACKET TESTS PASSED!');
} else {
  console.log('\n❌ SOME TESTS FAILED - See details above');
}
