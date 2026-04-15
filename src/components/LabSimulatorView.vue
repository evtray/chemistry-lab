<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  alcoholimetricTable,
  geToPercentEthanol,
  percentEthanolToGe
} from '../data/labTableData.js'
import { FlaskConical, ArrowRightLeft, Table2, LineChart } from 'lucide-vue-next'

const activeTab = ref('converter')

const geInput = ref('')
const pctInput = ref('')

const geValue = computed(() => parseFloat(geInput.value))
const pctValue = computed(() => parseFloat(pctInput.value))

const geToPctResult = computed(() => {
  if (!Number.isFinite(geValue.value)) return null
  return geToPercentEthanol(geValue.value)
})

const pctToGeResult = computed(() => {
  if (!Number.isFinite(pctValue.value)) return null
  return percentEthanolToGe(pctValue.value)
})

// Datos para gráfica
const chartData = computed(() =>
  alcoholimetricTable.map((r) => ({ x: r.pctEthanol, y: r.ge }))
)

// Azeótropo etanol-agua
const azeotrope = { pct: 95.6, temp: 78.2 }
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap gap-2">
      <Button
        v-for="t in [
          { id: 'converter', label: 'Conversor GE ↔ %', icon: ArrowRightLeft },
          { id: 'table', label: 'Tabla', icon: Table2 },
          { id: 'chart', label: 'Gráfica', icon: LineChart }
        ]"
        :key="t.id"
        :variant="activeTab === t.id ? 'default' : 'outline'"
        size="sm"
        class="gap-1"
        @click="activeTab = t.id"
      >
        <component :is="t.icon" class="size-4" />
        {{ t.label }}
      </Button>
    </div>

    <!-- Conversor GE ↔ % etanol -->
    <Card v-if="activeTab === 'converter'">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <FlaskConical class="size-5" />
          Conversor Gravedad Específica ↔ % etanol (v/v)
        </CardTitle>
        <CardDescription>
          Basado en tablas de referencia (Perry, 20°C). En la práctica se usa 15,56°C; los valores son aproximados.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="grid gap-6 sm:grid-cols-2">
          <div class="space-y-3">
            <Label>GE → % etanol</Label>
            <Input
              v-model="geInput"
              type="number"
              step="0.0001"
              min="0.78"
              max="1.01"
              placeholder="ej: 0.9650"
            />
            <div
              v-if="geToPctResult !== null"
              class="rounded-lg bg-primary/10 p-4 font-mono text-lg text-primary"
            >
              {{ geToPctResult }}% v/v etanol
            </div>
          </div>
          <div class="space-y-3">
            <Label>% etanol → GE</Label>
            <Input
              v-model="pctInput"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="ej: 40"
            />
            <div
              v-if="pctToGeResult !== null"
              class="rounded-lg bg-amber-500/10 p-4 font-mono text-lg text-amber-700 dark:text-amber-300"
            >
              GE ≈ {{ pctToGeResult }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Tabla alcoholimétrica -->
    <Card v-if="activeTab === 'table'">
      <CardHeader>
        <CardTitle>Tabla alcoholimétrica (referencia 20°C)</CardTitle>
        <CardDescription>
          Densidad y gravedad específica de mezclas etanol-agua. GE = ρ/ρ_agua (ρ_agua ≈ 0.998 g/mL).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto max-h-[20rem] overflow-y-auto rounded-lg border">
          <table class="w-full text-sm">
            <thead class="sticky top-0 bg-muted">
              <tr>
                <th class="px-4 py-2 text-left font-semibold">% etanol (v/v)</th>
                <th class="px-4 py-2 text-left font-semibold">ρ (g/mL)</th>
                <th class="px-4 py-2 text-left font-semibold">GE</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in alcoholimetricTable"
                :key="row.pctEthanol"
                class="border-t hover:bg-muted/50"
              >
                <td class="px-4 py-2 font-medium">{{ row.pctEthanol }}%</td>
                <td class="px-4 py-2 font-mono">{{ row.density.toFixed(4) }}</td>
                <td class="px-4 py-2 font-mono">{{ row.ge }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Gráfica GE vs % -->
    <Card v-if="activeTab === 'chart'">
      <CardHeader>
        <CardTitle>Curva GE vs % etanol</CardTitle>
        <CardDescription>
          La gravedad específica disminuye al aumentar la concentración de etanol (menor densidad).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="h-64 sm:h-80 relative">
          <svg viewBox="0 0 400 250" class="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <!-- Grid -->
            <g stroke="currentColor" stroke-opacity="0.1" stroke-width="0.5">
              <line v-for="i in 5" :key="'v'+i" :x1="50 + i*70" y1="20" :x2="50 + i*70" y2="230" />
              <line v-for="i in 5" :key="'h'+i" x1="50" :y1="20 + i*42" x2="400" :y2="20 + i*42" />
            </g>
            <!-- Axes -->
            <line x1="50" y1="20" x2="50" y2="230" stroke="currentColor" stroke-width="1" />
            <line x1="50" y1="230" x2="400" y2="230" stroke="currentColor" stroke-width="1" />
            <!-- Labels -->
            <text x="220" y="248" text-anchor="middle" class="fill-muted-foreground" font-size="12">% etanol (v/v)</text>
            <text x="15" y="130" text-anchor="middle" transform="rotate(-90 15 130)" class="fill-muted-foreground" font-size="12">GE</text>
            <!-- Curve -->
            <polyline
              :points="chartData.map((d, i) => {
                const x = 50 + (d.x / 100) * 350
                const y = 230 - ((d.y - 0.79) / (1 - 0.79)) * 210
                return `${x},${y}`
              }).join(' ')"
              fill="none"
              stroke="hsl(var(--primary))"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <!-- Azeótropo marker -->
            <circle
              :cx="50 + (azeotrope.pct / 100) * 350"
              :cy="230 - ((percentEthanolToGe(azeotrope.pct) - 0.79) / 0.21) * 210"
              r="5"
              fill="hsl(var(--destructive))"
            />
            <text
              :x="50 + (azeotrope.pct / 100) * 350 + 8"
              :y="230 - ((percentEthanolToGe(azeotrope.pct) - 0.79) / 0.21) * 210"
              font-size="10"
              fill="hsl(var(--destructive))"
            >Azeótropo 95.6%</text>
          </svg>
        </div>
      </CardContent>
    </Card>

    <!-- Diagrama conceptual azeótropo -->
    <Card>
      <CardHeader>
        <CardTitle>Diagrama conceptual: Azeótropo etanol-agua</CardTitle>
        <CardDescription>
          A 95,6% etanol y 78,2°C, vapor y líquido tienen la misma composición. La destilación simple no supera este punto.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div class="text-center space-y-2">
            <div class="text-4xl font-bold text-primary">0%</div>
            <p class="text-sm text-muted-foreground">Agua pura</p>
            <p class="text-xs">P.E. 100°C</p>
          </div>
          <div class="flex items-center gap-2 text-muted-foreground">
            <div class="h-px w-8 bg-border" />
            <span class="text-xs">destilación</span>
          </div>
          <div class="text-center space-y-2 p-4 rounded-lg border-2 border-destructive/50 bg-destructive/5">
            <Badge variant="destructive">Azeótropo</Badge>
            <div class="text-2xl font-bold text-destructive">95,6%</div>
            <p class="text-sm">etanol · 78,2°C</p>
            <p class="text-xs text-muted-foreground">Límite destilación simple</p>
          </div>
          <div class="flex items-center gap-2 text-muted-foreground">
            <div class="h-px w-8 bg-border" />
            <span class="text-xs">no se supera</span>
          </div>
          <div class="text-center space-y-2">
            <div class="text-4xl font-bold text-primary">100%</div>
            <p class="text-sm text-muted-foreground">Etanol puro</p>
            <p class="text-xs">P.E. 78,4°C</p>
          </div>
        </div>
        <p class="text-sm text-muted-foreground text-center max-w-xl mx-auto">
          Para obtener etanol absoluto se requieren métodos alternativos: destilación azeotrópica con benceno, tamices moleculares o desecantes.
        </p>
      </CardContent>
    </Card>
  </div>
</template>
