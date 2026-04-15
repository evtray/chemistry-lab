<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { loadPeriodicTable, CATEGORY_COLORS, getPhaseAtTemp } from '@/data/periodicTableData.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const elements = ref([])
const selected = ref(null)
const loading = ref(true)
const search = ref('')
const activeCategory = ref(null)
const temperature = ref(298) // K (25°C por defecto)
const showTemperature = ref(false)
const hoveredElement = ref(null)
const tooltipPos = ref({ x: 0, y: 0 })
const detailTab = ref('general')
const detailPanelRef = ref(null)

onMounted(async () => {
  elements.value = await loadPeriodicTable()
  loading.value = false
})

// Categorías únicas para la leyenda
const categories = computed(() => {
  const cats = new Map()
  for (const el of elements.value) {
    if (!cats.has(el.category)) {
      cats.set(el.category, { key: el.category, label: el.categoryEs, color: el.categoryColor })
    }
  }
  return [...cats.values()]
})

// Búsqueda
const searchLower = computed(() => search.value.toLowerCase().trim())
const matchesSearch = (el) => {
  if (!searchLower.value) return true
  return (
    el.symbol.toLowerCase().includes(searchLower.value) ||
    el.name.toLowerCase().includes(searchLower.value) ||
    el.nameEs.toLowerCase().includes(searchLower.value) ||
    String(el.z).includes(searchLower.value)
  )
}

// Grid: 18 cols x 10 rows (0-indexed). Main table rows 0-6, gap row, f-block rows 8-9
const grid = computed(() => {
  const g = Array.from({ length: 10 }, () => Array(18).fill(null))
  for (const el of elements.value) {
    let col, row
    if (el.z >= 58 && el.z <= 71) {
      col = el.z - 58 + 3
      row = 8
    } else if (el.z >= 90 && el.z <= 103) {
      col = el.z - 90 + 3
      row = 9
    } else if (el.z === 57) {
      col = 2; row = 5
    } else if (el.z === 89) {
      col = 2; row = 6
    } else {
      col = el.x - 1; row = el.y - 1
    }
    if (row >= 0 && row < 10 && col >= 0 && col < 18) g[row][col] = el
  }
  return g
})

function select(el) {
  selected.value = el
  detailTab.value = 'general'
  // Hacer scroll al panel de detalle solo si no es visible (pantallas pequeñas)
  nextTick(() => {
    if (!detailPanelRef.value) return
    const rect = detailPanelRef.value.getBoundingClientRect()
    const isVisible = rect.top >= 0 && rect.top < window.innerHeight * 0.6
    if (!isVisible) {
      detailPanelRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

function getElementOpacity(el) {
  const catMatch = !activeCategory.value || el.category === activeCategory.value
  const searchMatch = matchesSearch(el)
  if (!catMatch || !searchMatch) return 0.15
  return 1
}

function getElementBgColor(el) {
  if (showTemperature.value) {
    const phase = getPhaseAtTemp(el, temperature.value)
    if (phase === 'Sólido') return '#60a5fa'
    if (phase === 'Líquido') return '#22d3ee'
    if (phase === 'Gas') return '#f87171'
    return '#6b7280'
  }
  return el.categoryColor
}

function toggleCategory(cat) {
  activeCategory.value = activeCategory.value === cat ? null : cat
}

function onElementHover(el, event) {
  hoveredElement.value = el
  const rect = event.target.getBoundingClientRect()
  tooltipPos.value = { x: rect.left + rect.width / 2, y: rect.top }
}

function onElementLeave() {
  hoveredElement.value = null
}

function tempCelsius(k) {
  return (k - 273.15).toFixed(0)
}

const GROUP_LABELS = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18']
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex items-center justify-center py-16 text-muted-foreground">
      Cargando tabla periódica...
    </div>

    <template v-else>
      <!-- Controles -->
      <div class="flex flex-wrap items-center gap-3">
        <Input
          v-model="search"
          placeholder="Buscar elemento (nombre, símbolo, Z)..."
          class="max-w-xs h-8 text-sm"
        />
        <button
          class="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors"
          :class="showTemperature ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted hover:bg-muted/80'"
          @click="showTemperature = !showTemperature"
        >
          <span>{{ showTemperature ? '🌡️' : '🌡️' }}</span>
          Estado vs temperatura
        </button>
      </div>

      <!-- Slider de temperatura -->
      <div v-if="showTemperature" class="flex items-center gap-3 px-2 py-3 rounded-lg border bg-muted/30">
        <span class="text-xs font-medium text-muted-foreground w-8">0 K</span>
        <input
          v-model.number="temperature"
          type="range"
          min="0"
          max="6500"
          step="10"
          class="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-primary"
        />
        <span class="text-xs font-medium text-muted-foreground w-14">6500 K</span>
        <div class="text-right min-w-[100px]">
          <span class="font-mono font-bold text-sm">{{ temperature }} K</span>
          <span class="text-xs text-muted-foreground ml-1">({{ tempCelsius(temperature) }} °C)</span>
        </div>
        <div class="flex gap-2 text-xs">
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-[#60a5fa]"></span>Sólido</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-[#22d3ee]"></span>Líquido</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-[#f87171]"></span>Gas</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-sm bg-[#6b7280]"></span>Desconocido</span>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,auto)_minmax(320px,1fr)] gap-6">
        <!-- Tabla -->
        <div class="overflow-x-auto">
          <div class="inline-block p-3 rounded-xl border bg-muted/10" style="min-width: min(100%, 720px)">
            <!-- Labels de grupo -->
            <div class="grid gap-0.5 font-mono text-[9px] text-muted-foreground mb-0.5"
              style="grid-template-columns: 1.5rem repeat(18, minmax(0, 1fr))"
            >
              <div></div>
              <div v-for="g in GROUP_LABELS" :key="g" class="text-center font-medium">{{ g }}</div>
            </div>

            <!-- Grid con labels de período -->
            <div
              class="grid gap-0.5 font-mono text-xs"
              style="grid-template-columns: 1.5rem repeat(18, minmax(0, 1fr))"
            >
              <template v-for="(row, ri) in grid" :key="ri">
                <!-- Label de período -->
                <div class="flex items-center justify-center text-[9px] text-muted-foreground font-medium h-[2.1rem]">
                  <template v-if="ri < 7">{{ ri + 1 }}</template>
                  <template v-else-if="ri === 7"></template>
                  <template v-else-if="ri === 8">*</template>
                  <template v-else-if="ri === 9">**</template>
                </div>
                <!-- Celdas de elementos -->
                <div
                  v-for="(el, ci) in row"
                  :key="`${ri}-${ci}`"
                  class="h-[2.1rem]"
                >
                  <!-- Separador visual para f-block -->
                  <div v-if="ri === 7 && !el" class="w-full h-full"></div>
                  <button
                    v-else-if="el"
                    type="button"
                    class="w-full h-full flex flex-col items-center justify-center rounded-[3px] min-w-0 px-0.5 transition-all duration-150 hover:scale-[1.15] hover:z-20 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary relative"
                    :style="{
                      backgroundColor: getElementBgColor(el) + '35',
                      borderColor: selected?.z === el.z ? 'var(--color-primary)' : getElementBgColor(el) + '60',
                      borderWidth: selected?.z === el.z ? '2px' : '1px',
                      borderStyle: 'solid',
                      opacity: getElementOpacity(el),
                      boxShadow: selected?.z === el.z ? '0 0 8px ' + getElementBgColor(el) + '80' : 'none'
                    }"
                    @click="select(el)"
                    @mouseenter="onElementHover(el, $event)"
                    @mouseleave="onElementLeave"
                  >
                    <span class="text-[8px] leading-none text-muted-foreground">{{ el.z }}</span>
                    <span class="font-bold text-[11px] leading-tight">{{ el.symbol }}</span>
                    <span class="text-[6px] leading-none text-muted-foreground truncate w-full text-center">{{ el.mass?.toFixed(1) }}</span>
                  </button>
                </div>
              </template>
            </div>

            <!-- Indicadores lantánidos/actínidos -->
            <div class="flex gap-4 mt-1 px-8 text-[9px] text-muted-foreground">
              <span>* Lantánidos (Z 57-71)</span>
              <span>** Actínidos (Z 89-103)</span>
            </div>
          </div>

          <!-- Leyenda de categorías -->
          <div class="mt-3 flex flex-wrap gap-1.5">
            <button
              v-for="cat in categories"
              :key="cat.key"
              class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium transition-all border"
              :class="activeCategory === cat.key ? 'ring-2 ring-primary shadow-sm' : 'opacity-80 hover:opacity-100'"
              :style="{
                backgroundColor: cat.color + '25',
                borderColor: cat.color + '50'
              }"
              @click="toggleCategory(cat.key)"
            >
              <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: cat.color }"></span>
              {{ cat.label }}
            </button>
          </div>
        </div>

        <!-- Panel de detalle -->
        <div ref="detailPanelRef" class="min-w-0" v-if="selected">
          <Card class="sticky top-4">
            <CardHeader class="pb-3">
              <div class="flex items-center gap-4">
                <div
                  class="w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold shadow-lg"
                  :style="{ backgroundColor: selected.categoryColor + 'cc', color: '#fff' }"
                >
                  <span class="text-[10px] opacity-80">{{ selected.z }}</span>
                  <span class="text-xl leading-tight">{{ selected.symbol }}</span>
                  <span class="text-[8px] opacity-70">{{ selected.mass?.toFixed(2) }}</span>
                </div>
                <div class="flex-1">
                  <CardTitle class="text-xl">{{ selected.name }}</CardTitle>
                  <div class="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="secondary" class="text-[10px]" :style="{ backgroundColor: selected.categoryColor + '30', color: selected.categoryColor }">
                      {{ selected.categoryEs }}
                    </Badge>
                    <Badge variant="outline" class="text-[10px]">
                      {{ selected.phaseEs }} (STP)
                    </Badge>
                    <Badge v-if="selected.block" variant="outline" class="text-[10px]">
                      Bloque {{ selected.block }}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent class="space-y-4 text-sm">
              <!-- Tabs del detalle -->
              <div class="flex gap-1 border-b pb-1">
                <button
                  v-for="tab in [
                    { id: 'general', label: 'General' },
                    { id: 'atomico', label: 'Atómico' },
                    { id: 'termico', label: 'Térmico' },
                    { id: 'historia', label: 'Historia' }
                  ]"
                  :key="tab.id"
                  class="px-3 py-1 rounded-t text-xs font-medium transition-colors"
                  :class="detailTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'"
                  @click="detailTab = tab.id"
                >
                  {{ tab.label }}
                </button>
              </div>

              <!-- Tab: General -->
              <div v-if="detailTab === 'general'" class="space-y-3">
                <div class="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Número atómico</span>
                    <span class="font-mono font-bold text-base">{{ selected.z }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Masa atómica</span>
                    <span class="font-mono font-bold text-base">{{ selected.mass != null ? selected.mass.toFixed(4) : '—' }} <span class="text-xs font-normal">u</span></span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Grupo</span>
                    <span class="font-mono font-medium">{{ selected.group ?? '—' }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Período</span>
                    <span class="font-mono font-medium">{{ selected.period }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Densidad</span>
                    <span class="font-mono font-medium">{{ selected.density != null ? selected.density : '—' }} <span class="text-xs font-normal">g/cm³</span></span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Electroneg. (Pauling)</span>
                    <span class="font-mono font-medium">{{ selected.electronegativity ?? '—' }}</span>
                  </div>
                </div>

                <!-- Capas electrónicas -->
                <div v-if="selected.shells.length">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Capas electrónicas</span>
                  <div class="flex items-center gap-4 mt-2">
                    <!-- Diagrama concéntrico -->
                    <div class="relative flex items-center justify-center shrink-0"
                      :style="{
                        width: Math.min(120, 28 + selected.shells.length * 14) + 'px',
                        height: Math.min(120, 28 + selected.shells.length * 14) + 'px'
                      }"
                    >
                      <div
                        v-for="(s, i) in [...selected.shells].reverse()"
                        :key="i"
                        class="absolute rounded-full border flex items-center justify-center"
                        :style="{
                          width: Math.min(120, 28 + (selected.shells.length - 1 - i) * 14) + 'px',
                          height: Math.min(120, 28 + (selected.shells.length - 1 - i) * 14) + 'px',
                          borderColor: selected.categoryColor + '50',
                          backgroundColor: i === selected.shells.length - 1 ? selected.categoryColor + '20' : 'transparent'
                        }"
                      >
                        <span
                          v-if="i === 0"
                          class="absolute font-mono font-bold text-[9px] leading-none"
                          :style="{
                            top: '1px',
                            color: selected.categoryColor
                          }"
                        >{{ s }}</span>
                        <span
                          v-else
                          class="absolute font-mono font-bold text-[9px] leading-none"
                          :style="{
                            top: '1px',
                            color: selected.categoryColor
                          }"
                        >{{ s }}</span>
                      </div>
                      <!-- Núcleo -->
                      <span class="relative z-10 font-mono font-bold text-xs" :style="{ color: selected.categoryColor }">
                        {{ selected.symbol }}
                      </span>
                    </div>
                    <!-- Labels -->
                    <div class="flex flex-col gap-1 min-w-0">
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="(s, i) in selected.shells"
                          :key="i"
                          class="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-medium"
                          :style="{
                            backgroundColor: selected.categoryColor + '15',
                            color: selected.categoryColor
                          }"
                        >
                          <span class="text-muted-foreground">{{ ['K','L','M','N','O','P','Q'][i] || i+1 }}:</span>{{ s }}
                        </span>
                      </div>
                      <span class="text-[10px] text-muted-foreground font-mono">
                        Total: {{ selected.shells.reduce((a,b) => a+b, 0) }} e⁻
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Config electrónica -->
                <div v-if="selected.electronConfig">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Configuración electrónica</span>
                  <code class="block bg-muted rounded px-2 py-1.5 text-xs mt-1 font-mono">{{ selected.electronConfig }}</code>
                  <code v-if="selected.electronConfigSemantic && selected.electronConfigSemantic !== selected.electronConfig"
                    class="block bg-muted/50 rounded px-2 py-1 text-[10px] mt-1 font-mono text-muted-foreground"
                  >
                    {{ selected.electronConfigSemantic }}
                  </code>
                </div>

                <!-- Apariencia -->
                <div v-if="selected.appearance">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Apariencia</span>
                  <p class="text-sm mt-0.5 capitalize">{{ selected.appearance }}</p>
                </div>
              </div>

              <!-- Tab: Atómico -->
              <div v-if="detailTab === 'atomico'" class="space-y-3">
                <div class="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Afinidad electrónica</span>
                    <span class="font-mono font-medium">{{ selected.electronAffinity != null ? selected.electronAffinity.toFixed(3) : '—' }} <span class="text-xs font-normal">kJ/mol</span></span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Electroneg. (Pauling)</span>
                    <span class="font-mono font-medium">{{ selected.electronegativity ?? '—' }}</span>
                  </div>
                </div>

                <!-- Energías de ionización -->
                <div v-if="selected.ionizationEnergies.length">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Energías de ionización (kJ/mol)</span>
                  <div class="mt-1.5 space-y-1">
                    <div
                      v-for="(ie, i) in selected.ionizationEnergies.slice(0, 8)"
                      :key="i"
                      class="flex items-center gap-2"
                    >
                      <span class="text-[10px] text-muted-foreground w-8 text-right font-mono">IE{{ i + 1 }}</span>
                      <div class="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all"
                          :style="{
                            width: Math.min(100, (ie / (selected.ionizationEnergies[selected.ionizationEnergies.length - 1] || ie)) * 100) + '%',
                            backgroundColor: selected.categoryColor
                          }"
                        ></div>
                      </div>
                      <span class="text-xs font-mono w-16 text-right">{{ ie.toFixed(1) }}</span>
                    </div>
                    <p v-if="selected.ionizationEnergies.length > 8" class="text-[10px] text-muted-foreground">
                      ...y {{ selected.ionizationEnergies.length - 8 }} más
                    </p>
                  </div>
                </div>

                <!-- Modelo de Bohr -->
                <div v-if="selected.bohrModelImage">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Modelo de Bohr</span>
                  <div class="mt-1 flex justify-center">
                    <img
                      :src="selected.bohrModelImage"
                      :alt="`Modelo de Bohr de ${selected.name}`"
                      class="w-32 h-32 object-contain rounded-lg bg-muted/30 p-2"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <!-- Tab: Térmico -->
              <div v-if="detailTab === 'termico'" class="space-y-3">
                <div class="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Punto de fusión</span>
                    <div class="font-mono font-medium">
                      <template v-if="selected.melt != null">
                        {{ selected.melt }} K
                        <span class="text-xs text-muted-foreground">({{ tempCelsius(selected.melt) }} °C)</span>
                      </template>
                      <template v-else>—</template>
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Punto de ebullición</span>
                    <div class="font-mono font-medium">
                      <template v-if="selected.boil != null">
                        {{ selected.boil }} K
                        <span class="text-xs text-muted-foreground">({{ tempCelsius(selected.boil) }} °C)</span>
                      </template>
                      <template v-else>—</template>
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Calor molar</span>
                    <span class="font-mono font-medium">{{ selected.molarHeat ?? '—' }} <span class="text-xs font-normal">J/(mol·K)</span></span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Densidad</span>
                    <span class="font-mono font-medium">{{ selected.density ?? '—' }} <span class="text-xs font-normal">g/cm³</span></span>
                  </div>
                </div>

                <!-- Barra visual fusión/ebullición -->
                <div v-if="selected.melt != null || selected.boil != null" class="mt-2">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Rango de fases</span>
                  <div class="mt-1.5 h-8 rounded-lg overflow-hidden flex relative bg-muted">
                    <template v-if="selected.melt != null && selected.boil != null">
                      <div
                        class="h-full flex items-center justify-center text-[9px] font-medium text-white"
                        :style="{ width: Math.max(10, (selected.melt / selected.boil) * 100) + '%', backgroundColor: '#60a5fa' }"
                      >
                        Sólido
                      </div>
                      <div
                        class="h-full flex items-center justify-center text-[9px] font-medium text-white"
                        :style="{ width: Math.max(10, ((selected.boil - selected.melt) / selected.boil) * 100) + '%', backgroundColor: '#22d3ee' }"
                      >
                        Líquido
                      </div>
                      <div
                        class="h-full flex-1 flex items-center justify-center text-[9px] font-medium text-white bg-[#f87171]"
                      >
                        Gas
                      </div>
                    </template>
                  </div>
                  <div class="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                    <span>0 K</span>
                    <span v-if="selected.melt">{{ selected.melt }} K (fusión)</span>
                    <span v-if="selected.boil">{{ selected.boil }} K (ebullición)</span>
                  </div>
                </div>
              </div>

              <!-- Tab: Historia -->
              <div v-if="detailTab === 'historia'" class="space-y-3">
                <div class="grid grid-cols-1 gap-3">
                  <div v-if="selected.discoveredBy">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Descubierto por</span>
                    <p class="font-medium mt-0.5">{{ selected.discoveredBy }}</p>
                  </div>
                  <div v-if="selected.namedBy">
                    <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Nombrado por</span>
                    <p class="font-medium mt-0.5">{{ selected.namedBy }}</p>
                  </div>
                </div>
                <div v-if="selected.summary">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Resumen</span>
                  <p class="text-sm text-muted-foreground mt-1 leading-relaxed">{{ selected.summary }}</p>
                </div>
                <a
                  v-if="selected.source"
                  :href="selected.source"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Ver en Wikipedia →
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center text-muted-foreground text-sm border border-dashed rounded-xl min-h-[300px] gap-2"
        >
          <span class="text-3xl opacity-30">⚛️</span>
          <span>Haz clic en un elemento para ver sus propiedades</span>
          <span class="text-xs">o usa la búsqueda y filtros para explorar</span>
        </div>
      </div>
    </template>

    <!-- Tooltip flotante -->
    <Teleport to="body">
      <div
        v-if="hoveredElement && hoveredElement.z !== selected?.z"
        class="fixed z-50 pointer-events-none bg-card border rounded-lg shadow-xl px-3 py-2 text-xs max-w-[200px]"
        :style="{
          left: tooltipPos.x + 'px',
          top: (tooltipPos.y - 8) + 'px',
          transform: 'translate(-50%, -100%)'
        }"
      >
        <div class="font-bold">{{ hoveredElement.name }}</div>
        <div class="text-muted-foreground text-[10px]">{{ hoveredElement.categoryEs }}</div>
        <div class="flex gap-3 mt-1 text-[10px] font-mono">
          <span>Z={{ hoveredElement.z }}</span>
          <span>{{ hoveredElement.mass?.toFixed(2) }} u</span>
        </div>
        <div v-if="hoveredElement.electronegativity" class="text-[10px] text-muted-foreground">
          χ={{ hoveredElement.electronegativity }}
        </div>
      </div>
    </Teleport>
  </div>
</template>
