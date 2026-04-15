import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'qg1-progress-v2'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Estado reactivo global (singleton por módulo)
const progressData = ref(loadData())

watch(progressData, (val) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)) } catch {}
}, { deep: true })

export function useProgress() {
  /**
   * Registra el resultado de un quiz completado.
   * @param {string} unidad  - id de la unidad (ej. 'u1', 'u2', 'todas')
   * @param {number} correctas
   * @param {number} total
   */
  function registrarQuiz(unidad, correctas, total) {
    if (!total) return
    const key = unidad || 'todas'
    if (!progressData.value[key]) {
      progressData.value[key] = { intentos: 0, mejorPct: 0, ultimoPct: 0 }
    }
    const pct = Math.round((correctas / total) * 100)
    progressData.value[key].intentos++
    progressData.value[key].ultimoPct = pct
    if (pct > progressData.value[key].mejorPct) {
      progressData.value[key].mejorPct = pct
    }
    // Forzar reactividad
    progressData.value = { ...progressData.value }
  }

  function resetProgress() {
    progressData.value = {}
  }

  const resumenUnidades = computed(() => {
    const unidades = [
      { id: 'u1', label: 'U1: Ciencia y Medición' },
      { id: 'u2', label: 'U2: Teoría Atómica' },
      { id: 'u3', label: 'U3: Clasificación Periódica' },
      { id: 'u4', label: 'U4: Enlace Químico' },
      { id: 'u5', label: 'U5: Nomenclatura' },
      { id: 'u6', label: 'U6: Estequiometría' },
      { id: 'u7', label: 'U7: Gases' },
    ]
    return unidades.map(u => ({
      ...u,
      data: progressData.value[u.id] ?? null
    }))
  })

  const totalIntentos = computed(() =>
    Object.values(progressData.value).reduce((s, d) => s + (d.intentos ?? 0), 0)
  )

  const unidadesCompletadas = computed(() =>
    resumenUnidades.value.filter(u => u.data && u.data.mejorPct >= 70).length
  )

  const promedioGeneral = computed(() => {
    const vals = Object.values(progressData.value)
      .filter(d => d.intentos > 0)
      .map(d => d.mejorPct)
    if (!vals.length) return null
    return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
  })

  return {
    progressData,
    registrarQuiz,
    resetProgress,
    resumenUnidades,
    totalIntentos,
    unidadesCompletadas,
    promedioGeneral
  }
}
