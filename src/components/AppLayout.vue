<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Atom, BookOpen, Calculator, FlaskConical, Home, PenLine,
  Ruler, Scale, Table2, Zap, Waves, Sun, Hash, Layers,
  Link, Tag, Wind, Beaker, ChevronDown, ChevronRight,
  Boxes, TrendingUp, FlaskRound, Moon, SunMedium,
  ArrowRight, Timer, Menu, X, Search, Command
} from 'lucide-vue-next'

// ── Modo oscuro ──
const isDark = ref(false)
function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('qg1-theme', dark ? 'dark' : 'light')
}
function toggleDark() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}
onMounted(() => {
  const saved = localStorage.getItem('qg1-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = saved ? saved === 'dark' : prefersDark
  applyTheme(isDark.value)
})

const route = useRoute()
const router = useRouter()

// ── Menú mobile ──
const mobileOpen = ref(false)
watch(() => route.path, () => { mobileOpen.value = false })

// ── Ítems de búsqueda (todos los destinos + herramientas) ──
const searchItems = [
  // General
  { path: '/', label: 'Inicio', keywords: 'home inicio', section: 'General', icon: Home },
  { path: '/examen', label: 'Modo Examen', keywords: 'examen simulacro tiempo cronómetro parcial prueba', section: 'General', icon: Timer },
  { path: '/quiz', label: 'Quiz', keywords: 'quiz preguntas respuestas práctica test', section: 'General', icon: Beaker },
  { path: '/flashcards', label: 'Flashcards', keywords: 'flashcards tarjetas memorizar repaso', section: 'General', icon: FlaskConical },
  { path: '/glosario', label: 'Glosario', keywords: 'glosario definiciones términos vocabulario', section: 'General', icon: BookOpen },
  { path: '/ejercicios', label: 'Ejercicios', keywords: 'ejercicios problemas cálculos numéricos', section: 'General', icon: PenLine },
  { path: '/calculadora', label: 'Calculadora', keywords: 'calculadora densidad mol gases concentración presión temperatura', section: 'General', icon: Calculator },
  { path: '/tabla-periodica', label: 'Tabla Periódica', keywords: 'tabla periódica elementos propiedades', section: 'General', icon: Table2 },
  // U1
  { path: '/quimica-ciencia', label: 'Química como Ciencia', keywords: 'método científico historia alquimia ramas lavoisier dalton química ciencia', section: 'U1', icon: FlaskRound },
  { path: '/mediciones', label: 'Mediciones', keywords: 'cifras significativas error incertidumbre densidad calibración medición SI', section: 'U1', icon: Ruler },
  { path: '/factor-unitario', label: 'Factor Unitario', keywords: 'factor unitario análisis dimensional conversión unidades molaridad dilución soluciones mezclas', section: 'U1', icon: ArrowRight },
  { path: '/materia', label: 'Materia', keywords: 'materia clasificación elemento compuesto mezcla densidad solución concentración dilución', section: 'U1', icon: Boxes },
  // U2
  { path: '/teoria-atomica', label: 'Teoría Atómica', keywords: 'modelo atómico dalton thomson rutherford bohr schrödinger electrón protón neutrón', section: 'U2', icon: Zap },
  { path: '/isotopos', label: 'Isótopos', keywords: 'isótopos masa atómica número atómico abundancia ponderada', section: 'U2', icon: Atom },
  { path: '/radiacion', label: 'Radiación EM', keywords: 'radiación electromagnética espectro fotón energía frecuencia longitud onda efecto fotoeléctrico', section: 'U2', icon: Waves },
  { path: '/hidrogeno', label: 'Átomo de Hidrógeno', keywords: 'hidrógeno bohr series espectrales lyman balmer paschen transiciones', section: 'U2', icon: Sun },
  { path: '/numeros-cuanticos', label: 'Números Cuánticos', keywords: 'números cuánticos n l ml ms orbital espín', section: 'U2', icon: Hash },
  { path: '/configuracion-electronica', label: 'Configuración Electrónica', keywords: 'configuración electrónica aufbau hund pauli orbitales diagrama caja ión', section: 'U2', icon: Layers },
  { path: '/slater', label: 'Reglas de Slater', keywords: 'slater apantallamiento carga nuclear efectiva Z* sigma pantalla', section: 'U2', icon: Scale },
  // U3
  { path: '/propiedades-periodicas', label: 'Propiedades Periódicas', keywords: 'propiedades periódicas potencial ionización electronegatividad afinidad electrónica radio atómico carácter metálico', section: 'U3', icon: TrendingUp },
  // U4
  { path: '/enlace-quimico', label: 'Enlace Químico', keywords: 'enlace covalente iónico metálico polar apolar lewis estructura resonancia carga formal', section: 'U4', icon: Link },
  // U5
  { path: '/nomenclatura', label: 'Nomenclatura', keywords: 'nomenclatura stock iupac tradicional óxido sal ácido hidróxido binario ternario', section: 'U5', icon: Tag },
  // U6
  { path: '/reacciones', label: 'Reacciones Químicas', keywords: 'reacciones síntesis descomposición desplazamiento combustión neutralización equilibrio cinética', section: 'U6', icon: Zap },
  { path: '/estequiometria', label: 'Estequiometría', keywords: 'estequiometría mol moles masa molar balanceo reactivo limitante rendimiento avogadro', section: 'U6', icon: Scale },
  // U7
  { path: '/gases', label: 'Gases', keywords: 'gases boyle charles avogadro gas ideal PV=nRT dalton graham presión volumen temperatura', section: 'U7', icon: Wind },
]

// ── Command palette ──
const paletteOpen = ref(false)
const searchQuery = ref('')
const selectedIdx = ref(0)
const searchInputRef = ref(null)

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return searchItems
  return searchItems.filter(item =>
    item.label.toLowerCase().includes(q) ||
    item.keywords.toLowerCase().includes(q) ||
    item.section.toLowerCase().includes(q)
  )
})

watch(searchQuery, () => { selectedIdx.value = 0 })
watch(paletteOpen, (val) => {
  if (val) {
    searchQuery.value = ''
    selectedIdx.value = 0
    setTimeout(() => searchInputRef.value?.focus(), 50)
  }
})

function openPalette() { paletteOpen.value = true }
function closePalette() { paletteOpen.value = false }

function selectItem(item) {
  router.push(item.path)
  closePalette()
  mobileOpen.value = false
}

function onKeydown(e) {
  // Ctrl+K / Cmd+K para abrir
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    paletteOpen.value = !paletteOpen.value
    return
  }
  if (!paletteOpen.value) return
  if (e.key === 'Escape') { closePalette(); return }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIdx.value = Math.min(selectedIdx.value + 1, filteredItems.value.length - 1)
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIdx.value = Math.max(selectedIdx.value - 1, 0)
  }
  if (e.key === 'Enter' && filteredItems.value[selectedIdx.value]) {
    selectItem(filteredItems.value[selectedIdx.value])
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// ── Sidebar sections ──
const sections = [
  {
    label: 'General',
    items: [
      { path: '/', label: 'Inicio', icon: Home },
      { path: '/examen', label: 'Modo Examen', icon: Timer },
      { path: '/quiz', label: 'Quiz', icon: Beaker },
      { path: '/flashcards', label: 'Flashcards', icon: FlaskConical },
      { path: '/glosario', label: 'Glosario', icon: BookOpen },
      { path: '/ejercicios', label: 'Ejercicios', icon: PenLine },
      { path: '/calculadora', label: 'Calculadora', icon: Calculator },
      { path: '/tabla-periodica', label: 'Tabla Periódica', icon: Table2 },
    ]
  },
  {
    label: 'U1: Ciencia y Medición',
    items: [
      { path: '/quimica-ciencia', label: 'Química como Ciencia', icon: FlaskRound },
      { path: '/mediciones', label: 'Mediciones', icon: Ruler },
      { path: '/factor-unitario', label: 'Factor Unitario', icon: ArrowRight },
      { path: '/materia', label: 'Materia', icon: Boxes },
    ]
  },
  {
    label: 'U2: Teoría Atómica',
    items: [
      { path: '/teoria-atomica', label: 'Teoría Atómica', icon: Zap },
      { path: '/isotopos', label: 'Isótopos', icon: Atom },
      { path: '/radiacion', label: 'Radiación EM', icon: Waves },
      { path: '/hidrogeno', label: 'Átomo de H', icon: Sun },
      { path: '/numeros-cuanticos', label: 'Núm. Cuánticos', icon: Hash },
      { path: '/configuracion-electronica', label: 'Config. Electrónica', icon: Layers },
      { path: '/slater', label: 'Reglas de Slater', icon: Scale },
    ]
  },
  {
    label: 'U3: Clasificación Periódica',
    items: [
      { path: '/propiedades-periodicas', label: 'Prop. Periódicas', icon: TrendingUp },
    ]
  },
  {
    label: 'U4: Enlace Químico',
    items: [
      { path: '/enlace-quimico', label: 'Enlace Químico', icon: Link },
    ]
  },
  {
    label: 'U5: Nomenclatura',
    items: [
      { path: '/nomenclatura', label: 'Nomenclatura', icon: Tag },
    ]
  },
  {
    label: 'U6: Estequiometría',
    items: [
      { path: '/reacciones', label: 'Reacciones Químicas', icon: Zap },
      { path: '/estequiometria', label: 'Estequiometría', icon: Scale },
    ]
  },
  {
    label: 'U7: Gases',
    items: [
      { path: '/gases', label: 'Gases', icon: Wind },
    ]
  }
]

const collapsedSections = ref(
  Object.fromEntries(sections.map(s => [s.label, s.label !== 'General']))
)

const toggleSection = (label) => {
  collapsedSections.value[label] = !collapsedSections.value[label]
}

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const sectionHasActive = (section) => section.items.some(item => isActive(item.path))

onMounted(() => {
  sections.forEach(s => {
    if (sectionHasActive(s)) collapsedSections.value[s.label] = false
  })
})

// Highlight texto buscado
function highlight(text, query) {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-primary/20 text-primary rounded px-0.5">$1</mark>')
}
</script>

<template>
  <div class="h-screen bg-muted/30 flex flex-col md:flex-row overflow-hidden">

    <!-- ══════════════════════════════════════════
         COMMAND PALETTE
    ══════════════════════════════════════════ -->
    <Transition name="overlay">
      <div
        v-if="paletteOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="closePalette" />

        <!-- Panel -->
        <div class="relative w-full max-w-lg bg-background rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[70vh]">
          <!-- Input -->
          <div class="flex items-center gap-3 px-4 py-3 border-b shrink-0">
            <Search class="size-4 text-muted-foreground shrink-0" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Buscar temas, herramientas, unidades…"
              class="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd class="hidden sm:flex items-center gap-0.5 text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono">
              Esc
            </kbd>
          </div>

          <!-- Resultados -->
          <div class="overflow-y-auto flex-1 py-1.5">
            <div v-if="filteredItems.length === 0" class="py-10 text-center text-sm text-muted-foreground">
              Sin resultados para "<strong>{{ searchQuery }}</strong>"
            </div>

            <template v-else>
              <!-- Agrupar por sección cuando no hay query -->
              <template v-if="!searchQuery.trim()">
                <div v-for="section in sections" :key="section.label">
                  <p class="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    {{ section.label }}
                  </p>
                  <button
                    v-for="item in section.items"
                    :key="item.path"
                    class="flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors"
                    :class="isActive(item.path)
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted text-foreground'"
                    @click="selectItem(item)"
                  >
                    <component :is="item.icon" class="size-4 shrink-0 text-muted-foreground" />
                    <span>{{ item.label }}</span>
                    <span v-if="isActive(item.path)" class="ml-auto text-xs text-primary font-medium">Actual</span>
                  </button>
                </div>
              </template>

              <!-- Resultados de búsqueda -->
              <template v-else>
                <button
                  v-for="(item, i) in filteredItems"
                  :key="item.path"
                  class="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                  :class="[
                    i === selectedIdx ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground',
                  ]"
                  @mouseenter="selectedIdx = i"
                  @click="selectItem(item)"
                >
                  <div
                    class="flex size-7 shrink-0 items-center justify-center rounded-md"
                    :class="i === selectedIdx ? 'bg-primary-foreground/20' : 'bg-muted'"
                  >
                    <component :is="item.icon" class="size-4" />
                  </div>
                  <div class="flex-1 min-w-0 text-left">
                    <p class="font-medium leading-none" v-html="highlight(item.label, searchQuery)" />
                    <p class="text-xs mt-0.5 opacity-60">{{ item.section }}</p>
                  </div>
                  <kbd
                    v-if="i === selectedIdx"
                    class="shrink-0 text-xs bg-primary-foreground/20 text-primary-foreground rounded px-1.5 py-0.5 font-mono"
                  >↵</kbd>
                </button>
              </template>
            </template>
          </div>

          <!-- Footer -->
          <div class="border-t px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground shrink-0 bg-muted/30">
            <span class="flex items-center gap-1"><kbd class="bg-muted rounded px-1 font-mono">↑↓</kbd> navegar</span>
            <span class="flex items-center gap-1"><kbd class="bg-muted rounded px-1 font-mono">↵</kbd> abrir</span>
            <span class="flex items-center gap-1"><kbd class="bg-muted rounded px-1 font-mono">Esc</kbd> cerrar</span>
            <span class="ml-auto flex items-center gap-1">
              <kbd class="bg-muted rounded px-1 font-mono">⌘K</kbd> atajo
            </span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════
         MOBILE: Top navbar
    ══════════════════════════════════════════ -->
    <header class="md:hidden flex items-center justify-between px-4 h-14 border-b bg-background shrink-0 z-30">
      <div class="flex items-center gap-2">
        <div class="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Atom class="size-4" />
        </div>
        <span class="font-bold text-sm">QG1</span>
      </div>

      <div class="flex items-center gap-1">
        <!-- Buscador mobile -->
        <button
          class="flex items-center gap-2 h-9 px-3 rounded-md bg-muted text-muted-foreground hover:text-foreground text-sm transition-colors"
          @click="openPalette"
        >
          <Search class="size-3.5" />
          <span class="text-xs">Buscar…</span>
        </button>
        <button
          class="flex size-9 items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          @click="toggleDark"
        >
          <SunMedium v-if="isDark" class="size-4" />
          <Moon v-else class="size-4" />
        </button>
        <button
          class="flex size-9 items-center justify-center rounded-md hover:bg-muted text-foreground transition-colors"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" class="size-5" />
          <Menu v-else class="size-5" />
        </button>
      </div>
    </header>

    <!-- Mobile: Drawer overlay -->
    <Transition name="overlay">
      <div
        v-if="mobileOpen"
        class="md:hidden fixed inset-0 top-14 bg-black/40 z-20"
        @click="mobileOpen = false"
      />
    </Transition>

    <!-- Mobile: Drawer panel -->
    <Transition name="slide">
      <nav
        v-if="mobileOpen"
        class="md:hidden fixed top-14 left-0 bottom-0 w-72 bg-background border-r z-20 flex flex-col overflow-hidden"
      >
        <div class="flex-1 overflow-y-auto py-3 scrollbar-hide">
          <div v-for="section in sections" :key="section.label" class="mb-1">
            <button
              class="flex w-full items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors"
              :class="sectionHasActive(section) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
              @click="toggleSection(section.label)"
            >
              <span>{{ section.label }}</span>
              <component
                :is="collapsedSections[section.label] ? ChevronRight : ChevronDown"
                class="size-3 shrink-0"
              />
            </button>
            <div v-if="!collapsedSections[section.label]" class="px-3 space-y-0.5">
              <router-link
                v-for="item in section.items"
                :key="item.path"
                :to="item.path"
                custom
                v-slot="{ navigate }"
              >
                <button
                  class="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
                  :class="isActive(item.path)
                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                    : 'text-foreground/70 hover:bg-muted hover:text-foreground'"
                  @click="navigate"
                >
                  <component :is="item.icon" class="size-4 shrink-0" />
                  <span class="truncate">{{ item.label }}</span>
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </Transition>

    <!-- ══════════════════════════════════════════
         DESKTOP: Sidebar
    ══════════════════════════════════════════ -->
    <aside class="hidden md:flex w-58 shrink-0 border-r bg-background flex-col overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-3.5 border-b shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Atom class="size-4" />
          </div>
          <span class="font-bold text-sm tracking-tight">Química General 1</span>
        </div>
        <button
          class="flex size-7 items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          :title="isDark ? 'Modo claro' : 'Modo oscuro'"
          @click="toggleDark"
        >
          <SunMedium v-if="isDark" class="size-3.5" />
          <Moon v-else class="size-3.5" />
        </button>
      </div>

      <!-- Buscador en sidebar -->
      <div class="px-3 py-2.5 border-b shrink-0">
        <button
          class="flex w-full items-center gap-2.5 h-8 px-3 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-sm transition-colors"
          @click="openPalette"
        >
          <Search class="size-3.5 shrink-0" />
          <span class="flex-1 text-left text-xs">Buscar…</span>
          <span class="hidden lg:flex items-center gap-0.5 text-[10px] bg-background border rounded px-1 font-mono opacity-60">
            ⌘K
          </span>
        </button>
      </div>

      <!-- Nav -->
      <div class="flex-1 overflow-y-auto py-2 scrollbar-hide">
        <div v-for="section in sections" :key="section.label" class="mb-1">
          <button
            class="flex w-full items-center justify-between px-3 py-1.5 transition-colors group"
            @click="toggleSection(section.label)"
          >
            <span
              class="text-[10px] font-bold uppercase tracking-widest transition-colors"
              :class="sectionHasActive(section)
                ? 'text-primary'
                : 'text-muted-foreground/60 group-hover:text-muted-foreground'"
            >{{ section.label }}</span>
            <component
              :is="collapsedSections[section.label] ? ChevronRight : ChevronDown"
              class="size-3 shrink-0 transition-colors"
              :class="sectionHasActive(section) ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-muted-foreground'"
            />
          </button>

          <div v-if="!collapsedSections[section.label]" class="px-2 space-y-0.5 pb-1">
            <router-link
              v-for="item in section.items"
              :key="item.path"
              :to="item.path"
              custom
              v-slot="{ navigate }"
            >
              <button
                class="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-all"
                :class="isActive(item.path)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
                @click="navigate"
              >
                <component
                  :is="item.icon"
                  class="size-3.5 shrink-0"
                  :class="isActive(item.path) ? 'text-primary' : ''"
                />
                <span class="truncate text-[13px]">{{ item.label }}</span>
                <span
                  v-if="isActive(item.path)"
                  class="ml-auto size-1.5 rounded-full bg-primary shrink-0"
                />
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </aside>

    <!-- ══════════════════════════════════════════
         MAIN CONTENT
    ══════════════════════════════════════════ -->
    <div class="flex-1 flex flex-col min-w-0 min-h-0">
      <main class="flex-1 min-h-0 p-4 md:p-6 lg:p-8 overflow-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
