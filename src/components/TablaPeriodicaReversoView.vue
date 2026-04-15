<script setup>
import { ref } from 'vue'
import {
  particulasSubatomicas,
  caracterIonico,
  leyendaElementos,
  reglasSolubilidad,
  ionesPoliatomicos,
  serieActividad,
  ordenLlenado,
  constantes,
  prefijosNumericos,
  tendenciasPeriodicas,
  estadosOxidacion,
  acidosComunes,
  basesComunes,
  conversionesUnidades
} from '@/data/tablaPeriodicaReversoData.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const activeSection = ref('tendencias')

const sections = [
  { id: 'tendencias', label: 'Tendencias', icon: '📊' },
  { id: 'particulas', label: 'Partículas', icon: '⚛️' },
  { id: 'oxidacion', label: 'E. oxidación', icon: '⚡' },
  { id: 'caracter', label: 'Carácter iónico', icon: '🔗' },
  { id: 'solubilidad', label: 'Solubilidad', icon: '💧' },
  { id: 'iones', label: 'Iones', icon: '🔬' },
  { id: 'acidos', label: 'Ácidos y bases', icon: '🧪' },
  { id: 'serie', label: 'Serie actividad', icon: '⚙️' },
  { id: 'orbitales', label: 'Orbitales', icon: '🌀' },
  { id: 'constantes', label: 'Constantes', icon: '📐' },
  { id: 'conversiones', label: 'Conversiones', icon: '🔄' },
  { id: 'leyenda', label: 'Leyenda', icon: '📋' },
  { id: 'prefijos', label: 'Prefijos', icon: '🔢' }
]
</script>

<template>
  <div class="space-y-4">
    <!-- Navegación tipo pills -->
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="sec in sections"
        :key="sec.id"
        class="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
        :class="activeSection === sec.id
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'"
        @click="activeSection = sec.id"
      >
        <span class="text-[11px]">{{ sec.icon }}</span>
        {{ sec.label }}
      </button>
    </div>

    <!-- TENDENCIAS PERIÓDICAS -->
    <div v-if="activeSection === 'tendencias'">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Tendencias periódicas</CardTitle>
          <p class="text-sm text-muted-foreground">
            Cómo varían las propiedades a lo largo de grupos (↓) y períodos (→).
          </p>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="t in tendenciasPeriodicas"
              :key="t.propiedad"
              class="rounded-lg border p-3 space-y-2"
            >
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: t.color }"></div>
                <span class="font-semibold text-sm">{{ t.propiedad }}</span>
              </div>
              <!-- Diagrama mini -->
              <div class="flex gap-4 text-xs">
                <div class="flex flex-col items-center gap-1">
                  <span class="text-muted-foreground text-[10px]">En grupo</span>
                  <div class="flex items-center gap-1 font-mono font-medium" :style="{ color: t.color }">
                    {{ t.grupo }}
                  </div>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <span class="text-muted-foreground text-[10px]">En período</span>
                  <div class="flex items-center gap-1 font-mono font-medium" :style="{ color: t.color }">
                    {{ t.periodo }}
                  </div>
                </div>
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ t.explicacion }}</p>
            </div>
          </div>

          <!-- Diagrama visual de tendencias -->
          <div class="mt-4 p-4 rounded-lg border bg-muted/20">
            <p class="text-xs font-medium mb-3 text-center text-muted-foreground">Resumen visual de tendencias</p>
            <div class="relative mx-auto" style="max-width: 320px">
              <!-- Grid simulado -->
              <div class="border rounded-lg overflow-hidden">
                <!-- Header -->
                <div class="flex">
                  <div class="w-16 h-8 border-r border-b flex items-center justify-center text-[9px] text-muted-foreground"></div>
                  <div class="flex-1 h-8 border-b flex items-center justify-center text-[10px] font-medium">
                    Período →
                  </div>
                </div>
                <div class="flex">
                  <div class="w-16 border-r flex items-center justify-center text-[10px] font-medium" style="writing-mode: vertical-rl; transform: rotate(180deg); height: 120px">
                    Grupo ↓
                  </div>
                  <div class="flex-1 grid grid-cols-4 grid-rows-4" style="height: 120px">
                    <template v-for="r in 4" :key="`grad-row-${r}`">
                      <div
                        v-for="c in 4"
                        :key="`grad-${r}-${c}`"
                        class="border border-border/30 flex items-center justify-center text-[8px] font-mono"
                        :style="{
                          backgroundColor: `rgba(96, 165, 250, ${0.1 + (r - 1) * 0.15 + (4 - c) * 0.1})`,
                        }"
                      >
                      </div>
                    </template>
                  </div>
                </div>
              </div>
              <div class="flex justify-between mt-2 text-[9px] text-muted-foreground px-16">
                <span>Radio ↗ (abajo-izq)</span>
                <span>EN ↗ (arriba-der)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- PARTÍCULAS -->
    <div v-if="activeSection === 'particulas'">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Partículas elementales (subatómicas)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead>
                <tr class="border-b bg-muted/30">
                  <th class="text-left py-2 px-3 font-medium">{{ particulasSubatomicas.headers[0] }}</th>
                  <th class="text-center py-2 px-3 font-mono font-medium">{{ particulasSubatomicas.headers[1] }}</th>
                  <th class="text-center py-2 px-3 font-mono font-medium">{{ particulasSubatomicas.headers[2] }}</th>
                  <th class="text-center py-2 px-3 font-mono font-medium">{{ particulasSubatomicas.headers[3] }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(r, i) in particulasSubatomicas.rows"
                  :key="i"
                  class="border-b border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <td class="py-2 px-3 font-medium">{{ r.prop }}</td>
                  <td class="py-2 px-3 font-mono text-xs text-center">{{ r.n }}</td>
                  <td class="py-2 px-3 font-mono text-xs text-center">{{ r.p }}</td>
                  <td class="py-2 px-3 font-mono text-xs text-center">{{ r.e }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ESTADOS DE OXIDACIÓN -->
    <div v-if="activeSection === 'oxidacion'">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Estados de oxidación comunes</CardTitle>
          <p class="text-sm text-muted-foreground">
            Estados de oxidación más frecuentes de elementos importantes.
          </p>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <div
              v-for="(e, i) in estadosOxidacion"
              :key="i"
              class="rounded-lg border px-3 py-2 hover:bg-muted/20 transition-colors"
            >
              <span class="font-mono font-bold text-base">{{ e.elemento }}</span>
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="(estado, j) in e.estados"
                  :key="j"
                  class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono font-medium"
                  :class="estado.startsWith('+') ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'"
                >
                  {{ estado }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- CARÁCTER IÓNICO -->
    <div v-if="activeSection === 'caracter'">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Porcentaje de carácter iónico</CardTitle>
          <p class="text-sm text-muted-foreground">
            Relación entre diferencia de electronegatividad (Δχ) y carácter iónico del enlace.
          </p>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
            <div
              v-for="(c, i) in caracterIonico"
              :key="i"
              class="flex flex-col rounded-lg border px-2 py-2 hover:bg-muted/20 transition-colors"
              :style="{
                borderLeftWidth: '3px',
                borderLeftColor: `hsl(${220 - (i / caracterIonico.length) * 220}, 70%, 55%)`
              }"
            >
              <span class="font-mono font-semibold">Δχ = {{ c.deltaEN }}</span>
              <span class="text-muted-foreground">{{ c.pct }}</span>
            </div>
          </div>
          <p class="mt-3 text-xs text-muted-foreground">
            Δχ ≥ 1.7 se considera enlace predominantemente iónico (≥50% carácter iónico).
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- SOLUBILIDAD -->
    <div v-if="activeSection === 'solubilidad'">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Reglas de solubilidad</CardTitle>
          <p class="text-sm text-muted-foreground">
            Compuestos iónicos en agua (25 °C). Soluble: &gt;30 g/L; Insoluble: &lt;1 g/L.
          </p>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
              v-for="(r, i) in reglasSolubilidad"
              :key="i"
              class="rounded-lg border p-3 hover:bg-muted/20 transition-colors"
              :class="r.resultado.startsWith('Siempre') || r.resultado.startsWith('Solubles')
                ? 'border-l-4 border-l-green-500'
                : 'border-l-4 border-l-red-400'"
            >
              <p class="font-medium text-sm">{{ r.regla }}</p>
              <p class="text-sm text-muted-foreground mt-1">→ {{ r.resultado }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- IONES POLIATÓMICOS -->
    <div v-if="activeSection === 'iones'">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Iones poliatómicos comunes</CardTitle>
        </CardHeader>
        <CardContent>
          <!-- Agrupados por carga -->
          <div class="space-y-4">
            <div v-for="carga in ['+1', '−1', '−2', '−3']" :key="carga">
              <h4 class="text-xs font-medium text-muted-foreground mb-2">
                Carga {{ carga }}
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
                <div
                  v-for="(ion, i) in ionesPoliatomicos.filter(x => x.carga === carga)"
                  :key="i"
                  class="flex flex-col rounded-lg border px-3 py-2 hover:bg-muted/20 transition-colors"
                >
                  <code class="font-mono font-semibold text-base">{{ ion.formula }}</code>
                  <span class="text-muted-foreground text-xs">{{ ion.nombre }}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ÁCIDOS Y BASES -->
    <div v-if="activeSection === 'acidos'">
      <div class="space-y-4">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Ácidos comunes</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead>
                  <tr class="border-b bg-muted/30">
                    <th class="text-left py-2 px-3 font-medium">Nombre</th>
                    <th class="text-left py-2 px-3 font-mono font-medium">Fórmula</th>
                    <th class="text-left py-2 px-3 font-medium">Tipo</th>
                    <th class="text-left py-2 px-3 font-medium">Notas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(a, i) in acidosComunes"
                    :key="i"
                    class="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td class="py-2 px-3">{{ a.nombre }}</td>
                    <td class="py-2 px-3 font-mono font-semibold">{{ a.formula }}</td>
                    <td class="py-2 px-3">
                      <span
                        class="inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium"
                        :class="a.tipo === 'Fuerte' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'"
                      >
                        {{ a.tipo }}
                      </span>
                    </td>
                    <td class="py-2 px-3 text-xs text-muted-foreground">{{ a.descripcion }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Bases comunes</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead>
                  <tr class="border-b bg-muted/30">
                    <th class="text-left py-2 px-3 font-medium">Nombre</th>
                    <th class="text-left py-2 px-3 font-mono font-medium">Fórmula</th>
                    <th class="text-left py-2 px-3 font-medium">Tipo</th>
                    <th class="text-left py-2 px-3 font-medium">Notas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(b, i) in basesComunes"
                    :key="i"
                    class="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td class="py-2 px-3">{{ b.nombre }}</td>
                    <td class="py-2 px-3 font-mono font-semibold">{{ b.formula }}</td>
                    <td class="py-2 px-3">
                      <span
                        class="inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium"
                        :class="b.tipo === 'Fuerte' ? 'bg-blue-500/10 text-blue-600' : 'bg-cyan-500/10 text-cyan-600'"
                      >
                        {{ b.tipo }}
                      </span>
                    </td>
                    <td class="py-2 px-3 text-xs text-muted-foreground">{{ b.descripcion }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- SERIE DE ACTIVIDAD -->
    <div v-if="activeSection === 'serie'">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Serie de actividad (potenciales E° en V)</CardTitle>
          <p class="text-sm text-muted-foreground">
            M²⁺ + 2e⁻ → M. Más negativo = mejor reductor. Referencia: 2H⁺ + 2e⁻ → H₂ (0.00 V).
          </p>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead>
                <tr class="border-b bg-muted/30">
                  <th class="text-left py-2 px-3 font-medium">Metal</th>
                  <th class="text-left py-2 px-3 font-medium">Ion</th>
                  <th class="text-left py-2 px-3 font-medium">E° (V)</th>
                  <th class="text-left py-2 px-3 font-medium w-40">Visual</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(m, i) in serieActividad"
                  :key="i"
                  class="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  :class="m.E0 === '0.00' ? 'bg-amber-500/5 font-semibold' : ''"
                >
                  <td class="py-2 px-3 font-mono font-semibold">{{ m.metal }}</td>
                  <td class="py-2 px-3 font-mono">{{ m.ion }}</td>
                  <td class="py-2 px-3 font-mono" :class="m.E0.startsWith('−') || m.E0.startsWith('+') ? '' : ''">
                    {{ m.E0 }}
                  </td>
                  <td class="py-2 px-3">
                    <div class="h-3 rounded-full overflow-hidden bg-muted relative">
                      <div
                        class="absolute h-full rounded-full"
                        :style="{
                          left: m.E0.startsWith('−') || m.E0.startsWith('+')
                            ? `${50 + parseFloat(m.E0.replace('−', '-').replace('+', '')) / 3.04 * 50}%`
                            : '50%',
                          width: '3px',
                          backgroundColor: parseFloat(m.E0.replace('−', '-').replace('+', '')) < 0 ? '#60a5fa' : '#f87171'
                        }"
                      ></div>
                      <!-- Center line for 0 -->
                      <div class="absolute left-1/2 top-0 w-px h-full bg-muted-foreground/30"></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="mt-2 text-xs text-muted-foreground">
            Los metales arriba del H₂ desplazan hidrógeno de ácidos. Los metales más activos desplazan a los menos activos de sus soluciones.
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- ORBITALES -->
    <div v-if="activeSection === 'orbitales'">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Orden de llenado de orbitales (Aufbau)</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <code class="block bg-muted rounded-lg p-4 text-sm font-mono leading-relaxed">
            {{ ordenLlenado[0] }}
          </code>

          <!-- Diagrama de Aufbau visual -->
          <div class="rounded-lg border p-4 bg-muted/10">
            <p class="text-xs font-medium text-muted-foreground mb-3">Diagrama de llenado (diagonal)</p>
            <div class="space-y-1.5 font-mono text-xs">
              <div v-for="n in 7" :key="n" class="flex items-center gap-2">
                <span class="w-4 text-muted-foreground text-right">{{ n }}</span>
                <div class="flex gap-1">
                  <span class="px-1.5 py-0.5 rounded bg-red-500/15 text-red-600 text-[10px]">{{ n }}s</span>
                  <span v-if="n >= 2" class="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 text-[10px]">{{ n }}p</span>
                  <span v-if="n >= 3" class="px-1.5 py-0.5 rounded bg-green-500/15 text-green-600 text-[10px]">{{ n }}d</span>
                  <span v-if="n >= 4" class="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-600 text-[10px]">{{ n }}f</span>
                </div>
                <span class="text-[9px] text-muted-foreground">
                  (máx: {{ n >= 4 ? '2+6+10+14' : n >= 3 ? '2+6+10' : n >= 2 ? '2+6' : '2' }} e⁻)
                </span>
              </div>
            </div>
          </div>

          <div class="text-xs text-muted-foreground space-y-1">
            <p><strong>Principio de Aufbau:</strong> Los electrones llenan orbitales de menor energía primero.</p>
            <p><strong>Regla de Hund:</strong> En orbitales degenerados, maximizar espines paralelos antes de aparear.</p>
            <p><strong>Principio de exclusión de Pauli:</strong> Máximo 2 electrones por orbital, con espines opuestos.</p>
            <p><strong>Excepciones notables:</strong> Cr ([Ar] 3d⁵ 4s¹) y Cu ([Ar] 3d¹⁰ 4s¹) — estabilidad de subcapas semillenas y llenas.</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- CONSTANTES -->
    <div v-if="activeSection === 'constantes'">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Constantes físicas y químicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div
              v-for="(c, i) in constantes"
              :key="i"
              class="flex items-baseline gap-2 rounded-lg border px-3 py-2.5 hover:bg-muted/20 transition-colors"
            >
              <code class="font-mono font-bold text-primary shrink-0">{{ c.simbolo }}</code>
              <div class="flex-1 min-w-0">
                <span class="text-muted-foreground text-xs">{{ c.nombre }}</span>
                <div class="font-mono text-xs truncate">{{ c.valor }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- CONVERSIONES -->
    <div v-if="activeSection === 'conversiones'">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Conversiones de unidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="(conv, i) in conversionesUnidades"
              :key="i"
              class="rounded-lg border p-3"
            >
              <h4 class="font-medium text-sm mb-1.5">{{ conv.magnitud }}</h4>
              <div class="space-y-1">
                <div
                  v-for="(c, j) in conv.conversiones"
                  :key="j"
                  class="text-xs font-mono bg-muted/30 rounded px-2 py-1"
                >
                  {{ c }}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- LEYENDA -->
    <div v-if="activeSection === 'leyenda'">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Leyenda — Propiedades en la celda del elemento</CardTitle>
          <p class="text-sm text-muted-foreground">
            Significado de los valores que aparecen en cada casilla de la tabla periódica (ej. Zn).
          </p>
        </CardHeader>
        <CardContent>
          <ul class="space-y-2 text-sm">
            <li
              v-for="(l, i) in leyendaElementos"
              :key="i"
              class="flex flex-col sm:flex-row sm:items-center gap-1 border-b border-border pb-2 last:border-0"
            >
              <span class="font-medium shrink-0">{{ l.prop }}</span>
              <code v-if="l.unidad !== '—'" class="text-xs text-muted-foreground">({{ l.unidad }})</code>
              <span class="text-muted-foreground">— {{ l.desc }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>

    <!-- PREFIJOS -->
    <div v-if="activeSection === 'prefijos'">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-base">Prefijos numéricos (nomenclatura)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(p, i) in prefijosNumericos"
              :key="i"
              class="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-sm"
            >
              <code class="font-bold">{{ p.prefijo }}</code>
              <span class="text-muted-foreground">= {{ p.n }}</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
