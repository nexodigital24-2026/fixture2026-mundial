// Copa Confederación de Selecciones - Tournament Data

export interface Team {
  name: string;
  flag: string; // emoji flag
  code: string; // country code
}

export interface Group {
  id: string;
  name: string;
  color: string; // tailwind color class
  bgColor: string; // tailwind bg color
  borderColor: string; // tailwind border color
  teams: Team[];
}

export interface Match {
  id: number;
  home: Team;
  away: Team;
  homeScore?: number;
  awayScore?: number;
  date?: string;
  time?: string;
  venue?: string;
  played?: boolean;
}

export interface KnockoutRound {
  id: string;
  name: string;
  shortName: string;
  matches: Match[];
}

// Country flag mapping
const flags: Record<string, string> = {
  "México": "🇲🇽",
  "Japón": "🇯🇵",
  "Brasil": "🇧🇷",
  "Paraguay": "🇵🇾",
  "Bélgica": "🇧🇪",
  "Croacia": "🇭🇷",
  "Francia": "🇫🇷",
  "Corea del Sur": "🇰🇷",
  "Alemania": "🇩🇪",
  "Bosnia y Herzegovina": "🇧🇦",
  "Portugal": "🇵🇹",
  "Cabo Verde": "🇨🇻",
  "Camerún": "🇨🇲",
  "Catar": "🇶🇦",
  "Angola": "🇦🇴",
  "Haití": "🇭🇹",
  "Polonia": "🇵🇱",
  "Sudáfrica": "🇿🇦",
  "Estados Unidos": "🇺🇸",
  "Marruecos": "🇲🇦",
  "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Egipto": "🇪🇬",
  "España": "🇪🇸",
  "Australia": "🇦🇺",
  "Argentina": "🇦🇷",
  "Costa de Marfil": "🇨🇮",
  "Senegal": "🇸🇳",
  "Suecia": "🇸🇪",
  "Congo DRC": "🇨🇩",
  "Irán": "🇮🇷",
  "Canadá": "🇨🇦",
  "Arabia Saudita": "🇸🇦",
  "Italia": "🇮🇹",
  "Costa Rica": "🇨🇷",
  "Chile": "🇨🇱",
  "Suiza": "🇨🇭",
  "Ecuador": "🇪🇨",
  "Rusia": "🇷🇺",
  "Países Bajos": "🇳🇱",
  "Túnez": "🇹🇳",
  "Turquía": "🇹🇷",
  "Tailandia": "🇹🇭",
  "Vietnam": "🇻🇳",
  "Nueva Zelanda": "🇳🇿",
  "Noruega": "🇳🇴",
  "Colombia": "🇨🇴",
  "Ghana": "🇬🇭",
  "Panamá": "🇵🇦",
  "Uruguay": "🇺🇾",
  "Irak": "🇮🇶",
  "Jordania": "🇯🇴",
  "Austria": "🇦🇹",
  "Hungría": "🇭🇺",
  "India": "🇮🇳",
  "Ucrania": "🇺🇦",
};

const codes: Record<string, string> = {
  "México": "MEX",
  "Japón": "JPN",
  "Brasil": "BRA",
  "Paraguay": "PAR",
  "Bélgica": "BEL",
  "Croacia": "CRO",
  "Francia": "FRA",
  "Corea del Sur": "KOR",
  "Alemania": "GER",
  "Bosnia y Herzegovina": "BIH",
  "Portugal": "POR",
  "Cabo Verde": "CPV",
  "Camerún": "CMR",
  "Catar": "QAT",
  "Angola": "ANG",
  "Haití": "HAI",
  "Polonia": "POL",
  "Sudáfrica": "RSA",
  "Estados Unidos": "USA",
  "Marruecos": "MAR",
  "Inglaterra": "ENG",
  "Egipto": "EGY",
  "España": "ESP",
  "Australia": "AUS",
  "Argentina": "ARG",
  "Costa de Marfil": "CIV",
  "Senegal": "SEN",
  "Suecia": "SWE",
  "Congo DRC": "COD",
  "Irán": "IRN",
  "Canadá": "CAN",
  "Arabia Saudita": "KSA",
  "Italia": "ITA",
  "Costa Rica": "CRC",
  "Chile": "CHI",
  "Suiza": "SUI",
  "Ecuador": "ECU",
  "Rusia": "RUS",
  "Países Bajos": "NED",
  "Túnez": "TUN",
  "Turquía": "TUR",
  "Tailandia": "THA",
  "Vietnam": "VIE",
  "Nueva Zelanda": "NZL",
  "Noruega": "NOR",
  "Colombia": "COL",
  "Ghana": "GHA",
  "Panamá": "PAN",
  "Uruguay": "URU",
  "Irak": "IRQ",
  "Jordania": "JOR",
  "Austria": "AUT",
  "Hungría": "HUN",
  "India": "IND",
  "Ucrania": "UKR",
};

function makeTeam(name: string): Team {
  return {
    name,
    flag: flags[name] || "🏳️",
    code: codes[name] || name.substring(0, 3).toUpperCase(),
  };
}

// 12 Groups with 4 teams each
export const groups: Group[] = [
  {
    id: "A",
    name: "Grupo A",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    teams: ["Italia", "México", "Costa Rica", "Chile"].map(makeTeam),
  },
  {
    id: "B",
    name: "Grupo B",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-300",
    teams: ["Canadá", "Catar", "Suiza", "Ecuador"].map(makeTeam),
  },
  {
    id: "C",
    name: "Grupo C",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    teams: ["Brasil", "Haití", "Rusia", "Australia"].map(makeTeam),
  },
  {
    id: "D",
    name: "Grupo D",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    teams: ["Estados Unidos", "Países Bajos", "Túnez", "Argentina"].map(makeTeam),
  },
  {
    id: "E",
    name: "Grupo E",
    color: "text-slate-700",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-300",
    teams: ["Alemania", "Costa de Marfil", "Turquía", "Camerún"].map(makeTeam),
  },
  {
    id: "F",
    name: "Grupo F",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    teams: ["Suecia", "Tailandia", "Vietnam", "Irán"].map(makeTeam),
  },
  {
    id: "G",
    name: "Grupo G",
    color: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-300",
    teams: ["Bélgica", "Croacia", "Nueva Zelanda", "Cabo Verde"].map(makeTeam),
  },
  {
    id: "H",
    name: "Grupo H",
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-300",
    teams: ["Francia", "Arabia Saudita", "Noruega", "Sudáfrica"].map(makeTeam),
  },
  {
    id: "I",
    name: "Grupo I",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    teams: ["Inglaterra", "Egipto", "Colombia", "Ghana"].map(makeTeam),
  },
  {
    id: "J",
    name: "Grupo J",
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-300",
    teams: ["Japón", "Senegal", "Panamá", "Polonia"].map(makeTeam),
  },
  {
    id: "K",
    name: "Grupo K",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-300",
    teams: ["España", "Portugal", "Bosnia y Herzegovina", "Congo DRC"].map(makeTeam),
  },
  {
    id: "L",
    name: "Grupo L",
    color: "text-cyan-700",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-300",
    teams: ["Paraguay", "Angola", "Corea del Sur", "Marruecos"].map(makeTeam),
  },
];

// Best third-place teams
export const mejoresTerceros: Team[] = [
  "Corea del Sur",
  "Catar",
  "Haití",
  "Australia",
  "Costa de Marfil",
  "Sudáfrica",
  "Croacia",
  "Arabia Saudita",
].map(makeTeam);

// Knockout rounds
export const octavos: Match[] = [
  { id: 1, home: makeTeam("México"), away: makeTeam("Japón"), date: "25 Jul", time: "14:00", venue: "Estadio Nacional" },
  { id: 2, home: makeTeam("Brasil"), away: makeTeam("Paraguay"), date: "25 Jul", time: "17:00", venue: "Estadio Central" },
  { id: 3, home: makeTeam("Bélgica"), away: makeTeam("Croacia"), date: "26 Jul", time: "14:00", venue: "Estadio Norte" },
  { id: 4, home: makeTeam("Francia"), away: makeTeam("Corea del Sur"), date: "26 Jul", time: "17:00", venue: "Estadio Sur" },
  { id: 5, home: makeTeam("Alemania"), away: makeTeam("Bosnia y Herzegovina"), date: "27 Jul", time: "14:00", venue: "Estadio Oriental" },
  { id: 6, home: makeTeam("Portugal"), away: makeTeam("Cabo Verde"), date: "27 Jul", time: "17:00", venue: "Estadio Occidental" },
  { id: 7, home: makeTeam("Camerún"), away: makeTeam("Catar"), date: "28 Jul", time: "14:00", venue: "Estadio Nacional" },
  { id: 8, home: makeTeam("Angola"), away: makeTeam("Haití"), date: "28 Jul", time: "17:00", venue: "Estadio Central" },
  { id: 9, home: makeTeam("Polonia"), away: makeTeam("Sudáfrica"), date: "29 Jul", time: "14:00", venue: "Estadio Norte" },
  { id: 10, home: makeTeam("Estados Unidos"), away: makeTeam("Marruecos"), date: "29 Jul", time: "17:00", venue: "Estadio Sur" },
  { id: 11, home: makeTeam("Inglaterra"), away: makeTeam("Egipto"), date: "30 Jul", time: "14:00", venue: "Estadio Oriental" },
  { id: 12, home: makeTeam("España"), away: makeTeam("Australia"), date: "30 Jul", time: "17:00", venue: "Estadio Occidental" },
  { id: 13, home: makeTeam("Argentina"), away: makeTeam("Costa de Marfil"), date: "31 Jul", time: "14:00", venue: "Estadio Nacional" },
  { id: 14, home: makeTeam("Senegal"), away: makeTeam("Suecia"), date: "31 Jul", time: "17:00", venue: "Estadio Central" },
  { id: 15, home: makeTeam("Congo DRC"), away: makeTeam("Irán"), date: "1 Ago", time: "14:00", venue: "Estadio Norte" },
  { id: 16, home: makeTeam("Canadá"), away: makeTeam("Arabia Saudita"), date: "1 Ago", time: "17:00", venue: "Estadio Sur" },
];

export const cuartos: Match[] = [
  { id: 17, home: makeTeam("México"), away: makeTeam("Brasil"), date: "3 Ago", time: "14:00", venue: "Estadio Nacional" },
  { id: 18, home: makeTeam("Bélgica"), away: makeTeam("Francia"), date: "3 Ago", time: "17:00", venue: "Estadio Central" },
  { id: 19, home: makeTeam("Alemania"), away: makeTeam("Portugal"), date: "4 Ago", time: "14:00", venue: "Estadio Norte" },
  { id: 20, home: makeTeam("Camerún"), away: makeTeam("Angola"), date: "4 Ago", time: "17:00", venue: "Estadio Sur" },
  { id: 21, home: makeTeam("Polonia"), away: makeTeam("Estados Unidos"), date: "5 Ago", time: "14:00", venue: "Estadio Oriental" },
  { id: 22, home: makeTeam("Inglaterra"), away: makeTeam("España"), date: "5 Ago", time: "17:00", venue: "Estadio Occidental" },
  { id: 23, home: makeTeam("Argentina"), away: makeTeam("Senegal"), date: "6 Ago", time: "14:00", venue: "Estadio Nacional" },
  { id: 24, home: makeTeam("Congo DRC"), away: makeTeam("Canadá"), date: "6 Ago", time: "17:00", venue: "Estadio Central" },
];

export const semifinales: Match[] = [
  { id: 25, home: makeTeam("México"), away: makeTeam("Bélgica"), date: "8 Ago", time: "14:00", venue: "Estadio Nacional" },
  { id: 26, home: makeTeam("Alemania"), away: makeTeam("Camerún"), date: "8 Ago", time: "17:00", venue: "Estadio Central" },
  { id: 27, home: makeTeam("Inglaterra"), away: makeTeam("Polonia"), date: "9 Ago", time: "14:00", venue: "Estadio Norte" },
  { id: 28, home: makeTeam("Argentina"), away: makeTeam("Congo DRC"), date: "9 Ago", time: "17:00", venue: "Estadio Sur" },
];

export const semifinalFinal: Match[] = [
  { id: 29, home: makeTeam("México"), away: makeTeam("Alemania"), date: "12 Ago", time: "14:00", venue: "Estadio Nacional" },
  { id: 30, home: makeTeam("Inglaterra"), away: makeTeam("Argentina"), date: "12 Ago", time: "17:00", venue: "Estadio Central" },
];

export const final_: Match = {
  id: 31,
  home: makeTeam("México"),
  away: makeTeam("Inglaterra"),
  date: "15 Ago",
  time: "16:00",
  venue: "Estadio Nacional",
};

export const tercerPuesto: Match = {
  id: 32,
  home: makeTeam("Alemania"),
  away: makeTeam("Argentina"),
  date: "14 Ago",
  time: "16:00",
  venue: "Estadio Central",
};

export const knockoutRounds: KnockoutRound[] = [
  { id: "octavos", name: "Octavos de Final", shortName: "Octavos", matches: octavos },
  { id: "cuartos", name: "Cuartos de Final", shortName: "Cuartos", matches: cuartos },
  { id: "semifinales", name: "Semifinales", shortName: "Semi", matches: semifinales },
  { id: "semifinal-final", name: "Semifinal Final", shortName: "SF Final", matches: semifinalFinal },
];

export const tournamentInfo = {
  name: "Copa Confederación de Selecciones",
  date: "25 de Julio, 2025",
  totalGroups: 12,
  totalMatches: 104,
  totalStages: 16,
  teams: 48,
};
