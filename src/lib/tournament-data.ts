// FIFA World Cup 2026 - Real Data from Infobae

export interface Team {
  name: string;
  flag: string;
  code: string;
}

export interface GroupMatch {
  id: number;
  group: string;
  matchday: number;
  home: Team;
  away: Team;
  date: string;
  time: string;
  venue: string;
}

export interface Group {
  id: string;
  name: string;
  teams: Team[];
  matches: GroupMatch[];
}

export interface KnockoutMatch {
  id: number;
  round: string;
  home: string; // team code or "TBD"
  away: string;
  date: string;
  time: string;
  venue: string;
}

const flags: Record<string, string> = {
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

const names: Record<string, string> = {
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

function t(code: string): Team {
  return { code, flag: flags[code] || "🏳️", name: names[code] || code };
}

const groupColors: Record<string, { bg: string; border: string; text: string; gradient: string; headerFrom: string; headerTo: string }> = {
  A: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", gradient: "from-rose-500 to-pink-600", headerFrom: "from-rose-500", headerTo: "to-pink-600" },
  B: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", gradient: "from-emerald-500 to-teal-600", headerFrom: "from-emerald-500", headerTo: "to-teal-600" },
  C: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", gradient: "from-amber-500 to-yellow-600", headerFrom: "from-amber-500", headerTo: "to-yellow-600" },
  D: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", gradient: "from-sky-500 to-blue-600", headerFrom: "from-sky-500", headerTo: "to-blue-600" },
  E: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", gradient: "from-red-500 to-rose-600", headerFrom: "from-red-500", headerTo: "to-rose-600" },
  F: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", gradient: "from-orange-500 to-amber-600", headerFrom: "from-orange-500", headerTo: "to-amber-600" },
  G: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", gradient: "from-violet-500 to-purple-600", headerFrom: "from-violet-500", headerTo: "to-purple-600" },
  H: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", gradient: "from-indigo-500 to-blue-600", headerFrom: "from-indigo-500", headerTo: "to-blue-600" },
  I: { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", gradient: "from-cyan-500 to-teal-600", headerFrom: "from-cyan-500", headerTo: "to-teal-600" },
  J: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", gradient: "from-sky-400 to-cyan-600", headerFrom: "from-sky-400", headerTo: "to-cyan-600" },
  K: { bg: "bg-lime-50", border: "border-lime-200", text: "text-lime-700", gradient: "from-lime-500 to-green-600", headerFrom: "from-lime-500", headerTo: "to-green-600" },
  L: { bg: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-700", gradient: "from-fuchsia-500 to-pink-600", headerFrom: "from-fuchsia-500", headerTo: "to-pink-600" },
};

export { groupColors };

export const tournamentInfo = {
  name: "FIFA World Cup 2026",
  host: "Estados Unidos • México • Canadá",
  startDate: "11 de Junio, 2026",
  finalDate: "19 de Julio, 2026",
  totalTeams: 48,
  totalGroups: 12,
  totalMatches: 104,
  venues: 16,
};

export const groups: Group[] = [
  {
    id: "A",
    name: "Grupo A",
    teams: [t("MEX"), t("RSA"), t("KOR"), t("CZE")],
    matches: [
      { id: 1, group: "A", matchday: 1, home: t("MEX"), away: t("RSA"), date: "11 Jun", time: "19:00", venue: "Mexico City Stadium" },
      { id: 2, group: "A", matchday: 1, home: t("KOR"), away: t("CZE"), date: "12 Jun", time: "02:00", venue: "Estadio Guadalajara" },
      { id: 25, group: "A", matchday: 2, home: t("CZE"), away: t("RSA"), date: "18 Jun", time: "16:00", venue: "Atlanta Stadium" },
      { id: 26, group: "A", matchday: 2, home: t("MEX"), away: t("KOR"), date: "19 Jun", time: "19:00", venue: "Estadio Guadalajara" },
      { id: 49, group: "A", matchday: 3, home: t("CZE"), away: t("MEX"), date: "25 Jun", time: "01:00", venue: "Mexico City Stadium" },
      { id: 50, group: "A", matchday: 3, home: t("RSA"), away: t("KOR"), date: "25 Jun", time: "01:00", venue: "Estadio Monterrey" },
    ],
  },
  {
    id: "B",
    name: "Grupo B",
    teams: [t("CAN"), t("BIH"), t("QAT"), t("SUI")],
    matches: [
      { id: 3, group: "B", matchday: 1, home: t("CAN"), away: t("BIH"), date: "12 Jun", time: "19:00", venue: "Toronto Stadium" },
      { id: 5, group: "B", matchday: 1, home: t("QAT"), away: t("SUI"), date: "13 Jun", time: "19:00", venue: "San Francisco Bay Area Stadium" },
      { id: 27, group: "B", matchday: 2, home: t("SUI"), away: t("BIH"), date: "18 Jun", time: "19:00", venue: "Los Angeles Stadium" },
      { id: 28, group: "B", matchday: 2, home: t("CAN"), away: t("QAT"), date: "18 Jun", time: "22:00", venue: "BC Place Vancouver" },
      { id: 51, group: "B", matchday: 3, home: t("SUI"), away: t("CAN"), date: "24 Jun", time: "19:00", venue: "BC Place Vancouver" },
      { id: 52, group: "B", matchday: 3, home: t("BIH"), away: t("QAT"), date: "24 Jun", time: "19:00", venue: "Seattle Stadium" },
    ],
  },
  {
    id: "C",
    name: "Grupo C",
    teams: [t("BRA"), t("MAR"), t("HAI"), t("SCO")],
    matches: [
      { id: 6, group: "C", matchday: 1, home: t("BRA"), away: t("MAR"), date: "13 Jun", time: "22:00", venue: "New York New Jersey Stadium" },
      { id: 7, group: "C", matchday: 1, home: t("HAI"), away: t("SCO"), date: "14 Jun", time: "01:00", venue: "Boston Stadium" },
      { id: 29, group: "C", matchday: 2, home: t("SCO"), away: t("MAR"), date: "19 Jun", time: "22:00", venue: "Boston Stadium" },
      { id: 30, group: "C", matchday: 2, home: t("BRA"), away: t("HAI"), date: "20 Jun", time: "00:30", venue: "Philadelphia Stadium" },
      { id: 53, group: "C", matchday: 3, home: t("MAR"), away: t("HAI"), date: "24 Jun", time: "22:00", venue: "Atlanta Stadium" },
      { id: 54, group: "C", matchday: 3, home: t("SCO"), away: t("BRA"), date: "24 Jun", time: "22:00", venue: "Miami Stadium" },
    ],
  },
  {
    id: "D",
    name: "Grupo D",
    teams: [t("USA"), t("PAR"), t("AUS"), t("TUR")],
    matches: [
      { id: 4, group: "D", matchday: 1, home: t("USA"), away: t("PAR"), date: "13 Jun", time: "01:00", venue: "Los Angeles Stadium" },
      { id: 8, group: "D", matchday: 1, home: t("AUS"), away: t("TUR"), date: "14 Jun", time: "04:00", venue: "BC Place Vancouver" },
      { id: 31, group: "D", matchday: 2, home: t("USA"), away: t("AUS"), date: "19 Jun", time: "19:00", venue: "Seattle Stadium" },
      { id: 32, group: "D", matchday: 2, home: t("TUR"), away: t("PAR"), date: "20 Jun", time: "03:00", venue: "San Francisco Bay Area Stadium" },
      { id: 55, group: "D", matchday: 3, home: t("TUR"), away: t("USA"), date: "26 Jun", time: "02:00", venue: "Los Angeles Stadium" },
      { id: 56, group: "D", matchday: 3, home: t("PAR"), away: t("AUS"), date: "26 Jun", time: "02:00", venue: "San Francisco Bay Area Stadium" },
    ],
  },
  {
    id: "E",
    name: "Grupo E",
    teams: [t("GER"), t("CUW"), t("CIV"), t("ECU")],
    matches: [
      { id: 9, group: "E", matchday: 1, home: t("GER"), away: t("CUW"), date: "14 Jun", time: "17:00", venue: "Houston Stadium" },
      { id: 11, group: "E", matchday: 1, home: t("CIV"), away: t("ECU"), date: "14 Jun", time: "23:00", venue: "Philadelphia Stadium" },
      { id: 33, group: "E", matchday: 2, home: t("GER"), away: t("CIV"), date: "20 Jun", time: "20:00", venue: "Toronto Stadium" },
      { id: 34, group: "E", matchday: 2, home: t("ECU"), away: t("CUW"), date: "21 Jun", time: "00:00", venue: "Kansas City Stadium" },
      { id: 57, group: "E", matchday: 3, home: t("ECU"), away: t("GER"), date: "25 Jun", time: "20:00", venue: "New York New Jersey Stadium" },
      { id: 58, group: "E", matchday: 3, home: t("CUW"), away: t("CIV"), date: "25 Jun", time: "20:00", venue: "Philadelphia Stadium" },
    ],
  },
  {
    id: "F",
    name: "Grupo F",
    teams: [t("NED"), t("JAP"), t("SWE"), t("TUN")],
    matches: [
      { id: 10, group: "F", matchday: 1, home: t("NED"), away: t("JAP"), date: "14 Jun", time: "20:00", venue: "Dallas Stadium" },
      { id: 12, group: "F", matchday: 1, home: t("SWE"), away: t("TUN"), date: "15 Jun", time: "02:00", venue: "Estadio Monterrey" },
      { id: 35, group: "F", matchday: 2, home: t("NED"), away: t("SWE"), date: "20 Jun", time: "17:00", venue: "Houston Stadium" },
      { id: 36, group: "F", matchday: 2, home: t("TUN"), away: t("JAP"), date: "21 Jun", time: "04:00", venue: "Estadio Monterrey" },
      { id: 59, group: "F", matchday: 3, home: t("TUN"), away: t("NED"), date: "25 Jun", time: "23:00", venue: "Kansas City Stadium" },
      { id: 60, group: "F", matchday: 3, home: t("JAP"), away: t("SWE"), date: "25 Jun", time: "23:00", venue: "Dallas Stadium" },
    ],
  },
  {
    id: "G",
    name: "Grupo G",
    teams: [t("BEL"), t("EGY"), t("IRN"), t("NZL")],
    matches: [
      { id: 14, group: "G", matchday: 1, home: t("BEL"), away: t("EGY"), date: "15 Jun", time: "19:00", venue: "Seattle Stadium" },
      { id: 15, group: "G", matchday: 1, home: t("IRN"), away: t("NZL"), date: "16 Jun", time: "01:00", venue: "Los Angeles Stadium" },
      { id: 37, group: "G", matchday: 2, home: t("BEL"), away: t("IRN"), date: "21 Jun", time: "19:00", venue: "Los Angeles Stadium" },
      { id: 38, group: "G", matchday: 2, home: t("NZL"), away: t("EGY"), date: "22 Jun", time: "01:00", venue: "BC Place Vancouver" },
      { id: 61, group: "G", matchday: 3, home: t("EGY"), away: t("IRN"), date: "27 Jun", time: "03:00", venue: "Seattle Stadium" },
      { id: 62, group: "G", matchday: 3, home: t("NZL"), away: t("BEL"), date: "27 Jun", time: "03:00", venue: "BC Place Vancouver" },
    ],
  },
  {
    id: "H",
    name: "Grupo H",
    teams: [t("ESP"), t("CPV"), t("KSA"), t("URU")],
    matches: [
      { id: 13, group: "H", matchday: 1, home: t("ESP"), away: t("CPV"), date: "15 Jun", time: "16:00", venue: "Atlanta Stadium" },
      { id: 16, group: "H", matchday: 1, home: t("KSA"), away: t("URU"), date: "15 Jun", time: "22:00", venue: "Miami Stadium" },
      { id: 39, group: "H", matchday: 2, home: t("ESP"), away: t("KSA"), date: "21 Jun", time: "16:00", venue: "Atlanta Stadium" },
      { id: 40, group: "H", matchday: 2, home: t("URU"), away: t("CPV"), date: "21 Jun", time: "22:00", venue: "Miami Stadium" },
      { id: 63, group: "H", matchday: 3, home: t("URU"), away: t("ESP"), date: "27 Jun", time: "00:00", venue: "Estadio Guadalajara" },
      { id: 64, group: "H", matchday: 3, home: t("CPV"), away: t("KSA"), date: "27 Jun", time: "00:00", venue: "Houston Stadium" },
    ],
  },
  {
    id: "I",
    name: "Grupo I",
    teams: [t("FRA"), t("SEN"), t("IRQ"), t("NOR")],
    matches: [
      { id: 17, group: "I", matchday: 1, home: t("FRA"), away: t("SEN"), date: "16 Jun", time: "19:00", venue: "New York New Jersey Stadium" },
      { id: 18, group: "I", matchday: 1, home: t("IRQ"), away: t("NOR"), date: "16 Jun", time: "22:00", venue: "Boston Stadium" },
      { id: 41, group: "I", matchday: 2, home: t("FRA"), away: t("IRQ"), date: "22 Jun", time: "21:00", venue: "Philadelphia Stadium" },
      { id: 42, group: "I", matchday: 2, home: t("NOR"), away: t("SEN"), date: "23 Jun", time: "00:00", venue: "New York New Jersey Stadium" },
      { id: 65, group: "I", matchday: 3, home: t("NOR"), away: t("FRA"), date: "26 Jun", time: "19:00", venue: "Boston Stadium" },
      { id: 66, group: "I", matchday: 3, home: t("SEN"), away: t("IRQ"), date: "26 Jun", time: "19:00", venue: "Toronto Stadium" },
    ],
  },
  {
    id: "J",
    name: "Grupo J",
    teams: [t("ARG"), t("ALG"), t("AUT"), t("JOR")],
    matches: [
      { id: 19, group: "J", matchday: 1, home: t("ARG"), away: t("ALG"), date: "17 Jun", time: "01:00", venue: "Kansas City Stadium" },
      { id: 20, group: "J", matchday: 1, home: t("AUT"), away: t("JOR"), date: "17 Jun", time: "04:00", venue: "San Francisco Bay Area Stadium" },
      { id: 43, group: "J", matchday: 2, home: t("ARG"), away: t("AUT"), date: "22 Jun", time: "17:00", venue: "Dallas Stadium" },
      { id: 44, group: "J", matchday: 2, home: t("JOR"), away: t("ALG"), date: "23 Jun", time: "03:00", venue: "San Francisco Bay Area Stadium" },
      { id: 67, group: "J", matchday: 3, home: t("JOR"), away: t("ARG"), date: "28 Jun", time: "02:00", venue: "Dallas Stadium" },
      { id: 68, group: "J", matchday: 3, home: t("ALG"), away: t("AUT"), date: "28 Jun", time: "02:00", venue: "Kansas City Stadium" },
    ],
  },
  {
    id: "K",
    name: "Grupo K",
    teams: [t("POR"), t("COD"), t("UZB"), t("COL")],
    matches: [
      { id: 21, group: "K", matchday: 1, home: t("POR"), away: t("COD"), date: "17 Jun", time: "17:00", venue: "Houston Stadium" },
      { id: 24, group: "K", matchday: 1, home: t("UZB"), away: t("COL"), date: "18 Jun", time: "02:00", venue: "Mexico City Stadium" },
      { id: 45, group: "K", matchday: 2, home: t("POR"), away: t("UZB"), date: "23 Jun", time: "17:00", venue: "Houston Stadium" },
      { id: 48, group: "K", matchday: 2, home: t("COL"), away: t("COD"), date: "24 Jun", time: "02:00", venue: "Estadio Guadalajara" },
      { id: 69, group: "K", matchday: 3, home: t("COL"), away: t("POR"), date: "27 Jun", time: "23:30", venue: "Miami Stadium" },
      { id: 70, group: "K", matchday: 3, home: t("COD"), away: t("UZB"), date: "27 Jun", time: "23:30", venue: "Atlanta Stadium" },
    ],
  },
  {
    id: "L",
    name: "Grupo L",
    teams: [t("ENG"), t("CRO"), t("GHA"), t("PAN")],
    matches: [
      { id: 22, group: "L", matchday: 1, home: t("ENG"), away: t("CRO"), date: "17 Jun", time: "20:00", venue: "Dallas Stadium" },
      { id: 23, group: "L", matchday: 1, home: t("GHA"), away: t("PAN"), date: "17 Jun", time: "23:00", venue: "Toronto Stadium" },
      { id: 46, group: "L", matchday: 2, home: t("ENG"), away: t("GHA"), date: "23 Jun", time: "20:00", venue: "Boston Stadium" },
      { id: 47, group: "L", matchday: 2, home: t("PAN"), away: t("CRO"), date: "23 Jun", time: "23:00", venue: "Toronto Stadium" },
      { id: 71, group: "L", matchday: 3, home: t("PAN"), away: t("ENG"), date: "27 Jun", time: "21:00", venue: "New York New Jersey Stadium" },
      { id: 72, group: "L", matchday: 3, home: t("CRO"), away: t("GHA"), date: "27 Jun", time: "21:00", venue: "Philadelphia Stadium" },
    ],
  },
];

export const knockoutSchedule = [
  { round: "Dieciseisavos de Final", shortRound: "Dieciseisavos", dates: "28 Jun - 4 Jul", matches: 16, desc: "1° y 2° de cada grupo + 8 mejores terceros" },
  { round: "Octavos de Final", shortRound: "Octavos", dates: "4 - 7 Jul", matches: 8, desc: "Ganadores de Dieciseisavos" },
  { round: "Cuartos de Final", shortRound: "Cuartos", dates: "9 - 12 Jul", matches: 4, venues: "Boston, LA, Miami, Kansas City" },
  { round: "Semifinales", shortRound: "Semifinales", dates: "14 - 15 Jul", matches: 2, venues: "Dallas, Atlanta" },
  { round: "3er y 4to Puesto", shortRound: "3er Puesto", dates: "18 Jul", matches: 1, venue: "Miami Stadium" },
  { round: "Final", shortRound: "Final", dates: "19 Jul", matches: 1, venue: "New York New Jersey Stadium" },
];

export const venues = [
  { name: "Mexico City Stadium", city: "Ciudad de México", country: "México", realName: "Estadio Azteca", image: "/stadiums/stadium_01.png" },
  { name: "Estadio Guadalajara", city: "Guadalajara", country: "México", realName: "Estadio Akron", image: "/stadiums/stadium_02.png" },
  { name: "Estadio Monterrey", city: "Monterrey", country: "México", realName: "Estadio BBVA", image: "/stadiums/stadium_03.png" },
  { name: "Toronto Stadium", city: "Toronto", country: "Canadá", realName: "BMO Field", image: "/stadiums/stadium_04.png" },
  { name: "BC Place Vancouver", city: "Vancouver", country: "Canadá", realName: "BC Place", image: "/stadiums/stadium_05.png" },
  { name: "Los Angeles Stadium", city: "Los Ángeles", country: "EE.UU.", realName: "SoFi Stadium", image: "/stadiums/stadium_06.png" },
  { name: "San Francisco Bay Area Stadium", city: "San Francisco", country: "EE.UU.", realName: "Levi's Stadium", image: "/stadiums/stadium_07.png" },
  { name: "Seattle Stadium", city: "Seattle", country: "EE.UU.", realName: "Lumen Field", image: "/stadiums/stadium_08.png" },
  { name: "Dallas Stadium", city: "Dallas", country: "EE.UU.", realName: "AT&T Stadium", image: "/stadiums/stadium_09.png" },
  { name: "Houston Stadium", city: "Houston", country: "EE.UU.", realName: "NRG Stadium", image: "/stadiums/stadium_10.png" },
  { name: "Kansas City Stadium", city: "Kansas City", country: "EE.UU.", realName: "Arrowhead Stadium", image: "/stadiums/stadium_11.png" },
  { name: "Atlanta Stadium", city: "Atlanta", country: "EE.UU.", realName: "Mercedes-Benz Stadium", image: "/stadiums/stadium_12.png" },
  { name: "Miami Stadium", city: "Miami", country: "EE.UU.", realName: "Hard Rock Stadium", image: "/stadiums/stadium_13.png" },
  { name: "Philadelphia Stadium", city: "Filadelfia", country: "EE.UU.", realName: "Lincoln Financial Field", image: "/stadiums/stadium_14.png" },
  { name: "Boston Stadium", city: "Boston", country: "EE.UU.", realName: "Gillette Stadium", image: "/stadiums/stadium_15.png" },
  { name: "New York New Jersey Stadium", city: "Nueva York", country: "EE.UU.", realName: "MetLife Stadium", image: "/stadiums/stadium_16.png" },
];

// ─── Bracket (Knockout Phase) ────────────────────────────────────────────────

export interface KnockoutSlot {
  position: string; // e.g. "1° Grupo A", "2° Grupo B", "3° Mejor 1", etc.
  teamCode: string | null; // null until determined
  flag: string; // emoji flag or "🏳️" if TBD
  name: string; // display name or "Por definir"
}

export interface BracketMatch {
  id: number;
  home: KnockoutSlot;
  away: KnockoutSlot;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  venue: string;
}

export interface BracketRound {
  name: string;
  shortName: string;
  matches: BracketMatch[];
}

export const bracketRounds: BracketRound[] = [
  {
    name: "Dieciseisavos de Final",
    shortName: "Dieciseisavos",
    matches: [
      {
        id: 73,
        home: { position: "1° Grupo A", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "2° Grupo B", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "28 Jun",
        venue: "Mexico City Stadium",
      },
      {
        id: 74,
        home: { position: "1° Grupo C", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "2° Grupo D", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "28 Jun",
        venue: "Atlanta Stadium",
      },
      {
        id: 75,
        home: { position: "1° Grupo E", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "2° Grupo F", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "28 Jun",
        venue: "Houston Stadium",
      },
      {
        id: 76,
        home: { position: "1° Grupo G", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "2° Grupo H", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "29 Jun",
        venue: "Seattle Stadium",
      },
      {
        id: 77,
        home: { position: "1° Grupo I", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "2° Grupo J", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "29 Jun",
        venue: "Boston Stadium",
      },
      {
        id: 78,
        home: { position: "1° Grupo K", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "2° Grupo L", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "29 Jun",
        venue: "Dallas Stadium",
      },
      {
        id: 79,
        home: { position: "1° Grupo B", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "2° Grupo A", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "30 Jun",
        venue: "Toronto Stadium",
      },
      {
        id: 80,
        home: { position: "1° Grupo D", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "2° Grupo C", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "30 Jun",
        venue: "San Francisco Bay Area Stadium",
      },
      {
        id: 81,
        home: { position: "1° Grupo F", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "2° Grupo E", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "30 Jun",
        venue: "BC Place Vancouver",
      },
      {
        id: 82,
        home: { position: "1° Grupo H", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "2° Grupo G", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "1 Jul",
        venue: "Miami Stadium",
      },
      {
        id: 83,
        home: { position: "1° Grupo J", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "2° Grupo I", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "1 Jul",
        venue: "Philadelphia Stadium",
      },
      {
        id: 84,
        home: { position: "1° Grupo L", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "2° Grupo K", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "1 Jul",
        venue: "New York New Jersey Stadium",
      },
      {
        id: 85,
        home: { position: "3° (ABFJ)", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "3° (CDE)", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "2 Jul",
        venue: "Estadio Monterrey",
      },
      {
        id: 86,
        home: { position: "3° (ABFJ)", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "3° (GHI)", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "2 Jul",
        venue: "Los Angeles Stadium",
      },
      {
        id: 87,
        home: { position: "3° (CDE)", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "3° (KLM)", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "3 Jul",
        venue: "Kansas City Stadium",
      },
      {
        id: 88,
        home: { position: "3° (GHI)", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "3° (KLM)", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "3 Jul",
        venue: "Estadio Guadalajara",
      },
    ],
  },
  {
    name: "Octavos de Final",
    shortName: "Octavos",
    matches: [
      {
        id: 89,
        home: { position: "Ganador Match 73", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 74", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "4 Jul",
        venue: "Por definir",
      },
      {
        id: 90,
        home: { position: "Ganador Match 77", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 78", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "4 Jul",
        venue: "Por definir",
      },
      {
        id: 91,
        home: { position: "Ganador Match 81", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 82", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "5 Jul",
        venue: "Por definir",
      },
      {
        id: 92,
        home: { position: "Ganador Match 85", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 86", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "5 Jul",
        venue: "Por definir",
      },
      {
        id: 93,
        home: { position: "Ganador Match 75", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 76", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "5 Jul",
        venue: "Por definir",
      },
      {
        id: 94,
        home: { position: "Ganador Match 79", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 80", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "6 Jul",
        venue: "Por definir",
      },
      {
        id: 95,
        home: { position: "Ganador Match 83", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 84", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "6 Jul",
        venue: "Por definir",
      },
      {
        id: 96,
        home: { position: "Ganador Match 87", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 88", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "6 Jul",
        venue: "Por definir",
      },
    ],
  },
  {
    name: "Cuartos de Final",
    shortName: "Cuartos",
    matches: [
      {
        id: 97,
        home: { position: "Ganador Match 89", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 90", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "9 Jul",
        venue: "Los Angeles Stadium",
      },
      {
        id: 98,
        home: { position: "Ganador Match 91", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 92", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "9 Jul",
        venue: "Miami Stadium",
      },
      {
        id: 99,
        home: { position: "Ganador Match 93", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 94", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "10 Jul",
        venue: "Kansas City Stadium",
      },
      {
        id: 100,
        home: { position: "Ganador Match 95", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 96", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "10 Jul",
        venue: "Boston Stadium",
      },
    ],
  },
  {
    name: "Semifinales",
    shortName: "Semifinales",
    matches: [
      {
        id: 101,
        home: { position: "Ganador Match 97", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 98", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "14 Jul",
        venue: "Dallas Stadium",
      },
      {
        id: 102,
        home: { position: "Ganador Match 99", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 100", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "15 Jul",
        venue: "Atlanta Stadium",
      },
    ],
  },
  {
    name: "3er y 4to Puesto",
    shortName: "3er Puesto",
    matches: [
      {
        id: 103,
        home: { position: "Perdedor Match 101", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Perdedor Match 102", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "18 Jul",
        venue: "Miami Stadium",
      },
    ],
  },
  {
    name: "Final",
    shortName: "Final",
    matches: [
      {
        id: 104,
        home: { position: "Ganador Match 101", teamCode: null, flag: "🏳️", name: "Por definir" },
        away: { position: "Ganador Match 102", teamCode: null, flag: "🏳️", name: "Por definir" },
        homeScore: null,
        awayScore: null,
        date: "19 Jul",
        venue: "New York New Jersey Stadium",
      },
    ],
  },
];
