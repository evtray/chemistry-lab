<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RotateCcw, ArrowRight, Zap, Flame, Droplets, RefreshCw } from 'lucide-vue-next'

// ──────────────────────────────────────────────
// Clasificación de reacciones
// ──────────────────────────────────────────────
const tiposReaccion = [
  {
    tipo: 'Síntesis (Combinación)',
    formula: 'A + B → AB',
    descripcion: 'Dos o más sustancias se combinan para formar un único producto.',
    caracteristicas: [
      'Siempre produce UNA sola sustancia',
      'Los reactivos pueden ser elementos o compuestos',
      'Muy común en formación de óxidos, hidróxidos, sales',
    ],
    ejemplos: [
      { reac: '2 H₂ + O₂', prod: '2 H₂O', desc: 'Formación del agua', tipo: 'síntesis' },
      { reac: 'N₂ + 3 H₂', prod: '2 NH₃', desc: 'Síntesis de amoniaco (Proceso Haber)', tipo: 'síntesis' },
      { reac: '2 Na + Cl₂', prod: '2 NaCl', desc: 'Formación de sal de mesa', tipo: 'síntesis' },
      { reac: 'CaO + CO₂', prod: 'CaCO₃', desc: 'Óxido + anhídrido → sal ternaria', tipo: 'síntesis' },
    ],
    color: 'border-blue-300 bg-blue-50/50',
    badgeColor: 'bg-blue-100 text-blue-700'
  },
  {
    tipo: 'Descomposición',
    formula: 'AB → A + B',
    descripcion: 'Una sustancia se divide en dos o más productos más simples. Opuesta a la síntesis.',
    caracteristicas: [
      'Siempre tiene UN solo reactivo',
      'Generalmente requiere energía (calor, luz, electricidad)',
      'Común en hidróxidos, carbonatos, cloratos',
    ],
    ejemplos: [
      { reac: '2 H₂O₂', prod: '2 H₂O + O₂', desc: 'Descomposición del agua oxigenada', tipo: 'descomposición' },
      { reac: '2 KClO₃', prod: '2 KCl + 3 O₂', desc: 'Descomposición del clorato (con calor)', tipo: 'descomposición' },
      { reac: 'CaCO₃', prod: 'CaO + CO₂', desc: 'Calcinación del carbonato de calcio', tipo: 'descomposición' },
      { reac: '2 H₂O', prod: '2 H₂ + O₂', desc: 'Electrólisis del agua', tipo: 'descomposición' },
    ],
    color: 'border-orange-300 bg-orange-50/50',
    badgeColor: 'bg-orange-100 text-orange-700'
  },
  {
    tipo: 'Desplazamiento Simple (Sustitución)',
    formula: 'A + BC → AC + B',
    descripcion: 'Un elemento desplaza a otro de un compuesto. El elemento más activo desplaza al menos activo.',
    caracteristicas: [
      'Un elemento reacciona con un compuesto',
      'Se rige por la serie de actividad/reactividad de los metales',
      'Un metal más activo desplaza a uno menos activo de su sal',
    ],
    ejemplos: [
      { reac: 'Zn + 2 HCl', prod: 'ZnCl₂ + H₂', desc: 'Zinc desplaza H del ácido clorhídrico', tipo: 'desplazamiento' },
      { reac: 'Fe + CuSO₄', prod: 'FeSO₄ + Cu', desc: 'Hierro desplaza cobre (Fe más activo)', tipo: 'desplazamiento' },
      { reac: '2 Na + 2 H₂O', prod: '2 NaOH + H₂', desc: 'Sodio desplaza H del agua', tipo: 'desplazamiento' },
      { reac: 'Cl₂ + 2 KBr', prod: '2 KCl + Br₂', desc: 'Cloro (más activo) desplaza bromo', tipo: 'desplazamiento' },
    ],
    color: 'border-green-300 bg-green-50/50',
    badgeColor: 'bg-green-100 text-green-700'
  },
  {
    tipo: 'Doble Desplazamiento (Metátesis)',
    formula: 'AB + CD → AD + CB',
    descripcion: 'Los iones de dos compuestos se intercambian. Ocurre cuando se forma precipitado, gas o agua.',
    caracteristicas: [
      'Dos compuestos iónicos intercambian sus aniones',
      'La reacción "va hacia adelante" si se forma: precipitado, gas, o agua (molécula estable)',
      'Muy común en reacciones ácido-base (neutralización)',
    ],
    ejemplos: [
      { reac: 'AgNO₃ + NaCl', prod: 'AgCl↓ + NaNO₃', desc: 'Formación de precipitado AgCl (blanco)', tipo: 'doble' },
      { reac: 'HCl + NaOH', prod: 'NaCl + H₂O', desc: 'Neutralización: ácido + base → sal + agua', tipo: 'doble' },
      { reac: 'BaCl₂ + Na₂SO₄', prod: 'BaSO₄↓ + 2 NaCl', desc: 'Precipitado de sulfato de bario', tipo: 'doble' },
      { reac: 'Na₂S + 2 HCl', prod: '2 NaCl + H₂S↑', desc: 'Formación de gas H₂S', tipo: 'doble' },
    ],
    color: 'border-purple-300 bg-purple-50/50',
    badgeColor: 'bg-purple-100 text-purple-700'
  },
  {
    tipo: 'Combustión',
    formula: 'CₓHᵧ + O₂ → CO₂ + H₂O',
    descripcion: 'Reacción rápida de un combustible con oxígeno, liberando calor y luz. Combustión completa produce CO₂ y H₂O.',
    caracteristicas: [
      'Siempre requiere O₂ como reactivo',
      'Combustión completa: CO₂ + H₂O (suficiente O₂)',
      'Combustión incompleta: CO + H₂O (poco O₂)',
      'Muy exotérmica (libera energía)',
    ],
    ejemplos: [
      { reac: 'CH₄ + 2 O₂', prod: 'CO₂ + 2 H₂O', desc: 'Combustión del metano (gas natural)', tipo: 'combustión' },
      { reac: 'C₃H₈ + 5 O₂', prod: '3 CO₂ + 4 H₂O', desc: 'Combustión del propano', tipo: 'combustión' },
      { reac: 'C₆H₁₂O₆ + 6 O₂', prod: '6 CO₂ + 6 H₂O', desc: 'Oxidación de glucosa (respiración celular)', tipo: 'combustión' },
      { reac: '2 C₂H₅OH + 6 O₂', prod: '4 CO₂ + 6 H₂O', desc: 'Combustión del etanol', tipo: 'combustión' },
    ],
    color: 'border-red-300 bg-red-50/50',
    badgeColor: 'bg-red-100 text-red-700'
  },
  {
    tipo: 'Neutralización (Ácido-Base)',
    formula: 'ácido + base → sal + agua',
    descripcion: 'Caso especial del doble desplazamiento. Un ácido reacciona con una base para producir sal y agua.',
    caracteristicas: [
      'Siempre produce agua como subproducto',
      'El H⁺ del ácido se combina con el OH⁻ de la base',
      'La sal formada depende del ácido y la base usados',
      'pH del producto depende de las cantidades relativas',
    ],
    ejemplos: [
      { reac: 'HCl + NaOH', prod: 'NaCl + H₂O', desc: 'Ácido fuerte + base fuerte → sal neutra', tipo: 'neutralización' },
      { reac: 'H₂SO₄ + 2 KOH', prod: 'K₂SO₄ + 2 H₂O', desc: 'Ácido sulfúrico + hidróxido de potasio', tipo: 'neutralización' },
      { reac: 'HNO₃ + Ca(OH)₂', prod: 'Ca(NO₃)₂ + H₂O', desc: 'Ácido nítrico + hidróxido de calcio', tipo: 'neutralización' },
      { reac: 'H₃PO₄ + 3 NaOH', prod: 'Na₃PO₄ + 3 H₂O', desc: 'Ácido triprótido: reacciona 3:1 con NaOH', tipo: 'neutralización' },
    ],
    color: 'border-teal-300 bg-teal-50/50',
    badgeColor: 'bg-teal-100 text-teal-700'
  },
]

// ──────────────────────────────────────────────
// Identificador interactivo
// ──────────────────────────────────────────────
const ejerciciosId = [
  { reac: 'Na₂O + H₂O →', prod: '2 NaOH', tipo: 'Síntesis', hint: 'Dos reactivos → un producto. Óxido + agua → hidróxido.' },
  { reac: '2 H₂O →', prod: '2 H₂ + O₂', tipo: 'Descomposición', hint: 'Un reactivo → dos productos. Electrólisis.' },
  { reac: 'Mg + 2 HCl →', prod: 'MgCl₂ + H₂', tipo: 'Desplazamiento Simple', hint: 'Elemento + compuesto → nuevo compuesto + elemento desplazado.' },
  { reac: 'Pb(NO₃)₂ + 2 KI →', prod: 'PbI₂↓ + 2 KNO₃', tipo: 'Doble Desplazamiento', hint: 'Intercambio de iones. Se forma precipitado PbI₂ (amarillo).' },
  { reac: 'C₂H₄ + 3 O₂ →', prod: '2 CO₂ + 2 H₂O', tipo: 'Combustión', hint: 'Hidrocarburo + O₂ → CO₂ + H₂O.' },
  { reac: 'HBr + LiOH →', prod: 'LiBr + H₂O', tipo: 'Neutralización', hint: 'Ácido + base → sal + agua.' },
  { reac: '4 Fe + 3 O₂ →', prod: '2 Fe₂O₃', tipo: 'Síntesis', hint: 'Dos elementos se combinan para formar un óxido metálico.' },
  { reac: 'Cu + 2 AgNO₃ →', prod: 'Cu(NO₃)₂ + 2 Ag', tipo: 'Desplazamiento Simple', hint: 'Cobre (más activo que Ag) desplaza la plata de su sal.' },
  { reac: '2 NaHCO₃ →', prod: 'Na₂CO₃ + H₂O + CO₂', tipo: 'Descomposición', hint: 'Bicarbonato de sodio se descompone con calor.' },
  { reac: 'H₂SO₄ + 2 NaOH →', prod: 'Na₂SO₄ + 2 H₂O', tipo: 'Neutralización', hint: 'Ácido dibásico: reacciona con 2 mol de base.' },
  { reac: 'CaCl₂ + K₂CO₃ →', prod: 'CaCO₃↓ + 2 KCl', tipo: 'Doble Desplazamiento', hint: 'Intercambio iónico, se forma precipitado CaCO₃.' },
  { reac: '2 C₈H₁₈ + 25 O₂ →', prod: '16 CO₂ + 18 H₂O', tipo: 'Combustión', hint: 'Octano (gasolina) + O₂ → CO₂ + H₂O.' },
]

const opciones = ['Síntesis', 'Descomposición', 'Desplazamiento Simple', 'Doble Desplazamiento', 'Combustión', 'Neutralización']
const ejIdx = ref(0)
const ejResp = ref(null)
const ejScore = ref(0)
const ejShuffled = ref([...ejerciciosId].sort(() => Math.random() - 0.5))
const ejTerminado = computed(() => ejIdx.value >= ejShuffled.value.length)
const ejActual = computed(() => ejShuffled.value[ejIdx.value])

function ejResponder(op) {
  if (ejResp.value !== null) return
  ejResp.value = op
  if (op === ejActual.value.tipo) ejScore.value++
  setTimeout(() => { ejIdx.value++; ejResp.value = null }, 1600)
}
function ejReiniciar() {
  ejShuffled.value = [...ejerciciosId].sort(() => Math.random() - 0.5)
  ejIdx.value = 0; ejResp.value = null; ejScore.value = 0
}

// ──────────────────────────────────────────────
// Intro a otros conceptos (equilibrio, cinética)
// ──────────────────────────────────────────────
const otrosConceptos = [
  {
    titulo: 'Equilibrio Químico',
    simbolo: '⇌',
    descripcion: 'Estado en que las velocidades de la reacción directa e inversa son iguales. Las concentraciones no cambian (pero la reacción sigue ocurriendo).',
    formula: 'aA + bB ⇌ cC + dD',
    detalle: 'La constante de equilibrio Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ. Kc grande → productos favorecidos; Kc pequeño → reactivos favorecidos.',
    ejemplo: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)'
  },
  {
    titulo: 'Termodinámica Química',
    simbolo: 'ΔG',
    descripcion: 'Estudia la energía en las reacciones. Una reacción espontánea tiene ΔG < 0. ΔH es el calor de reacción; ΔS es el cambio de entropía.',
    formula: 'ΔG = ΔH − TΔS',
    detalle: 'Exotérmicas (ΔH < 0): liberan calor. Endotérmicas (ΔH > 0): absorben calor. La espontaneidad depende de ΔG, no solo de ΔH.',
    ejemplo: 'Combustión CH₄: ΔH = −890 kJ/mol (exotérmica espontánea)'
  },
  {
    titulo: 'Cinética Química',
    simbolo: 'k',
    descripcion: 'Estudia la velocidad de las reacciones y los factores que la afectan.',
    formula: 'Velocidad = k[A]ᵐ[B]ⁿ',
    detalle: 'Factores que aumentan la velocidad: ↑ temperatura, ↑ concentración, catalizador, mayor área de contacto (sólidos). k es la constante de velocidad (depende de T).',
    ejemplo: 'A 10°C más, la velocidad se duplica aproximadamente (regla empírica)'
  },
  {
    titulo: 'Electroquímica',
    simbolo: 'e⁻',
    descripcion: 'Estudia las reacciones de oxidación-reducción (redox) y su relación con la energía eléctrica.',
    formula: 'Ox + Red → producto + e⁻ (transferencia)',
    detalle: 'Oxidación: pérdida de e⁻ (el N.O. aumenta). Reducción: ganancia de e⁻ (el N.O. disminuye). "OIL RIG" — Oxidation Is Loss, Reduction Is Gain.',
    ejemplo: 'Zn + Cu²⁺ → Zn²⁺ + Cu  (Zn se oxida, Cu²⁺ se reduce)'
  },
]

const conceptoActivo = ref(null)
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold">Reacciones Químicas</h1>
      <p class="text-sm text-muted-foreground mt-1">Unidad 6.2 — Clasificación, balanceo y conceptos avanzados</p>
    </div>

    <Tabs default-value="tipos">
      <TabsList class="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="tipos">Tipos de Reacción</TabsTrigger>
        <TabsTrigger value="identificar">Identificar el tipo</TabsTrigger>
        <TabsTrigger value="conceptos">Equilibrio y Cinética</TabsTrigger>
      </TabsList>

      <!-- ── TIPOS DE REACCIÓN ── -->
      <TabsContent value="tipos" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">Las reacciones químicas se clasifican según cómo se reorganizan los átomos y moléculas.</p>

        <div class="grid gap-4">
          <Card
            v-for="tipo in tiposReaccion"
            :key="tipo.tipo"
            :class="['border-2', tipo.color]"
          >
            <CardHeader class="pb-2">
              <div class="flex items-center gap-2 flex-wrap">
                <CardTitle class="text-base">{{ tipo.tipo }}</CardTitle>
                <Badge :class="['text-xs border-0', tipo.badgeColor]">{{ tipo.formula }}</Badge>
              </div>
              <CardDescription class="mt-1">{{ tipo.descripcion }}</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              <!-- Características -->
              <ul class="space-y-0.5">
                <li
                  v-for="c in tipo.caracteristicas"
                  :key="c"
                  class="text-sm text-muted-foreground flex gap-2"
                >
                  <span class="text-primary shrink-0">•</span>{{ c }}
                </li>
              </ul>

              <!-- Ejemplos -->
              <div class="grid gap-2 sm:grid-cols-2">
                <div
                  v-for="ej in tipo.ejemplos"
                  :key="ej.reac"
                  class="bg-background border rounded p-2.5 text-sm"
                >
                  <div class="flex items-center gap-1 font-mono text-sm flex-wrap">
                    <span class="font-semibold">{{ ej.reac }}</span>
                    <ArrowRight class="size-3 text-muted-foreground shrink-0" />
                    <span class="text-primary font-semibold">{{ ej.prod }}</span>
                  </div>
                  <p class="text-xs text-muted-foreground mt-0.5">{{ ej.desc }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- ── IDENTIFICAR TIPO ── -->
      <TabsContent value="identificar" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">Observa la ecuación química e identifica de qué tipo de reacción se trata.</p>

        <div v-if="!ejTerminado">
          <Card class="border-2" :class="{
            'border-green-400': ejResp !== null && ejResp === ejActual.tipo,
            'border-red-400': ejResp !== null && ejResp !== ejActual.tipo,
            'border-border': ejResp === null
          }">
            <CardHeader class="pb-2">
              <div class="flex items-center justify-between">
                <Badge variant="outline">{{ ejIdx + 1 }} / {{ ejShuffled.length }}</Badge>
                <span class="text-sm text-muted-foreground">✓ {{ ejScore }}</span>
              </div>
              <p class="text-xs text-muted-foreground mt-2">¿Qué tipo de reacción es?</p>
              <div class="bg-muted rounded p-3 font-mono text-base mt-1">
                <span class="font-bold">{{ ejActual.reac }}</span>
                <ArrowRight class="size-4 inline mx-2 text-muted-foreground" />
                <span class="text-primary font-bold">{{ ejActual.prod }}</span>
              </div>
            </CardHeader>
            <CardContent class="space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <Button
                  v-for="op in opciones" :key="op"
                  :variant="ejResp === op
                    ? (op === ejActual.tipo ? 'default' : 'destructive')
                    : ejResp !== null && op === ejActual.tipo ? 'default' : 'outline'"
                  :disabled="ejResp !== null"
                  class="text-sm h-10"
                  @click="ejResponder(op)"
                >{{ op }}</Button>
              </div>
              <p v-if="ejResp !== null" class="text-sm border-l-2 pl-2 mt-2"
                :class="ejResp === ejActual.tipo ? 'text-green-600 border-green-400' : 'text-red-600 border-red-400'">
                <span v-if="ejResp === ejActual.tipo">✓ Correcto. </span>
                <span v-else>✗ Era: <strong>{{ ejActual.tipo }}</strong>. </span>
                {{ ejActual.hint }}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card v-else>
          <CardContent class="pt-8 pb-8 text-center space-y-4">
            <p class="text-4xl font-bold" :class="ejScore / ejShuffled.length >= 0.7 ? 'text-green-600' : 'text-orange-500'">
              {{ ejScore }} / {{ ejShuffled.length }}
            </p>
            <p class="text-muted-foreground">
              {{ ejScore / ejShuffled.length >= 0.85 ? '¡Dominas la clasificación de reacciones!' : 'Repasa los tipos y vuelve a intentarlo.' }}
            </p>
            <Button @click="ejReiniciar" class="gap-2">
              <RotateCcw class="size-4" /> Reintentar
            </Button>
          </CardContent>
        </Card>

        <!-- Tabla resumen rápido -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Guía rápida de identificación</CardTitle>
          </CardHeader>
          <CardContent class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead class="bg-muted/40">
                <tr>
                  <th class="text-left py-2 px-3 font-medium">Tipo</th>
                  <th class="text-left py-2 px-3 font-medium">Patrón</th>
                  <th class="text-left py-2 px-3 font-medium hidden sm:table-cell">Clave para identificar</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr v-for="t in [
                  { tipo: 'Síntesis', patron: 'A + B → AB', clave: '2+ reactivos, 1 producto' },
                  { tipo: 'Descomposición', patron: 'AB → A + B', clave: '1 reactivo, 2+ productos' },
                  { tipo: 'Desplazamiento simple', patron: 'A + BC → AC + B', clave: 'Elemento + compuesto → nuevo compuesto + elemento' },
                  { tipo: 'Doble desplazamiento', patron: 'AB + CD → AD + CB', clave: '2 compuestos → 2 compuestos distintos' },
                  { tipo: 'Combustión', patron: 'CₓHᵧ + O₂ → CO₂ + H₂O', clave: 'O₂ como reactivo + CO₂ y H₂O como productos' },
                  { tipo: 'Neutralización', patron: 'ácido + base → sal + agua', clave: 'ácido + hidróxido → sal + H₂O' },
                ]" :key="t.tipo">
                  <td class="py-2 px-3 font-medium">{{ t.tipo }}</td>
                  <td class="py-2 px-3 font-mono text-xs">{{ t.patron }}</td>
                  <td class="py-2 px-3 text-xs text-muted-foreground hidden sm:table-cell">{{ t.clave }}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── EQUILIBRIO Y CINÉTICA ── -->
      <TabsContent value="conceptos" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">
          Más allá de la clasificación, las reacciones se estudian según su mecanismo, velocidad y extensión.
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <button
            v-for="c in otrosConceptos"
            :key="c.titulo"
            class="text-left border rounded p-4 hover:border-primary/50 transition-colors space-y-2"
            :class="conceptoActivo === c.titulo ? 'border-primary bg-primary/5' : ''"
            @click="conceptoActivo = conceptoActivo === c.titulo ? null : c.titulo"
          >
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold text-primary font-mono">{{ c.simbolo }}</span>
              <span class="font-semibold text-base">{{ c.titulo }}</span>
            </div>
            <p class="text-sm text-muted-foreground">{{ c.descripcion }}</p>

            <div v-if="conceptoActivo === c.titulo" class="space-y-2 border-t pt-2 mt-2">
              <div class="bg-muted rounded p-2 font-mono text-sm text-center">{{ c.formula }}</div>
              <p class="text-sm text-muted-foreground">{{ c.detalle }}</p>
              <div class="bg-background border rounded p-2 font-mono text-sm">
                <span class="text-xs text-muted-foreground block mb-0.5">Ejemplo:</span>
                {{ c.ejemplo }}
              </div>
            </div>
          </button>
        </div>

        <!-- Comparativa -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">¿Cómo se relacionan estos conceptos?</CardTitle>
          </CardHeader>
          <CardContent class="text-sm text-muted-foreground space-y-2">
            <div class="grid gap-2">
              <div class="flex items-start gap-2 p-2 bg-muted/50 rounded">
                <Badge class="shrink-0 text-xs">Mecanismo</Badge>
                <span>Cómo ocurre la reacción paso a paso (pasos elementales, intermedios de reacción).</span>
              </div>
              <div class="flex items-start gap-2 p-2 bg-muted/50 rounded">
                <Badge class="shrink-0 text-xs">Extensión (Equilibrio)</Badge>
                <span>¿Hasta dónde llega la reacción? Kc grande → reacción casi completa; Kc pequeño → poco producto.</span>
              </div>
              <div class="flex items-start gap-2 p-2 bg-muted/50 rounded">
                <Badge class="shrink-0 text-xs">Termodinámica</Badge>
                <span>¿La reacción es espontánea? ΔG &lt; 0 → espontánea. ΔG &gt; 0 → no espontánea (requiere energía).</span>
              </div>
              <div class="flex items-start gap-2 p-2 bg-muted/50 rounded">
                <Badge class="shrink-0 text-xs">Cinética</Badge>
                <span>¿Qué tan rápido ocurre? Una reacción puede ser termodinámicamente favorable pero cinéticamente lenta (diamante → grafito: espontánea pero tardísima).</span>
              </div>
              <div class="flex items-start gap-2 p-2 bg-muted/50 rounded">
                <Badge class="shrink-0 text-xs">Electroquímica</Badge>
                <span>Reacciones redox donde la transferencia de e⁻ genera (o consume) corriente eléctrica. Base de baterías y electrólisis.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
