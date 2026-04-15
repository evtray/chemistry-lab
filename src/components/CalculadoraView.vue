<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const categorias = [
  { id: 'u1', label: 'U1: Materia', color: 'bg-blue-500/10 text-blue-700' },
  { id: 'u6', label: 'U6: Estequio.', color: 'bg-teal-500/10 text-teal-700' },
  { id: 'u7', label: 'U7: Gases', color: 'bg-orange-500/10 text-orange-700' },
  { id: 'util', label: 'Utilidades', color: 'bg-purple-500/10 text-purple-700' },
]
const catActiva = ref('u1')

// ─────────────────────────────────────────────
// U1: Densidad (ρ = m/V) — 1 incógnita
// ─────────────────────────────────────────────
const densM = ref(''), densV = ref(''), densRho = ref('')
const densResult = computed(() => {
  const m = parseFloat(densM.value), v = parseFloat(densV.value), rho = parseFloat(densRho.value)
  const f = [densM.value, densV.value, densRho.value].filter(x => x !== '').length
  if (f !== 2) return null
  if (densM.value === '') return { v: 'masa (m)', val: (rho * v).toFixed(4), u: 'g', step: `ρ × V = ${rho} × ${v} = ${(rho*v).toFixed(4)} g` }
  if (densV.value === '') return { v: 'volumen (V)', val: (m / rho).toFixed(4), u: 'mL', step: `m / ρ = ${m} / ${rho} = ${(m/rho).toFixed(4)} mL` }
  return { v: 'densidad (ρ)', val: (m / v).toFixed(4), u: 'g/mL', step: `m / V = ${m} / ${v} = ${(m/v).toFixed(4)} g/mL` }
})

// ─────────────────────────────────────────────
// U1: Gravedad Específica
// ─────────────────────────────────────────────
const geRhoSust = ref(''), geRhoAgua = ref('0.9982')
const geResult = computed(() => {
  const rs = parseFloat(geRhoSust.value), ra = parseFloat(geRhoAgua.value)
  if (!rs || !ra) return null
  const ge = rs / ra
  return { ge: ge.toFixed(4), nota: ge < 1 ? '< 1 → Flota en agua' : ge > 1 ? '> 1 → Se hunde en agua' : '= 1 → Misma densidad que el agua', clase: ge < 1 ? 'text-blue-600' : ge > 1 ? 'text-red-600' : 'text-green-600' }
})

// ─────────────────────────────────────────────
// U1: Concentraciones
// ─────────────────────────────────────────────
const concMode = ref('pmm')
// %m/m
const mmSoluto = ref(''), mmSolucion = ref(''), mmPct = ref('')
const mmResult = computed(() => {
  const ms = parseFloat(mmSoluto.value), mt = parseFloat(mmSolucion.value), p = parseFloat(mmPct.value)
  const f = [mmSoluto.value, mmSolucion.value, mmPct.value].filter(x => x !== '').length
  if (f !== 2) return null
  if (mmSoluto.value === '') return { v: 'm_soluto', val: ((p/100)*mt).toFixed(4), u: 'g', step: `(${p}/100) × ${mt} = ${((p/100)*mt).toFixed(4)} g` }
  if (mmSolucion.value === '') return { v: 'm_solución', val: (ms/(p/100)).toFixed(4), u: 'g', step: `${ms} / (${p}/100) = ${(ms/(p/100)).toFixed(4)} g` }
  return { v: '% m/m', val: ((ms/mt)*100).toFixed(2), u: '%', step: `(${ms}/${mt}) × 100 = ${((ms/mt)*100).toFixed(2)}%` }
})
// %v/v
const vvSoluto = ref(''), vvSolucion = ref(''), vvPct = ref('')
const vvResult = computed(() => {
  const vs = parseFloat(vvSoluto.value), vt = parseFloat(vvSolucion.value), p = parseFloat(vvPct.value)
  const f = [vvSoluto.value, vvSolucion.value, vvPct.value].filter(x => x !== '').length
  if (f !== 2) return null
  if (vvSoluto.value === '') return { v: 'V_soluto', val: ((p/100)*vt).toFixed(4), u: 'mL', step: `(${p}/100) × ${vt} = ${((p/100)*vt).toFixed(4)} mL` }
  if (vvSolucion.value === '') return { v: 'V_solución', val: (vs/(p/100)).toFixed(4), u: 'mL', step: `${vs} / (${p}/100) = ${(vs/(p/100)).toFixed(4)} mL` }
  return { v: '% v/v', val: ((vs/vt)*100).toFixed(2), u: '%', step: `(${vs}/${vt}) × 100 = ${((vs/vt)*100).toFixed(2)}%` }
})
// Dilución
const dilC1 = ref(''), dilV1 = ref(''), dilC2 = ref(''), dilV2 = ref('')
const dilResult = computed(() => {
  const c1 = parseFloat(dilC1.value), v1 = parseFloat(dilV1.value), c2 = parseFloat(dilC2.value), v2 = parseFloat(dilV2.value)
  const f = [dilC1.value, dilV1.value, dilC2.value, dilV2.value].filter(x => x !== '').length
  if (f !== 3) return null
  if (dilC1.value === '') return { v: 'C₁', val: (c2*v2/v1).toFixed(4), u: '(mismas)', step: `C₂V₂/V₁ = (${c2}×${v2})/${v1}` }
  if (dilV1.value === '') return { v: 'V₁', val: (c2*v2/c1).toFixed(4), u: 'mL', step: `C₂V₂/C₁ = (${c2}×${v2})/${c1}` }
  if (dilC2.value === '') return { v: 'C₂', val: (c1*v1/v2).toFixed(4), u: '(mismas)', step: `C₁V₁/V₂ = (${c1}×${v1})/${v2}` }
  return { v: 'V₂', val: (c1*v1/c2).toFixed(4), u: 'mL', step: `C₁V₁/C₂ = (${c1}×${v1})/${c2}` }
})

// ─────────────────────────────────────────────
// U6: Mol ↔ g ↔ partículas
// ─────────────────────────────────────────────
const AVOGADRO = 6.022e23
const molMM = ref('18.015'), molG = ref(''), molMol = ref(''), molPart = ref('')
const molMode = ref('g')
const molResult = computed(() => {
  const mm = parseFloat(molMM.value); if (!mm) return null
  if (molMode.value === 'g') {
    const g = parseFloat(molG.value); if (!g) return null
    const mol = g/mm, part = mol*AVOGADRO
    return { mol: mol.toExponential(4), g: g.toFixed(4), part: part.toExponential(4), steps: [`${g} g ÷ ${mm} g/mol = ${mol.toExponential(3)} mol`, `${mol.toExponential(3)} mol × 6.022×10²³ = ${part.toExponential(3)} partículas`] }
  }
  if (molMode.value === 'mol') {
    const mol = parseFloat(molMol.value); if (!mol) return null
    const g = mol*mm, part = mol*AVOGADRO
    return { mol: mol.toFixed(4), g: g.toFixed(4), part: part.toExponential(4), steps: [`${mol} mol × ${mm} g/mol = ${g.toFixed(3)} g`, `${mol} mol × 6.022×10²³ = ${part.toExponential(3)} partículas`] }
  }
  const part = parseFloat(molPart.value); if (!part) return null
  const mol = part/AVOGADRO, g = mol*mm
  return { mol: mol.toExponential(4), g: g.toExponential(4), part: part.toExponential(4), steps: [`${part.toExponential(3)} ÷ 6.022×10²³ = ${mol.toExponential(3)} mol`, `${mol.toExponential(3)} mol × ${mm} g/mol = ${g.toExponential(3)} g`] }
})

// ─────────────────────────────────────────────
// U6: Reactivo limitante (2 reactivos, 1 producto)
// ─────────────────────────────────────────────
const rlA = ref(''), rlB = ref(''), rlCoefA = ref('1'), rlCoefB = ref('1'), rlCoefP = ref('1'), rlMMA = ref(''), rlMMB = ref(''), rlMMP = ref('')
const rlResult = computed(() => {
  const mA = parseFloat(rlA.value), mB = parseFloat(rlB.value)
  const cA = parseFloat(rlCoefA.value)||1, cB = parseFloat(rlCoefB.value)||1, cP = parseFloat(rlCoefP.value)||1
  const mmA = parseFloat(rlMMA.value), mmB = parseFloat(rlMMB.value), mmP = parseFloat(rlMMP.value)
  if (!mA || !mB || !mmA || !mmB) return null
  const molA = mA/mmA, molB = mB/mmB
  const razA = molA/cA, razB = molB/cB
  const limitante = razA <= razB ? 'A' : 'B'
  const molLim = limitante === 'A' ? molA : molB
  const coefLim = limitante === 'A' ? cA : cB
  const molP = (molLim/coefLim)*cP
  const masaP = mmP ? molP*mmP : null
  return { limitante, razA: razA.toFixed(4), razB: razB.toFixed(4), molP: molP.toFixed(4), masaP: masaP?.toFixed(4), steps: [
    `mol A = ${mA}/${mmA} = ${molA.toFixed(4)} mol`,
    `mol B = ${mB}/${mmB} = ${molB.toFixed(4)} mol`,
    `Razón A = ${molA.toFixed(4)}/${cA} = ${razA.toFixed(4)}`,
    `Razón B = ${molB.toFixed(4)}/${cB} = ${razB.toFixed(4)}`,
    `Limitante: ${limitante} (menor razón)`,
    `mol producto = (${molLim.toFixed(4)}/${coefLim}) × ${cP} = ${molP.toFixed(4)} mol`,
    masaP ? `masa producto = ${molP.toFixed(4)} mol × ${mmP} g/mol = ${masaP} g` : ''
  ].filter(Boolean) }
})

// ─────────────────────────────────────────────
// U7: Gas ideal PV = nRT
// ─────────────────────────────────────────────
const R = 0.08206
const idP = ref(''), idV = ref(''), idN = ref(''), idT = ref('')
const idealResult = computed(() => {
  const P = parseFloat(idP.value), V = parseFloat(idV.value), n = parseFloat(idN.value), T = parseFloat(idT.value)
  const f = [idP.value, idV.value, idN.value, idT.value].filter(x => x !== '').length
  if (f !== 3) return null
  if (idP.value === '') { const r = n*R*T/V; return { v: 'P', val: r.toFixed(4), u: 'atm', step: `nRT/V = (${n}×0.08206×${T})/${V} = ${r.toFixed(4)} atm` } }
  if (idV.value === '') { const r = n*R*T/P; return { v: 'V', val: r.toFixed(4), u: 'L', step: `nRT/P = (${n}×0.08206×${T})/${P} = ${r.toFixed(4)} L` } }
  if (idN.value === '') { const r = P*V/(R*T); return { v: 'n', val: r.toFixed(4), u: 'mol', step: `PV/(RT) = (${P}×${V})/(0.08206×${T}) = ${r.toFixed(4)} mol` } }
  const r = P*V/(n*R); return { v: 'T', val: r.toFixed(4), u: 'K', step: `PV/(nR) = (${P}×${V})/(${n}×0.08206) = ${r.toFixed(4)} K` }
})

// ─────────────────────────────────────────────
// Util: Convertidor de temperatura
// ─────────────────────────────────────────────
const tempVal = ref('25'), tempFrom = ref('C')
const tempResult = computed(() => {
  const v = parseFloat(tempVal.value); if (!Number.isFinite(v)) return null
  let C, K, F
  if (tempFrom.value === 'C') { C=v; K=v+273.15; F=v*1.8+32 }
  else if (tempFrom.value === 'K') { K=v; C=v-273.15; F=C*1.8+32 }
  else { F=v; C=(v-32)/1.8; K=C+273.15 }
  return { C: C.toFixed(3), K: K.toFixed(3), F: F.toFixed(3) }
})

// ─────────────────────────────────────────────
// Util: Conversión de presión
// ─────────────────────────────────────────────
const presVal = ref('1'), presFrom = ref('atm')
const presUnidades = [
  { id: 'atm', label: 'atm', factor: 1 },
  { id: 'mmHg', label: 'mmHg', factor: 1/760 },
  { id: 'kPa', label: 'kPa', factor: 1/101.325 },
  { id: 'bar', label: 'bar', factor: 1/1.01325 },
  { id: 'psi', label: 'psi', factor: 1/14.696 },
]
const presResult = computed(() => {
  const v = parseFloat(presVal.value); if (!v) return null
  const from = presUnidades.find(u => u.id === presFrom.value)
  if (!from) return null
  const enAtm = v * from.factor
  return presUnidades.map(u => ({ id: u.id, label: u.label, val: (enAtm / u.factor).toFixed(5) }))
})
</script>

<template>
  <div class="space-y-4">
    <!-- Selector de categoría -->
    <div class="flex flex-wrap gap-2">
      <Button
        v-for="cat in categorias" :key="cat.id"
        :variant="catActiva === cat.id ? 'default' : 'outline'"
        size="sm"
        @click="catActiva = cat.id"
      >{{ cat.label }}</Button>
    </div>

    <!-- ══ U1: Materia ══ -->
    <template v-if="catActiva === 'u1'">
      <!-- Densidad -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Densidad — ρ = m / V</CardTitle>
          <CardDescription>Deja en blanco la variable a calcular (exactamente 2 de 3).</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="grid gap-3 sm:grid-cols-3">
            <div class="space-y-1"><label class="text-sm font-medium">Masa m (g)</label>
              <input v-model="densM" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div class="space-y-1"><label class="text-sm font-medium">Volumen V (mL)</label>
              <input v-model="densV" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div class="space-y-1"><label class="text-sm font-medium">Densidad ρ (g/mL)</label>
              <input v-model="densRho" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          </div>
          <div v-if="densResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-1">
            <p class="text-xs font-mono text-muted-foreground">{{ densResult.step }}</p>
            <p class="text-xl font-bold text-primary font-mono">{{ densResult.v }} = {{ densResult.val }} {{ densResult.u }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- GE -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Gravedad Específica — GE = ρ_sust / ρ_agua</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-1"><label class="text-sm font-medium">ρ sustancia (g/mL)</label>
              <input v-model="geRhoSust" type="number" step="any" placeholder="ej. 0.789" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div class="space-y-1"><label class="text-sm font-medium">ρ agua (g/mL)</label>
              <input v-model="geRhoAgua" type="number" step="any" placeholder="0.9982" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          </div>
          <div v-if="geResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-1">
            <p class="text-xl font-bold text-primary font-mono">GE = {{ geResult.ge }}</p>
            <p class="text-sm font-medium" :class="geResult.clase">{{ geResult.nota }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Concentraciones -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Concentraciones y Diluciones</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="flex gap-2 flex-wrap">
            <Button v-for="m in [{ id:'pmm', l:'% m/m'}, {id:'pvv', l:'% v/v'}, {id:'dil', l:'Dilución C₁V₁=C₂V₂'}]"
              :key="m.id" :variant="concMode===m.id?'default':'outline'" size="sm" @click="concMode=m.id">{{ m.l }}</Button>
          </div>

          <!-- %m/m -->
          <template v-if="concMode === 'pmm'">
            <div class="grid gap-3 sm:grid-cols-3">
              <div class="space-y-1"><label class="text-sm font-medium">m soluto (g)</label>
                <input v-model="mmSoluto" type="number" step="any" placeholder="vacío" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              <div class="space-y-1"><label class="text-sm font-medium">m solución (g)</label>
                <input v-model="mmSolucion" type="number" step="any" placeholder="vacío" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              <div class="space-y-1"><label class="text-sm font-medium">% m/m</label>
                <input v-model="mmPct" type="number" step="any" placeholder="vacío" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            </div>
            <div v-if="mmResult" class="bg-primary/10 border border-primary/20 rounded p-3">
              <p class="text-xs font-mono text-muted-foreground">{{ mmResult.step }}</p>
              <p class="text-xl font-bold text-primary font-mono">{{ mmResult.v }} = {{ mmResult.val }} {{ mmResult.u }}</p>
            </div>
          </template>

          <!-- %v/v -->
          <template v-if="concMode === 'pvv'">
            <div class="grid gap-3 sm:grid-cols-3">
              <div class="space-y-1"><label class="text-sm font-medium">V soluto (mL)</label>
                <input v-model="vvSoluto" type="number" step="any" placeholder="vacío" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              <div class="space-y-1"><label class="text-sm font-medium">V solución (mL)</label>
                <input v-model="vvSolucion" type="number" step="any" placeholder="vacío" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              <div class="space-y-1"><label class="text-sm font-medium">% v/v</label>
                <input v-model="vvPct" type="number" step="any" placeholder="vacío" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            </div>
            <div v-if="vvResult" class="bg-primary/10 border border-primary/20 rounded p-3">
              <p class="text-xs font-mono text-muted-foreground">{{ vvResult.step }}</p>
              <p class="text-xl font-bold text-primary font-mono">{{ vvResult.v }} = {{ vvResult.val }} {{ vvResult.u }}</p>
            </div>
          </template>

          <!-- Dilución -->
          <template v-if="concMode === 'dil'">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="border rounded p-3 space-y-2">
                <p class="text-xs font-semibold text-muted-foreground uppercase">Inicial (madre)</p>
                <div class="space-y-1"><label class="text-sm font-medium">C₁</label>
                  <input v-model="dilC1" type="number" step="any" placeholder="vacío" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                <div class="space-y-1"><label class="text-sm font-medium">V₁ (mL)</label>
                  <input v-model="dilV1" type="number" step="any" placeholder="vacío" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              </div>
              <div class="border rounded p-3 space-y-2">
                <p class="text-xs font-semibold text-muted-foreground uppercase">Final (diluida)</p>
                <div class="space-y-1"><label class="text-sm font-medium">C₂</label>
                  <input v-model="dilC2" type="number" step="any" placeholder="vacío" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                <div class="space-y-1"><label class="text-sm font-medium">V₂ (mL)</label>
                  <input v-model="dilV2" type="number" step="any" placeholder="vacío" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              </div>
            </div>
            <div v-if="dilResult" class="bg-primary/10 border border-primary/20 rounded p-3">
              <p class="text-xs font-mono text-muted-foreground">{{ dilResult.step }}</p>
              <p class="text-xl font-bold text-primary font-mono">{{ dilResult.v }} = {{ dilResult.val }} {{ dilResult.u }}</p>
            </div>
          </template>
        </CardContent>
      </Card>
    </template>

    <!-- ══ U6: Estequiometría ══ -->
    <template v-if="catActiva === 'u6'">
      <!-- Mol ↔ g ↔ partículas -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Conversión Mol ↔ Gramos ↔ Partículas</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="space-y-1"><label class="text-sm font-medium">Masa molar M (g/mol)</label>
            <input v-model="molMM" type="number" step="any" placeholder="ej. 18.015 para H₂O" class="w-full sm:w-48 rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <div class="flex gap-2 flex-wrap">
            <Button v-for="m in [{id:'g',l:'Dar gramos'},{id:'mol',l:'Dar moles'},{id:'part',l:'Dar partículas'}]"
              :key="m.id" :variant="molMode===m.id?'default':'outline'" size="sm" @click="molMode=m.id">{{ m.l }}</Button>
          </div>
          <div class="space-y-1" v-if="molMode==='g'">
            <label class="text-sm font-medium">Gramos</label>
            <input v-model="molG" type="number" step="any" placeholder="ej. 36.03" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-1" v-if="molMode==='mol'">
            <label class="text-sm font-medium">Moles</label>
            <input v-model="molMol" type="number" step="any" placeholder="ej. 2" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-1" v-if="molMode==='part'">
            <label class="text-sm font-medium">Número de partículas</label>
            <input v-model="molPart" type="number" step="any" placeholder="ej. 1.204e24" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div v-if="molResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-2">
            <p v-for="s in molResult.steps" :key="s" class="text-xs font-mono text-muted-foreground">{{ s }}</p>
            <div class="grid grid-cols-3 gap-2 pt-1">
              <div class="text-center bg-background rounded p-2">
                <p class="text-xs text-muted-foreground">Gramos</p>
                <p class="font-mono font-bold text-sm text-primary">{{ molResult.g }}</p>
              </div>
              <div class="text-center bg-background rounded p-2">
                <p class="text-xs text-muted-foreground">Moles</p>
                <p class="font-mono font-bold text-sm text-primary">{{ molResult.mol }}</p>
              </div>
              <div class="text-center bg-background rounded p-2">
                <p class="text-xs text-muted-foreground">Partículas</p>
                <p class="font-mono font-bold text-sm text-primary">{{ molResult.part }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Reactivo Limitante -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Reactivo Limitante</CardTitle>
          <CardDescription>Ecuación: cA·A + cB·B → cP·P</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="grid gap-3 sm:grid-cols-3">
            <div class="border rounded p-3 space-y-2">
              <p class="text-xs font-semibold text-muted-foreground uppercase">Reactivo A</p>
              <div class="space-y-1"><label class="text-sm font-medium">Masa A (g)</label>
                <input v-model="rlA" type="number" step="any" placeholder="ej. 5.0" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              <div class="space-y-1"><label class="text-sm font-medium">M_A (g/mol)</label>
                <input v-model="rlMMA" type="number" step="any" placeholder="ej. 26.98" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              <div class="space-y-1"><label class="text-sm font-medium">Coef. A (cA)</label>
                <input v-model="rlCoefA" type="number" step="1" placeholder="1" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            </div>
            <div class="border rounded p-3 space-y-2">
              <p class="text-xs font-semibold text-muted-foreground uppercase">Reactivo B</p>
              <div class="space-y-1"><label class="text-sm font-medium">Masa B (g)</label>
                <input v-model="rlB" type="number" step="any" placeholder="ej. 10.0" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              <div class="space-y-1"><label class="text-sm font-medium">M_B (g/mol)</label>
                <input v-model="rlMMB" type="number" step="any" placeholder="ej. 36.46" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              <div class="space-y-1"><label class="text-sm font-medium">Coef. B (cB)</label>
                <input v-model="rlCoefB" type="number" step="1" placeholder="1" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            </div>
            <div class="border rounded p-3 space-y-2">
              <p class="text-xs font-semibold text-muted-foreground uppercase">Producto P</p>
              <div class="space-y-1"><label class="text-sm font-medium">M_P (g/mol) <span class="text-muted-foreground text-xs">(opcional)</span></label>
                <input v-model="rlMMP" type="number" step="any" placeholder="para calcular masa" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              <div class="space-y-1"><label class="text-sm font-medium">Coef. P (cP)</label>
                <input v-model="rlCoefP" type="number" step="1" placeholder="1" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            </div>
          </div>
          <div v-if="rlResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-2">
            <p v-for="s in rlResult.steps" :key="s" class="text-xs font-mono text-muted-foreground">{{ s }}</p>
            <div class="flex gap-3 flex-wrap pt-1">
              <Badge class="text-sm px-3 py-1" :variant="rlResult.limitante === 'A' ? 'destructive' : 'outline'">
                {{ rlResult.limitante === 'A' ? '🔴 A es el limitante' : 'A — en exceso' }}
              </Badge>
              <Badge class="text-sm px-3 py-1" :variant="rlResult.limitante === 'B' ? 'destructive' : 'outline'">
                {{ rlResult.limitante === 'B' ? '🔴 B es el limitante' : 'B — en exceso' }}
              </Badge>
            </div>
            <p class="text-base font-bold text-primary font-mono">mol P = {{ rlResult.molP }} mol<span v-if="rlResult.masaP"> → {{ rlResult.masaP }} g</span></p>
          </div>
        </CardContent>
      </Card>
    </template>

    <!-- ══ U7: Gases ══ -->
    <template v-if="catActiva === 'u7'">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Gas Ideal — PV = nRT</CardTitle>
          <CardDescription>R = 0.08206 L·atm/(mol·K). T en Kelvin. Deja en blanco la variable a calcular.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-1"><label class="text-sm font-medium">P — Presión (atm)</label>
              <input v-model="idP" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div class="space-y-1"><label class="text-sm font-medium">V — Volumen (L)</label>
              <input v-model="idV" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div class="space-y-1"><label class="text-sm font-medium">n — Moles (mol)</label>
              <input v-model="idN" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div class="space-y-1"><label class="text-sm font-medium">T — Temperatura (K)</label>
              <input v-model="idT" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          </div>
          <div v-if="idealResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-1">
            <p class="text-xs font-mono text-muted-foreground">{{ idealResult.step }}</p>
            <p class="text-xl font-bold text-primary font-mono">{{ idealResult.v }} = {{ idealResult.val }} {{ idealResult.u }}</p>
          </div>
          <p v-else class="text-xs text-muted-foreground">Ingresa exactamente 3 de las 4 variables.</p>
        </CardContent>
      </Card>
    </template>

    <!-- ══ Utilidades ══ -->
    <template v-if="catActiva === 'util'">
      <!-- Temperatura -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Conversión de Temperatura</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="grid gap-3 sm:grid-cols-2 items-end">
            <div class="space-y-1"><label class="text-sm font-medium">Valor</label>
              <input v-model="tempVal" type="number" step="any" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div class="flex gap-2">
              <Button v-for="t in [{id:'C',l:'°C'},{id:'K',l:'K'},{id:'F',l:'°F'}]" :key="t.id"
                :variant="tempFrom===t.id?'default':'outline'" size="sm" @click="tempFrom=t.id">{{ t.l }}</Button>
            </div>
          </div>
          <div v-if="tempResult" class="grid grid-cols-3 gap-3">
            <div v-for="t in [{l:'°C',v:tempResult.C,c:'text-blue-600'},{l:'K',v:tempResult.K,c:'text-orange-600'},{l:'°F',v:tempResult.F,c:'text-purple-600'}]"
              :key="t.l" class="text-center border rounded p-3">
              <p class="text-xs text-muted-foreground">{{ t.l }}</p>
              <p class="text-xl font-bold font-mono" :class="t.c">{{ t.v }}</p>
            </div>
          </div>
          <div class="grid gap-1 text-xs font-mono text-muted-foreground">
            <div class="bg-muted rounded px-2 py-1">K = °C + 273.15</div>
            <div class="bg-muted rounded px-2 py-1">°F = °C × 1.8 + 32</div>
            <div class="bg-muted rounded px-2 py-1">°C = (°F − 32) / 1.8</div>
          </div>
        </CardContent>
      </Card>

      <!-- Conversión de presión -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Conversión de Presión</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="grid gap-3 sm:grid-cols-2 items-end">
            <div class="space-y-1"><label class="text-sm font-medium">Valor</label>
              <input v-model="presVal" type="number" step="any" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            <div class="space-y-1"><label class="text-sm font-medium">Unidad de entrada</label>
              <div class="flex flex-wrap gap-1">
                <Button v-for="u in presUnidades" :key="u.id" :variant="presFrom===u.id?'default':'outline'" size="sm" @click="presFrom=u.id">{{ u.label }}</Button>
              </div>
            </div>
          </div>
          <div v-if="presResult" class="grid gap-1">
            <div v-for="u in presResult" :key="u.id" class="flex justify-between items-center bg-muted rounded px-3 py-2">
              <span class="text-sm font-medium">{{ u.label }}</span>
              <span class="font-mono font-bold text-primary">{{ u.val }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
