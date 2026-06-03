'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Calendar, MapPin, ChevronDown, Clock, Globe,
  Zap, ArrowRight, Shield, Star, Users, Landmark,
  RotateCcw, Play, ChevronLeft, ChevronRight, Image,
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
  type Team,
} from '@/lib/tournament-data'

// ==================== Simulator State ====================
interface ScoreState {
  [matchId: number]: { home: number; away: number }
}

interface Standing {
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  gf: number
  ga: number
  pts: number
}

function computeStandings(group: Group, scores: ScoreState): Standing[] {
  const map = new Map<string, Standing>()
  for (const t of group.teams) {
    map.set(t.code, { team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 })
  }
  for (const m of group.matches) {
    const s = scores[m.id]
    if (s === undefined || s.home < 0 || s.away < 0) continue
    const h = map.get(m.home.code)!
    const a = map.get(m.away.code)!
    h.played++; a.played++
    h.gf += s.home; h.ga += s.away
    a.gf += s.away; a.ga += s.home
    if (s.home > s.away) { h.won++; h.pts += 3; a.lost++ }
    else if (s.home < s.away) { a.won++; a.pts += 3; h.lost++ }
    else { h.drawn++; a.drawn++; h.pts++; a.pts++ }
  }
  return [...map.values()].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf)
}

// ==================== Score Input ====================
function ScoreInput({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(value < 9 ? value + 1 : -1)}
      disabled={disabled}
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-black text-lg flex items-center justify-center transition-all duration-150 select-none
        ${disabled ? 'bg-gray-100 text-gray-300 cursor-not-allowed' :
          value >= 0 ? 'bg-gray-900 text-white shadow-md hover:bg-gray-800 active:scale-95' :
          'bg-gray-100 text-gray-400 hover:bg-gray-200 active:scale-95'}`}
    >
      {value >= 0 ? value : '–'}
    </button>
  )
}

// ==================== Hero Header ====================
function HeroHeader() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f2847] to-[#0a1628]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 0L40 20L20 40L0 20z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div className="absolute top-8 left-8 w-48 h-48 bg-amber-400/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-4 right-8 w-64 h-64 bg-sky-400/10 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
                World Cup <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">2026</span>
              </h1>
              <p className="text-xs sm:text-sm text-sky-300/80 font-medium">Simulador Digital Interactivo</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sky-200/60 text-xs">
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" />{tournamentInfo.host}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />11 Jun - 19 Jul 2026</span>
            <span className="flex items-center gap-1"><Play className="w-3.5 h-3.5 text-amber-400" />Simula los resultados</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="grid grid-cols-4 gap-2 sm:gap-3 mt-6 max-w-xl mx-auto">
          {[
            { label: 'Selecciones', value: tournamentInfo.totalTeams, icon: <Shield className="w-3.5 h-3.5" /> },
            { label: 'Grupos', value: tournamentInfo.totalGroups, icon: <Users className="w-3.5 h-3.5" /> },
            { label: 'Partidos', value: tournamentInfo.totalMatches, icon: <Zap className="w-3.5 h-3.5" /> },
            { label: 'Sedes', value: tournamentInfo.venues, icon: <Landmark className="w-3.5 h-3.5" /> },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.08 }}
              className="bg-white/[0.06] backdrop-blur rounded-xl border border-white/[0.08] p-2.5 sm:p-3 text-center">
              <div className="flex items-center justify-center text-amber-300/80 mb-0.5">{s.icon}</div>
              <p className="text-xl sm:text-2xl font-black text-white">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-sky-200/50 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </header>
  )
}

// ==================== Simulator Match Card ====================
function SimulatorMatch({ match, scores, onScoreChange, index }: {
  match: GroupMatch; scores: ScoreState; onScoreChange: (id: number, side: 'home' | 'away', val: number) => void; index: number
}) {
  const s = scores[match.id]
  const hasScore = s !== undefined && s.home >= 0 && s.away >= 0
  const colors = groupColors[match.group]

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}
      className={`rounded-xl border overflow-hidden transition-all duration-200 ${hasScore ? 'border-emerald-200 shadow-md bg-white' : 'border-gray-200 bg-white hover:shadow-sm'}`}>
      {/* Match meta */}
      <div className="flex items-center justify-between px-3 py-1 bg-gray-50 border-b border-gray-100">
        <Badge variant="secondary" className={`text-[10px] font-bold bg-gradient-to-r ${colors.headerFrom} ${colors.headerTo} text-white border-0`}>
          G{match.group}
        </Badge>
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-[10px]">{match.date}</span>
          <span className="text-[10px]">•</span>
          <span className="text-[10px]">{match.time}</span>
        </div>
      </div>

      {/* Score row */}
      <div className="flex items-center px-3 py-2.5 gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-xl leading-none">{match.home.flag}</span>
          <span className="text-xs font-bold text-gray-900 truncate">{match.home.name}</span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <ScoreInput value={s?.home ?? -1} onChange={(v) => onScoreChange(match.id, 'home', v)} disabled={false} />
          <span className="text-xs font-black text-gray-300">-</span>
          <ScoreInput value={s?.away ?? -1} onChange={(v) => onScoreChange(match.id, 'away', v)} disabled={false} />
        </div>

        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
          <span className="text-xs font-bold text-gray-900 truncate text-right">{match.away.name}</span>
          <span className="text-xl leading-none">{match.away.flag}</span>
        </div>
      </div>

      {/* Venue */}
      <div className="flex items-center gap-1 px-3 py-1 border-t border-gray-50">
        <MapPin className="w-2.5 h-2.5 text-gray-300" />
        <span className="text-[10px] text-gray-400 truncate">{match.venue}</span>
        {hasScore && <span className="ml-auto text-[10px] text-emerald-500 font-bold">✓</span>}
      </div>
    </motion.div>
  )
}

// ==================== Standings Table ====================
function StandingsTable({ standings, colors }: { standings: Standing[]; colors: typeof groupColors.A }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-1.5 px-1 text-gray-400 font-medium w-5">#</th>
            <th className="text-left py-1.5 px-1 text-gray-400 font-medium">Equipo</th>
            <th className="text-center py-1.5 px-1 text-gray-400 font-medium">PJ</th>
            <th className="text-center py-1.5 px-1 text-gray-400 font-medium">G</th>
            <th className="text-center py-1.5 px-1 text-gray-400 font-medium">E</th>
            <th className="text-center py-1.5 px-1 text-gray-400 font-medium">P</th>
            <th className="text-center py-1.5 px-1 text-gray-400 font-medium">GF</th>
            <th className="text-center py-1.5 px-1 text-gray-400 font-medium">GC</th>
            <th className="text-center py-1.5 px-1 text-gray-400 font-medium">DG</th>
            <th className="text-center py-1.5 px-1 text-gray-400 font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <tr key={s.team.code} className={`border-b border-gray-50 ${i < 2 ? 'bg-emerald-50/50' : i === 2 ? 'bg-amber-50/50' : ''}`}>
              <td className="py-1.5 px-1">
                <span className={`w-4 h-4 rounded-full inline-flex items-center justify-center text-[9px] font-bold text-white
                  ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-emerald-400' : i === 2 ? 'bg-amber-400' : 'bg-gray-200 text-gray-500'}`}>
                  {i + 1}
                </span>
              </td>
              <td className="py-1.5 px-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{s.team.flag}</span>
                  <span className="font-semibold text-gray-900 truncate max-w-[80px]">{s.team.name}</span>
                </div>
              </td>
              <td className="text-center py-1.5 px-1 text-gray-600">{s.played}</td>
              <td className="text-center py-1.5 px-1 text-gray-600">{s.won}</td>
              <td className="text-center py-1.5 px-1 text-gray-600">{s.drawn}</td>
              <td className="text-center py-1.5 px-1 text-gray-600">{s.lost}</td>
              <td className="text-center py-1.5 px-1 text-gray-600">{s.gf}</td>
              <td className="text-center py-1.5 px-1 text-gray-600">{s.ga}</td>
              <td className="text-center py-1.5 px-1 font-semibold text-gray-700">{s.gf - s.ga > 0 ? '+' : ''}{s.gf - s.ga}</td>
              <td className="text-center py-1.5 px-1 font-black text-gray-900 text-sm">{s.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Clasifica</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />Mejor 3ro</span>
      </div>
    </div>
  )
}

// ==================== Group Simulator ====================
function GroupSimulator({ group, scores, onScoreChange, isOpen, onToggle }: {
  group: Group; scores: ScoreState; onScoreChange: (id: number, side: 'home' | 'away', val: number) => void;
  isOpen: boolean; onToggle: () => void
}) {
  const [selectedMD, setSelectedMD] = useState(0) // 0 = all
  const colors = groupColors[group.id]
  const standings = useMemo(() => computeStandings(group, scores), [group, scores])

  const filteredMatches = useMemo(() =>
    selectedMD === 0 ? group.matches : group.matches.filter((m) => m.matchday === selectedMD),
    [group.matches, selectedMD]
  )

  const playedCount = group.matches.filter((m) => { const s = scores[m.id]; return s !== undefined && s.home >= 0 && s.away >= 0 }).length

  return (
    <motion.div layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden shadow-sm border-gray-200/80">
        <button onClick={onToggle} className={`w-full bg-gradient-to-r ${colors.headerFrom} ${colors.headerTo} text-white px-4 py-2.5 flex items-center justify-between cursor-pointer`}>
          <div className="flex items-center gap-2">
            <span className="text-base font-black">{group.name}</span>
            <div className="flex -space-x-1">{group.teams.map((t) => <span key={t.code} className="text-sm" title={t.name}>{t.flag}</span>)}</div>
            <span className="text-[10px] opacity-70 font-medium">{playedCount}/6</span>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown className="w-4 h-4" /></motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
              <CardContent className="p-0">
                {/* Standings */}
                <div className="px-3 pt-3 pb-1">
                  <StandingsTable standings={standings} colors={colors} />
                </div>

                <Separator />

                {/* Matchday filter */}
                <div className="flex border-b border-gray-100">
                  {[
                    { key: 0, label: 'Todos' },
                    { key: 1, label: 'F1' },
                    { key: 2, label: 'F2' },
                    { key: 3, label: 'F3' },
                  ].map((md) => (
                    <button key={md.key} onClick={() => setSelectedMD(md.key)}
                      className={`flex-1 py-1.5 text-[11px] font-bold transition-colors ${selectedMD === md.key
                        ? `bg-gradient-to-r ${colors.headerFrom} ${colors.headerTo} text-white`
                        : 'text-gray-400 hover:bg-gray-50'}`}>
                      {md.label}
                    </button>
                  ))}
                </div>

                {/* Matches */}
                <div className="p-2.5 space-y-2">
                  {filteredMatches.map((m, i) => (
                    <SimulatorMatch key={m.id} match={m} scores={scores} onScoreChange={onScoreChange} index={i} />
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

// ==================== Simulator Tab ====================
function SimulatorView() {
  const [scores, setScores] = useState<ScoreState>({})
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['A', 'B', 'C']))

  const onScoreChange = useCallback((id: number, side: 'home' | 'away', val: number) => {
    setScores((prev) => {
      const current = prev[id] ?? { home: -1, away: -1 }
      const updated = { ...current, [side]: val }
      // If both scores are -1 (unset), remove entry
      if (updated.home === -1 && updated.away === -1) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: updated }
    })
  }, [])

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => { const n = new Set(prev); if (n.has(id)) { n.delete(id) } else { n.add(id) } return n })
  }

  const totalPlayed = Object.values(scores).filter((s) => s.home >= 0 && s.away >= 0).length
  const totalMatches = groups.reduce((acc, g) => acc + g.matches.length, 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Simulador de Resultados</h2>
          <p className="text-sm text-gray-500">Haz clic en los números para ingresar goles y simular los resultados</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-bold">
            <Play className="w-3 h-3 mr-1" />
            {totalPlayed}/{totalMatches} jugados
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setScores({})} className="text-xs">
            <RotateCcw className="w-3 h-3 mr-1" />
            Resetear
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-3">
        <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          <strong>Simula el Mundial:</strong> Clic en los cuadros de goles para cargar resultados. La tabla de posiciones se actualiza en tiempo real. Los 2 primeros clasifican + 8 mejores terceros.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {groups.map((g) => (
          <GroupSimulator key={g.id} group={g} scores={scores} onScoreChange={onScoreChange}
            isOpen={openGroups.has(g.id)} onToggle={() => toggleGroup(g.id)} />
        ))}
      </div>
    </div>
  )
}

// ==================== Stadium Gallery ====================
const countryFlagMap: Record<string, string> = { 'México': '🇲🇽', 'Canadá': '🇨🇦', 'EE.UU.': '🇺🇸' }

function StadiumCard({ venue, index }: { venue: typeof venues[0]; index: number }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className="group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={venue.image}
          alt={venue.realName}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          aria-label={`Foto del estadio ${venue.realName}`}
        />
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="text-2xl drop-shadow-lg">{countryFlagMap[venue.country]}</span>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
          <p className="text-white font-bold text-sm leading-tight">{venue.realName}</p>
          <p className="text-white/70 text-[11px]">{venue.city}, {venue.country}</p>
        </div>
      </div>
    </motion.div>
  )
}

function VenueSection({ title, flag, items, startIdx }: { title: string; flag: string; items: typeof venues; startIdx: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{flag}</span>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <Badge variant="secondary" className="text-xs">{items.length} sedes</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((v, i) => <StadiumCard key={v.name} venue={v} index={startIdx + i} />)}
      </div>
    </div>
  )
}

function StadiumsView() {
  const mxV = venues.filter((v) => v.country === 'México')
  const caV = venues.filter((v) => v.country === 'Canadá')
  const usV = venues.filter((v) => v.country === 'EE.UU.')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Sedes del Mundial</h2>
        <p className="text-sm text-gray-500">16 estadios en 3 países de Norteamérica</p>
      </div>
      <VenueSection title="México" flag="🇲🇽" items={mxV} startIdx={0} />
      <Separator />
      <VenueSection title="Canadá" flag="🇨🇦" items={caV} startIdx={3} />
      <Separator />
      <VenueSection title="Estados Unidos" flag="🇺🇸" items={usV} startIdx={5} />
    </div>
  )
}

// ==================== Knockout View ====================
function KnockoutView() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Fase Eliminatoria</h2>
        <p className="text-sm text-gray-500">Del 28 de junio al 19 de julio de 2026</p>
      </div>

      {/* Flow diagram */}
      <div className="space-y-3">
        {knockoutSchedule.map((round, idx) => {
          const isFinal = round.shortRound === 'Final'
          const is3rd = round.shortRound === '3er Puesto'
          const isSemi = round.shortRound === 'Semifinales'

          return (
            <motion.div key={round.round} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card className={`overflow-hidden ${isFinal ? 'border-2 border-amber-400 shadow-xl' : isSemi ? 'border-2 border-purple-300' : is3rd ? 'border-2 border-amber-300' : 'border border-gray-200'}`}>
                <div className={`px-4 py-2.5 text-white ${isFinal ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500' : isSemi ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : is3rd ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-gray-700 to-gray-800'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isFinal ? <Trophy className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      <h3 className={`font-bold ${isFinal ? 'text-base' : 'text-sm'}`}>{round.round}</h3>
                    </div>
                    <Badge variant="secondary" className={`text-[10px] font-bold ${isFinal ? 'bg-amber-800/30 text-amber-100' : 'bg-white/20 text-white'}`}>
                      {round.matches} {round.matches === 1 ? 'partido' : 'partidos'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" />{round.dates}</span>
                    {(round.venues || round.venue) && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{round.venues || round.venue}</span>}
                  </div>
                  {isFinal && (
                    <div className="mt-3 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 text-center">
                      <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-1" />
                      <p className="text-base font-black text-amber-800">🏆 Gran Final</p>
                      <p className="text-xs text-amber-600 mt-1">19 Julio 2026 • MetLife Stadium • Nueva York</p>
                    </div>
                  )}
                  {is3rd && (
                    <div className="mt-3 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-3 text-center">
                      <Star className="w-6 h-6 text-orange-500 mx-auto mb-0.5" />
                      <p className="text-sm font-bold text-orange-800">3er y 4to Puesto</p>
                      <p className="text-xs text-orange-600">18 Julio 2026 • Hard Rock Stadium • Miami</p>
                    </div>
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

// ==================== Main Page ====================
export default function Home() {
  const [activeTab, setActiveTab] = useState('simulator')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeroHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
          <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-white rounded-xl shadow-sm border border-gray-200">
            <TabsTrigger value="simulator"
              className="rounded-lg py-2 sm:py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              Simulador
            </TabsTrigger>
            <TabsTrigger value="knockout"
              className="rounded-lg py-2 sm:py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Eliminatoria</span>
              <span className="sm:hidden">Elim.</span>
            </TabsTrigger>
            <TabsTrigger value="stadiums"
              className="rounded-lg py-2 sm:py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md">
              <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" alt="Sedes" />
              Sedes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulator"><SimulatorView /></TabsContent>
          <TabsContent value="knockout"><KnockoutView /></TabsContent>
          <TabsContent value="stadiums"><StadiumsView /></TabsContent>
        </Tabs>
      </main>

      <footer className="mt-auto bg-gradient-to-r from-[#0a1628] via-[#0f2847] to-[#0a1628] text-sky-200/50 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Trophy className="w-4 h-4 text-amber-400/80" />
            <span className="text-sm font-bold text-sky-200/70">FIFA World Cup 2026 — Simulador Digital</span>
          </div>
          <p className="text-[10px] text-sky-300/30">48 selecciones • 12 grupos • 104 partidos • 16 sedes • 3 países</p>
        </div>
      </footer>
    </div>
  )
}
