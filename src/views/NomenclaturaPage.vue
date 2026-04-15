<script setup>
import { ref, computed, watch } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RotateCcw, ChevronDown, ChevronUp } from 'lucide-vue-next'

// ──────────────────────────────────────────────
// Banco de ejercicios de nomenclatura
// ──────────────────────────────────────────────
const ejercicios = [
  // Binarios — Óxidos metálicos
  { formula: 'CaO', stock: 'óxido de calcio', iupac: 'monóxido de calcio', trad: 'óxido cálcico', tipo: 'Óxido Metálico', hint: 'Ca tiene valencia única (+2). O siempre −2.' },
  { formula: 'Fe₂O₃', stock: 'óxido de hierro(III)', iupac: 'trióxido de dihierro', trad: 'óxido férrico', tipo: 'Óxido Metálico', hint: 'Fe con valencia +3 (mayor). Mayor = ico, menor = oso.' },
  { formula: 'FeO', stock: 'óxido de hierro(II)', iupac: 'monóxido de hierro', trad: 'óxido ferroso', tipo: 'Óxido Metálico', hint: 'Fe con valencia +2 (menor). Ferroso = oso.' },
  { formula: 'Na₂O', stock: 'óxido de sodio', iupac: 'monóxido de disodio', trad: 'óxido sódico', tipo: 'Óxido Metálico', hint: 'Na siempre +1, grupo IA.' },
  { formula: 'Cu₂O', stock: 'óxido de cobre(I)', iupac: 'monóxido de dicobre', trad: 'óxido cuproso', tipo: 'Óxido Metálico', hint: 'Cu con valencia +1. Cuproso (menor).' },
  { formula: 'CuO', stock: 'óxido de cobre(II)', iupac: 'monóxido de cobre', trad: 'óxido cúprico', tipo: 'Óxido Metálico', hint: 'Cu con valencia +2. Cúprico (mayor).' },
  // Binarios — Anhídridos
  { formula: 'SO₂', stock: 'dióxido de azufre', iupac: 'dióxido de azufre', trad: 'anhídrido sulfuroso', tipo: 'Anhídrido', hint: 'S con N.O. +4. Prefijos IUPAC: di-O₂.' },
  { formula: 'SO₃', stock: 'trióxido de azufre', iupac: 'trióxido de azufre', trad: 'anhídrido sulfúrico', tipo: 'Anhídrido', hint: 'S con N.O. +6. Sulfúrico (mayor).' },
  { formula: 'CO₂', stock: 'dióxido de carbono', iupac: 'dióxido de carbono', trad: 'anhídrido carbónico', tipo: 'Anhídrido', hint: 'C con N.O. +4. di-C-O₂.' },
  { formula: 'N₂O₅', stock: 'pentaóxido de dinitrógeno', iupac: 'pentaóxido de dinitrógeno', trad: 'anhídrido nítrico', tipo: 'Anhídrido', hint: 'N con N.O. +5.' },
  // Ternarios — Hidróxidos
  { formula: 'NaOH', stock: 'hidróxido de sodio', iupac: 'hidróxido de sodio', trad: 'hidróxido sódico', tipo: 'Hidróxido', hint: 'Metal + OH⁻. Na siempre +1.' },
  { formula: 'Ca(OH)₂', stock: 'hidróxido de calcio', iupac: 'dihidróxido de calcio', trad: 'hidróxido cálcico', tipo: 'Hidróxido', hint: 'Ca(+2) + 2OH⁻.' },
  { formula: 'Fe(OH)₃', stock: 'hidróxido de hierro(III)', iupac: 'trihidróxido de hierro', trad: 'hidróxido férrico', tipo: 'Hidróxido', hint: 'Fe³⁺ + 3OH⁻. Férrico (mayor).' },
  // Ternarios — Oxácidos
  { formula: 'H₂SO₄', stock: 'ácido sulfúrico', iupac: 'ácido sulfúrico', trad: 'ácido sulfúrico', tipo: 'Oxácido', hint: 'S con N.O. +6. Mayor → ico.' },
  { formula: 'HNO₃', stock: 'ácido nítrico', iupac: 'ácido nítrico', trad: 'ácido nítrico', tipo: 'Oxácido', hint: 'N con N.O. +5. Nítrico.' },
  { formula: 'HNO₂', stock: 'ácido nitroso', iupac: 'ácido nitroso', trad: 'ácido nitroso', tipo: 'Oxácido', hint: 'N con N.O. +3. Menor → oso.' },
  { formula: 'H₃PO₄', stock: 'ácido fosfórico', iupac: 'ácido fosfórico', trad: 'ácido fosfórico', tipo: 'Oxácido', hint: 'P con N.O. +5.' },
  // Sales ternarias
  { formula: 'Na₂SO₄', stock: 'sulfato de sodio', iupac: 'sulfato de sodio', trad: 'sulfato sódico', tipo: 'Sal Ternaria', hint: 'Anión sulfato (SO₄²⁻) + Na⁺.' },
  { formula: 'Ca₃(PO₄)₂', stock: 'fosfato de calcio', iupac: 'fosfato de calcio', trad: 'fosfato cálcico', tipo: 'Sal Ternaria', hint: 'Anión fosfato (PO₄³⁻) + Ca²⁺.' },
  { formula: 'KNO₃', stock: 'nitrato de potasio', iupac: 'nitrato de potasio', trad: 'nitrato potásico', tipo: 'Sal Ternaria', hint: 'Anión nitrato (NO₃⁻) + K⁺.' },
]

const tipos = ['Todos', 'Óxido Metálico', 'Anhídrido', 'Hidróxido', 'Oxácido', 'Sal Ternaria']
const tipoFiltro = ref('Todos')
const sistemaQuiz = ref('stock') // stock, iupac, trad

const ejerciciosFiltrados = computed(() =>
  tipoFiltro.value === 'Todos' ? ejercicios : ejercicios.filter(e => e.tipo === tipoFiltro.value)
)

// ──────────────────────────────────────────────
// Modo Quiz: mostrar fórmula → dar nombre
// ──────────────────────────────────────────────
const qnIdx = ref(0)
const qnInput = ref('')
const qnFeedback = ref(null) // null | 'correct' | 'wrong'
const qnRespuestaCorrecta = ref('')
const qnScore = ref(0)
const qnShuffled = ref([...ejercicios].sort(() => Math.random() - 0.5))
const qnTerminado = computed(() => qnIdx.value >= qnShuffled.value.length)
const qnActual = computed(() => qnShuffled.value[qnIdx.value])

function qnVerificar() {
  if (!qnInput.value.trim() || qnFeedback.value !== null) return
  const correcto = qnActual.value[sistemaQuiz.value]
  qnRespuestaCorrecta.value = correcto
  const normalizar = s => s.toLowerCase().trim().replace(/\s+/g, ' ')
  const correc = normalizar(qnInput.value) === normalizar(correcto)
  qnFeedback.value = correc ? 'correct' : 'wrong'
  if (correc) qnScore.value++
  setTimeout(() => {
    qnIdx.value++
    qnInput.value = ''
    qnFeedback.value = null
    qnRespuestaCorrecta.value = ''
  }, 2000)
}

function qnReiniciar() {
  qnShuffled.value = [...ejerciciosFiltrados.value].sort(() => Math.random() - 0.5)
  qnIdx.value = 0; qnInput.value = ''; qnFeedback.value = null; qnScore.value = 0
}

watch(tipoFiltro, () => qnReiniciar())
watch(sistemaQuiz, () => qnReiniciar())

// ──────────────────────────────────────────────
// Prefijos
// ──────────────────────────────────────────────
const prefijosGrecos = [
  { n: 1, p: 'mono-' }, { n: 2, p: 'di-' }, { n: 3, p: 'tri-' }, { n: 4, p: 'tetra-' },
  { n: 5, p: 'penta-' }, { n: 6, p: 'hexa-' }, { n: 7, p: 'hepta-' }, { n: 8, p: 'octa-' },
]

// ──────────────────────────────────────────────
// Tabla completa expandible
// ──────────────────────────────────────────────
const tablaExpanded = ref(false)
const tablaFiltro = ref('Todos')
const tablaFiltrada = computed(() =>
  tablaFiltro.value === 'Todos' ? ejercicios : ejercicios.filter(e => e.tipo === tablaFiltro.value)
)
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold">Nomenclatura Química</h1>
      <p class="text-sm text-muted-foreground mt-1">Unidad 5 — Practica dando nombre a los compuestos</p>
    </div>

    <Tabs default-value="quiz">
      <TabsList class="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="quiz">Practica</TabsTrigger>
        <TabsTrigger value="tabla">Tabla de Compuestos</TabsTrigger>
        <TabsTrigger value="guia">Guía Rápida</TabsTrigger>
      </TabsList>

      <!-- ── PRÁCTICA ── -->
      <TabsContent value="quiz" class="mt-4 space-y-4">
        <!-- Configuración -->
        <div class="flex flex-wrap gap-3 items-start">
          <div class="space-y-1">
            <p class="text-xs font-medium text-muted-foreground">Sistema de nomenclatura:</p>
            <div class="flex gap-1 flex-wrap">
              <Button v-for="s in [{ id: 'stock', label: 'Stock' }, { id: 'iupac', label: 'IUPAC' }, { id: 'trad', label: 'Tradicional' }]"
                :key="s.id" :variant="sistemaQuiz === s.id ? 'default' : 'outline'" size="sm"
                @click="sistemaQuiz = s.id">{{ s.label }}</Button>
            </div>
          </div>
          <div class="space-y-1">
            <p class="text-xs font-medium text-muted-foreground">Tipo de compuesto:</p>
            <div class="flex gap-1 flex-wrap">
              <Button v-for="t in tipos" :key="t" :variant="tipoFiltro === t ? 'secondary' : 'outline'" size="sm"
                @click="tipoFiltro = t">{{ t }}</Button>
            </div>
          </div>
        </div>

        <div v-if="!qnTerminado">
          <Card class="border-2" :class="{
            'border-green-400': qnFeedback === 'correct',
            'border-red-400': qnFeedback === 'wrong',
            'border-border': !qnFeedback
          }">
            <CardHeader class="pb-2">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <Badge variant="outline">{{ qnIdx + 1 }} / {{ qnShuffled.length }}</Badge>
                <div class="flex gap-2">
                  <Badge variant="secondary">{{ qnActual.tipo }}</Badge>
                  <span class="text-sm text-muted-foreground">✓ {{ qnScore }}</span>
                </div>
              </div>
              <p class="text-xs text-muted-foreground mt-1">Da el nombre en sistema <strong>{{ sistemaQuiz === 'stock' ? 'Stock' : sistemaQuiz === 'iupac' ? 'IUPAC' : 'Tradicional' }}</strong>:</p>
              <CardTitle class="text-3xl text-center py-4 font-mono tracking-wider">{{ qnActual.formula }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="flex gap-2">
                <input
                  v-model="qnInput"
                  type="text"
                  :placeholder="`nombre en sistema ${sistemaQuiz}…`"
                  :disabled="qnFeedback !== null"
                  class="flex-1 rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  @keydown.enter="qnVerificar"
                />
                <Button :disabled="!qnInput.trim() || qnFeedback !== null" @click="qnVerificar">
                  Verificar
                </Button>
              </div>

              <div v-if="qnFeedback" class="rounded p-3 space-y-1"
                :class="qnFeedback === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
                <p class="text-sm font-medium" :class="qnFeedback === 'correct' ? 'text-green-700' : 'text-red-700'">
                  {{ qnFeedback === 'correct' ? '✓ ¡Correcto!' : `✗ La respuesta era: "${qnRespuestaCorrecta}"` }}
                </p>
                <p class="text-xs text-muted-foreground">{{ qnActual.hint }}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card v-else>
          <CardContent class="pt-8 pb-8 text-center space-y-4">
            <p class="text-4xl font-bold" :class="qnScore / qnShuffled.length >= 0.7 ? 'text-green-600' : 'text-orange-500'">
              {{ qnScore }} / {{ qnShuffled.length }}
            </p>
            <p class="text-muted-foreground">{{ qnScore / qnShuffled.length >= 0.7 ? '¡Buen dominio de nomenclatura!' : 'Revisa la tabla y vuelve a practicar.' }}</p>
            <Button @click="qnReiniciar" class="gap-2"><RotateCcw class="size-4" />Reintentar</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── TABLA ── -->
      <TabsContent value="tabla" class="mt-4 space-y-4">
        <div class="flex flex-wrap gap-1">
          <Button v-for="t in tipos" :key="t" :variant="tablaFiltro === t ? 'default' : 'outline'" size="sm"
            @click="tablaFiltro = t">{{ t }}</Button>
        </div>
        <div class="overflow-x-auto rounded border">
          <table class="w-full text-sm border-collapse">
            <thead class="bg-muted">
              <tr>
                <th class="text-left py-2 px-3 font-medium">Fórmula</th>
                <th class="text-left py-2 px-3 font-medium">Stock</th>
                <th class="text-left py-2 px-3 font-medium hidden sm:table-cell">IUPAC</th>
                <th class="text-left py-2 px-3 font-medium hidden md:table-cell">Tradicional</th>
                <th class="text-center py-2 px-3 font-medium hidden lg:table-cell">Tipo</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="e in tablaFiltrada" :key="e.formula" class="hover:bg-muted/30">
                <td class="py-2 px-3 font-mono font-bold">{{ e.formula }}</td>
                <td class="py-2 px-3 text-muted-foreground">{{ e.stock }}</td>
                <td class="py-2 px-3 text-muted-foreground hidden sm:table-cell">{{ e.iupac }}</td>
                <td class="py-2 px-3 text-muted-foreground hidden md:table-cell">{{ e.trad }}</td>
                <td class="py-2 px-3 text-center hidden lg:table-cell">
                  <Badge variant="outline" class="text-xs">{{ e.tipo }}</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>

      <!-- ── GUÍA RÁPIDA ── -->
      <TabsContent value="guia" class="mt-4 space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader class="pb-2"><CardTitle class="text-sm">Prefijos grecolatinos (IUPAC)</CardTitle></CardHeader>
            <CardContent>
              <div class="grid grid-cols-4 gap-1 text-center">
                <div v-for="p in prefijosGrecos" :key="p.n" class="bg-muted rounded p-1.5">
                  <p class="text-lg font-bold text-primary">{{ p.n }}</p>
                  <p class="text-xs font-mono">{{ p.p }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-2"><CardTitle class="text-sm">Sufijos -ico / -oso</CardTitle></CardHeader>
            <CardContent class="text-sm space-y-2">
              <div class="bg-muted rounded p-2">
                <p class="font-semibold">Sistema Stock</p>
                <p class="text-xs text-muted-foreground">Indica la valencia en romanos entre paréntesis: Fe(II), Fe(III)</p>
              </div>
              <div class="bg-muted rounded p-2">
                <p class="font-semibold">Sistema tradicional</p>
                <p class="text-xs text-muted-foreground"><strong>-oso</strong> = menor valencia (Fe²⁺ = ferroso)</p>
                <p class="text-xs text-muted-foreground"><strong>-ico</strong> = mayor valencia (Fe³⁺ = férrico)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-2"><CardTitle class="text-sm">Aniones comunes</CardTitle></CardHeader>
            <CardContent>
              <div class="space-y-1 text-sm">
                <div v-for="an in [
                  { ion: 'O²⁻', nombre: 'óxido' }, { ion: 'OH⁻', nombre: 'hidróxido' },
                  { ion: 'SO₄²⁻', nombre: 'sulfato' }, { ion: 'SO₃²⁻', nombre: 'sulfito' },
                  { ion: 'NO₃⁻', nombre: 'nitrato' }, { ion: 'NO₂⁻', nombre: 'nitrito' },
                  { ion: 'PO₄³⁻', nombre: 'fosfato' }, { ion: 'CO₃²⁻', nombre: 'carbonato' },
                  { ion: 'ClO₄⁻', nombre: 'perclorato' }, { ion: 'ClO₃⁻', nombre: 'clorato' },
                  { ion: 'Cl⁻', nombre: 'cloruro' }, { ion: 'Br⁻', nombre: 'bromuro' },
                ]" :key="an.ion" class="flex items-center gap-2">
                  <Badge variant="outline" class="font-mono text-xs w-20 justify-center">{{ an.ion }}</Badge>
                  <span class="text-muted-foreground">{{ an.nombre }}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-2"><CardTitle class="text-sm">Regla hipo- / per- (halógenos)</CardTitle></CardHeader>
            <CardContent class="text-sm space-y-1 font-mono">
              <div class="bg-muted rounded p-1.5">HClO → ácido hipocloroso (Cl = +1)</div>
              <div class="bg-muted rounded p-1.5">HClO₂ → ácido cloroso (Cl = +3)</div>
              <div class="bg-muted rounded p-1.5">HClO₃ → ácido clórico (Cl = +5)</div>
              <div class="bg-muted rounded p-1.5">HClO₄ → ácido perclórico (Cl = +7)</div>
              <p class="text-xs text-muted-foreground mt-1">hipo-oso &lt; -oso &lt; -ico &lt; per-ico</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
