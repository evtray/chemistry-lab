<script setup>
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Atom, Beaker, BookOpen, Calculator, FlaskConical,
  PenLine, Ruler, Scale, Table2, Zap, Waves, Sun, Hash,
  Layers, Link, Tag, Wind, Boxes, TrendingUp, Trophy,
  RotateCcw, CheckCircle2, FlaskRound, Timer, ArrowRight
} from 'lucide-vue-next'
import { useProgress } from '@/composables/useProgress.js'

const { resumenUnidades, totalIntentos, unidadesCompletadas, promedioGeneral, resetProgress } = useProgress()

const herramientas = [
  { path: '/examen', icon: Timer, title: 'Modo Examen', description: 'Simulacro cronometrado con preguntas de todas las unidades', variant: 'default' },
  { path: '/quiz', icon: Beaker, title: 'Quiz por tema', description: 'Preguntas filtradas por unidad y categoría', variant: 'secondary' },
  { path: '/flashcards', icon: FlaskConical, title: 'Flashcards', description: 'Tarjetas de estudio con conceptos clave', variant: 'outline' },
  { path: '/glosario', icon: BookOpen, title: 'Glosario', description: '100+ términos con búsqueda y filtro por unidad', variant: 'outline' },
  { path: '/calculadora', icon: Calculator, title: 'Calculadora', description: 'Densidad, mol, gases, concentraciones…', variant: 'secondary' },
  { path: '/tabla-periodica', icon: Table2, title: 'Tabla Periódica', description: '118 elementos interactivos con propiedades', variant: 'default' },
]

const unidades = [
  {
    numero: 1, titulo: 'Ciencia y Medición', id: 'u1',
    temas: [
      { path: '/quimica-ciencia', icon: FlaskRound, label: 'Química como Ciencia', descripcion: 'Método científico, historia, ramas y relaciones' },
      { path: '/mediciones', icon: Ruler, label: 'Mediciones', descripcion: 'Cifras significativas, factor unitario, conversiones' },
      { path: '/factor-unitario', icon: ArrowRight, label: 'Factor Unitario', descripcion: '10 problemas resueltos con cadena de factores: mezclas, molaridad, diluciones' },
      { path: '/materia', icon: Boxes, label: 'Materia', descripcion: 'Clasificación, densidad, gravedad específica, soluciones' },
    ]
  },
  {
    numero: 2, titulo: 'Teoría Atómica', id: 'u2',
    temas: [
      { path: '/teoria-atomica', icon: Zap, label: 'Teoría Atómica', descripcion: 'Modelos atómicos, partículas subatómicas' },
      { path: '/isotopos', icon: Atom, label: 'Isótopos', descripcion: 'Número atómico, masa atómica, abundancias' },
      { path: '/radiacion', icon: Waves, label: 'Radiación EM', descripcion: 'Espectro, λ↔ν↔E, efecto fotoeléctrico' },
      { path: '/hidrogeno', icon: Sun, label: 'Átomo de Hidrógeno', descripcion: 'Bohr, series espectrales, transiciones' },
      { path: '/numeros-cuanticos', icon: Hash, label: 'Números Cuánticos', descripcion: 'n, l, mₗ, mₛ — explorador de orbitales' },
      { path: '/configuracion-electronica', icon: Layers, label: 'Config. Electrónica', descripcion: 'Aufbau, Hund, Pauli, Z* efectiva' },
      { path: '/slater', icon: Scale, label: 'Reglas de Slater', descripcion: 'σ, Z* = Z − σ, calculadora y tabla para Z=1–36' },
    ]
  },
  {
    numero: 3, titulo: 'Clasificación Periódica', id: 'u3',
    temas: [
      { path: '/propiedades-periodicas', icon: TrendingUp, label: 'Propiedades Periódicas', descripcion: 'PI, electronegatividad, AE, carácter metálico, valencia' },
      { path: '/tabla-periodica', icon: Table2, label: 'Tabla Periódica', descripcion: 'Grupos, períodos, elementos representativos y tierras raras' },
    ]
  },
  {
    numero: 4, titulo: 'Enlace Químico', id: 'u4',
    temas: [
      { path: '/enlace-quimico', icon: Link, label: 'Enlace Químico', descripcion: 'Covalente, iónico, metálico; Lewis, carga formal' },
    ]
  },
  {
    numero: 5, titulo: 'Nomenclatura', id: 'u5',
    temas: [
      { path: '/nomenclatura', icon: Tag, label: 'Nomenclatura', descripcion: 'Compuestos binarios y ternarios: Stock, IUPAC, tradicional' },
    ]
  },
  {
    numero: 6, titulo: 'Estequiometría', id: 'u6',
    temas: [
      { path: '/reacciones', icon: Zap, label: 'Reacciones Químicas', descripcion: 'Síntesis, descomposición, desplazamiento, combustión, equilibrio' },
      { path: '/estequiometria', icon: Scale, label: 'Estequiometría', descripcion: 'Mol, masa molar, balanceo, reactivo limitante, rendimiento' },
    ]
  },
  {
    numero: 7, titulo: 'Gases', id: 'u7',
    temas: [
      { path: '/gases', icon: Wind, label: 'Gases', descripcion: 'Boyle, Charles, Avogadro, gas ideal, Dalton, Graham' },
    ]
  },
]

function colorProgreso(pct) {
  if (pct >= 90) return 'text-green-600'
  if (pct >= 70) return 'text-blue-600'
  if (pct >= 50) return 'text-yellow-600'
  return 'text-red-500'
}

function barProgreso(pct) {
  if (pct >= 90) return 'bg-green-500'
  if (pct >= 70) return 'bg-blue-500'
  if (pct >= 50) return 'bg-yellow-500'
  return 'bg-red-400'
}
</script>

<template>
  <div class="space-y-10">
    <!-- Header -->
    <div class="text-center space-y-2 pt-2">
      <h1 class="text-3xl font-bold tracking-tight">Química General 1</h1>
      <p class="text-muted-foreground max-w-xl mx-auto">
        Plataforma de estudio interactiva. Navega por las 7 unidades, practica con quiz, flashcards y calculadoras.
      </p>
    </div>

    <!-- Dashboard de Progreso -->
    <section v-if="totalIntentos > 0">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-muted-foreground uppercase tracking-wider">Tu progreso</h2>
        <Button variant="ghost" size="sm" class="gap-1.5 text-muted-foreground" @click="resetProgress">
          <RotateCcw class="size-3.5" /> Reiniciar
        </Button>
      </div>
      <div class="grid gap-3 sm:grid-cols-3 mb-4">
        <Card class="text-center">
          <CardContent class="pt-4 pb-4">
            <p class="text-3xl font-bold text-primary">{{ totalIntentos }}</p>
            <p class="text-xs text-muted-foreground mt-1">quizzes completados</p>
          </CardContent>
        </Card>
        <Card class="text-center">
          <CardContent class="pt-4 pb-4">
            <p class="text-3xl font-bold" :class="promedioGeneral >= 70 ? 'text-green-600' : 'text-orange-500'">
              {{ promedioGeneral ?? '—' }}%
            </p>
            <p class="text-xs text-muted-foreground mt-1">mejor puntaje promedio</p>
          </CardContent>
        </Card>
        <Card class="text-center">
          <CardContent class="pt-4 pb-4">
            <p class="text-3xl font-bold text-blue-600">{{ unidadesCompletadas }} / 7</p>
            <p class="text-xs text-muted-foreground mt-1">unidades con ≥70%</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent class="pt-4 pb-4">
          <div class="space-y-3">
            <div v-for="u in resumenUnidades" :key="u.id" class="flex items-center gap-3">
              <span class="text-xs font-medium w-28 shrink-0">{{ u.label }}</span>
              <div class="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  v-if="u.data"
                  class="h-full rounded-full transition-all duration-500"
                  :class="barProgreso(u.data.mejorPct)"
                  :style="{ width: `${u.data.mejorPct}%` }"
                />
              </div>
              <div class="w-20 text-right shrink-0">
                <span v-if="u.data" class="text-sm font-mono font-semibold" :class="colorProgreso(u.data.mejorPct)">
                  {{ u.data.mejorPct }}%
                </span>
                <span v-else class="text-xs text-muted-foreground">sin datos</span>
              </div>
              <CheckCircle2 v-if="u.data && u.data.mejorPct >= 70" class="size-4 text-green-500 shrink-0" />
              <div v-else class="size-4 shrink-0" />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- CTA si no hay progreso -->
    <Card v-else class="border-dashed">
      <CardContent class="pt-6 pb-6 text-center space-y-3">
        <Trophy class="size-10 text-muted-foreground mx-auto" />
        <p class="text-sm font-medium">Empieza un quiz para ver tu progreso aquí</p>
        <router-link to="/quiz">
          <Button class="gap-2"><Beaker class="size-4" />Ir al Quiz</Button>
        </router-link>
      </CardContent>
    </Card>

    <!-- Herramientas de estudio -->
    <section>
      <h2 class="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-4">Herramientas de estudio</h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <router-link
          v-for="h in herramientas"
          :key="h.path"
          :to="h.path"
          class="block"
        >
          <Card class="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 h-full">
            <CardHeader class="pb-2">
              <div
                class="mb-2 flex size-10 items-center justify-center rounded-lg"
                :class="{
                  'bg-primary/10 text-primary': h.variant === 'default',
                  'bg-secondary text-secondary-foreground': h.variant === 'secondary',
                  'border bg-background': h.variant === 'outline',
                }"
              >
                <component :is="h.icon" class="size-5" />
              </div>
              <CardTitle class="text-base">{{ h.title }}</CardTitle>
              <CardDescription class="text-sm">{{ h.description }}</CardDescription>
            </CardHeader>
          </Card>
        </router-link>
      </div>
    </section>

    <!-- Temario por unidades -->
    <section>
      <h2 class="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-4">Temario del curso</h2>
      <div class="space-y-6">
        <div v-for="unidad in unidades" :key="unidad.numero">
          <div class="flex items-center gap-3 mb-3">
            <Badge class="text-xs font-mono shrink-0">Unidad {{ unidad.numero }}</Badge>
            <h3 class="font-semibold text-base">{{ unidad.titulo }}</h3>
            <CheckCircle2
              v-if="resumenUnidades.find(u => u.id === unidad.id)?.data?.mejorPct >= 70"
              class="size-4 text-green-500 shrink-0"
            />
          </div>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pl-2">
            <router-link
              v-for="tema in unidad.temas"
              :key="tema.path"
              :to="tema.path"
              class="block"
            >
              <Card class="cursor-pointer transition-all hover:shadow-sm hover:border-primary/40 h-full">
                <CardContent class="pt-4 pb-4 flex gap-3 items-start">
                  <div class="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <component :is="tema.icon" class="size-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-sm leading-tight">{{ tema.label }}</p>
                    <p class="text-xs text-muted-foreground mt-0.5 leading-snug">{{ tema.descripcion }}</p>
                  </div>
                </CardContent>
              </Card>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
