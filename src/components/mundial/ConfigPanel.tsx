'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, Save, Loader2, RotateCcw, Check,
  Globe, Trophy, Palette, Bell, Shield, Info,
  Monitor, Sparkles, Type, Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// ==================== Config Defaults ====================
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

interface ConfigPanelProps {
  onConfigChange?: (configs: Record<string, string>) => void
}

export default function ConfigPanel({ onConfigChange }: ConfigPanelProps) {
  const [configs, setConfigs] = useState<Record<string, string>>(DEFAULT_CONFIG)
  const [originalConfigs, setOriginalConfigs] = useState<Record<string, string>>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Load configs
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const res = await fetch('/api/admin/config')
        if (res.ok) {
          const data = await res.json()
          const merged = { ...DEFAULT_CONFIG, ...data }
          setConfigs(merged)
          setOriginalConfigs(merged)
          onConfigChange?.(merged)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    loadConfigs()
  }, [])

  // Detect changes
  useEffect(() => {
    setHasChanges(JSON.stringify(configs) !== JSON.stringify(originalConfigs))
  }, [configs, originalConfigs])

  const updateConfig = useCallback((key: string, value: string) => {
    setConfigs((prev) => ({ ...prev, [key]: value }))
  }, [])

  const saveConfigs = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs }),
      })
      if (res.ok) {
        setOriginalConfigs({ ...configs })
        setSaved(true)
        onConfigChange?.(configs)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  const resetConfigs = () => {
    setConfigs({ ...DEFAULT_CONFIG })
  }

  const resetToSaved = () => {
    setConfigs({ ...originalConfigs })
  }

  if (loading) {
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
            <Settings className="w-6 h-6 text-sky-500" />
            Configuración
          </h2>
          <p className="text-sm text-gray-500">Personaliza el simulador y la apariencia del sitio</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge className="bg-amber-100 text-amber-700 border-0 text-xs animate-pulse">
              Sin guardar
            </Badge>
          )}
          {saved && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-xs text-emerald-600">
              <Check className="w-3.5 h-3.5" /> Guardado
            </motion.div>
          )}
          <Button variant="outline" size="sm" onClick={resetToSaved} className="text-xs" disabled={!hasChanges}>
            <RotateCcw className="w-3 h-3 mr-1" />Descartar
          </Button>
          <Button size="sm" onClick={saveConfigs} disabled={saving || !hasChanges}
            className="text-xs bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold">
            {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
            Guardar
          </Button>
        </div>
      </div>

      {/* Config Sections */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full grid grid-cols-4 h-auto p-1 bg-white rounded-xl shadow-sm border border-gray-200">
          <TabsTrigger value="general" className="rounded-lg py-2 text-xs font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">
            <Globe className="w-3.5 h-3.5 mr-1" />General
          </TabsTrigger>
          <TabsTrigger value="display" className="rounded-lg py-2 text-xs font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md">
            <Monitor className="w-3.5 h-3.5 mr-1" />Pantalla
          </TabsTrigger>
          <TabsTrigger value="simulator" className="rounded-lg py-2 text-xs font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md">
            <Sparkles className="w-3.5 h-3.5 mr-1" />Simulador
          </TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-lg py-2 text-xs font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md">
            <Shield className="w-3.5 h-3.5 mr-1" />Avanzado
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4">
          <ConfigSection title="Información del Sitio" icon={<Info className="w-4 h-4 text-sky-500" />} description="Datos generales del simulador">
            <ConfigField label="Nombre del Sitio" description="Título principal que aparece en el header">
              <Input value={configs.siteName} onChange={(e) => updateConfig('siteName', e.target.value)} className="h-9" />
            </ConfigField>
            <ConfigField label="Descripción" description="Breve descripción que aparece en el footer">
              <Input value={configs.siteDescription} onChange={(e) => updateConfig('siteDescription', e.target.value)} className="h-9" />
            </ConfigField>
            <ConfigField label="Texto del Footer" description="Texto adicional para el footer (opcional)">
              <Input value={configs.footerText} onChange={(e) => updateConfig('footerText', e.target.value)} placeholder="Texto personalizado del footer..." className="h-9" />
            </ConfigField>
          </ConfigSection>

          <ConfigSection title="Cuenta Regresiva" icon={<Trophy className="w-4 h-4 text-amber-500" />} description="Configuración del temporizador">
            <ConfigField label="Fecha de Inicio" description="Fecha de inicio del Mundial">
              <Input type="datetime-local" value={configs.countdownDate?.slice(0, 16)} onChange={(e) => updateConfig('countdownDate', new Date(e.target.value).toISOString())} className="h-9" />
            </ConfigField>
            <ConfigField label="Título Pre-Inicio" description="Texto cuando el Mundial aún no comenzó">
              <Input value={configs.heroTitle} onChange={(e) => updateConfig('heroTitle', e.target.value)} className="h-9" />
            </ConfigField>
            <ConfigField label="Título Post-Inicio" description="Texto cuando el Mundial ya comenzó">
              <Input value={configs.heroStarted} onChange={(e) => updateConfig('heroStarted', e.target.value)} className="h-9" />
            </ConfigField>
          </ConfigSection>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="space-y-4">
          <ConfigSection title="Secciones Visibles" icon={<Monitor className="w-4 h-4 text-violet-500" />} description="Controla qué secciones son visibles">
            <ToggleConfig label="Cuenta Regresiva" description="Mostrar el temporizador en la página principal" value={configs.showCountdown === 'true'} onChange={(v) => updateConfig('showCountdown', v ? 'true' : 'false')} />
            <ToggleConfig label="Fase de Grupos" description="Mostrar la pestaña del simulador de grupos" value={configs.showGroups === 'true'} onChange={(v) => updateConfig('showGroups', v ? 'true' : 'false')} />
            <ToggleConfig label="Llaves Eliminatorias" description="Mostrar la pestaña de llaves" value={configs.showBracket === 'true'} onChange={(v) => updateConfig('showBracket', v ? 'true' : 'false')} />
            <ToggleConfig label="Sedes / Estadios" description="Mostrar la pestaña de estadios" value={configs.showStadiums === 'true'} onChange={(v) => updateConfig('showStadiums', v ? 'true' : 'false')} />
          </ConfigSection>

          <ConfigSection title="Color de Acento" icon={<Palette className="w-4 h-4 text-pink-500" />} description="Color principal del simulador">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[
                { key: 'sky', color: 'bg-sky-500', label: 'Sky' },
                { key: 'emerald', color: 'bg-emerald-500', label: 'Emerald' },
                { key: 'violet', color: 'bg-violet-500', label: 'Violet' },
                { key: 'rose', color: 'bg-rose-500', label: 'Rose' },
                { key: 'amber', color: 'bg-amber-500', label: 'Amber' },
                { key: 'teal', color: 'bg-teal-500', label: 'Teal' },
              ].map((c) => (
                <button key={c.key} onClick={() => updateConfig('accentColor', c.key)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${configs.accentColor === c.key ? 'border-gray-900 bg-gray-50 shadow-md' : 'border-gray-100 hover:border-gray-300'}`}>
                  <div className={`w-8 h-8 rounded-lg ${c.color} ${configs.accentColor === c.key ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`} />
                  <span className="text-[10px] font-bold text-gray-600">{c.label}</span>
                </button>
              ))}
            </div>
          </ConfigSection>
        </TabsContent>

        {/* Simulator Tab */}
        <TabsContent value="simulator" className="space-y-4">
          <ConfigSection title="Simulador de Resultados" icon={<Sparkles className="w-4 h-4 text-emerald-500" />} description="Ajustes del simulador de partidos">
            <ConfigField label="Máximo de Goles" description="Cantidad máxima de goles por equipo (0-20)">
              <Input type="number" min={1} max={20} value={configs.maxGoals} onChange={(e) => updateConfig('maxGoals', e.target.value)} className="h-9 w-24" />
            </ConfigField>
            <ToggleConfig label="Auto-guardado" description="Guardar resultados automáticamente al cambiar" value={configs.enableAutoSave === 'true'} onChange={(v) => updateConfig('enableAutoSave', v ? 'true' : 'false')} />
            <ConfigField label="Delay de Auto-guardado (ms)" description="Milisegundos de espera antes de guardar">
              <Input type="number" min={200} max={5000} step={100} value={configs.autoSaveDelay} onChange={(e) => updateConfig('autoSaveDelay', e.target.value)} className="h-9 w-32" />
            </ConfigField>
          </ConfigSection>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <ConfigSection title="Usuarios y Seguridad" icon={<Shield className="w-4 h-4 text-amber-500" />} description="Configuración de acceso de usuarios">
            <ToggleConfig label="Registro de Usuarios" description="Permitir que nuevos usuarios se registren" value={configs.enableRegistration === 'true'} onChange={(v) => updateConfig('enableRegistration', v ? 'true' : 'false')} />
          </ConfigSection>

          <ConfigSection title="Restaurar" icon={<RotateCcw className="w-4 h-4 text-red-500" />} description="Volver a los valores por defecto">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={resetConfigs} className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                <RotateCcw className="w-3 h-3 mr-1" />Restaurar valores por defecto
              </Button>
              <span className="text-[10px] text-gray-400">Esto no guarda los cambios, solo los pre-carga</span>
            </div>
          </ConfigSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ==================== Helper Sub-Components ====================
function ConfigSection({ title, icon, description, children }: { title: string; icon: React.ReactNode; description: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden border-gray-200/80 shadow-sm">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
        {icon}
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <p className="text-[10px] text-gray-500">{description}</p>
        </div>
      </div>
      <CardContent className="p-4 space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}

function ConfigField({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
      <div className="sm:w-56 flex-shrink-0">
        <label className="text-xs font-bold text-gray-700">{label}</label>
        <p className="text-[10px] text-gray-400">{description}</p>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function ToggleConfig({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <label className="text-xs font-bold text-gray-700">{label}</label>
        <p className="text-[10px] text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${value ? 'bg-emerald-500' : 'bg-gray-300'}`}
      >
        <motion.div
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  )
}
