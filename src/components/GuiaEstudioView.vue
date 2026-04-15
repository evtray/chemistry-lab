<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle, ChevronDown, ChevronRight, BookOpen, Atom, Beaker, Zap, FlaskRound, Target } from 'lucide-vue-next'

const temas = [
  {
    id: 'fundamentos',
    titulo: '1. Fundamentos: Materia y partículas',
    icono: Atom,
    color: 'text-blue-500',
    descripcion: 'Qué es la materia, partículas subatómicas, quarks',
    duracion: '~30 min',
    pasos: [
      { texto: 'Leer: ¿Qué es la materia? Masa, sistema, propiedades', recurso: 'Teoría Atómica', link: '/teoria-atomica' },
      { texto: 'Modelos atómicos: Dalton → Thomson → Rutherford → Bohr → Schrödinger', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Partículas fundamentales: protón (p⁺), neutrón (n⁰), electrón (e⁻)', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Quarks: up (+2/3) y down (−1/3). Protón = uud, Neutrón = udd', recurso: 'Ejercicios → Quarks', link: '/ejercicios' },
      { texto: 'Resolver: Comprobar carga del protón y neutrón con quarks', recurso: 'Ejercicios', link: '/ejercicios' },
      { texto: 'Quiz: Preguntas de u2_nucleo (modelos, quarks, partículas)', recurso: 'Quiz', link: '/quiz' },
    ]
  },
  {
    id: 'nucleo',
    titulo: '2. El Núcleo: Z, A y notación isotópica',
    icono: Target,
    color: 'text-green-500',
    descripcion: 'Número atómico, número masa, simbología ᴬ_Z E^q, iones',
    duracion: '~45 min',
    pasos: [
      { texto: 'Conceptos: Z = protones (identidad), A = protones + neutrones (masa)', recurso: 'Teoría Atómica', link: '/teoria-atomica' },
      { texto: 'Notación: ᴬ_Z E^q. E = símbolo, A = masa, Z = atómico, q = carga', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Practicar: Escribir ¹²C, ²³⁵U en estado neutro', recurso: 'Ejercicios → Notación', link: '/ejercicios' },
      { texto: 'Calcular p⁺, n⁰, e⁻ del ¹⁴C y ²³⁸U', recurso: 'Ejercicios → Notación', link: '/ejercicios' },
      { texto: 'IONES: ³⁶₁₆S²⁻ (e⁻ = Z − q = 16+2 = 18) y ⁵⁸₂₆Fe³⁺ (e⁻ = 26−3 = 23)', recurso: 'Ejercicios → Notación', link: '/ejercicios' },
      { texto: 'Reacciones nucleares: ²⁷S→²⁵Al, Po→Pb (contar Δp⁺ y Δn⁰)', recurso: 'Ejercicios → Reacciones', link: '/ejercicios' },
      { texto: 'Quiz: Preguntas sobre iones, neutrones, reacciones', recurso: 'Quiz', link: '/quiz' },
    ]
  },
  {
    id: 'isotopos',
    titulo: '3. Isótopos y Masa Atómica',
    icono: Beaker,
    color: 'text-purple-500',
    descripcion: 'Uma, masa isotópica, masa elemental, media ponderada, abundancias',
    duracion: '~1 hora',
    pasos: [
      { texto: 'Definición: isótopos = mismo Z, diferente A (diferente N)', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Isótopos del H: Protio (¹H), Deuterio (²H), Tritio (³H)', recurso: 'Teoría Atómica', link: '/teoria-atomica' },
      { texto: 'Uma: 1 u = 1/12 masa del ¹²C. Masa atómica ≈ A (en u)', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Masas: m(p⁺) ≈ m(n⁰) ≈ 1 u. m(e⁻) ≈ 0 (despreciable)', recurso: 'Quiz', link: '/quiz' },
      { texto: 'Masa elemental = media ponderada: m̄ = Σ mᵢ · fᵢ', recurso: 'Isótopos (calculadora)', link: '/isotopos' },
      { texto: 'Normalización: fracción (total=1), % (total=100), ‰ (total=1000)', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Ejercicio: Azufre — calcular m̄ con fracción y verificar con %', recurso: 'Ejercicios → Masa atómica', link: '/ejercicios' },
      { texto: 'Ejercicio: Titanio — 5 isótopos, calcular masa elemental', recurso: 'Ejercicios → Masa atómica', link: '/ejercicios' },
      { texto: 'Ejercicio DIFÍCIL: Hallar masa/abundancia faltante (1 incógnita)', recurso: 'Ejercicios → Masa atómica', link: '/ejercicios' },
      { texto: 'Ejercicio DIFÍCIL: Sistema 2 ecuaciones 2 incógnitas (Fe, S en ‰)', recurso: 'Ejercicios → Masa atómica', link: '/ejercicios' },
      { texto: 'Quiz: Todas las preguntas de u2_isotopos', recurso: 'Quiz', link: '/quiz' },
    ]
  },
  {
    id: 'hidrogeno',
    titulo: '4. Electrón del Hidrógeno (Modelo de Bohr)',
    icono: Zap,
    color: 'text-yellow-500',
    descripcion: 'REEMPE, números cuánticos, Eₚ, Eₖ, ℋ, ε, r — ecuaciones y cálculos',
    duracion: '~1.5 horas',
    pasos: [
      { texto: 'Estructura del átomo: núcleo (p⁺ + n⁰) + electrones en REEMPE', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'REEMPE = orbital. Electrón partícula vs electrón onda', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Números cuánticos: n (energía/distancia), l (forma), mₗ (orientación), mₛ (espín)', recurso: 'Teoría Atómica', link: '/teoria-atomica' },
      { texto: 'MEMORIZAR constantes: Rₕ = 2.1799×10⁻¹⁸ J, a₀ = 5.2918×10⁻¹¹ m, e = 1.6022×10⁻¹⁹ C', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Ecuaciones: Eₚ = −2Rₕ/n², Eₖ = Rₕ/n², ℋ = −Rₕ/n², r = a₀n²', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Relaciones clave: Eₚ = −2Eₖ, ℋ = −Eₖ, |Eₚ(eV)| = |ε(V)|', recurso: 'Quiz', link: '/quiz' },
      { texto: 'Potencial eléctrico: ε = Eₚ/q, donde q = −e para el electrón', recurso: 'Ejercicios → Átomo de H', link: '/ejercicios' },
      { texto: 'Ejercicio: Calcular TODO para n=1 (estado basal)', recurso: 'Ejercicios → Átomo de H', link: '/ejercicios' },
      { texto: 'Ejercicio: Calcular TODO para n=5', recurso: 'Ejercicios → Átomo de H', link: '/ejercicios' },
      { texto: 'Ejercicio INVERSO: Dado ℋ = −4.4488×10⁻²⁰ J, hallar n, eV, r', recurso: 'Ejercicios → Átomo de H', link: '/ejercicios' },
      { texto: 'Ejercicio INVERSO: Dado ε = 0.068028 V, hallar n, Eₚ, r', recurso: 'Ejercicios → Átomo de H', link: '/ejercicios' },
      { texto: 'Completar tabla de n=1 a n=∞ (como en el PDF)', recurso: 'Ejercicios → Átomo de H', link: '/ejercicios' },
      { texto: 'Quiz: Todas las preguntas de u2_hidrogeno', recurso: 'Quiz', link: '/quiz' },
    ]
  },
  {
    id: 'transiciones',
    titulo: '5. Transiciones electrónicas e ionización',
    icono: Zap,
    color: 'text-red-500',
    descripcion: 'ΔEₚ, Δℋ, emisión/absorción, energía de ionización, reparto de energía',
    duracion: '~1 hora',
    pasos: [
      { texto: 'Concepto: Δ = final − inicial. Negativo = pierde energía (emite)', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Fórmulas: ΔEₚ = 2Rₕ[1/n₀² − 1/nf²], Δℋ = Rₕ[1/n₀² − 1/nf²]', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'CLAVE: Δℋ = ½ΔEₚ (siempre en Bohr)', recurso: 'Quiz', link: '/quiz' },
      { texto: 'Decaimiento: pierde |ΔEₚ|. Mitad → Eₖ, mitad → fotón (= |Δℋ|)', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Ejercicio: Transición n=9 → n=2 (calcular ΔEₚ y Δℋ)', recurso: 'Ejercicios → Transiciones', link: '/ejercicios' },
      { texto: 'Ejercicio: Convertir entre eV y J en transiciones mixtas', recurso: 'Ejercicios → Transiciones', link: '/ejercicios' },
      { texto: 'Ejercicio: Energía de ionización del H (n=1 → n=∞)', recurso: 'Ejercicios → Transiciones', link: '/ejercicios' },
      { texto: 'Ejercicio: Transición n=2 → n=8 (Δℋ, Δε, Δr)', recurso: 'Ejercicios → Transiciones', link: '/ejercicios' },
      { texto: 'Pozo de potencial: ¿por qué energías negativas? ¿qué pasa en n=∞?', recurso: 'Quiz', link: '/quiz' },
      { texto: 'Quiz: Preguntas de transiciones, ionización, pozo', recurso: 'Quiz', link: '/quiz' },
    ]
  },
  {
    id: 'config',
    titulo: '6. Configuración electrónica',
    icono: BookOpen,
    color: 'text-cyan-500',
    descripcion: 'Aufbau, Hund, Pauli, paramagnetismo, Z*',
    duracion: '~45 min',
    pasos: [
      { texto: 'Máximo por nivel: 2n². Subniveles: s(2), p(6), d(10), f(14)', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Orden de llenado (Aufbau): 1s→2s→2p→3s→3p→4s→3d→...', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Regla de Hund: e⁻ desapareados primero en orbitales degenerados', recurso: 'Quiz', link: '/quiz' },
      { texto: 'Pauli: máx 2 e⁻ por orbital, espines opuestos', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Paramagnético (e⁻ desapareados) vs diamagnético (todos apareados)', recurso: 'Quiz', link: '/quiz' },
      { texto: 'Z* = Z − σ: carga nuclear efectiva y apantallamiento', recurso: 'Quiz', link: '/quiz' },
      { texto: 'Practicar configuraciones: O, Fe, Cu, Cr (excepciones d)', recurso: 'Teoría Atómica', link: '/teoria-atomica' },
      { texto: 'Quiz: Todas las preguntas de u2_configuracion y u2_cuanticos', recurso: 'Quiz', link: '/quiz' },
    ]
  },
  {
    id: 'repaso',
    titulo: '7. Repaso final integrador',
    icono: FlaskRound,
    color: 'text-orange-500',
    descripcion: 'Repasar todo, hacer quiz completo, identificar debilidades',
    duracion: '~1 hora',
    pasos: [
      { texto: 'Hacer quiz COMPLETO (78 preguntas) del módulo Curso', recurso: 'Quiz', link: '/quiz' },
      { texto: 'Repasar flashcards que fallaste (modo aleatorio)', recurso: 'Flashcards', link: '/flashcards' },
      { texto: 'Resolver TODOS los ejercicios de Masa Atómica sin ver solución', recurso: 'Ejercicios', link: '/ejercicios' },
      { texto: 'Resolver ejercicios de Bohr: calcular Eₚ, Eₖ, ℋ, ε, r para n=3 y n=8', recurso: 'Ejercicios', link: '/ejercicios' },
      { texto: 'Calcular ΔEₚ y Δℋ para una transición a tu elección', recurso: 'Ejercicios', link: '/ejercicios' },
      { texto: 'Verificar: ¿puedes escribir la notación de cualquier ion dado Z, A, q?', recurso: 'Ejercicios', link: '/ejercicios' },
      { texto: 'Tabla periódica: localizar elementos clave (H, He, C, N, O, S, Fe, Cu, U)', recurso: 'Tabla periódica', link: '/tabla-periodica' },
    ]
  }
]

// Progress tracking (persisted in localStorage)
const STORAGE_KEY = 'guia-estudio-progress'

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch { return {} }
}

const progress = ref(loadProgress())

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value))
}

function togglePaso(temaId, pasoIdx) {
  const key = `${temaId}-${pasoIdx}`
  progress.value[key] = !progress.value[key]
  saveProgress()
}

function isChecked(temaId, pasoIdx) {
  return !!progress.value[`${temaId}-${pasoIdx}`]
}

function temaProgress(tema) {
  const total = tema.pasos.length
  const done = tema.pasos.filter((_, i) => isChecked(tema.id, i)).length
  return { done, total, pct: Math.round((done / total) * 100) }
}

const totalProgress = computed(() => {
  const allPasos = temas.flatMap(t => t.pasos.map((_, i) => `${t.id}-${i}`))
  const done = allPasos.filter(k => progress.value[k]).length
  return { done, total: allPasos.length, pct: Math.round((done / allPasos.length) * 100) }
})

const expandedTemas = ref({ [temas[0].id]: true })

function toggleTema(id) {
  expandedTemas.value[id] = !expandedTemas.value[id]
}

function resetProgress() {
  progress.value = {}
  saveProgress()
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold">Guia de Estudio — Unidad 2: Teoria Atomica</h2>
      <p class="text-sm text-muted-foreground mt-1">
        Plan paso a paso para dominar todo el contenido. Marca cada paso al completarlo.
      </p>
    </div>

    <!-- Progress general -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">
            Progreso total: {{ totalProgress.done }}/{{ totalProgress.total }} pasos
          </span>
          <span class="text-sm font-bold" :class="totalProgress.pct === 100 ? 'text-green-600' : 'text-muted-foreground'">
            {{ totalProgress.pct }}%
          </span>
        </div>
        <Progress :model-value="totalProgress.pct" class="h-3" />
        <div class="flex justify-end mt-2">
          <button
            @click="resetProgress"
            class="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Reiniciar progreso
          </button>
        </div>
      </CardContent>
    </Card>

    <!-- Temas -->
    <div class="space-y-3">
      <Card v-for="tema in temas" :key="tema.id" class="overflow-hidden">
        <button
          type="button"
          class="w-full text-left"
          @click="toggleTema(tema.id)"
        >
          <CardHeader class="pb-3 hover:bg-muted/30 transition-colors">
            <div class="flex items-start gap-3">
              <div class="mt-0.5">
                <component
                  :is="expandedTemas[tema.id] ? ChevronDown : ChevronRight"
                  class="size-5 text-muted-foreground"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <component :is="tema.icono" :class="['size-5', tema.color]" />
                  <CardTitle class="text-base">{{ tema.titulo }}</CardTitle>
                  <Badge variant="outline" class="text-xs">{{ tema.duracion }}</Badge>
                </div>
                <CardDescription class="mt-1">{{ tema.descripcion }}</CardDescription>
                <div class="flex items-center gap-2 mt-2">
                  <Progress :model-value="temaProgress(tema).pct" class="h-2 flex-1" />
                  <span class="text-xs text-muted-foreground whitespace-nowrap">
                    {{ temaProgress(tema).done }}/{{ temaProgress(tema).total }}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </button>

        <CardContent v-show="expandedTemas[tema.id]" class="pt-0 pb-4">
          <div class="space-y-1 ml-8">
            <div
              v-for="(paso, idx) in tema.pasos"
              :key="idx"
              class="flex items-start gap-3 py-2 rounded-lg px-2 hover:bg-muted/30 transition-colors group"
            >
              <button
                type="button"
                @click="togglePaso(tema.id, idx)"
                class="mt-0.5 shrink-0"
              >
                <CheckCircle2
                  v-if="isChecked(tema.id, idx)"
                  class="size-5 text-green-500"
                />
                <Circle
                  v-else
                  class="size-5 text-muted-foreground/40 group-hover:text-muted-foreground"
                />
              </button>
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm"
                  :class="isChecked(tema.id, idx) ? 'line-through text-muted-foreground' : ''"
                >
                  {{ paso.texto }}
                </p>
                <router-link
                  :to="paso.link"
                  class="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  → {{ paso.recurso }}
                </router-link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Tips -->
    <Card class="border-primary/30 bg-primary/5">
      <CardHeader class="pb-3">
        <CardTitle class="text-sm font-medium">Consejos para estudiar</CardTitle>
      </CardHeader>
      <CardContent class="pt-0">
        <ul class="text-sm space-y-2 text-muted-foreground">
          <li><strong>Constantes:</strong> Memoriza Rₕ, a₀, e, y las 4 ecuaciones de Bohr. Todo se deriva de ahi.</li>
          <li><strong>Unidades:</strong> Practica convertir J ↔ eV (dividir entre 1.6022×10⁻¹⁹). |Eₚ en eV| = |ε en V|.</li>
          <li><strong>Isotopos:</strong> Los problemas dificiles son sistemas de ecuaciones. Practica despejar con sustitucion.</li>
          <li><strong>Transiciones:</strong> Recuerda Δℋ = ½ΔEₚ siempre. Si Δ negativo → emision. Si positivo → absorcion.</li>
          <li><strong>Iones:</strong> q = p⁺ − e⁻. Para aniones (q negativo): e⁻ = Z + |q|. Para cationes: e⁻ = Z − q.</li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>
