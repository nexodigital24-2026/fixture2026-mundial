'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, ChevronDown, LogIn, LogOut, Crown,
  Loader2, Eye, EyeOff, UserPlus, Menu, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { signIn, signOut } from 'next-auth/react'
import { tournamentInfo } from '@/lib/tournament-data'

// ==================== Auth Types ====================
interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface HeaderProps {
  user: AuthUser | null
  loading: boolean
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  onRegister: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  onLogout: () => void
  isAdmin: boolean
  siteName: string
}

// ==================== Auth Dialog ====================
function AuthDialog({ mode, onModeChange, onSuccess, loginFn, registerFn }: {
  mode: 'login' | 'register'; onModeChange: (m: 'login' | 'register') => void; onSuccess: () => void;
  loginFn: (e: string, p: string) => Promise<{ success: boolean; error?: string }>;
  registerFn: (n: string, e: string, p: string) => Promise<{ success: boolean; error?: string }>;
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      if (mode === 'login') {
        const result = await loginFn(email, password)
        if (result.success) { onSuccess() } else { setError(result.error || 'Email o contraseña incorrectos') }
      } else {
        const result = await registerFn(name, email, password)
        if (result.success) { onSuccess() } else { setError(result.error || 'Error al registrarse') }
      }
    } catch { setError('Error de conexión') } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'register' && (
        <div><label className="text-xs font-bold text-gray-600 mb-1 block">Nombre</label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required className="h-10" /></div>
      )}
      <div><label className="text-xs font-bold text-gray-600 mb-1 block">Email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required className="h-10" /></div>
      <div><label className="text-xs font-bold text-gray-600 mb-1 block">Contraseña</label>
        <div className="relative"><Input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" required minLength={4} className="h-10 pr-10" /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
      </div>
      {error && <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg p-2"><span className="flex-shrink-0">⚠</span>{error}</div>}
      <Button type="submit" disabled={loading} className="w-full h-10 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold">
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : mode === 'login' ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
        {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </Button>
      <div className="text-center text-xs text-gray-500">
        {mode === 'login' ? <>¿No tienes cuenta? <button type="button" onClick={() => onModeChange('register')} className="text-sky-600 font-bold hover:underline">Regístrate</button></> : <>¿Ya tienes cuenta? <button type="button" onClick={() => onModeChange('login')} className="text-sky-600 font-bold hover:underline">Inicia sesión</button></>}
      </div>
      {mode === 'login' && (
        <div className="text-center text-[10px] text-gray-400 mt-2 bg-gray-50 rounded-lg p-2">
          <strong>Admin:</strong> admin@mundial2026.com / admin123
        </div>
      )}
    </form>
  )
}

// ==================== Header Component ====================
export default function Header({ user, loading, onLogin, onRegister, onLogout, isAdmin, siteName }: HeaderProps) {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg shadow-black/20' : ''}`}>
      {/* Main Header Bar */}
      <div className="bg-gradient-to-r from-[#0a1628] via-[#0f2847] to-[#0a1628] border-b border-sky-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-md shadow-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm font-black text-white leading-none tracking-tight">{siteName || 'Mundial 2026'}</h1>
                  <p className="text-[10px] text-sky-300/50 font-medium">Simulador Digital</p>
                </div>
              </motion.div>
              <img src="/logo-24.png" alt="24 Horicias" className="h-7 sm:h-9 w-auto opacity-80 hidden md:block" />
            </div>

            {/* Desktop Nav Info */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-sky-900/50 text-sky-300/70 border-sky-800/30 text-[10px] font-medium px-2.5 py-0.5">
                  🌎 {tournamentInfo.host}
                </Badge>
                <Badge className="bg-amber-900/40 text-amber-300/70 border-amber-800/30 text-[10px] font-medium px-2.5 py-0.5">
                  📅 {tournamentInfo.startDate}
                </Badge>
              </div>
            </div>

            {/* Right Side - Auth */}
            <div className="flex items-center gap-2">
              {!user ? (
                <Dialog open={authOpen} onOpenChange={setAuthOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold h-8 sm:h-9">
                      <LogIn className="w-3.5 h-3.5 mr-1.5" />
                      <span className="hidden sm:inline">Iniciar Sesión</span>
                      <span className="sm:hidden">Entrar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle className="text-center text-lg font-black">
                      {authMode === 'login' ? '⚽ Iniciar Sesión' : '🆕 Crear Cuenta'}
                    </DialogTitle></DialogHeader>
                    <AuthDialog mode={authMode} onModeChange={setAuthMode} onSuccess={() => setAuthOpen(false)} loginFn={onLogin} registerFn={onRegister} />
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-white/[0.06] backdrop-blur rounded-lg border border-white/[0.08] px-2.5 sm:px-3 py-1.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">{user.name[0]?.toUpperCase()}</div>
                    <span className="text-xs font-medium text-white/80 hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                    {isAdmin && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <Button variant="ghost" size="sm" onClick={onLogout} className="text-sky-300/50 hover:text-white hover:bg-white/10 h-8 w-8 p-0" title="Cerrar sesión">
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-header with tournament stats strip */}
      <div className="bg-[#0d1f3c]/90 border-b border-sky-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-4 text-[10px] sm:text-xs">
              <span className="flex items-center gap-1 text-sky-300/60 whitespace-nowrap">
                <span className="font-black text-white">{tournamentInfo.totalTeams}</span> Selecciones
              </span>
              <span className="text-sky-800">•</span>
              <span className="flex items-center gap-1 text-sky-300/60 whitespace-nowrap">
                <span className="font-black text-white">{tournamentInfo.totalGroups}</span> Grupos
              </span>
              <span className="text-sky-800">•</span>
              <span className="flex items-center gap-1 text-sky-300/60 whitespace-nowrap">
                <span className="font-black text-white">{tournamentInfo.totalMatches}</span> Partidos
              </span>
              <span className="text-sky-800">•</span>
              <span className="flex items-center gap-1 text-sky-300/60 whitespace-nowrap">
                <span className="font-black text-white">{tournamentInfo.venues}</span> Sedes
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-sky-400/40">
              <span>🇲🇽</span><span>🇨🇦</span><span>🇺🇸</span>
              <span className="ml-1">2026</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
