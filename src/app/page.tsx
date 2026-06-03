'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Calendar, MapPin, ChevronDown, Clock, Globe,
  Zap, ArrowRight, Shield, Star, Users, Landmark,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  groups,
  groupColors,
  knockoutSchedule,
  venues,
  tournamentInfo,
  type Group,
  type GroupMatch,
} from '@/lib/tournament-data'

// ==================== Hero Header ====================
function HeroHeader() {
  return (
    <header className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460]" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Glowing orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Trophy icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 mb-4"
          >
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-2">
            World Cup
            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent"> 2026</span>
          </h1>
          <p className="text-lg sm:text-xl text-sky-200 font-medium mb-3">
            FIFA Copa Mundial de Fútbol
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sky-300/80 text-sm">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>{tournamentInfo.host}</span>
            </div>
            <span className="hidden sm:inline text-sky-500">|</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>11 Jun - 19 Jul 2026</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-2xl mx-auto"
        >
          {[
            { label: 'Selecciones', value: tournamentInfo.totalTeams, icon: <Shield className="w-4 h-4" /> },
            { label: 'Grupos', value: tournamentInfo.totalGroups, icon: <Users className="w-4 h-4" /> },
            { label: 'Partidos', value: tournamentInfo.totalMatches, icon: <Zap className="w-4 h-4" /> },
            { label: 'Sedes', value: tournamentInfo.venues, icon: <Landmark className="w-4 h-4" /> },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-3 text-center"
            >
              <div className="flex items-center justify-center text-amber-300 mb-1">{stat.icon}</div>
              <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
              <p className="text-[11px] text-sky-200/70 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </header>
  )
}

// ==================== Match Card ====================
function MatchCard({ match, index }: { match: GroupMatch; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.25 }}
      className="group rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* Date bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Calendar className="w-3 h-3" />
          <span className="text-[11px] font-medium">{match.date}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock className="w-3 h-3" />
          <span className="text-[11px] font-medium">{match.time}</span>
        </div>
      </div>

      {/* Teams */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl leading-none">{match.home.flag}</span>
          <span className="text-sm font-semibold text-gray-900 flex-1 truncate">{match.home.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{match.away.flag}</span>
          <span className="text-sm font-semibold text-gray-900 flex-1 truncate">{match.away.name}</span>
        </div>
      </div>

      {/* Venue */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-t border-gray-100 bg-gray-50/50">
        <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span className="text-[11px] text-gray-500 truncate">{match.venue}</span>
      </div>
    </motion.div>
  )
}

// ==================== Group Card ====================
function GroupCard({ group, isOpen, onToggle }: { group: Group; isOpen: boolean; onToggle: () => void }) {
  const [selectedMatchday, setSelectedMatchday] = useState(1)
  const colors = groupColors[group.id]

  const filteredMatches = useMemo(
    () => group.matches.filter((m) => m.matchday === selectedMatchday),
    [group.matches, selectedMatchday]
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border-gray-200/80">
        {/* Header */}
        <button
          onClick={onToggle}
          className={`w-full bg-gradient-to-r ${colors.headerFrom} ${colors.headerTo} text-white px-4 py-3 flex items-center justify-between cursor-pointer`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-black">{group.name}</span>
            <div className="flex items-center -space-x-1">
              {group.teams.map((team) => (
                <span key={team.code} className="text-base" title={team.name}>{team.flag}</span>
              ))}
            </div>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
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
                {/* Teams row */}
                <div className="grid grid-cols-4 gap-0 border-b border-gray-100">
                  {group.teams.map((team, idx) => (
                    <motion.div
                      key={team.code}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex flex-col items-center py-3 px-1 text-center border-r border-gray-100 last:border-r-0"
                    >
                      <span className="text-2xl mb-1">{team.flag}</span>
                      <p className="text-xs font-bold text-gray-900 leading-tight truncate w-full">{team.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{team.code}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Matchday selector */}
                <div className="flex border-b border-gray-100">
                  {[1, 2, 3].map((md) => (
                    <button
                      key={md}
                      onClick={() => setSelectedMatchday(md)}
                      className={`flex-1 py-2 text-xs font-bold transition-colors ${
                        selectedMatchday === md
                          ? `bg-gradient-to-r ${colors.headerFrom} ${colors.headerTo} text-white`
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Fecha {md}
                    </button>
                  ))}
                </div>

                {/* Matches */}
                <div className="p-3 space-y-2">
                  {filteredMatches.map((match, idx) => (
                    <MatchCard key={match.id} match={match} index={idx} />
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

// ==================== Groups View ====================
function GroupsView() {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['A']))

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Fase de Grupos</h2>
          <p className="text-sm text-gray-500">12 grupos • 48 selecciones • 72 partidos</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenGroups(new Set(groups.map((g) => g.id)))}
            className="text-xs"
          >
            Expandir todo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenGroups(new Set())}
            className="text-xs"
          >
            Colapsar todo
          </Button>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-4">
        <Shield className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-sky-800">Formato de clasificación</p>
          <p className="text-xs text-sky-600 mt-0.5">
            Clasifican los 2 primeros de cada grupo (24 equipos) y los 8 mejores terceros a la Fase Eliminatoria.
            Dieciseisavos de Final → Octavos → Cuartos → Semifinales → Final.
          </p>
        </div>
      </div>

      {/* Group cards grid */}
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
    </div>
  )
}

// ==================== Matchday Calendar View ====================
function CalendarView() {
  const [selectedMatchday, setSelectedMatchday] = useState(1)

  const allMatches = useMemo(() => {
    return groups
      .flatMap((g) => g.matches)
      .filter((m) => m.matchday === selectedMatchday)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  }, [selectedMatchday])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Calendario de Partidos</h2>
        <p className="text-sm text-gray-500">Todos los partidos por fecha</p>
      </div>

      {/* Matchday tabs */}
      <div className="flex gap-2">
        {[1, 2, 3].map((md) => (
          <Button
            key={md}
            variant={selectedMatchday === md ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMatchday(md)}
            className={`text-sm font-bold ${
              selectedMatchday === md
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                : ''
            }`}
          >
            Fecha {md}
          </Button>
        ))}
      </div>

      {/* Matches grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {allMatches.map((match, idx) => {
          const colors = groupColors[match.group]
          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={`bg-gradient-to-r ${colors.headerFrom} ${colors.headerTo} text-white px-3 py-1 flex items-center justify-between`}>
                <span className="text-[11px] font-bold">Grupo {match.group}</span>
                <span className="text-[10px] opacity-80">{match.date} • {match.time}</span>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{match.home.flag}</span>
                  <span className="text-sm font-semibold text-gray-900 flex-1 truncate">{match.home.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{match.away.flag}</span>
                  <span className="text-sm font-semibold text-gray-900 flex-1 truncate">{match.away.name}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 pt-1 border-t border-gray-100">
                  <MapPin className="w-3 h-3" />
                  <span className="text-[11px] truncate">{match.venue}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ==================== Knockout View ====================
function KnockoutView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Fase Eliminatoria</h2>
        <p className="text-sm text-gray-500">Del 28 de junio al 19 de julio de 2026</p>
      </div>

      {/* Bracket visualization */}
      <div className="space-y-4">
        {knockoutSchedule.map((round, idx) => {
          const isFinal = round.shortRound === 'Final'
          const is3rd = round.shortRound === '3er Puesto'
          const isSemi = round.shortRound === 'Semifinales'

          return (
            <motion.div
              key={round.round}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <Card className={`overflow-hidden ${
                isFinal ? 'border-2 border-amber-400 shadow-xl' :
                isSemi ? 'border-2 border-purple-300 shadow-lg' :
                is3rd ? 'border-2 border-amber-300 shadow-md' :
                'border border-gray-200 shadow-sm'
              }`}>
                <div className={`px-5 py-3 ${
                  isFinal ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500' :
                  isSemi ? 'bg-gradient-to-r from-purple-500 to-indigo-600' :
                  is3rd ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                  'bg-gradient-to-r from-gray-700 to-gray-800'
                } text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isFinal ? <Trophy className="w-5 h-5" /> :
                       isSemi ? <Star className="w-5 h-5" /> :
                       <ArrowRight className="w-5 h-5" />}
                      <h3 className={`font-bold ${isFinal ? 'text-lg' : 'text-base'}`}>
                        {round.round}
                      </h3>
                    </div>
                    <Badge variant="secondary" className={`text-xs font-bold ${
                      isFinal ? 'bg-amber-800/30 text-amber-100' :
                      isSemi ? 'bg-purple-900/30 text-purple-100' :
                      'bg-white/20 text-white'
                    }`}>
                      {round.matches} {round.matches === 1 ? 'partido' : 'partidos'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{round.dates}</span>
                    </div>
                    {(round.venues || round.venue) && (
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{round.venues || round.venue}</span>
                      </div>
                    )}
                    {round.desc && (
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{round.desc}</span>
                    )}
                  </div>

                  {/* Final & 3rd place special cards */}
                  {isFinal && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 text-center"
                    >
                      <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                      <p className="text-lg font-black text-amber-800">🏆 Gran Final</p>
                      <p className="text-sm text-amber-600 mt-1">19 de Julio, 2026 • 16:00</p>
                      <p className="text-xs text-amber-500 mt-0.5">New York New Jersey Stadium</p>
                      <div className="flex items-center justify-center gap-3 mt-3 text-xs text-amber-600">
                        <span>Equipos por definir</span>
                      </div>
                    </motion.div>
                  )}

                  {is3rd && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 text-center"
                    >
                      <Star className="w-8 h-8 text-orange-500 mx-auto mb-1" />
                      <p className="text-base font-bold text-orange-800">3er y 4to Puesto</p>
                      <p className="text-sm text-orange-600 mt-1">18 de Julio, 2026</p>
                      <p className="text-xs text-orange-500 mt-0.5">Miami Stadium</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ==================== Venue Section Component ====================
const countryFlagMap: Record<string, string> = { 'México': '🇲🇽', 'Canadá': '🇨🇦', 'EE.UU.': '🇺🇸' }

function VenueSection({ title, flag, items }: { title: string; flag: string; items: typeof venues }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{flag}</span>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <Badge variant="secondary" className="text-xs">{items.length} sedes</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((venue, idx) => (
          <motion.div
            key={venue.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
          >
            <MapPin className="w-5 h-5 text-red-400 mb-2" />
            <p className="font-bold text-sm text-gray-900">{venue.name}</p>
            <p className="text-xs text-gray-500 mt-1">{venue.city}, {venue.country}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ==================== Venues View ====================
function VenuesView() {
  const mxVenues = venues.filter((v) => v.country === 'México')
  const caVenues = venues.filter((v) => v.country === 'Canadá')
  const usVenues = venues.filter((v) => v.country === 'EE.UU.')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Sedes del Mundial</h2>
        <p className="text-sm text-gray-500">16 estadios en 3 países de Norteamérica</p>
      </div>

      <VenueSection title="México" flag={countryFlagMap['México']} items={mxVenues} />
      <Separator />
      <VenueSection title="Canadá" flag={countryFlagMap['Canadá']} items={caVenues} />
      <Separator />
      <VenueSection title="Estados Unidos" flag={countryFlagMap['EE.UU.']} items={usVenues} />
    </div>
  )
}

// ==================== Main Page ====================
export default function Home() {
  const [activeTab, setActiveTab] = useState('groups')

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <HeroHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full grid grid-cols-4 h-auto p-1 bg-gray-100 rounded-xl">
            <TabsTrigger
              value="groups"
              className="rounded-lg py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
            >
              <Shield className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Fase de </span>Grupos
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="rounded-lg py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
            >
              <Calendar className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Calendario</span>
              <span className="sm:hidden">Calend.</span>
            </TabsTrigger>
            <TabsTrigger
              value="knockout"
              className="rounded-lg py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
            >
              <Zap className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Eliminatoria</span>
              <span className="sm:hidden">Elim.</span>
            </TabsTrigger>
            <TabsTrigger
              value="venues"
              className="rounded-lg py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
            >
              <MapPin className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Sedes</span>
              <span className="sm:hidden">Sedes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups"><GroupsView /></TabsContent>
          <TabsContent value="calendar"><CalendarView /></TabsContent>
          <TabsContent value="knockout"><KnockoutView /></TabsContent>
          <TabsContent value="venues"><VenuesView /></TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-gradient-to-r from-[#1a0a2e] via-[#16213e] to-[#0f3460] text-sky-200/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-sky-200/80">FIFA World Cup 2026</span>
          </div>
          <p className="text-xs text-sky-300/40">
            Fixture interactivo • 48 selecciones • 12 grupos • 104 partidos • 16 sedes • 3 países
          </p>
          <p className="text-xs text-sky-300/30 mt-1">
            Datos: infobae.com/mundial-2026/calendario
          </p>
        </div>
      </footer>
    </div>
  )
}
