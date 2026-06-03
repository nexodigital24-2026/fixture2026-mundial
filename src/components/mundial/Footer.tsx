'use client'

import { Trophy, Globe, Mail, ExternalLink } from 'lucide-react'
import { tournamentInfo } from '@/lib/tournament-data'

interface FooterProps {
  siteName: string
  siteDescription: string
}

export default function Footer({ siteName, siteDescription }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-gradient-to-r from-[#0a1628] via-[#0f2847] to-[#0a1628] border-t border-sky-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-6 sm:py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white leading-none">{siteName || 'Mundial 2026'}</h3>
                <p className="text-[10px] text-sky-300/40">Simulador Digital</p>
              </div>
            </div>
            <p className="text-[11px] text-sky-200/40 leading-relaxed max-w-xs">
              {siteDescription || 'Simulador interactivo del FIFA World Cup 2026. Cuenta regresiva, fase de grupos, llaves eliminatorias y sedes.'}
            </p>
            <div className="mt-3">
              <img src="/logo-24.png" alt="24 Horicias" className="h-7 w-auto opacity-50 hover:opacity-80 transition-opacity" />
            </div>
          </div>

          {/* Tournament Info Column */}
          <div>
            <h4 className="text-xs font-bold text-sky-200/60 uppercase tracking-wider mb-3">Torneo</h4>
            <ul className="space-y-1.5">
              {[
                { label: 'Sede', value: tournamentInfo.host },
                { label: 'Inicio', value: tournamentInfo.startDate },
                { label: 'Final', value: tournamentInfo.finalDate },
                { label: 'Selecciones', value: String(tournamentInfo.totalTeams) },
                { label: 'Partidos', value: String(tournamentInfo.totalMatches) },
              ].map((item) => (
                <li key={item.label} className="flex items-center justify-between text-[11px]">
                  <span className="text-sky-300/40">{item.label}</span>
                  <span className="text-sky-200/70 font-medium">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Countries Column */}
          <div>
            <h4 className="text-xs font-bold text-sky-200/60 uppercase tracking-wider mb-3">Sedes</h4>
            <div className="space-y-2">
              {[
                { flag: '🇲🇽', country: 'México', cities: 'CDMX, Guadalajara, Monterrey', stadiums: 3 },
                { flag: '🇨🇦', country: 'Canadá', cities: 'Toronto, Vancouver', stadiums: 2 },
                { flag: '🇺🇸', country: 'Estados Unidos', cities: '11 ciudades', stadiums: 11 },
              ].map((item) => (
                <div key={item.country} className="flex items-start gap-2">
                  <span className="text-lg leading-none">{item.flag}</span>
                  <div>
                    <p className="text-[11px] font-medium text-sky-200/70">{item.country}</p>
                    <p className="text-[10px] text-sky-300/40">{item.cities} · {item.stadiums} estadios</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sky-900/20 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-sky-300/30 text-center sm:text-left">
              © {currentYear} {siteName || 'Mundial 2026 Simulador'}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-3 text-[10px] text-sky-300/30">
              <span>48 selecciones</span>
              <span className="text-sky-700">•</span>
              <span>12 grupos</span>
              <span className="text-sky-700">•</span>
              <span>104 partidos</span>
              <span className="text-sky-700">•</span>
              <span>16 sedes</span>
              <span className="text-sky-700">•</span>
              <span>3 países</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
