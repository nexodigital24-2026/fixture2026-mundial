'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Calendar, MapPin, ChevronDown, ChevronRight, Flag, Medal, Zap, Clock, ArrowRight, Info } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  groups,
  mejoresTerceros,
  octavos,
  cuartos,
  semifinales,
  semifinalFinal,
  final_,
  tercerPuesto,
  tournamentInfo,
  type Match,
  type Group,
  type Team,
} from '@/lib/tournament-data'

// ==================== Group Card Component ====================
function GroupCard({ group, isOpen, onToggle }: { group: Group; isOpen: boolean; onToggle: () => void }) {
  const groupColors: Record<string, { gradient: string; headerBg: string; headerText: string; accent: string; dot: string }> = {
    A: { gradient: 'from-orange-500/10 to-orange-500/5', headerBg: 'bg-gradient-to-r from-orange-500 to-orange-600', headerText: 'text-white', accent: 'text-orange-600', dot: 'bg-orange-500' },
    B: { gradient: 'from-emerald-500/10 to-emerald-500/5', headerBg: 'bg-gradient-to-r from-emerald-500 to-emerald-600', headerText: 'text-white', accent: 'text-emerald-600', dot: 'bg-emerald-500' },
    C: { gradient: 'from-red-500/10 to-red-500/5', headerBg: 'bg-gradient-to-r from-red-500 to-red-600', headerText: 'text-white', accent: 'text-red-600', dot: 'bg-red-500' },
    D: { gradient: 'from-purple-500/10 to-purple-500/5', headerBg: 'bg-gradient-to-r from-purple-500 to-purple-600', headerText: 'text-white', accent: 'text-purple-600', dot: 'bg-purple-500' },
    E: { gradient: 'from-slate-500/10 to-slate-500/5', headerBg: 'bg-gradient-to-r from-slate-500 to-slate-600', headerText: 'text-white', accent: 'text-slate-600', dot: 'bg-slate-500' },
    F: { gradient: 'from-amber-500/10 to-amber-500/5', headerBg: 'bg-gradient-to-r from-amber-500 to-amber-600', headerText: 'text-white', accent: 'text-amber-600', dot: 'bg-amber-500' },
    G: { gradient: 'from-pink-500/10 to-pink-500/5', headerBg: 'bg-gradient-to-r from-pink-500 to-pink-600', headerText: 'text-white', accent: 'text-pink-600', dot: 'bg-pink-500' },
    H: { gradient: 'from-sky-500/10 to-sky-500/5', headerBg: 'bg-gradient-to-r from-sky-500 to-sky-600', headerText: 'text-white', accent: 'text-sky-600', dot: 'bg-sky-500' },
    I: { gradient: 'from-blue-500/10 to-blue-500/5', headerBg: 'bg-gradient-to-r from-blue-500 to-blue-600', headerText: 'text-white', accent: 'text-blue-600', dot: 'bg-blue-500' },
    J: { gradient: 'from-teal-500/10 to-teal-500/5', headerBg: 'bg-gradient-to-r from-teal-500 to-teal-600', headerText: 'text-white', accent: 'text-teal-600', dot: 'bg-teal-500' },
    K: { gradient: 'from-rose-500/10 to-rose-500/5', headerBg: 'bg-gradient-to-r from-rose-500 to-rose-600', headerText: 'text-white', accent: 'text-rose-600', dot: 'bg-rose-500' },
    L: { gradient: 'from-cyan-500/10 to-cyan-500/5', headerBg: 'bg-gradient-to-r from-cyan-500 to-cyan-600', headerText: 'text-white', accent: 'text-cyan-600', dot: 'bg-cyan-500' },
  }

  const c = groupColors[group.id] || groupColors.A

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-md transition-shadow duration-300`}>
        <button
          onClick={onToggle}
          className={`w-full ${c.headerBg} ${c.headerText} px-4 py-3 flex items-center justify-between cursor-pointer`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{group.name}</span>
            <span className="text-xs opacity-80 font-medium">{group.teams.length} equipos</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {group.teams.map((team, idx) => (
                    <motion.div
                      key={team.code}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors"
                    >
                      <span className="text-2xl">{team.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{team.name}</p>
                        <p className="text-xs text-gray-400">{team.code}</p>
                      </div>
                      {idx < 2 && (
                        <Badge variant="secondary" className={`${c.accent} bg-opacity-10 text-xs font-medium`}>
                          <Zap className="w-3 h-3 mr-1" />
                          Clasifica
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

// ==================== Match Card Component ====================
function MatchCard({ match, index, isFinal = false }: { match: Match; index: number; isFinal?: boolean }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative rounded-xl border transition-all duration-300 overflow-hidden
        ${isFinal ? 'border-amber-300 shadow-lg' : 'border-gray-200 shadow-sm'}
        ${isHovered ? 'shadow-md -translate-y-0.5' : ''}
      `}
    >
      {/* Match header */}
      <div className={`flex items-center justify-between px-3 py-1.5 ${isFinal ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-gray-50'}`}>
        <span className={`text-xs font-medium ${isFinal ? 'text-white' : 'text-gray-500'}`}>
          Partido {match.id}
        </span>
        <div className="flex items-center gap-1.5">
          <Clock className={`w-3 h-3 ${isFinal ? 'text-amber-100' : 'text-gray-400'}`} />
          <span className={`text-xs ${isFinal ? 'text-amber-100' : 'text-gray-500'}`}>
            {match.time}
          </span>
        </div>
      </div>

      {/* Teams */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-xl flex-shrink-0">{match.home.flag}</span>
            <span className="text-sm font-semibold text-gray-900 truncate">{match.home.name}</span>
          </div>
          <span className="text-sm font-bold text-gray-400 ml-2">VS</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-xl flex-shrink-0">{match.away.flag}</span>
            <span className="text-sm font-semibold text-gray-900 truncate">{match.away.name}</span>
          </div>
        </div>
      </div>

      {/* Match footer */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 border-t ${isFinal ? 'border-amber-200 bg-amber-50/50' : 'border-gray-100 bg-gray-50/50'}`}>
        <Calendar className={`w-3 h-3 ${isFinal ? 'text-amber-500' : 'text-gray-400'}`} />
        <span className={`text-xs ${isFinal ? 'text-amber-600' : 'text-gray-500'}`}>{match.date}</span>
        <span className={`text-xs ${isFinal ? 'text-amber-400' : 'text-gray-300'}`}>•</span>
        <MapPin className={`w-3 h-3 ${isFinal ? 'text-amber-500' : 'text-gray-400'}`} />
        <span className={`text-xs truncate ${isFinal ? 'text-amber-600' : 'text-gray-500'}`}>{match.venue}</span>
      </div>
    </motion.div>
  )
}

// ==================== Knockout Round Section ====================
function KnockoutSection({ title, matches, accentColor, icon }: { title: string; matches: Match[]; accentColor: string; icon: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <Badge variant="secondary" className="text-xs">{matches.length} partidos</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {matches.map((match, idx) => (
          <MatchCard key={match.id} match={match} index={idx} />
        ))}
      </div>
    </div>
  )
}

// ==================== Final Match Card ====================
function FinalCard({ match, title }: { match: Match; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto"
    >
      <Card className="overflow-hidden border-2 border-amber-400 shadow-xl">
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-6 py-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Trophy className="w-6 h-6 text-amber-900" />
            <h3 className="text-xl font-bold text-amber-900">{title}</h3>
            <Trophy className="w-6 h-6 text-amber-900" />
          </div>
          <p className="text-amber-800 text-sm font-medium">{match.date} • {match.time}</p>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center flex-1">
              <span className="text-5xl block mb-2">{match.home.flag}</span>
              <p className="font-bold text-gray-900 text-lg">{match.home.name}</p>
              <p className="text-xs text-gray-400">{match.home.code}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-amber-500">VS</span>
              <div className="flex items-center gap-1 text-gray-400">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{match.venue}</span>
              </div>
            </div>
            <div className="text-center flex-1">
              <span className="text-5xl block mb-2">{match.away.flag}</span>
              <p className="font-bold text-gray-900 text-lg">{match.away.name}</p>
              <p className="text-xs text-gray-400">{match.away.code}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ==================== Podium Component ====================
function Podium() {
  const podiumTeams = [
    { place: 2, team: final_.away, color: 'from-gray-300 to-gray-400', height: 'h-24', medal: '🥈', label: 'Subcampeón' },
    { place: 1, team: final_.home, color: 'from-amber-400 to-amber-500', height: 'h-32', medal: '🥇', label: 'Campeón' },
    { place: 3, team: tercerPuesto.home, color: 'from-amber-600 to-amber-700', height: 'h-20', medal: '🥉', label: 'Tercer Puesto' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden border-2 border-amber-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 pb-4">
          <CardTitle className="text-center text-amber-900 flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6" />
            Podio - Copa Confederación de Selecciones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-end justify-center gap-4 sm:gap-8">
            {podiumTeams.map((item) => (
              <motion.div
                key={item.place}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.place === 1 ? 0.3 : item.place === 2 ? 0.5 : 0.7, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <span className="text-4xl mb-2">{item.medal}</span>
                <span className="text-3xl mb-1">{item.team.flag}</span>
                <p className="font-bold text-sm text-gray-900 text-center">{item.team.name}</p>
                <p className="text-xs text-gray-400 mb-2">{item.label}</p>
                <div className={`w-20 sm:w-28 ${item.height} bg-gradient-to-t ${item.color} rounded-t-lg flex items-start justify-center pt-2`}>
                  <span className="text-2xl font-black text-white/90">{item.place}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ==================== Stats Bar ====================
function StatsBar() {
  const stats = [
    { label: 'Equipos', value: tournamentInfo.teams, icon: <Flag className="w-4 h-4" /> },
    { label: 'Grupos', value: tournamentInfo.totalGroups, icon: <ChevronRight className="w-4 h-4" /> },
    { label: 'Partidos', value: tournamentInfo.totalMatches, icon: <Zap className="w-4 h-4" /> },
    { label: 'Fases', value: tournamentInfo.totalStages, icon: <Trophy className="w-4 h-4" /> },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center"
        >
          <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-1">
            {stat.icon}
          </div>
          <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

// ==================== Best Third Place Teams ====================
function MejoresTerceros() {
  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 py-3">
        <CardTitle className="text-white text-base flex items-center gap-2">
          <Medal className="w-5 h-5" />
          Mejores Terceros
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {mejoresTerceros.map((team, idx) => (
            <motion.div
              key={team.code}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
            >
              <span className="text-lg">{team.flag}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{team.name}</p>
                <p className="text-[10px] text-gray-400">{idx + 1}° mejor tercero</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== Main Page ====================
export default function Home() {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['A']))
  const [activeTab, setActiveTab] = useState('groups')
  const bracketRef = useRef<HTMLDivElement>(null)

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const openAllGroups = () => {
    setOpenGroups(new Set(groups.map((g) => g.id)))
  }

  const closeAllGroups = () => {
    setOpenGroups(new Set())
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMC0zMHY2aC02VjRoNnptMCAxMHY2aC02di02aDZ6bTAgMTB2NmgtNnYtNmg2em0tMTAgMHY2aC02di02aDZ6bS0xMCAwdjZoLTZ2LTZoNnptMzAgMHY2aC02di02aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Copa Confederación
              </h1>
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            </div>
            <p className="text-lg sm:text-xl text-amber-300 font-semibold mb-2">
              de Selecciones
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{tournamentInfo.date}</span>
            </div>
          </motion.div>

          <div className="mt-8">
            <StatsBar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-gray-100 rounded-xl">
            <TabsTrigger
              value="groups"
              className="rounded-lg py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
            >
              <Flag className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Fase de </span>Grupos
            </TabsTrigger>
            <TabsTrigger
              value="bracket"
              className="rounded-lg py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
            >
              <Zap className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Llave </span>Eliminatoria
            </TabsTrigger>
            <TabsTrigger
              value="podium"
              className="rounded-lg py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
            >
              <Trophy className="w-4 h-4 mr-1.5" />
              Podio
            </TabsTrigger>
          </TabsList>

          {/* ==================== GROUP STAGE TAB ==================== */}
          <TabsContent value="groups" className="space-y-6">
            {/* Best Third Place Teams */}
            <MejoresTerceros />

            {/* Controls */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Fase de Grupos</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={openAllGroups} className="text-xs">
                  Expandir todo
                </Button>
                <Button variant="outline" size="sm" onClick={closeAllGroups} className="text-xs">
                  Colapsar todo
                </Button>
              </div>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  isOpen={openGroups.has(group.id)}
                  onToggle={() => toggleGroup(group.id)}
                />
              ))}
            </div>

            {/* Info note */}
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Clasificación</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Los primeros 2 de cada grupo (24 equipos) y los 8 mejores terceros clasifican a Octavos de Final.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* ==================== KNOCKOUT BRACKET TAB ==================== */}
          <TabsContent value="bracket" className="space-y-8" ref={bracketRef}>
            {/* Octavos */}
            <KnockoutSection
              title="Octavos de Final"
              matches={octavos}
              accentColor="amber"
              icon={<Zap className="w-5 h-5 text-amber-500" />}
            />

            <Separator className="my-6" />

            {/* Cuartos */}
            <KnockoutSection
              title="Cuartos de Final"
              matches={cuartos}
              accentColor="blue"
              icon={<ChevronRight className="w-5 h-5 text-blue-500" />}
            />

            <Separator className="my-6" />

            {/* Semifinales */}
            <KnockoutSection
              title="Semifinales"
              matches={semifinales}
              accentColor="purple"
              icon={<ArrowRight className="w-5 h-5 text-purple-500" />}
            />

            <Separator className="my-6" />

            {/* Semifinal Final */}
            <KnockoutSection
              title="Semifinal Final"
              matches={semifinalFinal}
              accentColor="emerald"
              icon={<Trophy className="w-5 h-5 text-emerald-500" />}
            />

            <Separator className="my-6" />

            {/* Tercer Puesto */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-gray-900">3er y 4to Puesto</h3>
              </div>
              <div className="max-w-lg mx-auto">
                <MatchCard match={tercerPuesto} index={0} />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Final */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-black text-gray-900">🏆 Gran Final</h3>
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <FinalCard match={final_} title="Gran Final" />
            </div>
          </TabsContent>

          {/* ==================== PODIUM TAB ==================== */}
          <TabsContent value="podium" className="space-y-6">
            <Podium />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <FinalCard match={final_} title="Final" />
              <div className="max-w-lg mx-auto w-full">
                <Card className="overflow-hidden border border-amber-300 shadow-md h-full">
                  <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Medal className="w-5 h-5 text-amber-200" />
                      <h3 className="text-base font-bold text-white">3er Puesto</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center flex-1">
                        <span className="text-3xl block mb-1">{tercerPuesto.home.flag}</span>
                        <p className="font-bold text-sm text-gray-900">{tercerPuesto.home.name}</p>
                      </div>
                      <span className="text-xl font-bold text-gray-400">VS</span>
                      <div className="text-center flex-1">
                        <span className="text-3xl block mb-1">{tercerPuesto.away.flag}</span>
                        <p className="font-bold text-sm text-gray-900">{tercerPuesto.away.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-gray-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-gray-300">Copa Confederación de Selecciones 2025</span>
          </div>
          <p className="text-xs text-gray-500">Fixture interactivo • 48 equipos • 12 grupos • 104 partidos</p>
        </div>
      </footer>
    </div>
  )
}
