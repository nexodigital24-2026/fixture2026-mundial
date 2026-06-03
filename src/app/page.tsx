'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Calendar, MapPin, ChevronDown, Clock, Globe,
  Zap, ArrowRight, Shield, Star, Users, Landmark,
  RotateCcw, Play, Image as ImageIcon,
  LogIn, LogOut, UserPlus, Settings, Trash2, Save, Check,
  Loader2, AlertCircle, Crown, User,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
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
  type BracketMatch,
  type BracketRound,
} from '@/lib/tournament-data'
import Header from '@/components/mundial/Header'
import Footer from '@/components/mundial/Footer'
import ConfigPanel from '@/components/mundial/ConfigPanel'

// ==================== Auth Context ====================
import { signIn, signOut } from 'next-auth/react'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { checkSession() }, [])

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session')
      if (res.ok) {
        const data = await res.json()
        if (data?.user) {
          setUser({
            id: (data.user as { id: string }).id,
            name: data.user.name || '',
            email: data.user.email || '',
            role: (data.user as { role: string }).role || 'user',
          })
        }
      }
    } catch { /* Not authenticated */ } finally { setLoading(false) }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.ok) { await checkSession(); return { success: true } }
      return { success: false, error: result?.error || 'Email o contraseña incorrectos' }
    } catch { return { success: false, error: 'Error de conexión' } }
  }

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (res.ok) return login(email, password)
      return { success: false, error: data.error || 'Error al registrarse' }
    } catch { return { success: false, error: 'Error de conexión' } }
  }

  const logout = async () => { await signOut({ redirect: false }); setUser(null) }

  return { user, loading, login, register, logout, isAdmin: user?.role === 'admin' }
}

// ==================== Config Hook ====================
const DEFAULT_CONFIG: Record<string, string> = {
  siteName: 'Mundial 2026',
  siteDescription: 'Simulador interactivo del FIFA World Cup 2026. Cuenta regresiva, fase de grupos, llaves eliminatorias y sedes.',
  accentColor: 'sky',
  showCountdown: 'true',
  showStadiums: 'true',
  showBracket: 'true',
  showGroups: 'true',
  maxGoals: '9',
  countdownDate: '2026-06-11T18:00:00Z',
  heroTitle: 'El Mundial comienza en:',
  heroStarted: '¡El Mundial ha comenzado!',
  footerText: '',
  enableRegistration: 'true',
  enableAutoSave: 'true',
  autoSaveDelay: '800',
}

function useConfig() {
  const [configs, setConfigs] = useState<Record<string, string>>(DEFAULT_CONFIG)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/config')
        if (res.ok) {
          const data = await res.json()
          setConfigs((prev) => ({ ...prev, ...data }))
        }
      } catch { /* ignore */ } finally { setLoaded(true) }
    }
    load()
  }, [])

  const updateConfigs = useCallback((newConfigs: Record<string, string>) => {
    setConfigs((prev) => ({ ...prev, ...newConfigs }))
  }, [])

  return { configs, updateConfigs, loaded }
}

// ==================== Simulation Persistence ====================
interface SimData { matchId: number; matchType: string; homeScore: number; awayScore: number }

function useSimulationPersistence(userId: string | null, autoSaveEnabled: boolean, autoSaveDelay: number) {
  const [scores, setScores] = useState<ScoreState>({})
  const [knockoutScores, setKnockoutScores] = useState<ScoreState>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!userId) { setScores({}); setKnockoutScores({}); setIsLoaded(true); return }
    const loadSimulations = async () => {
      try {
        const res = await fetch('/api/simulations')
        if (res.ok) {
          const data: SimData[] = await res.json()
          const newScores: ScoreState = {}
          const newKnockout: ScoreState = {}
          for (const sim of data) {
            if (sim.matchType === 'group') { newScores[sim.matchId] = { home: sim.homeScore, away: sim.awayScore } }
            else { newKnockout[sim.matchId] = { home: sim.homeScore, away: sim.awayScore } }
          }
          setScores(newScores); setKnockoutScores(newKnockout)
        }
      } catch { /* ignore */ } finally { setIsLoaded(true) }
    }
    loadSimulations()
  }, [userId])

  const saveToServer = useCallback(async (matchId: number, matchType: string, homeScore: number, awayScore: number) => {
    if (!userId) return
    try {
      await fetch('/api/simulations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, matchType, homeScore, awayScore }),
      })
    } catch { /* ignore */ }
  }, [userId])

  const onScoreChange = useCallback((id: number, side: 'home' | 'away', val: number) => {
    setScores((prev) => {
      const current = prev[id] ?? { home: -1, away: -1 }
      const updated = { ...current, [side]: val }
      if (updated.home === -1 && updated.away === -1) { const next = { ...prev }; delete next[id]; return next }
      return { ...prev, [id]: updated }
    })
  }, [])

  const onKnockoutScoreChange = useCallback((id: number, side: 'home' | 'away', val: number) => {
    setKnockoutScores((prev) => {
      const current = prev[id] ?? { home: -1, away: -1 }
      const updated = { ...current, [side]: val }
      if (updated.home === -1 && updated.away === -1) { const next = { ...prev }; delete next[id]; return next }
      return { ...prev, [id]: updated }
    })
  }, [])

  useEffect(() => {
    if (!userId || !isLoaded || !autoSaveEnabled) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true)
      const saves: Promise<void>[] = []
      for (const [id, s] of Object.entries(scores)) { if (s.home >= 0 || s.away >= 0) saves.push(saveToServer(Number(id), 'group', s.home, s.away)) }
      for (const [id, s] of Object.entries(knockoutScores)) { if (s.home >= 0 || s.away >= 0) saves.push(saveToServer(Number(id), 'knockout', s.home, s.away)) }
      await Promise.all(saves); setIsSaving(false)
    }, autoSaveDelay)
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current) }
  }, [scores, knockoutScores, userId, isLoaded, saveToServer, autoSaveEnabled, autoSaveDelay])

  const resetScores = useCallback(async () => {
    setScores({}); setKnockoutScores({})
    if (userId) { try { await fetch('/api/simulations', { method: 'DELETE' }) } catch { /* ignore */ } }
  }, [userId])

  return { scores, knockoutScores, onScoreChange, onKnockoutScoreChange, resetScores, isLoaded, isSaving }
}

// ==================== Countdown Timer ====================
function useCountdownDate(configDate: string) {
  return useMemo(() => new Date(configDate).getTime(), [configDate])
}

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; total: number }

function useCountLeft(targetDate: number): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    const diff = Math.max(0, targetDate - Date.now())
    return { days: Math.floor(diff / 864e5), hours: Math.floor((diff / 36e5) % 24), minutes: Math.floor((diff / 6e4) % 60), seconds: Math.floor((diff / 1e3) % 60), total: diff }
  })
  useEffect(() => {
    const id = setInterval(() => {
      const diff = Math.max(0, targetDate - Date.now())
      setTimeLeft({ days: Math.floor(diff / 864e5), hours: Math.floor((diff / 36e5) % 24), minutes: Math.floor((diff / 6e4) % 60), seconds: Math.floor((diff / 1e3) % 60), total: diff })
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return timeLeft
}

function CountdownTimer({ heroTitle, heroStarted }: { heroTitle: string; heroStarted: string }) {
  const t = useCountLeft(useCountdownDate('2026-06-11T18:00:00Z'))
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0f2847] to-[#0a1628]" />
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-400/10 rounded-full blur-[100px]" />
      <div className="relative px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
            </motion.div>
            <div className="hidden sm:block"><img src="/logo-24.png" alt="24 Horicias" className="h-10 w-auto opacity-80" /></div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-sm sm:text-lg font-bold text-white/90 mb-3 sm:mb-4 tracking-wide uppercase">
              {t.total <= 0 ? (heroStarted || '¡El Mundial ha comenzado!') : (heroTitle || 'El Mundial comienza en:')}
            </motion.p>
            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
              {[{ value: t.days, label: 'DÍAS' }, { value: t.hours, label: 'HS' }, { value: t.minutes, label: 'MIN' }, { value: t.seconds, label: 'SEG' }].map((u, i) => (
                <motion.div key={u.label} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.1, type: 'spring' }} className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                    <span className="text-2xl sm:text-4xl font-black text-white tabular-nums">{String(u.value).padStart(2, '0')}</span>
                  </div>
                  <span className="text-[9px] sm:text-xs font-bold text-sky-300/70 mt-1 tracking-wider">{u.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="hidden lg:flex flex-col gap-2">
            {[{ label: 'Selecciones', value: tournamentInfo.totalTeams, icon: <Shield className="w-3.5 h-3.5" /> }, { label: 'Grupos', value: tournamentInfo.totalGroups, icon: <Users className="w-3.5 h-3.5" /> }, { label: 'Partidos', value: tournamentInfo.totalMatches, icon: <Zap className="w-3.5 h-3.5" /> }, { label: 'Sedes', value: tournamentInfo.venues, icon: <Landmark className="w-3.5 h-3.5" /> }].map((s) => (
              <div key={s.label} className="flex items-center gap-2 bg-white/[0.06] backdrop-blur rounded-lg border border-white/[0.08] px-3 py-1.5">
                <span className="text-amber-300/80">{s.icon}</span>
                <span className="text-sm font-black text-white">{s.value}</span>
                <span className="text-[10px] text-sky-200/50">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="grid grid-cols-4 gap-1.5 mt-4 lg:hidden">
          {[{ label: 'Selecciones', value: tournamentInfo.totalTeams, icon: <Shield className="w-3 h-3" /> }, { label: 'Grupos', value: tournamentInfo.totalGroups, icon: <Users className="w-3 h-3" /> }, { label: 'Partidos', value: tournamentInfo.totalMatches, icon: <Zap className="w-3 h-3" /> }, { label: 'Sedes', value: tournamentInfo.venues, icon: <Landmark className="w-3 h-3" /> }].map((s) => (
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

// ==================== Score State & Logic ====================
interface ScoreState { [matchId: number]: { home: number; away: number } }
interface Standing { team: Team; played: number; won: number; drawn: number; lost: number; gf: number; ga: number; pts: number }

function computeStandings(group: Group, scores: ScoreState): Standing[] {
  const map = new Map<string, Standing>()
  for (const t of group.teams) map.set(t.code, { team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 })
  for (const m of group.matches) {
    const s = scores[m.id]; if (!s || s.home < 0 || s.away < 0) continue
    const h = map.get(m.home.code)!, a = map.get(m.away.code)!
    h.played++; a.played++; h.gf += s.home; h.ga += s.away; a.gf += s.away; a.ga += s.home
    if (s.home > s.away) { h.won++; h.pts += 3; a.lost++ } else if (s.home < s.away) { a.won++; a.pts += 3; h.lost++ } else { h.drawn++; a.drawn++; h.pts++; a.pts++ }
  }
  return [...map.values()].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf)
}

function resolveBracket(groupScores: ScoreState, knockoutScores: ScoreState): BracketRound[] {
  // Deep clone bracketRounds
  const resolved: BracketRound[] = JSON.parse(JSON.stringify(bracketRounds))

  // Step 1: Compute standings for all 12 groups
  const standingsMap = new Map<string, Standing[]>()
  for (const group of groups) {
    standingsMap.set(group.id, computeStandings(group, groupScores))
  }

  // Step 2: Resolve group position slots (1° and 2° Grupo X)
  for (const round of resolved) {
    for (const match of round.matches) {
      for (const side of ['home', 'away'] as const) {
        const slot = match[side]
        const pos = slot.position
        const groupPosMatch = pos.match(/^([12])° Grupo ([A-L])$/)
        if (groupPosMatch) {
          const position = parseInt(groupPosMatch[1])
          const groupId = groupPosMatch[2]
          const standings = standingsMap.get(groupId)
          if (standings && standings.length >= position) {
            const team = standings[position - 1].team
            slot.teamCode = team.code
            slot.flag = team.flag
            slot.name = team.name
          }
        }
      }
    }
  }

  // Step 3: Handle 3rd-place teams
  const thirdPlaceEntries: { team: Team; group: string; pts: number; gd: number; gf: number }[] = []
  for (const group of groups) {
    const standings = standingsMap.get(group.id)
    if (standings && standings.length >= 3) {
      const s = standings[2]
      thirdPlaceEntries.push({ team: s.team, group: group.id, pts: s.pts, gd: s.gf - s.ga, gf: s.gf })
    }
  }

  // Rank all 3rd-place teams and select top 8
  thirdPlaceEntries.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
  const qualifiedThird = thirdPlaceEntries.slice(0, 8)

  // Define paths for 3rd-place team assignment
  const pathGroups: Record<string, string[]> = {
    'ABFJ': ['A', 'B', 'F', 'J'],
    'CDE': ['C', 'D', 'E'],
    'GHI': ['G', 'H', 'I'],
    'KLM': ['K', 'L'],
  }

  // For each path, rank qualifying 3rd-place teams within the path
  const pathTeams: Record<string, Team[]> = {}
  for (const [pathKey, groupsList] of Object.entries(pathGroups)) {
    const teams = qualifiedThird
      .filter((t) => groupsList.includes(t.group))
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf)
    pathTeams[pathKey] = teams.map((t) => t.team)
  }

  // Use counters per path to assign teams to bracket slots in order
  const pathCounters: Record<string, number> = { 'ABFJ': 0, 'CDE': 0, 'GHI': 0, 'KLM': 0 }

  // Only resolve 3rd-place slots in the first round (Dieciseisavos)
  for (const match of resolved[0].matches) {
    for (const side of ['home', 'away'] as const) {
      const slot = match[side]
      const pos = slot.position
      const thirdMatch = pos.match(/^3° \(([A-Z]+)\)$/)
      if (thirdMatch) {
        const pathKey = thirdMatch[1]
        const teams = pathTeams[pathKey]
        const counter = pathCounters[pathKey] ?? 0
        if (teams && teams.length > counter) {
          const team = teams[counter]
          slot.teamCode = team.code
          slot.flag = team.flag
          slot.name = team.name
        }
        pathCounters[pathKey] = counter + 1
      }
    }
  }

  // Step 4: Handle knockout advancement (process rounds in order)
  const matchResults = new Map<number, { winner: Team | null; loser: Team | null }>()

  for (const round of resolved) {
    for (const match of round.matches) {
      // First resolve Ganador/Perdedor references for this match's slots
      for (const side of ['home', 'away'] as const) {
        const slot = match[side]
        const pos = slot.position

        const ganadorMatch = pos.match(/^Ganador Match (\d+)$/)
        if (ganadorMatch) {
          const refMatchId = parseInt(ganadorMatch[1])
          const result = matchResults.get(refMatchId)
          if (result?.winner) {
            slot.teamCode = result.winner.code
            slot.flag = result.winner.flag
            slot.name = result.winner.name
          }
        }

        const perdedorMatch = pos.match(/^Perdedor Match (\d+)$/)
        if (perdedorMatch) {
          const refMatchId = parseInt(perdedorMatch[1])
          const result = matchResults.get(refMatchId)
          if (result?.loser) {
            slot.teamCode = result.loser.code
            slot.flag = result.loser.flag
            slot.name = result.loser.name
          }
        }
      }

      // Store match result if score is available and both teams are set
      const score = knockoutScores[match.id]
      const hs = score?.home ?? -1
      const as2 = score?.away ?? -1
      if (hs >= 0 && as2 >= 0 && match.home.teamCode && match.away.teamCode) {
        const homeTeam: Team = { code: match.home.teamCode, flag: match.home.flag, name: match.home.name }
        const awayTeam: Team = { code: match.away.teamCode, flag: match.away.flag, name: match.away.name }
        if (hs > as2) {
          matchResults.set(match.id, { winner: homeTeam, loser: awayTeam })
        } else if (as2 > hs) {
          matchResults.set(match.id, { winner: awayTeam, loser: homeTeam })
        }
        // Draw = no winner stored, user needs to break the tie
      }
    }
  }

  return resolved
}

function ScoreInput({ value, onChange, maxGoals }: { value: number; onChange: (v: number) => void; maxGoals: number }) {
  return (
    <button onClick={() => onChange(value < maxGoals ? value + 1 : -1)}
      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-black text-sm flex items-center justify-center transition-all duration-150 select-none
        ${value >= 0 ? 'bg-gray-900 text-white shadow-md hover:bg-gray-800 active:scale-95' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 active:scale-95'}`}>
      {value >= 0 ? value : '–'}
    </button>
  )
}

function SimulatorMatch({ match, scores, onScoreChange, index, maxGoals }: { match: GroupMatch; scores: ScoreState; onScoreChange: (id: number, side: 'home' | 'away', val: number) => void; index: number; maxGoals: number }) {
  const s = scores[match.id]; const hasScore = s !== undefined && s.home >= 0 && s.away >= 0; const colors = groupColors[match.group]
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}
      className={`rounded-xl border overflow-hidden transition-all ${hasScore ? 'border-emerald-200 shadow-md bg-white' : 'border-gray-200 bg-white hover:shadow-sm'}`}>
      <div className="flex items-center justify-between px-3 py-1 bg-gray-50 border-b border-gray-100">
        <Badge variant="secondary" className={`text-[10px] font-bold bg-gradient-to-r ${colors.headerFrom} ${colors.headerTo} text-white border-0`}>G{match.group}</Badge>
        <div className="flex items-center gap-2 text-gray-400"><span className="text-[10px]">{match.date}</span><span className="text-[10px]">•</span><span className="text-[10px]">{match.time}</span></div>
      </div>
      <div className="flex items-center px-3 py-2 gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0"><span className="text-lg leading-none">{match.home.flag}</span><span className="text-xs font-bold text-gray-900 truncate">{match.home.name}</span></div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <ScoreInput value={s?.home ?? -1} onChange={(v) => onScoreChange(match.id, 'home', v)} maxGoals={maxGoals} />
          <span className="text-xs font-black text-gray-300">-</span>
          <ScoreInput value={s?.away ?? -1} onChange={(v) => onScoreChange(match.id, 'away', v)} maxGoals={maxGoals} />
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end"><span className="text-xs font-bold text-gray-900 truncate text-right">{match.away.name}</span><span className="text-lg leading-none">{match.away.flag}</span></div>
      </div>
      <div className="flex items-center gap-1 px-3 py-1 border-t border-gray-50"><MapPin className="w-2.5 h-2.5 text-gray-300" /><span className="text-[10px] text-gray-400 truncate">{match.venue}</span>{hasScore && <span className="ml-auto text-[10px] text-emerald-500 font-bold">✓</span>}</div>
    </motion.div>
  )
}

function StandingsTable({ standings }: { standings: Standing[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead><tr className="border-b border-gray-200"><th className="text-left py-1.5 px-1 text-gray-400 w-5">#</th><th className="text-left py-1.5 px-1 text-gray-400">Equipo</th><th className="text-center py-1.5 px-1 text-gray-400">PJ</th><th className="text-center py-1.5 px-1 text-gray-400">G</th><th className="text-center py-1.5 px-1 text-gray-400">E</th><th className="text-center py-1.5 px-1 text-gray-400">P</th><th className="text-center py-1.5 px-1 text-gray-400">GF</th><th className="text-center py-1.5 px-1 text-gray-400">GC</th><th className="text-center py-1.5 px-1 text-gray-400">DG</th><th className="text-center py-1.5 px-1 text-gray-400 font-bold">Pts</th></tr></thead>
        <tbody>{standings.map((s, i) => (
          <tr key={s.team.code} className={`border-b border-gray-50 ${i < 2 ? 'bg-emerald-50/50' : i === 2 ? 'bg-amber-50/50' : ''}`}>
            <td className="py-1.5 px-1"><span className={`w-4 h-4 rounded-full inline-flex items-center justify-center text-[9px] font-bold text-white ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-emerald-400' : i === 2 ? 'bg-amber-400' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</span></td>
            <td className="py-1.5 px-1"><div className="flex items-center gap-1"><span className="text-sm">{s.team.flag}</span><span className="font-semibold text-gray-900 truncate max-w-[80px]">{s.team.name}</span></div></td>
            <td className="text-center py-1.5 px-1 text-gray-600">{s.played}</td><td className="text-center py-1.5 px-1 text-gray-600">{s.won}</td><td className="text-center py-1.5 px-1 text-gray-600">{s.drawn}</td><td className="text-center py-1.5 px-1 text-gray-600">{s.lost}</td><td className="text-center py-1.5 px-1 text-gray-600">{s.gf}</td><td className="text-center py-1.5 px-1 text-gray-600">{s.ga}</td>
            <td className="text-center py-1.5 px-1 font-semibold text-gray-700">{s.gf - s.ga > 0 ? '+' : ''}{s.gf - s.ga}</td>
            <td className="text-center py-1.5 px-1 font-black text-gray-900 text-sm">{s.pts}</td>
          </tr>))}</tbody>
      </table>
      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Clasifica</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />Mejor 3ro</span></div>
    </div>
  )
}

function GroupSimulator({ group, scores, onScoreChange, isOpen, onToggle, maxGoals }: { group: Group; scores: ScoreState; onScoreChange: (id: number, side: 'home' | 'away', val: number) => void; isOpen: boolean; onToggle: () => void; maxGoals: number }) {
  const [selectedMD, setSelectedMD] = useState(0)
  const colors = groupColors[group.id]
  const standings = useMemo(() => computeStandings(group, scores), [group, scores])
  const filteredMatches = useMemo(() => selectedMD === 0 ? group.matches : group.matches.filter((m) => m.matchday === selectedMD), [group.matches, selectedMD])
  const playedCount = group.matches.filter((m) => { const s = scores[m.id]; return s !== undefined && s.home >= 0 && s.away >= 0 }).length
  return (
    <motion.div layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden shadow-sm border-gray-200/80">
        <button onClick={onToggle} className={`w-full bg-gradient-to-r ${colors.headerFrom} ${colors.headerTo} text-white px-4 py-2.5 flex items-center justify-between cursor-pointer`}>
          <div className="flex items-center gap-2"><span className="text-base font-black">{group.name}</span><div className="flex -space-x-1">{group.teams.map((t) => <span key={t.code} className="text-sm">{t.flag}</span>)}</div><span className="text-[10px] opacity-70 font-medium">{playedCount}/6</span></div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown className="w-4 h-4" /></motion.div>
        </button>
        <AnimatePresence>{isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <CardContent className="p-0">
              <div className="px-3 pt-3 pb-1"><StandingsTable standings={standings} /></div>
              <Separator />
              <div className="flex border-b border-gray-100">{[{ key: 0, label: 'Todos' }, { key: 1, label: 'F1' }, { key: 2, label: 'F2' }, { key: 3, label: 'F3' }].map((md) => (
                <button key={md.key} onClick={() => setSelectedMD(md.key)} className={`flex-1 py-1.5 text-[11px] font-bold transition-colors ${selectedMD === md.key ? `bg-gradient-to-r ${colors.headerFrom} ${colors.headerTo} text-white` : 'text-gray-400 hover:bg-gray-50'}`}>{md.label}</button>
              ))}</div>
              <div className="p-2.5 space-y-2">{filteredMatches.map((m, i) => <SimulatorMatch key={m.id} match={m} scores={scores} onScoreChange={onScoreChange} index={i} maxGoals={maxGoals} />)}</div>
            </CardContent>
          </motion.div>
        )}</AnimatePresence>
      </Card>
    </motion.div>
  )
}

function SimulatorView({ scores, onScoreChange, resetScores, isSaving, isLoggedIn, maxGoals }: { scores: ScoreState; onScoreChange: (id: number, s: 'home' | 'away', v: number) => void; resetScores: () => void; isSaving: boolean; isLoggedIn: boolean; maxGoals: number }) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['A', 'B', 'C']))
  const toggleGroup = (id: string) => setOpenGroups((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
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
          {isLoggedIn && isSaving && <span className="flex items-center gap-1 text-xs text-amber-600"><Loader2 className="w-3 h-3 animate-spin" />Guardando...</span>}
          {isLoggedIn && !isSaving && totalPlayed > 0 && <span className="flex items-center gap-1 text-xs text-emerald-600"><Check className="w-3 h-3" />Guardado</span>}
          <Badge variant="secondary" className="text-xs font-bold"><Play className="w-3 h-3 mr-1" />{totalPlayed}/{totalMatches}</Badge>
          <Button variant="outline" size="sm" onClick={resetScores} className="text-xs"><RotateCcw className="w-3 h-3 mr-1" />Resetear</Button>
        </div>
      </div>
      <div className="flex items-start gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-3">
        <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700"><strong>Simula el Mundial:</strong> Clic en los cuadros de goles para cargar resultados. {isLoggedIn ? 'Tus resultados se guardan automáticamente.' : 'Inicia sesión para guardar tus resultados.'}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {groups.map((g) => <GroupSimulator key={g.id} group={g} scores={scores} onScoreChange={onScoreChange} isOpen={openGroups.has(g.id)} onToggle={() => toggleGroup(g.id)} maxGoals={maxGoals} />)}
      </div>
    </div>
  )
}

// ==================== Bracket Llaves ====================
function BracketScoreInput({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  const display = value !== null && value >= 0 ? value : '–'
  return (
    <button onClick={() => onChange(value === null ? 0 : value < 9 ? value + 1 : -1)}
      className={`w-7 h-7 rounded-md font-black text-xs flex items-center justify-center transition-all select-none
        ${value !== null && value >= 0 ? 'bg-amber-500 text-white shadow-md hover:bg-amber-400 active:scale-95' : 'bg-gray-800 text-gray-500 hover:bg-gray-700 active:scale-95'}`}>
      {display}
    </button>
  )
}

function BracketMatchCard({ match, knockoutScores, onKnockoutScoreChange }: { match: BracketMatch; knockoutScores: ScoreState; onKnockoutScoreChange: (id: number, side: 'home' | 'away', val: number) => void }) {
  const s = knockoutScores[match.id]; const hs = s?.home ?? -1; const as2 = s?.away ?? -1; const has = hs >= 0 && as2 >= 0; const hw = has && hs > as2; const aw = has && as2 > hs
  const hq = match.home.name !== 'Por definir'
  const aq = match.away.name !== 'Por definir'
  return (
    <div className={`bg-[#0d1b2a] border rounded-lg overflow-hidden shadow-lg min-w-[200px] sm:min-w-[220px] transition-all ${has ? 'border-emerald-500/30' : 'border-sky-900/40'}`}>
      <div className="flex items-center justify-between px-2 py-0.5 bg-sky-900/30 border-b border-sky-900/40"><span className="text-[9px] font-medium text-sky-400/60 truncate">{match.home.position}</span><span className="text-[9px] text-sky-500/40">vs</span><span className="text-[9px] font-medium text-sky-400/60 truncate">{match.away.position}</span></div>
      <div className={`flex items-center gap-1.5 px-2 py-1.5 border-b border-sky-900/30 transition-all ${hw ? 'bg-emerald-900/40' : ''}`}>
        <span className="text-sm leading-none">{match.home.flag}</span>
        {hq && !hw && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />}
        <span className={`text-[11px] font-bold truncate flex-1 ${hw ? 'text-emerald-300' : hq ? 'text-white' : 'text-white/50'}`}>{match.home.name}</span>
        {hw && <ArrowRight className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
        <BracketScoreInput value={hs >= 0 ? hs : null} onChange={(v) => onKnockoutScoreChange(match.id, 'home', v)} />
      </div>
      <div className={`flex items-center gap-1.5 px-2 py-1.5 transition-all ${aw ? 'bg-emerald-900/40' : ''}`}>
        <span className="text-sm leading-none">{match.away.flag}</span>
        {aq && !aw && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />}
        <span className={`text-[11px] font-bold truncate flex-1 ${aw ? 'text-emerald-300' : aq ? 'text-white' : 'text-white/50'}`}>{match.away.name}</span>
        {aw && <ArrowRight className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
        <BracketScoreInput value={as2 >= 0 ? as2 : null} onChange={(v) => onKnockoutScoreChange(match.id, 'away', v)} />
      </div>
      <div className="flex items-center gap-1 px-2 py-0.5 bg-sky-900/20 border-t border-sky-900/30"><MapPin className="w-2.5 h-2.5 text-sky-600" /><span className="text-[9px] text-sky-500/50 truncate">{match.venue}</span><span className="text-[9px] text-sky-500/50 ml-auto">{match.date}</span></div>
    </div>
  )
}

function BracketLlavesView({ knockoutScores, onKnockoutScoreChange, resetScores, isSaving, isLoggedIn, resolvedBracket }: { knockoutScores: ScoreState; onKnockoutScoreChange: (id: number, s: 'home' | 'away', v: number) => void; resetScores: () => void; isSaving: boolean; isLoggedIn: boolean; resolvedBracket: BracketRound[] }) {
  const [selectedRound, setSelectedRound] = useState(0)
  const currentRound = resolvedBracket[selectedRound]
  const getRoundColor = (idx: number) => ['from-sky-600 to-blue-700', 'from-violet-600 to-purple-700', 'from-amber-600 to-orange-700', 'from-rose-600 to-pink-700', 'from-emerald-600 to-teal-700', 'from-amber-400 to-yellow-500'][idx] || 'from-sky-600 to-blue-700'
  const getRoundIcon = (idx: number) => idx === resolvedBracket.length - 1 ? <Trophy className="w-4 h-4" /> : idx === resolvedBracket.length - 2 ? <Star className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div><h2 className="text-2xl font-black text-gray-900">Llaves Eliminatorias</h2><p className="text-sm text-gray-500">Simula los resultados de cada llave y avanza en el bracket</p></div>
        <div className="flex items-center gap-2">
          {isLoggedIn && isSaving && <span className="flex items-center gap-1 text-xs text-amber-600"><Loader2 className="w-3 h-3 animate-spin" />Guardando...</span>}
          <Button variant="outline" size="sm" onClick={resetScores} className="text-xs"><RotateCcw className="w-3 h-3 mr-1" />Resetear</Button>
        </div>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-2">{resolvedBracket.map((round, idx) => (
        <button key={round.shortName} onClick={() => setSelectedRound(idx)} className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedRound === idx ? `bg-gradient-to-r ${getRoundColor(idx)} text-white shadow-lg` : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
          <span className="flex items-center gap-1">{getRoundIcon(idx)}<span>{round.shortName}</span></span><span className="text-[10px] opacity-70 ml-1">({round.matches.length})</span>
        </button>))}</div>
      <motion.div key={selectedRound} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="bg-[#0a1628] rounded-2xl p-4 sm:p-6 border border-sky-900/30">
        <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${getRoundColor(selectedRound)} text-white px-4 py-2 rounded-xl mb-4`}>{getRoundIcon(selectedRound)}<span className="font-bold text-sm">{currentRound.name}</span><Badge className="bg-white/20 text-white border-0 text-[10px]">{currentRound.matches.length} partidos</Badge></div>
        <div className={`grid gap-3 ${currentRound.matches.length <= 2 ? 'grid-cols-1 max-w-md mx-auto' : currentRound.matches.length <= 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {currentRound.matches.map((match) => <BracketMatchCard key={match.id} match={match} knockoutScores={knockoutScores} onKnockoutScoreChange={onKnockoutScoreChange} />)}
        </div>
        <div className="mt-6 flex items-center justify-center gap-1 flex-wrap">{resolvedBracket.map((round, idx) => (
          <div key={round.shortName} className="flex items-center">{idx > 0 && <ArrowRight className="w-3 h-3 text-sky-700 mx-1" />}<div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${idx === selectedRound ? `bg-gradient-to-r ${getRoundColor(idx)} text-white` : 'bg-sky-900/30 text-sky-400/50'}`}><span>{round.shortName}</span><span className="opacity-50">{round.matches.length}</span></div></div>))}</div>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{knockoutSchedule.map((round, idx) => (
        <motion.div key={round.round} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className={`rounded-xl border p-3 ${selectedRound === idx ? 'border-amber-300 bg-amber-50 shadow-md' : 'border-gray-200 bg-white hover:shadow-sm'}`}>
          <div className="flex items-center justify-between mb-1.5"><div className="flex items-center gap-2"><div className={`w-7 h-7 rounded-lg bg-gradient-to-r ${getRoundColor(idx)} flex items-center justify-center text-white`}>{getRoundIcon(idx)}</div><span className="text-sm font-bold text-gray-900">{round.round}</span></div><Badge variant="secondary" className="text-[10px]">{round.matches} partidos</Badge></div>
          <div className="flex items-center gap-3 text-xs text-gray-500"><span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{round.dates}</span>{(round.venues || round.venue) && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{round.venues || round.venue}</span>}</div>
        </motion.div>))}</div>
    </div>
  )
}

// ==================== Stadium Gallery ====================
const countryFlagMap: Record<string, string> = { 'México': '🇲🇽', 'Canadá': '🇨🇦', 'EE.UU.': '🇺🇸' }
function StadiumCard({ venue, index }: { venue: typeof venues[0]; index: number }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img src={venue.image} alt={venue.realName} onLoad={() => setImgLoaded(true)} className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} />
        {!imgLoaded && <div className="absolute inset-0 flex items-center justify-center bg-gray-100"><div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /></div>}
        <div className="absolute top-2 left-2"><span className="text-2xl drop-shadow-lg">{countryFlagMap[venue.country]}</span></div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8"><p className="text-white font-bold text-sm leading-tight">{venue.realName}</p><p className="text-white/70 text-[11px]">{venue.city}, {venue.country}</p></div>
      </div>
    </motion.div>
  )
}
function StadiumsView() {
  return (
    <div className="space-y-8">
      <div><h2 className="text-2xl font-black text-gray-900">Sedes del Mundial</h2><p className="text-sm text-gray-500">16 estadios en 3 países de Norteamérica</p></div>
      {[{ title: 'México', flag: '🇲🇽', items: venues.filter((v) => v.country === 'México'), start: 0 }, { title: 'Canadá', flag: '🇨🇦', items: venues.filter((v) => v.country === 'Canadá'), start: 3 }, { title: 'Estados Unidos', flag: '🇺🇸', items: venues.filter((v) => v.country === 'EE.UU.'), start: 5 }].map((section) => (
        <div key={section.title} className="space-y-3"><div className="flex items-center gap-2"><span className="text-2xl">{section.flag}</span><h3 className="text-lg font-bold text-gray-900">{section.title}</h3><Badge variant="secondary" className="text-xs">{section.items.length} sedes</Badge></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{section.items.map((v, i) => <StadiumCard key={v.name} venue={v} index={section.start + i} />)}</div>
        </div>))}
    </div>
  )
}

// ==================== Admin Panel ====================
interface AdminUser { id: string; name: string; email: string; role: string; createdAt: string; _count: { simulations: number } }
interface AdminStats {
  totalUsers: number; totalAdmins: number; totalSimulations: number; activeUsers: number;
  groupSims: number; knockoutSims: number; newUsersThisWeek: number; newSimsThisWeek: number;
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string; _count: { simulations: number } }[];
  topUsers: { id: string; name: string; email: string; _count: { simulations: number } }[];
}

function AdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminTab, setAdminTab] = useState<'dashboard' | 'users' | 'system'>('dashboard')

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/stats'),
      ])
      if (usersRes.ok) setUsers(await usersRes.json())
      if (statsRes.ok) setStats(await statsRes.json())
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const deleteUser = async (id: string) => {
    if (!confirm('¿Eliminar este usuario y todas sus simulaciones?')) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) { setUsers((prev) => prev.filter((u) => u.id !== id)); loadData() }
  }

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    const res = await fetch(`/api/admin/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: newRole }) })
    if (res.ok) { setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: newRole } : u)); loadData() }
  }

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            Panel de Administración
          </h2>
          <p className="text-sm text-gray-500">Gestiona usuarios, simulaciones y configuración del sistema</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData} className="text-xs">
          <RotateCcw className="w-3 h-3 mr-1" />Actualizar
        </Button>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {[
          { key: 'dashboard' as const, label: 'Dashboard', icon: <Zap className="w-3.5 h-3.5" /> },
          { key: 'users' as const, label: 'Usuarios', icon: <Users className="w-3.5 h-3.5" /> },
          { key: 'system' as const, label: 'Sistema', icon: <Shield className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setAdminTab(tab.key)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${adminTab === tab.key ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {adminTab === 'dashboard' && (
        <div className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <Users className="w-5 h-5 text-sky-500 mx-auto mb-1.5" />
              <p className="text-2xl font-black text-gray-900">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500">Usuarios</p>
              {stats.newUsersThisWeek > 0 && <p className="text-[10px] text-emerald-500 font-bold mt-1">+{stats.newUsersThisWeek} esta semana</p>}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <Shield className="w-5 h-5 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-2xl font-black text-gray-900">{stats.totalSimulations}</p>
              <p className="text-xs text-gray-500">Simulaciones</p>
              {stats.newSimsThisWeek > 0 && <p className="text-[10px] text-emerald-500 font-bold mt-1">+{stats.newSimsThisWeek} esta semana</p>}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <Play className="w-5 h-5 text-violet-500 mx-auto mb-1.5" />
              <p className="text-2xl font-black text-gray-900">{stats.activeUsers}</p>
              <p className="text-xs text-gray-500">Activos</p>
              <p className="text-[10px] text-gray-400 mt-1">{stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% del total</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <Crown className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
              <p className="text-2xl font-black text-gray-900">{stats.totalAdmins}</p>
              <p className="text-xs text-gray-500">Admins</p>
            </motion.div>
          </div>

          {/* Simulation Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="overflow-hidden border-gray-200/80 shadow-sm">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Simulaciones por Tipo</h3>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">Fase de Grupos</span>
                      <span className="font-bold text-gray-900">{stats.groupSims}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-sky-500 to-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${stats.totalSimulations > 0 ? (stats.groupSims / stats.totalSimulations) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">Llaves Eliminatorias</span>
                      <span className="font-bold text-gray-900">{stats.knockoutSims}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-2.5 rounded-full transition-all" style={{ width: `${stats.totalSimulations > 0 ? (stats.knockoutSims / stats.totalSimulations) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-gray-200/80 shadow-sm">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900">Top Simuladores</h3>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2.5">
                  {stats.topUsers.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">Sin datos aún</p>
                  ) : stats.topUsers.map((u, i) => (
                    <div key={u.id} className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-700' : 'bg-gray-300'}`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{u.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-bold">{u._count.simulations} sim</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Users */}
          <Card className="overflow-hidden border-gray-200/80 shadow-sm">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Usuarios Recientes</h3>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {stats.recentUsers.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">Sin usuarios registrados</p>
                ) : stats.recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{u.name?.[0]?.toUpperCase() || '?'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-gray-900 truncate">{u.name}</p>
                        {u.role === 'admin' && <Crown className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                      </div>
                      <p className="text-[10px] text-gray-400 truncate">{u.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-gray-400">{new Date(u.createdAt).toLocaleDateString('es')}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{u._count.simulations} sim</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {adminTab === 'users' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
              <p className="text-lg font-black text-gray-900">{stats.totalUsers}</p>
              <p className="text-[10px] text-gray-500">Total</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
              <p className="text-lg font-black text-emerald-600">{stats.activeUsers}</p>
              <p className="text-[10px] text-gray-500">Activos</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
              <p className="text-lg font-black text-amber-600">{stats.totalAdmins}</p>
              <p className="text-[10px] text-gray-500">Admins</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">Usuarios Registrados</h3>
              <Badge variant="secondary" className="text-[10px]">{users.length} total</Badge>
            </div>
            {users.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No hay usuarios</div>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50 z-10"><tr className="border-b border-gray-100"><th className="text-left py-3 px-4 font-medium text-gray-500">Usuario</th><th className="text-left py-3 px-4 font-medium text-gray-500">Email</th><th className="text-center py-3 px-4 font-medium text-gray-500">Rol</th><th className="text-center py-3 px-4 font-medium text-gray-500">Sim</th><th className="text-center py-3 px-4 font-medium text-gray-500">Registro</th><th className="text-center py-3 px-4 font-medium text-gray-500">Acciones</th></tr></thead>
                  <tbody>{users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-4"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">{u.name?.[0]?.toUpperCase() || '?'}</div><span className="font-medium text-gray-900">{u.name}</span></div></td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{u.email}</td>
                      <td className="py-3 px-4 text-center"><Badge className={`${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'} border-0 text-xs font-bold`}>{u.role === 'admin' ? <><Crown className="w-3 h-3 mr-1" />Admin</> : <><User className="w-3 h-3 mr-1" />User</>}</Badge></td>
                      <td className="py-3 px-4 text-center font-bold text-gray-900">{u._count.simulations}</td>
                      <td className="py-3 px-4 text-center text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString('es')}</td>
                      <td className="py-3 px-4 text-center"><div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => toggleRole(u.id, u.role)} className="text-xs h-7 px-2" title={u.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}><Crown className={`w-3.5 h-3.5 ${u.role === 'admin' ? 'text-amber-500' : 'text-gray-300'}`} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteUser(u.id)} className="text-xs h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50" title="Eliminar"><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div></td>
                    </tr>))}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* System Tab */}
      {adminTab === 'system' && (
        <div className="space-y-4">
          <Card className="overflow-hidden border-gray-200/80 shadow-sm">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Información del Sistema</h3>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                {[
                  { label: 'Plataforma', value: 'Next.js 16 + TypeScript' },
                  { label: 'Base de Datos', value: 'SQLite (Prisma ORM)' },
                  { label: 'Autenticación', value: 'NextAuth.js v4 (JWT)' },
                  { label: 'UI Framework', value: 'Tailwind CSS + shadcn/ui' },
                  { label: 'Animaciones', value: 'Framer Motion' },
                  { label: 'Equipos', value: `${tournamentInfo.totalTeams} selecciones` },
                  { label: 'Grupos', value: `${tournamentInfo.totalGroups} grupos (A-L)` },
                  { label: 'Partidos Grupo', value: '72 (6 por grupo)' },
                  { label: 'Partidos Eliminatoria', value: '32 (16+8+4+2+1+1)' },
                  { label: 'Total Partidos', value: '104' },
                  { label: 'Sedes', value: '16 estadios en 3 países' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-500">{item.label}</span>
                    <span className="text-xs font-bold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-gray-200/80 shadow-sm">
            <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
              <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Seguridad
              </h3>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700">Credenciales de admin ocultas del formulario de login</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700">Contraseñas encriptadas con bcrypt</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700">Sesiones JWT con expiración de 30 días</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700">APIs de admin protegidas por verificación de rol</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700">Panel de admin visible solo para usuarios con rol admin</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-gray-200/80 shadow-sm">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Estructura de Datos</h3>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3 font-mono text-[11px]">
                <div className="bg-gray-900 text-green-400 rounded-lg p-3 overflow-x-auto">
                  <pre>{`models:
  User:
    id        String   @id @default(cuid())
    email     String   @unique
    name      String
    password  String   (bcrypt hashed)
    role      String   ("admin" | "user")
    avatar    String?
    simulations Simulation[]
    createdAt DateTime
    updatedAt DateTime

  Simulation:
    id         String  @id @default(cuid())
    userId     String  → User
    matchId    Int
    matchType  String  ("group" | "knockout")
    homeScore  Int     (-1 = not set)
    awayScore  Int     (-1 = not set)
    @@unique([userId, matchId, matchType])

  Config:
    id    String @id @default(cuid())
    key   String @unique
    value String`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// ==================== Main Page ====================
export default function Home() {
  const { user, loading, login, register, logout, isAdmin } = useAuth()
  const { configs, updateConfigs, loaded: configLoaded } = useConfig()
  const autoSaveEnabled = configs.enableAutoSave !== 'false'
  const autoSaveDelay = parseInt(configs.autoSaveDelay || '800', 10)
  const maxGoals = parseInt(configs.maxGoals || '9', 10)
  const { scores, knockoutScores, onScoreChange, onKnockoutScoreChange, resetScores, isLoaded, isSaving } = useSimulationPersistence(user?.id ?? null, autoSaveEnabled, autoSaveDelay)
  const resolvedBracket = useMemo(() => resolveBracket(scores, knockoutScores), [scores, knockoutScores])
  const [activeTab, setActiveTab] = useState('simulator')

  const handleConfigChange = useCallback((newConfigs: Record<string, string>) => {
    updateConfigs(newConfigs)
  }, [updateConfigs])

  if (loading || !isLoaded || !configLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center"><Loader2 className="w-10 h-10 animate-spin text-sky-500 mx-auto mb-3" /><p className="text-gray-500 font-medium">Cargando simulador...</p></div>
      </div>
    )
  }

  // Determine visible tabs
  const showGroups = configs.showGroups !== 'false'
  const showBracket = configs.showBracket !== 'false'
  const showStadiums = configs.showStadiums !== 'false'
  const showCountdown = configs.showCountdown !== 'false'
  const visibleTabs = [
    showGroups && 'simulator',
    showBracket && 'knockout',
    showStadiums && 'stadiums',
    isAdmin && 'admin',
    isAdmin && 'config',
  ].filter(Boolean) as string[]
  const tabCount = visibleTabs.length

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header
        user={user}
        loading={loading}
        onLogin={login}
        onRegister={register}
        onLogout={logout}
        isAdmin={isAdmin}
        siteName={configs.siteName || 'Mundial 2026'}
      />

      {/* Countdown */}
      {showCountdown && (
        <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-4 sm:pt-5">
          <CountdownTimer heroTitle={configs.heroTitle} heroStarted={configs.heroStarted} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
          <TabsList className={`w-full grid h-auto p-1 bg-white rounded-xl shadow-sm border border-gray-200`} style={{ gridTemplateColumns: `repeat(${tabCount}, 1fr)` }}>
            {showGroups && (
              <TabsTrigger value="simulator" className="rounded-lg py-2 text-xs sm:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                <Play className="w-3.5 h-3.5 mr-1" />Simulador
              </TabsTrigger>
            )}
            {showBracket && (
              <TabsTrigger value="knockout" className="rounded-lg py-2 text-xs sm:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                <Zap className="w-3.5 h-3.5 mr-1" />Llaves
              </TabsTrigger>
            )}
            {showStadiums && (
              <TabsTrigger value="stadiums" className="rounded-lg py-2 text-xs sm:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                <ImageIcon className="w-3.5 h-3.5 mr-1" />Sedes
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="admin" className="rounded-lg py-2 text-xs sm:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                <Crown className="w-3.5 h-3.5 mr-1" />Admin
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger value="config" className="rounded-lg py-2 text-xs sm:text-sm font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                <Settings className="w-3.5 h-3.5 mr-1" />Config
              </TabsTrigger>
            )}
          </TabsList>

          {showGroups && <TabsContent value="simulator"><SimulatorView scores={scores} onScoreChange={onScoreChange} resetScores={resetScores} isSaving={isSaving} isLoggedIn={!!user} maxGoals={maxGoals} /></TabsContent>}
          {showBracket && <TabsContent value="knockout"><BracketLlavesView knockoutScores={knockoutScores} onKnockoutScoreChange={onKnockoutScoreChange} resetScores={resetScores} isSaving={isSaving} isLoggedIn={!!user} resolvedBracket={resolvedBracket} /></TabsContent>}
          {showStadiums && <TabsContent value="stadiums"><StadiumsView /></TabsContent>}
          {isAdmin && <TabsContent value="admin"><AdminPanel /></TabsContent>}
          {isAdmin && <TabsContent value="config"><ConfigPanel onConfigChange={handleConfigChange} /></TabsContent>}
        </Tabs>
      </main>

      {/* Footer */}
      <Footer siteName={configs.siteName || 'Mundial 2026'} siteDescription={configs.siteDescription || ''} />
    </div>
  )
}
