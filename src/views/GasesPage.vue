<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-vue-next'

// ──────────────────────────────────────────────
// Tab 1: Calculadoras de leyes de gases
// ──────────────────────────────────────────────
const leyActiva = ref('ideal')

// Ley de Boyle: P1V1 = P2V2
const bp1 = ref(''), bv1 = ref(''), bp2 = ref(''), bv2 = ref('')
const boylerResult = computed(() => {
  const p1 = parseFloat(bp1.value), v1 = parseFloat(bv1.value)
  const p2 = parseFloat(bp2.value), v2 = parseFloat(bv2.value)
  const filled = [bp1.value, bv1.value, bp2.value, bv2.value].filter(x => x !== '').length
  if (filled !== 3) return null
  if (bp1.value === '') return { v: 'P₁', val: (p2 * v2 / v1).toFixed(4), u: 'atm', steps: [`P₁ = P₂V₂/V₁ = (${p2}×${v2})/${v1}`, `P₁ = ${(p2 * v2 / v1).toFixed(4)} atm`] }
  if (bv1.value === '') return { v: 'V₁', val: (p2 * v2 / p1).toFixed(4), u: 'L', steps: [`V₁ = P₂V₂/P₁ = (${p2}×${v2})/${p1}`, `V₁ = ${(p2 * v2 / p1).toFixed(4)} L`] }
  if (bp2.value === '') return { v: 'P₂', val: (p1 * v1 / v2).toFixed(4), u: 'atm', steps: [`P₂ = P₁V₁/V₂ = (${p1}×${v1})/${v2}`, `P₂ = ${(p1 * v1 / v2).toFixed(4)} atm`] }
  if (bv2.value === '') return { v: 'V₂', val: (p1 * v1 / p2).toFixed(4), u: 'L', steps: [`V₂ = P₁V₁/P₂ = (${p1}×${v1})/${p2}`, `V₂ = ${(p1 * v1 / p2).toFixed(4)} L`] }
  return null
})

// Ley de Charles: V1/T1 = V2/T2
const cv1 = ref(''), ct1 = ref(''), cv2 = ref(''), ct2 = ref('')
const charlesResult = computed(() => {
  const v1 = parseFloat(cv1.value), t1 = parseFloat(ct1.value)
  const v2 = parseFloat(cv2.value), t2 = parseFloat(ct2.value)
  const filled = [cv1.value, ct1.value, cv2.value, ct2.value].filter(x => x !== '').length
  if (filled !== 3) return null
  if (cv1.value === '') return { v: 'V₁', val: (v2 * t1 / t2).toFixed(4), u: 'L', steps: [`V₁ = V₂·T₁/T₂ = (${v2}×${t1})/${t2}`, `V₁ = ${(v2 * t1 / t2).toFixed(4)} L`] }
  if (ct1.value === '') return { v: 'T₁', val: (t2 * v1 / v2).toFixed(4), u: 'K', steps: [`T₁ = T₂·V₁/V₂ = (${t2}×${v1})/${v2}`, `T₁ = ${(t2 * v1 / v2).toFixed(4)} K`] }
  if (cv2.value === '') return { v: 'V₂', val: (v1 * t2 / t1).toFixed(4), u: 'L', steps: [`V₂ = V₁·T₂/T₁ = (${v1}×${t2})/${t1}`, `V₂ = ${(v1 * t2 / t1).toFixed(4)} L`] }
  if (ct2.value === '') return { v: 'T₂', val: (t1 * v2 / v1).toFixed(4), u: 'K', steps: [`T₂ = T₁·V₂/V₁ = (${t1}×${v2})/${v1}`, `T₂ = ${(t1 * v2 / v1).toFixed(4)} K`] }
  return null
})

// Ley Combinada: P1V1/T1 = P2V2/T2
const lcp1 = ref(''), lcv1 = ref(''), lct1 = ref(''), lcp2 = ref(''), lcv2 = ref(''), lct2 = ref('')
const combinadaResult = computed(() => {
  const p1 = parseFloat(lcp1.value), v1 = parseFloat(lcv1.value), t1 = parseFloat(lct1.value)
  const p2 = parseFloat(lcp2.value), v2 = parseFloat(lcv2.value), t2 = parseFloat(lct2.value)
  const filled = [lcp1.value, lcv1.value, lct1.value, lcp2.value, lcv2.value, lct2.value].filter(x => x !== '').length
  if (filled !== 5) return null
  if (lcp1.value === '') { const r = p2 * v2 * t1 / (v1 * t2); return { v: 'P₁', val: r.toFixed(4), u: 'atm', steps: [`P₁ = P₂V₂T₁/(V₁T₂)`, `= (${p2}×${v2}×${t1})/(${v1}×${t2}) = ${r.toFixed(4)} atm`] } }
  if (lcv1.value === '') { const r = p2 * v2 * t1 / (p1 * t2); return { v: 'V₁', val: r.toFixed(4), u: 'L', steps: [`V₁ = P₂V₂T₁/(P₁T₂) = ${r.toFixed(4)} L`] } }
  if (lct1.value === '') { const r = p1 * v1 * t2 / (p2 * v2); return { v: 'T₁', val: r.toFixed(4), u: 'K', steps: [`T₁ = P₁V₁T₂/(P₂V₂) = ${r.toFixed(4)} K`] } }
  if (lcp2.value === '') { const r = p1 * v1 * t2 / (v2 * t1); return { v: 'P₂', val: r.toFixed(4), u: 'atm', steps: [`P₂ = P₁V₁T₂/(V₂T₁) = ${r.toFixed(4)} atm`] } }
  if (lcv2.value === '') { const r = p1 * v1 * t2 / (p2 * t1); return { v: 'V₂', val: r.toFixed(4), u: 'L', steps: [`V₂ = P₁V₁T₂/(P₂T₁) = ${r.toFixed(4)} L`] } }
  if (lct2.value === '') { const r = p2 * v2 * t1 / (p1 * v1); return { v: 'T₂', val: r.toFixed(4), u: 'K', steps: [`T₂ = P₂V₂T₁/(P₁V₁) = ${r.toFixed(4)} K`] } }
  return null
})

// Gas Ideal: PV = nRT
const R = 0.08206
const idP = ref(''), idV = ref(''), idN = ref(''), idT = ref('')
const idealResult = computed(() => {
  const P = parseFloat(idP.value), V = parseFloat(idV.value)
  const n = parseFloat(idN.value), T = parseFloat(idT.value)
  const filled = [idP.value, idV.value, idN.value, idT.value].filter(x => x !== '').length
  if (filled !== 3) return null
  if (idP.value === '') { const r = n * R * T / V; return { v: 'P', val: r.toFixed(4), u: 'atm', steps: [`P = nRT/V = (${n}×0.08206×${T})/${V}`, `P = ${r.toFixed(4)} atm`] } }
  if (idV.value === '') { const r = n * R * T / P; return { v: 'V', val: r.toFixed(4), u: 'L', steps: [`V = nRT/P = (${n}×0.08206×${T})/${P}`, `V = ${r.toFixed(4)} L`] } }
  if (idN.value === '') { const r = P * V / (R * T); return { v: 'n', val: r.toFixed(4), u: 'mol', steps: [`n = PV/(RT) = (${P}×${V})/(0.08206×${T})`, `n = ${r.toFixed(4)} mol`] } }
  if (idT.value === '') { const r = P * V / (n * R); return { v: 'T', val: r.toFixed(4), u: 'K', steps: [`T = PV/(nR) = (${P}×${V})/(${n}×0.08206)`, `T = ${r.toFixed(4)} K`] } }
  return null
})

// Graham: r1/r2 = √(M2/M1)
const gM1 = ref(''), gM2 = ref(''), gR1 = ref('')
const grahamResult = computed(() => {
  const m1 = parseFloat(gM1.value), m2 = parseFloat(gM2.value), r1 = parseFloat(gR1.value)
  if (!m1 || !m2) return null
  const razon = Math.sqrt(m2 / m1)
  const r2 = r1 ? r1 / razon : null
  return {
    razon: razon.toFixed(4),
    r2: r2?.toFixed(4),
    masRapido: m1 < m2 ? `Gas 1 (M=${m1}) difunde ${razon.toFixed(2)}× más rápido` : `Gas 2 (M=${m2}) difunde ${(1 / razon).toFixed(2)}× más rápido`,
    steps: [
      `r₁/r₂ = √(M₂/M₁) = √(${m2}/${m1})`,
      `r₁/r₂ = ${razon.toFixed(4)}`,
      r2 ? `r₂ = r₁ / (r₁/r₂) = ${r1} / ${razon.toFixed(4)} = ${r2.toFixed(4)}` : '(ingresa r₁ para calcular r₂)'
    ]
  }
})

// Dalton: presiones parciales
const daltonGases = ref([
  { nombre: 'N₂', n: '0.6', mm: '28' },
  { nombre: 'O₂', n: '0.2', mm: '32' },
  { nombre: 'Ar', n: '0.2', mm: '40' },
])
const daltonPtotal = ref('1.0')

const daltonResult = computed(() => {
  const gases = daltonGases.value.map(g => ({ ...g, nVal: parseFloat(g.n) }))
  const nTotal = gases.reduce((s, g) => s + (g.nVal || 0), 0)
  const Pt = parseFloat(daltonPtotal.value)
  if (!nTotal || !Pt) return null
  return gases.map(g => ({
    ...g,
    xi: g.nVal / nTotal,
    Pi: (g.nVal / nTotal) * Pt
  }))
})

// ──────────────────────────────────────────────
// Tab 2: Quiz
// ──────────────────────────────────────────────
const preguntasGases = [
  { texto: 'A temperatura constante, un gas pasa de 2 L a 4 L. Su presión...', opciones: ['Se duplica', 'Se reduce a la mitad', 'No cambia'], correcta: 'Se reduce a la mitad', hint: 'Ley de Boyle: P₁V₁ = P₂V₂. Si V↑2×, P↓2×.' },
  { texto: 'Un gas a 300 K ocupa 10 L. A 600 K (presión cte), ocupa...', opciones: ['5 L', '20 L', '10 L'], correcta: '20 L', hint: 'Ley de Charles: V₁/T₁ = V₂/T₂. T↑2× → V↑2×.' },
  { texto: '¿Cuántos litros ocupa 1 mol de gas ideal a CNTP (0°C, 1 atm)?', opciones: ['22.4 L', '24.5 L', '18 L'], correcta: '22.4 L', hint: 'Ley de Avogadro: 1 mol = 22.4 L a CNTP (0°C, 1 atm).' },
  { texto: 'En la ley del gas ideal PV = nRT, el valor de R en L·atm/(mol·K) es...', opciones: ['0.08206', '8.314', '1.987'], correcta: '0.08206', hint: 'R = 0.08206 L·atm/(mol·K). El 8.314 es en J/(mol·K).' },
  { texto: 'En una mezcla, P_total = 2 atm. Si χ(O₂) = 0.3, la presión parcial de O₂ es...', opciones: ['0.6 atm', '1.4 atm', '0.3 atm'], correcta: '0.6 atm', hint: 'Ley de Dalton: P_O₂ = χ_O₂ × P_total = 0.3 × 2 = 0.6 atm.' },
  { texto: 'H₂ (M=2) y O₂ (M=32). Según Graham, H₂ difunde...', opciones: ['4× más rápido', '16× más rápido', '2× más rápido'], correcta: '4× más rápido', hint: 'r₁/r₂ = √(32/2) = √16 = 4.' },
  { texto: '¿Cómo se convierte de °C a K?', opciones: ['K = °C + 273.15', 'K = °C − 273.15', 'K = °C × 273'], correcta: 'K = °C + 273.15', hint: 'En las leyes de gases SIEMPRE se usa Kelvin: K = °C + 273.15.' },
  { texto: 'Un gas a 1 atm y 300 K. Se aumenta T a 600 K y se comprime a 2 atm. El volumen...', opciones: ['No cambia', 'Se duplica', 'Se reduce a la mitad'], correcta: 'No cambia', hint: 'Ley combinada: P₁V₁/T₁ = P₂V₂/T₂. P↑2×, T↑2× → V igual.' },
]

const qgIdx = ref(0)
const qgResp = ref(null)
const qgScore = ref(0)
const qgShuffled = ref([...preguntasGases].sort(() => Math.random() - 0.5))
const qgTerminado = computed(() => qgIdx.value >= qgShuffled.value.length)
const qgActual = computed(() => qgShuffled.value[qgIdx.value])

function qgResponder(op) {
  if (qgResp.value !== null) return
  qgResp.value = op
  if (op === qgActual.value.correcta) qgScore.value++
  setTimeout(() => { qgIdx.value++; qgResp.value = null }, 1600)
}
function qgReiniciar() {
  qgShuffled.value = [...preguntasGases].sort(() => Math.random() - 0.5)
  qgIdx.value = 0; qgResp.value = null; qgScore.value = 0
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold">Gases</h1>
      <p class="text-sm text-muted-foreground mt-1">Unidad 7 — Leyes de gases con solución paso a paso</p>
    </div>

    <Tabs default-value="calculadoras">
      <TabsList class="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="calculadoras">Calculadoras</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
        <TabsTrigger value="leyes">Resumen de Leyes</TabsTrigger>
        <TabsTrigger value="unidades">Unidades</TabsTrigger>
      </TabsList>

      <!-- ── CALCULADORAS ── -->
      <TabsContent value="calculadoras" class="mt-4 space-y-4">
        <!-- Selector de ley -->
        <div class="flex flex-wrap gap-2">
          <Button v-for="l in [
            { id: 'boyle', label: 'Boyle' },
            { id: 'charles', label: 'Charles' },
            { id: 'combinada', label: 'Combinada' },
            { id: 'ideal', label: 'Gas Ideal (PV=nRT)' },
            { id: 'graham', label: 'Graham' },
            { id: 'dalton', label: 'Dalton' },
          ]" :key="l.id"
            :variant="leyActiva === l.id ? 'default' : 'outline'"
            size="sm"
            @click="leyActiva = l.id">
            {{ l.label }}
          </Button>
        </div>

        <!-- Boyle -->
        <Card v-if="leyActiva === 'boyle'">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Ley de Boyle — P₁V₁ = P₂V₂</CardTitle>
            <CardDescription>T y n constantes. Deja en blanco la variable a calcular.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="space-y-2 border rounded p-3">
                <p class="text-xs font-semibold text-muted-foreground uppercase">Estado 1</p>
                <div class="space-y-1">
                  <label class="text-sm font-medium">P₁ (atm)</label>
                  <input v-model="bp1" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div class="space-y-1">
                  <label class="text-sm font-medium">V₁ (L)</label>
                  <input v-model="bv1" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div class="space-y-2 border rounded p-3">
                <p class="text-xs font-semibold text-muted-foreground uppercase">Estado 2</p>
                <div class="space-y-1">
                  <label class="text-sm font-medium">P₂ (atm)</label>
                  <input v-model="bp2" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div class="space-y-1">
                  <label class="text-sm font-medium">V₂ (L)</label>
                  <input v-model="bv2" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>
            <div v-if="boylerResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-1">
              <p v-for="s in boylerResult.steps" :key="s" class="text-xs font-mono text-muted-foreground">{{ s }}</p>
              <p class="text-xl font-bold text-primary font-mono">{{ boylerResult.v }} = {{ boylerResult.val }} {{ boylerResult.u }}</p>
            </div>
            <p v-else class="text-xs text-muted-foreground">Ingresa exactamente 3 de las 4 variables.</p>
          </CardContent>
        </Card>

        <!-- Charles -->
        <Card v-if="leyActiva === 'charles'">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Ley de Charles — V₁/T₁ = V₂/T₂</CardTitle>
            <CardDescription>P y n constantes. Temperatura en Kelvin (K = °C + 273.15).</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="space-y-2 border rounded p-3">
                <p class="text-xs font-semibold text-muted-foreground uppercase">Estado 1</p>
                <div class="space-y-1"><label class="text-sm font-medium">V₁ (L)</label>
                  <input v-model="cv1" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                <div class="space-y-1"><label class="text-sm font-medium">T₁ (K)</label>
                  <input v-model="ct1" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              </div>
              <div class="space-y-2 border rounded p-3">
                <p class="text-xs font-semibold text-muted-foreground uppercase">Estado 2</p>
                <div class="space-y-1"><label class="text-sm font-medium">V₂ (L)</label>
                  <input v-model="cv2" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                <div class="space-y-1"><label class="text-sm font-medium">T₂ (K)</label>
                  <input v-model="ct2" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              </div>
            </div>
            <div v-if="charlesResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-1">
              <p v-for="s in charlesResult.steps" :key="s" class="text-xs font-mono text-muted-foreground">{{ s }}</p>
              <p class="text-xl font-bold text-primary font-mono">{{ charlesResult.v }} = {{ charlesResult.val }} {{ charlesResult.u }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Combinada -->
        <Card v-if="leyActiva === 'combinada'">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Ley Combinada — P₁V₁/T₁ = P₂V₂/T₂</CardTitle>
            <CardDescription>n constante. Temperatura en K. Deja en blanco la variable a calcular.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="space-y-2 border rounded p-3">
                <p class="text-xs font-semibold text-muted-foreground uppercase">Estado 1</p>
                <div class="space-y-1"><label class="text-sm font-medium">P₁ (atm)</label>
                  <input v-model="lcp1" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                <div class="space-y-1"><label class="text-sm font-medium">V₁ (L)</label>
                  <input v-model="lcv1" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                <div class="space-y-1"><label class="text-sm font-medium">T₁ (K)</label>
                  <input v-model="lct1" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              </div>
              <div class="space-y-2 border rounded p-3">
                <p class="text-xs font-semibold text-muted-foreground uppercase">Estado 2</p>
                <div class="space-y-1"><label class="text-sm font-medium">P₂ (atm)</label>
                  <input v-model="lcp2" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                <div class="space-y-1"><label class="text-sm font-medium">V₂ (L)</label>
                  <input v-model="lcv2" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                <div class="space-y-1"><label class="text-sm font-medium">T₂ (K)</label>
                  <input v-model="lct2" type="number" step="any" placeholder="vacío = calcular" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              </div>
            </div>
            <div v-if="combinadaResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-1">
              <p v-for="s in combinadaResult.steps" :key="s" class="text-xs font-mono text-muted-foreground">{{ s }}</p>
              <p class="text-xl font-bold text-primary font-mono">{{ combinadaResult.v }} = {{ combinadaResult.val }} {{ combinadaResult.u }}</p>
            </div>
            <p v-else class="text-xs text-muted-foreground">Ingresa exactamente 5 de las 6 variables.</p>
          </CardContent>
        </Card>

        <!-- Gas Ideal -->
        <Card v-if="leyActiva === 'ideal'">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Ley del Gas Ideal — PV = nRT</CardTitle>
            <CardDescription>R = 0.08206 L·atm/(mol·K). T en K, P en atm, V en L.</CardDescription>
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
              <p v-for="s in idealResult.steps" :key="s" class="text-xs font-mono text-muted-foreground">{{ s }}</p>
              <p class="text-xl font-bold text-primary font-mono">{{ idealResult.v }} = {{ idealResult.val }} {{ idealResult.u }}</p>
            </div>
            <p v-else class="text-xs text-muted-foreground">Ingresa exactamente 3 de las 4 variables.</p>
          </CardContent>
        </Card>

        <!-- Graham -->
        <Card v-if="leyActiva === 'graham'">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Ley de Graham — r₁/r₂ = √(M₂/M₁)</CardTitle>
            <CardDescription>La efusión es inversamente proporcional a √M. Ingresa masas molares y opcionalmente la velocidad r₁.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid gap-3 sm:grid-cols-3">
              <div class="space-y-1"><label class="text-sm font-medium">M₁ (g/mol) — Gas 1</label>
                <input v-model="gM1" type="number" step="any" placeholder="ej. 2 (H₂)" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              <div class="space-y-1"><label class="text-sm font-medium">M₂ (g/mol) — Gas 2</label>
                <input v-model="gM2" type="number" step="any" placeholder="ej. 32 (O₂)" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
              <div class="space-y-1"><label class="text-sm font-medium">r₁ (opcional)</label>
                <input v-model="gR1" type="number" step="any" placeholder="para calcular r₂" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" /></div>
            </div>
            <div v-if="grahamResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-2">
              <p v-for="s in grahamResult.steps" :key="s" class="text-xs font-mono text-muted-foreground">{{ s }}</p>
              <p class="text-base font-semibold">{{ grahamResult.masRapido }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Dalton -->
        <Card v-if="leyActiva === 'dalton'">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Ley de Dalton — Presiones parciales</CardTitle>
            <CardDescription>P_i = χ_i × P_total  donde  χ_i = n_i / n_total</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="space-y-1">
              <label class="text-sm font-medium">P_total (atm)</label>
              <input v-model="daltonPtotal" type="number" step="any" class="w-full sm:w-40 rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div class="space-y-2">
              <p class="text-sm font-medium">Gases en la mezcla (moles):</p>
              <div v-for="(g, i) in daltonGases" :key="i" class="flex gap-2 items-center">
                <input v-model="g.nombre" type="text" class="w-16 rounded border bg-background px-2 py-1.5 text-sm" placeholder="gas" />
                <input v-model="g.n" type="number" step="any" class="w-20 rounded border bg-background px-2 py-1.5 text-sm" placeholder="moles" />
              </div>
            </div>
            <div v-if="daltonResult" class="overflow-x-auto">
              <table class="w-full text-sm border-collapse border rounded">
                <thead class="bg-muted"><tr>
                  <th class="py-2 px-3 text-left">Gas</th>
                  <th class="py-2 px-3 text-center">n (mol)</th>
                  <th class="py-2 px-3 text-center">χᵢ (fracción)</th>
                  <th class="py-2 px-3 text-center">Pᵢ (atm)</th>
                </tr></thead>
                <tbody class="divide-y">
                  <tr v-for="g in daltonResult" :key="g.nombre">
                    <td class="py-2 px-3 font-mono font-bold">{{ g.nombre }}</td>
                    <td class="py-2 px-3 text-center">{{ g.n }}</td>
                    <td class="py-2 px-3 text-center font-mono">{{ g.xi.toFixed(4) }}</td>
                    <td class="py-2 px-3 text-center font-mono text-primary font-bold">{{ g.Pi.toFixed(4) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── QUIZ ── -->
      <TabsContent value="quiz" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">Pon a prueba tu comprensión de las leyes de los gases.</p>
        <div v-if="!qgTerminado">
          <Card class="border-2" :class="{
            'border-green-400': qgResp !== null && qgResp === qgActual.correcta,
            'border-red-400': qgResp !== null && qgResp !== qgActual.correcta,
            'border-border': qgResp === null
          }">
            <CardHeader class="pb-2">
              <div class="flex items-center justify-between">
                <Badge variant="outline">{{ qgIdx + 1 }} / {{ qgShuffled.length }}</Badge>
                <span class="text-sm text-muted-foreground">✓ {{ qgScore }}</span>
              </div>
              <CardTitle class="text-base mt-2">{{ qgActual.texto }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <div class="flex flex-col gap-2">
                <Button
                  v-for="op in qgActual.opciones" :key="op"
                  :variant="qgResp === op ? (op === qgActual.correcta ? 'default' : 'destructive') : qgResp !== null && op === qgActual.correcta ? 'default' : 'outline'"
                  :disabled="qgResp !== null"
                  class="justify-start"
                  @click="qgResponder(op)"
                >{{ op }}</Button>
              </div>
              <p v-if="qgResp !== null" class="text-sm border-l-2 pl-2 mt-2"
                :class="qgResp === qgActual.correcta ? 'text-green-600 border-green-400' : 'text-red-600 border-red-400'">
                <span v-if="qgResp === qgActual.correcta">✓ </span><span v-else>✗ Era: <strong>{{ qgActual.correcta }}</strong>. </span>
                {{ qgActual.hint }}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card v-else>
          <CardContent class="pt-8 pb-8 text-center space-y-4">
            <p class="text-4xl font-bold" :class="qgScore / qgShuffled.length >= 0.7 ? 'text-green-600' : 'text-orange-500'">
              {{ qgScore }} / {{ qgShuffled.length }}
            </p>
            <Button @click="qgReiniciar" class="gap-2"><RotateCcw class="size-4" />Reintentar</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── RESUMEN DE LEYES ── -->
      <TabsContent value="leyes" class="mt-4">
        <div class="grid gap-3">
          <Card v-for="ley in [
            { nombre: 'Boyle', cond: 'T, n ctes', formula: 'P₁V₁ = P₂V₂', desc: 'P y V inversamente proporcionales', color: 'border-blue-200' },
            { nombre: 'Charles', cond: 'P, n ctes', formula: 'V₁/T₁ = V₂/T₂', desc: 'V y T directamente proporcionales', color: 'border-green-200' },
            { nombre: 'Ley Combinada', cond: 'n cte', formula: 'P₁V₁/T₁ = P₂V₂/T₂', desc: 'Combina Boyle y Charles', color: 'border-teal-200' },
            { nombre: 'Avogadro', cond: 'P, T ctes', formula: 'V/n = k  →  1 mol = 22.4 L', desc: 'V proporcional a moles', color: 'border-indigo-200' },
            { nombre: 'Gas Ideal', cond: 'Gas perfecto', formula: 'PV = nRT  (R = 0.08206)', desc: 'Une todas las variables', color: 'border-orange-200' },
            { nombre: 'Dalton', cond: 'Mezcla', formula: 'P_t = Σ Pᵢ  |  Pᵢ = χᵢ P_t', desc: 'Suma de presiones parciales', color: 'border-purple-200' },
            { nombre: 'Graham', cond: 'Misma T, P', formula: 'r₁/r₂ = √(M₂/M₁)', desc: 'Efusión inversamente proporcional a √M', color: 'border-yellow-200' },
          ]" :key="ley.nombre" :class="['border', ley.color]">
            <CardContent class="pt-3 pb-3 flex gap-3 items-start">
              <Badge class="shrink-0 mt-0.5">{{ ley.nombre }}</Badge>
              <div class="flex-1">
                <p class="font-mono font-semibold text-sm">{{ ley.formula }}</p>
                <p class="text-xs text-muted-foreground">{{ ley.desc }} · <span class="italic">{{ ley.cond }}</span></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- ── UNIDADES ── -->
      <TabsContent value="unidades" class="mt-4 space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <Card v-for="u in [
            { mag: 'Presión', units: ['1 atm = 760 mmHg', '1 atm = 101.325 kPa', '1 atm = 1.01325 bar'] },
            { mag: 'Temperatura', units: ['K = °C + 273.15', 'Siempre usar K en gases', '0°C = 273.15 K, 25°C = 298.15 K'] },
            { mag: 'Constante R', units: ['0.08206 L·atm/(mol·K)', '8.314 J/(mol·K)', '1.987 cal/(mol·K)'] },
            { mag: 'Condiciones de referencia', units: ['CNTP: 0°C, 1 atm → 22.4 L/mol', 'CATP: 25°C, 1 atm → 24.5 L/mol'] },
          ]" :key="u.mag">
            <CardHeader class="pb-2"><CardTitle class="text-sm">{{ u.mag }}</CardTitle></CardHeader>
            <CardContent class="space-y-1">
              <div v-for="unit in u.units" :key="unit" class="bg-muted rounded px-2 py-1.5 text-xs font-mono">{{ unit }}</div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
