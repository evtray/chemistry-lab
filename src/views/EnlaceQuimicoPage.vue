<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-vue-next'

// ──────────────────────────────────────────────
// Tab 1: Determinador de tipo de enlace por ΔEN
// ──────────────────────────────────────────────
const EN_DATA = {
  H: 2.20, Li: 0.98, Be: 1.57, B: 2.04, C: 2.55, N: 3.04, O: 3.44,
  F: 3.98, Na: 0.93, Mg: 1.31, Al: 1.61, Si: 1.90, P: 2.19, S: 2.58,
  Cl: 3.16, K: 0.82, Ca: 1.00, Fe: 1.83, Cu: 1.90, Zn: 1.65, Br: 2.96,
  I: 2.66, Mn: 1.55, Cr: 1.66, Ni: 1.91
}

const enlaceAt1 = ref('Na')
const enlaceAt2 = ref('Cl')
const en1 = computed(() => EN_DATA[enlaceAt1.value] ?? null)
const en2 = computed(() => EN_DATA[enlaceAt2.value] ?? null)
const deltaEN = computed(() => {
  if (en1.value === null || en2.value === null) return null
  return Math.abs(en1.value - en2.value)
})
const tipoEnlace = computed(() => {
  if (deltaEN.value === null) return null
  if (deltaEN.value < 0.4) return { tipo: 'Covalente Apolar', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', desc: 'Los electrones se comparten de manera casi equitativa. No hay polaridad significativa.' }
  if (deltaEN.value <= 1.7) return { tipo: 'Covalente Polar', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', desc: 'Compartición desigual de electrones. Se genera un dipolo (δ+ y δ−).' }
  return { tipo: 'Iónico', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', desc: 'Transferencia completa de electrones. Se forman catión (+) y anión (−).' }
})

const elementosEN = Object.keys(EN_DATA)

// ──────────────────────────────────────────────
// Tab 2: Calculadora de N° de Oxidación
// ──────────────────────────────────────────────
const noFormula = ref('H2SO4')
const noSolucion = ref(null)
const noError = ref('')

const REGLAS_NO = {
  H: { default: +1, except: { Na: -1, K: -1, Li: -1, Ca: -1, Mg: -1 } },
  O: { default: -2, peroxido: -1 },
  F: { default: -1 },
  metals_ia: { default: +1, elements: ['Li','Na','K','Rb','Cs','Fr'] },
  metals_iia: { default: +2, elements: ['Be','Mg','Ca','Sr','Ba','Ra'] },
}

const compuestosNO = [
  {
    formula: 'H₂SO₄', carga: 0,
    atoms: [{ el: 'H', n: 2, no: +1 }, { el: 'S', n: 1, no: +6 }, { el: 'O', n: 4, no: -2 }],
    patron: 'Ácido sulfúrico. S es la incógnita: 2(+1) + x + 4(−2) = 0  →  x = +6'
  },
  {
    formula: 'KMnO₄', carga: 0,
    atoms: [{ el: 'K', n: 1, no: +1 }, { el: 'Mn', n: 1, no: +7 }, { el: 'O', n: 4, no: -2 }],
    patron: 'K es +1 (metal IA). Mn es incógnita: (+1) + x + 4(−2) = 0  →  x = +7'
  },
  {
    formula: 'Fe₂O₃', carga: 0,
    atoms: [{ el: 'Fe', n: 2, no: +3 }, { el: 'O', n: 3, no: -2 }],
    patron: 'O es −2. Fe es incógnita: 2x + 3(−2) = 0  →  2x = +6  →  x = +3'
  },
  {
    formula: 'NH₃', carga: 0,
    atoms: [{ el: 'N', n: 1, no: -3 }, { el: 'H', n: 3, no: +1 }],
    patron: 'H es +1. N es incógnita: x + 3(+1) = 0  →  x = −3'
  },
  {
    formula: 'SO₄²⁻', carga: -2,
    atoms: [{ el: 'S', n: 1, no: +6 }, { el: 'O', n: 4, no: -2 }],
    patron: 'Ion con carga −2. x + 4(−2) = −2  →  x = +6'
  },
  {
    formula: 'Cr₂O₇²⁻', carga: -2,
    atoms: [{ el: 'Cr', n: 2, no: +6 }, { el: 'O', n: 7, no: -2 }],
    patron: 'Ion con carga −2. 2x + 7(−2) = −2  →  2x = +12  →  x = +6'
  },
  {
    formula: 'MnO₄⁻', carga: -1,
    atoms: [{ el: 'Mn', n: 1, no: +7 }, { el: 'O', n: 4, no: -2 }],
    patron: 'Ion permanganato (carga −1). x + 4(−2) = −1  →  x = +7'
  },
  {
    formula: 'Na₂O₂', carga: 0,
    atoms: [{ el: 'Na', n: 2, no: +1 }, { el: 'O', n: 2, no: -1 }],
    patron: 'Peróxido: O es −1 (excepción). Na es +1. 2(+1) + 2(−1) = 0 ✓'
  },
]

const noSeleccionado = ref(null)

// ──────────────────────────────────────────────
// Tab 3: Quiz de tipo de enlace / Lewis
// ──────────────────────────────────────────────
const preguntasEnlace = [
  { texto: 'H₂ — ¿Qué tipo de enlace une los átomos de hidrógeno?', opciones: ['Covalente Apolar', 'Covalente Polar', 'Iónico'], correcta: 'Covalente Apolar', hint: 'ΔEN = 0 (mismos átomos). Enlace covalente apolar.' },
  { texto: 'NaCl — El enlace Na–Cl es…', opciones: ['Covalente Apolar', 'Covalente Polar', 'Iónico'], correcta: 'Iónico', hint: 'ΔEN = |3.16 − 0.93| = 2.23 > 1.7 → Iónico.' },
  { texto: 'HF — El enlace H–F es…', opciones: ['Covalente Apolar', 'Covalente Polar', 'Iónico'], correcta: 'Covalente Polar', hint: 'ΔEN = |3.98 − 2.20| = 1.78 > 1.7... ¡caso límite, usualmente clasificado como iónico o muy polar!' },
  { texto: '¿Cuántos electrones de valencia tiene el N?', opciones: ['3', '5', '7'], correcta: '5', hint: 'N está en el grupo VA → 5 e⁻ de valencia.' },
  { texto: 'En H₂O, el oxígeno tiene…', opciones: ['1 par libre', '2 pares libres', '0 pares libres'], correcta: '2 pares libres', hint: 'O tiene 6 e⁻ de valencia. Forma 2 enlaces con H → quedan 4 e⁻ = 2 pares libres.' },
  { texto: 'La carga formal de C en CO₂ (dobles enlaces) es…', opciones: ['0', '+2', '-2'], correcta: '0', hint: 'CF = 4 − 0 − ½(8) = 4 − 4 = 0. Los dobles enlaces minimizan la carga formal.' },
  { texto: '¿Cuál es el N° de oxidación de S en H₂SO₄?', opciones: ['+4', '+6', '+8'], correcta: '+6', hint: '2(+1) + x + 4(−2) = 0 → x = +6.' },
  { texto: '¿Cuántos e⁻ de valencia tiene la estructura de Lewis de CO₂?', opciones: ['12', '16', '8'], correcta: '16', hint: 'C aporta 4, cada O aporta 6 → 4 + 6 + 6 = 16 e⁻ totales.' },
  { texto: 'El ozono (O₃) presenta…', opciones: ['Carga formal', 'Resonancia', 'Enlace coordinado'], correcta: 'Resonancia', hint: 'Hay dos estructuras equivalentes de Lewis para O₃. La estructura real es un híbrido.' },
  { texto: '¿Cuál es el tipo de enlace en el hierro metálico (Fe)?', opciones: ['Iónico', 'Covalente', 'Metálico'], correcta: 'Metálico', hint: 'En metales, los e⁻ de valencia se deslocalizan en un "mar de electrones".' },
]

const qeIdx = ref(0)
const qeResp = ref(null)
const qeScore = ref(0)
const qeShuffled = ref([...preguntasEnlace].sort(() => Math.random() - 0.5))
const qeTerminado = computed(() => qeIdx.value >= qeShuffled.value.length)
const qeActual = computed(() => qeShuffled.value[qeIdx.value])

function qeResponder(op) {
  if (qeResp.value !== null) return
  qeResp.value = op
  if (op === qeActual.value.correcta) qeScore.value++
  setTimeout(() => { qeIdx.value++; qeResp.value = null }, 1600)
}
function qeReiniciar() {
  qeShuffled.value = [...preguntasEnlace].sort(() => Math.random() - 0.5)
  qeIdx.value = 0; qeResp.value = null; qeScore.value = 0
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold">Enlace Químico</h1>
      <p class="text-sm text-muted-foreground mt-1">Unidad 4 — Tipos de enlace, Lewis y números de oxidación</p>
    </div>

    <Tabs default-value="enlace">
      <TabsList class="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="enlace">Tipo de Enlace (ΔEN)</TabsTrigger>
        <TabsTrigger value="oxidacion">N° de Oxidación</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
        <TabsTrigger value="referencia">Referencia Lewis</TabsTrigger>
      </TabsList>

      <!-- ── TIPO DE ENLACE ── -->
      <TabsContent value="enlace" class="mt-4 space-y-4">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Determinador de tipo de enlace por ΔEN</CardTitle>
            <CardDescription>Selecciona dos elementos para calcular la diferencia de electronegatividad.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-medium">Elemento 1</label>
                <select v-model="enlaceAt1"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option v-for="el in elementosEN" :key="el" :value="el">{{ el }} (EN = {{ EN_DATA[el] }})</option>
                </select>
                <p class="text-xs text-muted-foreground">EN({{ enlaceAt1 }}) = <strong>{{ en1 }}</strong></p>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Elemento 2</label>
                <select v-model="enlaceAt2"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option v-for="el in elementosEN" :key="el" :value="el">{{ el }} (EN = {{ EN_DATA[el] }})</option>
                </select>
                <p class="text-xs text-muted-foreground">EN({{ enlaceAt2 }}) = <strong>{{ en2 }}</strong></p>
              </div>
            </div>

            <div v-if="tipoEnlace" class="rounded border p-4 space-y-2" :class="tipoEnlace.bg">
              <div class="flex items-center gap-3">
                <div class="text-center">
                  <p class="text-sm font-mono">|{{ en1 }} − {{ en2 }}|</p>
                  <p class="text-2xl font-bold font-mono" :class="tipoEnlace.color">ΔEN = {{ deltaEN?.toFixed(2) }}</p>
                </div>
                <div class="flex-1">
                  <Badge class="text-sm font-semibold mb-1">{{ tipoEnlace.tipo }}</Badge>
                  <p class="text-sm text-muted-foreground">{{ tipoEnlace.desc }}</p>
                </div>
              </div>
            </div>

            <!-- Escala visual de ΔEN -->
            <div class="space-y-1">
              <p class="text-xs font-medium text-muted-foreground">Escala ΔEN</p>
              <div class="relative h-8 rounded overflow-hidden flex">
                <div class="bg-blue-200 flex items-center justify-center text-xs font-medium flex-1">Apolar (&lt;0.4)</div>
                <div class="bg-purple-200 flex items-center justify-center text-xs font-medium flex-1">Polar (0.4–1.7)</div>
                <div class="bg-orange-200 flex items-center justify-center text-xs font-medium flex-1">Iónico (&gt;1.7)</div>
              </div>
              <div v-if="deltaEN !== null" class="relative h-2 bg-muted rounded overflow-hidden">
                <div class="absolute top-0 h-full bg-primary rounded transition-all"
                  :style="{ left: `${Math.min((deltaEN / 4) * 100, 100)}%`, width: '3px' }" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Resumen de tipos de enlace</CardTitle>
          </CardHeader>
          <CardContent class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead><tr class="border-b bg-muted/40">
                <th class="text-left py-2 px-3">Tipo</th>
                <th class="text-center py-2 px-3">ΔEN</th>
                <th class="text-left py-2 px-3">Ejemplo</th>
                <th class="text-left py-2 px-3 hidden sm:table-cell">Característica</th>
              </tr></thead>
              <tbody class="divide-y">
                <tr><td class="py-2 px-3 font-medium text-blue-600">Covalente Apolar</td><td class="py-2 px-3 text-center font-mono">&lt; 0.4</td><td class="py-2 px-3 font-mono">H₂, O₂, N₂</td><td class="py-2 px-3 text-xs text-muted-foreground hidden sm:table-cell">Compartición igualitaria</td></tr>
                <tr><td class="py-2 px-3 font-medium text-purple-600">Covalente Polar</td><td class="py-2 px-3 text-center font-mono">0.4–1.7</td><td class="py-2 px-3 font-mono">H₂O, HCl, NH₃</td><td class="py-2 px-3 text-xs text-muted-foreground hidden sm:table-cell">Dipolo parcial δ+/δ−</td></tr>
                <tr><td class="py-2 px-3 font-medium text-orange-600">Iónico</td><td class="py-2 px-3 text-center font-mono">&gt; 1.7</td><td class="py-2 px-3 font-mono">NaCl, MgO</td><td class="py-2 px-3 text-xs text-muted-foreground hidden sm:table-cell">Transferencia de e⁻</td></tr>
                <tr><td class="py-2 px-3 font-medium text-yellow-600">Metálico</td><td class="py-2 px-3 text-center font-mono">—</td><td class="py-2 px-3 font-mono">Fe, Cu, Al</td><td class="py-2 px-3 text-xs text-muted-foreground hidden sm:table-cell">Mar de electrones</td></tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── N° DE OXIDACIÓN ── -->
      <TabsContent value="oxidacion" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">Selecciona un compuesto para ver el cálculo paso a paso del número de oxidación.</p>
        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <button
            v-for="c in compuestosNO"
            :key="c.formula"
            class="rounded border p-3 text-left hover:border-primary/50 transition-colors"
            :class="noSeleccionado?.formula === c.formula ? 'border-primary bg-primary/5' : ''"
            @click="noSeleccionado = noSeleccionado?.formula === c.formula ? null : c"
          >
            <p class="font-mono font-bold">{{ c.formula }}</p>
            <p class="text-xs text-muted-foreground mt-0.5">Carga: {{ c.carga === 0 ? 'neutro' : c.carga > 0 ? `+${c.carga}` : c.carga }}</p>
          </button>
        </div>

        <Card v-if="noSeleccionado" class="border-primary/30">
          <CardHeader class="pb-2">
            <CardTitle class="text-base font-mono">{{ noSeleccionado.formula }}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="bg-muted/40 rounded p-3 text-sm">
              <p class="font-medium mb-1">Razonamiento paso a paso:</p>
              <p class="text-muted-foreground">{{ noSeleccionado.patron }}</p>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead><tr class="border-b">
                  <th class="text-left py-2 px-3">Elemento</th>
                  <th class="text-center py-2 px-3">N° átomos</th>
                  <th class="text-center py-2 px-3">N.O. por átomo</th>
                  <th class="text-center py-2 px-3">Contribución total</th>
                </tr></thead>
                <tbody class="divide-y">
                  <tr v-for="at in noSeleccionado.atoms" :key="at.el">
                    <td class="py-2 px-3 font-mono font-bold">{{ at.el }}</td>
                    <td class="py-2 px-3 text-center">{{ at.n }}</td>
                    <td class="py-2 px-3 text-center font-mono">
                      <span :class="at.no > 0 ? 'text-red-600' : at.no < 0 ? 'text-blue-600' : 'text-muted-foreground'">
                        {{ at.no > 0 ? `+${at.no}` : at.no }}
                      </span>
                    </td>
                    <td class="py-2 px-3 text-center font-mono font-semibold">
                      {{ at.n * at.no > 0 ? `+${at.n * at.no}` : at.n * at.no }}
                    </td>
                  </tr>
                  <tr class="bg-muted/30 font-bold">
                    <td colspan="3" class="py-2 px-3 text-right">Suma total:</td>
                    <td class="py-2 px-3 text-center font-mono text-primary">
                      {{ noSeleccionado.atoms.reduce((s, a) => s + a.n * a.no, 0) === 0 ? '0 ✓' : noSeleccionado.atoms.reduce((s, a) => s + a.n * a.no, 0) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2"><CardTitle class="text-sm">Reglas para asignar N° de oxidación</CardTitle></CardHeader>
          <CardContent class="space-y-2 text-sm">
            <div v-for="(r, i) in [
              'Elemento libre (Fe, H₂, O₂): N.O. = 0',
              'Ion monoatómico: N.O. = carga del ion (Na⁺ = +1)',
              'H: siempre +1, excepto hidruros metálicos (NaH → H = −1)',
              'O: siempre −2, excepto peróxidos (H₂O₂ → O = −1) y OF₂ (+2)',
              'Metales grupo IA: siempre +1',
              'Metales grupo IIA: siempre +2',
              'F: siempre −1 (es el más electronegativo)',
              'La suma en compuesto neutro = 0; en ion = carga del ion',
            ]" :key="i" class="flex gap-2 items-start">
              <Badge variant="outline" class="shrink-0 font-mono text-xs mt-0.5">{{ i + 1 }}</Badge>
              <span class="text-muted-foreground">{{ r }}</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── QUIZ ── -->
      <TabsContent value="quiz" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">Preguntas sobre enlace, Lewis y números de oxidación.</p>
        <div v-if="!qeTerminado">
          <Card class="border-2" :class="{
            'border-green-400': qeResp !== null && qeResp === qeActual.correcta,
            'border-red-400': qeResp !== null && qeResp !== qeActual.correcta,
            'border-border': qeResp === null
          }">
            <CardHeader class="pb-2">
              <div class="flex items-center justify-between">
                <Badge variant="outline">{{ qeIdx + 1 }} / {{ qeShuffled.length }}</Badge>
                <span class="text-sm font-medium text-muted-foreground">✓ {{ qeScore }}</span>
              </div>
              <CardTitle class="text-base mt-2">{{ qeActual.texto }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <div class="flex flex-col gap-2">
                <Button
                  v-for="op in qeActual.opciones"
                  :key="op"
                  :variant="qeResp === op
                    ? (op === qeActual.correcta ? 'default' : 'destructive')
                    : qeResp !== null && op === qeActual.correcta ? 'default' : 'outline'"
                  :disabled="qeResp !== null"
                  class="justify-start"
                  @click="qeResponder(op)"
                >
                  {{ op }}
                </Button>
              </div>
              <p v-if="qeResp !== null" class="text-sm border-l-2 pl-2 mt-2"
                :class="qeResp === qeActual.correcta ? 'text-green-600 border-green-400' : 'text-red-600 border-red-400'">
                <span v-if="qeResp === qeActual.correcta">✓ </span><span v-else>✗ Era: <strong>{{ qeActual.correcta }}</strong>. </span>
                {{ qeActual.hint }}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card v-else>
          <CardContent class="pt-8 pb-8 text-center space-y-4">
            <p class="text-4xl font-bold" :class="qeScore / qeShuffled.length >= 0.7 ? 'text-green-600' : 'text-orange-500'">
              {{ qeScore }} / {{ qeShuffled.length }}
            </p>
            <Button @click="qeReiniciar" class="gap-2"><RotateCcw class="size-4" />Reintentar</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── REFERENCIA LEWIS ── -->
      <TabsContent value="referencia" class="mt-4 space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader class="pb-2"><CardTitle class="text-sm">Pasos para dibujar estructura de Lewis</CardTitle></CardHeader>
            <CardContent class="space-y-2">
              <div v-for="(paso, i) in [
                'Contar e⁻ de valencia totales (sumar o restar por carga)',
                'Conectar átomos con enlaces simples (el menos EN al centro)',
                'Completar octetos de átomos periféricos con pares libres',
                'Asignar e⁻ restantes al átomo central',
                'Si el central no tiene octeto: formar dobles/triples enlaces',
                'Verificar carga formal (CF = ev − eNE − ½ eE)'
              ]" :key="i" class="flex gap-2 items-start text-sm">
                <div class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{{ i + 1 }}</div>
                <span class="text-muted-foreground">{{ paso }}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="pb-2"><CardTitle class="text-sm">e⁻ de valencia por grupo</CardTitle></CardHeader>
            <CardContent>
              <div class="grid grid-cols-4 gap-1 text-center text-sm">
                <div v-for="g in [
                  { grupo: 'IA', ev: 1, ej: 'H, Li, Na' },
                  { grupo: 'IIA', ev: 2, ej: 'Be, Mg' },
                  { grupo: 'IIIA', ev: 3, ej: 'B, Al' },
                  { grupo: 'IVA', ev: 4, ej: 'C, Si' },
                  { grupo: 'VA', ev: 5, ej: 'N, P' },
                  { grupo: 'VIA', ev: 6, ej: 'O, S' },
                  { grupo: 'VIIA', ev: 7, ej: 'F, Cl' },
                  { grupo: 'VIIIA', ev: 8, ej: 'Ne, Ar' },
                ]" :key="g.grupo" class="bg-muted rounded p-1.5">
                  <p class="font-mono font-bold text-primary">{{ g.ev }}</p>
                  <p class="text-xs">{{ g.grupo }}</p>
                  <p class="text-xs text-muted-foreground">{{ g.ej }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card class="sm:col-span-2">
            <CardHeader class="pb-2"><CardTitle class="text-sm">Carga formal (CF)</CardTitle></CardHeader>
            <CardContent class="text-sm space-y-2">
              <div class="bg-muted rounded p-3 font-mono text-center text-base">
                CF = e⁻_valencia − e⁻_no_enlazantes − ½ × e⁻_enlazantes
              </div>
              <p class="text-muted-foreground">La mejor estructura de Lewis es aquella con cargas formales más cercanas a cero y donde los átomos más electronegativos tienen la carga negativa.</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
