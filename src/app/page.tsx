'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Calendar, MapPin, ChevronDown, Clock, Globe,
  Zap, ArrowRight, Shield, Star, Users, Landmark,
  RotateCcw, Play, ChevronLeft, ChevronRight, Image as ImageIcon,
  Timer,
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
  bracketRounds,
  type Group,
  type GroupMatch,
  type Team,
  type KnockoutSlot,
  type BracketMatch,
  type BracketRound,
} from '@/lib/tournament-data'

// ==================== Countdown Timer ====================
const WORLD_CUP_START = new Date('2026-06-11T18:00:00Z').getTime()

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function CountdownTimer() {
  const timeLeft = useCountLeft()
  const isStarted = timeLeft.total <= 0

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0f2847] to-[#0a1628]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-400/10 rounded-full blur-[100px]" />

      <div className="relative px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          {/* Left: Logo + Trophy */}
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 flex items-center justify-center flex-shrink-0"
            >
              <Trophy className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <img src="/logo-24.png" alt="24 Horicias" className="h-10 w-auto opacity-80" />
            </div>
          </div>

          {/* Center: Timer */}
          <div className="flex-1 text-center sm:text-left">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-lg font-bold text-white/90 mb-3 sm:mb-4 tracking-wide uppercase"
            >
              {isStarted ? '¡El Mundial ha comenzado!' : 'El Mundial comienza en:'}
            </motion.p>

            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
              {[
                { value: timeLeft.days, label: 'DÍAS' },
                { value: timeLeft.hours, label: 'HS' },
                { value: timeLeft.minutes, label: 'MIN' },
                { value: timeLeft.seconds, label: 'SEG' },
              ].map((unit, i) => (
                <motion.div
                  key={unit.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1, type: 'spring' }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                    <span className="text-2xl sm:text-4xl font-black text-white tabular-nums">
                      {String(unit.value).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-xs font-bold text-sky-300/70 mt-1 tracking-wider">{unit.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="hidden lg:flex flex-col gap-2"
          >
            {[
              { label: 'Selecciones', value: tournamentInfo.totalTeams, icon: <Shield className="w-3.5 h-3.5" /> },
              { label: 'Grupos', value: tournamentInfo.totalGroups, icon: <Users className="w-3.5 h-3.5" /> },
              { label: 'Partidos', value: tournamentInfo.totalMatches, icon: <Zap className="w-3.5 h-3.5" /> },
              { label: 'Sedes', value: tournamentInfo.venues, icon: <Landmark className="w-3.5 h-3.5" /> },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 bg-white/[0.06] backdrop-blur rounded-lg border border-white/[0.08] px-3 py-1.5">
                <span className="text-amber-300/80">{s.icon}</span>
                <span className="text-sm font-black text-white">{s.value}</span>
                <span className="text-[10px] text-sky-200/50">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Mobile stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-4 gap-1.5 mt-4 lg:hidden"
        >
          {[
            { label: 'Selecciones', value: tournamentInfo.totalTeams, icon: <Shield className="w-3 h-3" /> },
            { label: 'Grupos', value: tournamentInfo.totalGroups, icon: <Users className="w-3 h-3" /> },
            { label: 'Partidos', value: tournamentInfo.totalMatches, icon: <Zap className="w-3 h-3" /> },
            { label: 'Sedes', value: tournamentInfo.venues, icon: <Landmark className="w-3 h-3" /> },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.06] backdrop-blur rounded-lg border border-white/[0.08] p-1.5 text-center">
              <div className="flex items-center justify-center text-amber-300/80 mb-0.5">{s.icon}</div>
              <p className="text-base font-black text-white">{s.value}</p>
              <p className="text-[9px] text-sky-200/50">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function useCountLeft(): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    const now = Date.now()
    const diff = Math.max(0, WORLD_CUP_START - now)
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      total: diff,
    }
  })

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, WORLD_CUP_START - now)
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        total: diff,
      })
    }
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return timeLeft
}

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
      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-black text-sm flex items-center justify-center transition-all duration-150 select-none
        ${disabled ? 'bg-gray-100 text-gray-300 cursor-not-allowed' :
          value >= 0 ? 'bg-gray-900 text-white shadow-md hover:bg-gray-800 active:scale-95' :
          'bg-gray-100 text-gray-400 hover:bg-gray-200 active:scale-95'}`}
    >
      {value >= 0 ? value : '–'}
    </button>
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

      <div className="flex items-center px-3 py-2 gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-lg leading-none">{match.home.flag}</span>
          <span className="text-xs font-bold text-gray-900 truncate">{match.home.name}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <ScoreInput value={s?.home ?? -1} onChange={(v) => onScoreChange(match.id, 'home', v)} disabled={false} />
          <span className="text-xs font-black text-gray-300">-</span>
          <ScoreInput value={s?.away ?? -1} onChange={(v) => onScoreChange(match.id, 'away', v)} disabled={false} />
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
          <span className="text-xs font-bold text-gray-900 truncate text-right">{match.away.name}</span>
          <span className="text-lg leading-none">{match.away.flag}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 px-3 py-1 border-t border-gray-50">
        <MapPin className="w-2.5 h-2.5 text-gray-300" />
        <span className="text-[10px] text-gray-400 truncate">{match.venue}</span>
        {hasScore && <span className="ml-auto text-[10px] text-emerald-500 font-bold">✓</span>}
      </div>
    </motion.div>
  )
}

// ==================== Standings Table ====================
function StandingsTable({ standings }: { standings: Standing[] }) {
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
  const [selectedMD, setSelectedMD] = useState(0)
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
                <div className="px-3 pt-3 pb-1">
                  <StandingsTable standings={standings} />
                </div>
                <Separator />
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
          <p className="text-sm text-gray-500">Clic en los números para ingresar goles y simular los resultados</p>
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

// ==================== Bracket Llaves View ====================

// Knockout score input for bracket
function BracketScoreInput({ value, onChange, disabled }: { value: number | null; onChange: (v: number) => void; disabled: boolean }) {
  const display = value !== null && value >= 0 ? value : '–'
  return (
    <button
      onClick={() => !disabled && onChange(value === null ? 0 : value < 9 ? value + 1 : -1)}
      disabled={disabled}
      className={`w-7 h-7 rounded-md font-black text-xs flex items-center justify-center transition-all duration-150 select-none
        ${disabled ? 'bg-gray-800 text-gray-600 cursor-not-allowed' :
          value !== null && value >= 0 ? 'bg-amber-500 text-white shadow-md hover:bg-amber-400 active:scale-95' :
          'bg-gray-800 text-gray-500 hover:bg-gray-700 active:scale-95'}`}
    >
      {display}
    </button>
  )
}

// Single bracket match card (dark themed for bracket)
function BracketMatchCard({
  match,
  knockoutScores,
  onKnockoutScoreChange,
}: {
  match: BracketMatch
  knockoutScores: ScoreState
  onKnockoutScoreChange: (id: number, side: 'home' | 'away', val: number) => void
}) {
  const s = knockoutScores[match.id]
  const homeScore = s?.home ?? -1
  const awayScore = s?.away ?? -1
  const hasScore = homeScore >= 0 && awayScore >= 0
  const homeWins = hasScore && homeScore > awayScore
  const awayWins = hasScore && awayScore > homeScore

  return (
    <div className="bg-[#0d1b2a] border border-sky-900/40 rounded-lg overflow-hidden shadow-lg min-w-[200px] sm:min-w-[220px]">
      {/* Position label */}
      <div className="flex items-center justify-between px-2 py-0.5 bg-sky-900/30 border-b border-sky-900/40">
        <span className="text-[9px] font-medium text-sky-400/60 truncate">{match.home.position}</span>
        <span className="text-[9px] text-sky-500/40">vs</span>
        <span className="text-[9px] font-medium text-sky-400/60 truncate">{match.away.position}</span>
      </div>

      {/* Home team */}
      <div className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-sky-900/30 ${homeWins ? 'bg-emerald-900/30' : ''}`}>
        <span className="text-sm leading-none">{match.home.flag}</span>
        <span className={`text-[11px] font-bold truncate flex-1 ${homeWins ? 'text-emerald-300' : 'text-white/80'}`}>
          {match.home.name}
        </span>
        <BracketScoreInput
          value={homeScore >= 0 ? homeScore : null}
          onChange={(v) => onKnockoutScoreChange(match.id, 'home', v)}
          disabled={false}
        />
      </div>

      {/* Away team */}
      <div className={`flex items-center gap-1.5 px-2 py-1.5 ${awayWins ? 'bg-emerald-900/30' : ''}`}>
        <span className="text-sm leading-none">{match.away.flag}</span>
        <span className={`text-[11px] font-bold truncate flex-1 ${awayWins ? 'text-emerald-300' : 'text-white/80'}`}>
          {match.away.name}
        </span>
        <BracketScoreInput
          value={awayScore >= 0 ? awayScore : null}
          onChange={(v) => onKnockoutScoreChange(match.id, 'away', v)}
          disabled={false}
        />
      </div>

      {/* Venue */}
      <div className="flex items-center gap-1 px-2 py-0.5 bg-sky-900/20 border-t border-sky-900/30">
        <MapPin className="w-2.5 h-2.5 text-sky-600" />
        <span className="text-[9px] text-sky-500/50 truncate">{match.venue}</span>
        <span className="text-[9px] text-sky-500/50 ml-auto">{match.date}</span>
      </div>
    </div>
  )
}

function BracketLlavesView() {
  const [knockoutScores, setKnockoutScores] = useState<ScoreState>({})
  const [selectedRound, setSelectedRound] = useState(0)

  const onKnockoutScoreChange = useCallback((id: number, side: 'home' | 'away', val: number) => {
    setKnockoutScores((prev) => {
      const current = prev[id] ?? { home: -1, away: -1 }
      const updated = { ...current, [side]: val }
      if (updated.home === -1 && updated.away === -1) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: updated }
    })
  }, [])

  const currentRound = bracketRounds[selectedRound]

  // Split matches into top/bottom halves for bracket visualization
  const getRoundColor = (idx: number) => {
    const colors = [
      'from-sky-600 to-blue-700',
      'from-violet-600 to-purple-700',
      'from-amber-600 to-orange-700',
      'from-rose-600 to-pink-700',
      'from-emerald-600 to-teal-700',
      'from-amber-400 to-yellow-500',
    ]
    return colors[idx] || colors[0]
  }

  const getRoundIcon = (idx: number) => {
    if (idx === bracketRounds.length - 1) return <Trophy className="w-4 h-4" />
    if (idx === bracketRounds.length - 2) return <Star className="w-4 h-4" />
    return <ArrowRight className="w-4 h-4" />
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Llaves Eliminatorias</h2>
          <p className="text-sm text-gray-500">Simula los resultados de cada llave y avanza en el bracket</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setKnockoutScores({})} className="text-xs">
          <RotateCcw className="w-3 h-3 mr-1" />
          Resetear
        </Button>
      </div>

      {/* Round navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-2">
        {bracketRounds.map((round, idx) => (
          <button
            key={round.shortName}
            onClick={() => setSelectedRound(idx)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200
              ${selectedRound === idx
                ? `bg-gradient-to-r ${getRoundColor(idx)} text-white shadow-lg`
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            <span className="flex items-center gap-1">
              {getRoundIcon(idx)}
              <span>{round.shortName}</span>
            </span>
            <span className="text-[10px] opacity-70 ml-1">({round.matches.length})</span>
          </button>
        ))}
      </div>

      {/* Current round bracket */}
      <motion.div
        key={selectedRound}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0a1628] rounded-2xl p-4 sm:p-6 border border-sky-900/30"
      >
        {/* Round header */}
        <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getRoundColor(selectedRound)} text-white px-4 py-2 rounded-xl mb-4`}>
          {getRoundIcon(selectedRound)}
          <span className="font-bold text-sm">{currentRound.name}</span>
          <Badge className="bg-white/20 text-white border-0 text-[10px]">{currentRound.matches.length} partidos</Badge>
        </div>

        {/* Matches grid */}
        <div className={`grid gap-3 ${
          currentRound.matches.length <= 2 ? 'grid-cols-1 max-w-md mx-auto' :
          currentRound.matches.length <= 4 ? 'grid-cols-1 sm:grid-cols-2' :
          currentRound.matches.length <= 8 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4'
        }`}>
          {currentRound.matches.map((match) => (
            <BracketMatchCard
              key={match.id}
              match={match}
              knockoutScores={knockoutScores}
              onKnockoutScoreChange={onKnockoutScoreChange}
            />
          ))}
        </div>

        {/* Connecting lines visualization (round flow) */}
        <div className="mt-6 flex items-center justify-center gap-1 flex-wrap">
          {bracketRounds.map((round, idx) => (
            <div key={round.shortName} className="flex items-center">
              {idx > 0 && <ArrowRight className="w-3 h-3 text-sky-700 mx-1" />}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold
                ${idx === selectedRound ? `bg-gradient-to-r ${getRoundColor(idx)} text-white` : 'bg-sky-900/30 text-sky-400/50'}`}>
                <span>{round.shortName}</span>
                <span className="opacity-50">{round.matches.length}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Full bracket overview (desktop) */}
      <div className="hidden xl:block">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Bracket Completo</h3>
        <div className="bg-[#0a1628] rounded-2xl p-6 border border-sky-900/30 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {bracketRounds.map((round, roundIdx) => (
              <div key={round.shortName} className="flex flex-col justify-around">
                <div className={`text-[10px] font-bold text-center mb-2 px-2 py-1 rounded-lg bg-gradient-to-r ${getRoundColor(roundIdx)} text-white`}>
                  {round.shortName}
                </div>
                <div className="flex flex-col justify-around flex-1 gap-2">
                  {round.matches.map((match) => (
                    <BracketMatchCard
                      key={match.id}
                      match={match}
                      knockoutScores={knockoutScores}
                      onKnockoutScoreChange={onKnockoutScoreChange}
                    />
                  ))}
                </div>
                {roundIdx < bracketRounds.length - 1 && (
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-sky-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Knockout schedule info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {knockoutSchedule.map((round, idx) => (
          <motion.div
            key={round.round}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`rounded-xl border p-3 ${selectedRound === idx
              ? 'border-amber-300 bg-amber-50 shadow-md'
              : 'border-gray-200 bg-white hover:shadow-sm'}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-r ${getRoundColor(idx)} flex items-center justify-center text-white`}>
                  {getRoundIcon(idx)}
                </div>
                <span className="text-sm font-bold text-gray-900">{round.round}</span>
              </div>
              <Badge variant="secondary" className="text-[10px]">{round.matches} partidos</Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{round.dates}</span>
              {(round.venues || round.venue) && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{round.venues || round.venue}</span>}
            </div>
            {round.desc && <p className="text-[10px] text-gray-400 mt-1">{round.desc}</p>}
          </motion.div>
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

// ==================== Main Page ====================
export default function Home() {
  const [activeTab, setActiveTab] = useState('simulator')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Logo Bar */}
      <div className="bg-[#0a1628] border-b border-sky-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-24.png" alt="24 Horicias" className="h-6 sm:h-8 w-auto" />
          </div>
          <div className="flex items-center gap-2 text-sky-300/50 text-[10px] sm:text-xs">
            <Globe className="w-3 h-3" />
            <span className="hidden sm:inline">{tournamentInfo.host}</span>
            <span className="sm:hidden">USA • MEX • CAN</span>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        <CountdownTimer />
      </div>

      {/* Main Content */}
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
              <span className="hidden sm:inline">Llaves</span>
              <span className="sm:hidden">Llaves</span>
            </TabsTrigger>
            <TabsTrigger value="stadiums"
              className="rounded-lg py-2 sm:py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md">
              <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" alt="Sedes" />
              Sedes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulator"><SimulatorView /></TabsContent>
          <TabsContent value="knockout"><BracketLlavesView /></TabsContent>
          <TabsContent value="stadiums"><StadiumsView /></TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-gradient-to-r from-[#0a1628] via-[#0f2847] to-[#0a1628] text-sky-200/50 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-4 h-4 text-amber-400/80" />
            <span className="text-sm font-bold text-sky-200/70">FIFA World Cup 2026 — Simulador Digital</span>
            <img src="/logo-24.png" alt="24 Horicias" className="h-5 w-auto opacity-60" />
          </div>
          <p className="text-[10px] text-sky-300/30">48 selecciones • 12 grupos • 104 partidos • 16 sedes • 3 países</p>
        </div>
      </footer>
    </div>
  )
}
