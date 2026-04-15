import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: 'Inicio' }
      },
      // Herramientas generales
      {
        path: 'examen',
        name: 'examen',
        component: () => import('@/views/ExamenPage.vue'),
        meta: { title: 'Modo Examen' }
      },
      {
        path: 'quiz',
        name: 'quiz',
        component: () => import('@/views/QuizPage.vue'),
        meta: { title: 'Quiz' }
      },
      {
        path: 'flashcards',
        name: 'flashcards',
        component: () => import('@/views/FlashcardsPage.vue'),
        meta: { title: 'Flashcards' }
      },
      {
        path: 'glosario',
        name: 'glosario',
        component: () => import('@/views/GlosarioPage.vue'),
        meta: { title: 'Glosario' }
      },
      {
        path: 'calculadora',
        name: 'calculadora',
        component: () => import('@/views/CalculadoraPage.vue'),
        meta: { title: 'Calculadora' }
      },
      {
        path: 'ejercicios',
        name: 'ejercicios',
        component: () => import('@/views/EjerciciosPage.vue'),
        meta: { title: 'Ejercicios' }
      },
      {
        path: 'tabla-periodica',
        name: 'tabla-periodica',
        component: () => import('@/views/TablaPeriodicaPage.vue'),
        meta: { title: 'Tabla periódica' }
      },
      // Unidad 1: Ciencia y Medición
      {
        path: 'quimica-ciencia',
        name: 'quimica-ciencia',
        component: () => import('@/views/QuimicaCienciaPage.vue'),
        meta: { title: 'Química como Ciencia' }
      },
      {
        path: 'factor-unitario',
        name: 'factor-unitario',
        component: () => import('@/views/FactorUnitarioPage.vue'),
        meta: { title: 'Factor Unitario' }
      },
      {
        path: 'mediciones',
        name: 'mediciones',
        component: () => import('@/views/MedicionesPage.vue'),
        meta: { title: 'Mediciones' }
      },
      {
        path: 'materia',
        name: 'materia',
        component: () => import('@/views/MateriaPage.vue'),
        meta: { title: 'Materia' }
      },
      // Unidad 2: Teoría Atómica
      {
        path: 'teoria-atomica',
        name: 'teoria-atomica',
        component: () => import('@/views/TeoriaAtomicaPage.vue'),
        meta: { title: 'Teoría Atómica' }
      },
      {
        path: 'isotopos',
        name: 'isotopos',
        component: () => import('@/views/IsotoposPage.vue'),
        meta: { title: 'Isótopos' }
      },
      {
        path: 'radiacion',
        name: 'radiacion',
        component: () => import('@/views/RadiacionEMPage.vue'),
        meta: { title: 'Radiación Electromagnética' }
      },
      {
        path: 'hidrogeno',
        name: 'hidrogeno',
        component: () => import('@/views/HidrogenoPage.vue'),
        meta: { title: 'Átomo de Hidrógeno' }
      },
      {
        path: 'numeros-cuanticos',
        name: 'numeros-cuanticos',
        component: () => import('@/views/NumerosCuanticosPage.vue'),
        meta: { title: 'Números Cuánticos' }
      },
      {
        path: 'configuracion-electronica',
        name: 'configuracion-electronica',
        component: () => import('@/views/ConfigElectronicaPage.vue'),
        meta: { title: 'Configuración Electrónica' }
      },
      {
        path: 'slater',
        name: 'slater',
        component: () => import('@/views/SlaterPage.vue'),
        meta: { title: 'Reglas de Slater' }
      },
      // Unidad 3: Clasificación Periódica
      {
        path: 'propiedades-periodicas',
        name: 'propiedades-periodicas',
        component: () => import('@/views/PropiedadesPeriodicasPage.vue'),
        meta: { title: 'Propiedades Periódicas' }
      },
      // Unidad 4: Enlace Químico
      {
        path: 'enlace-quimico',
        name: 'enlace-quimico',
        component: () => import('@/views/EnlaceQuimicoPage.vue'),
        meta: { title: 'Enlace Químico' }
      },
      // Unidad 5: Nomenclatura
      {
        path: 'nomenclatura',
        name: 'nomenclatura',
        component: () => import('@/views/NomenclaturaPage.vue'),
        meta: { title: 'Nomenclatura' }
      },
      // Unidad 6: Estequiometría
      {
        path: 'reacciones',
        name: 'reacciones',
        component: () => import('@/views/ReaccionesPage.vue'),
        meta: { title: 'Reacciones Químicas' }
      },
      {
        path: 'estequiometria',
        name: 'estequiometria',
        component: () => import('@/views/EstequiometriaPage.vue'),
        meta: { title: 'Estequiometría' }
      },
      // Unidad 7: Gases
      {
        path: 'gases',
        name: 'gases',
        component: () => import('@/views/GasesPage.vue'),
        meta: { title: 'Gases' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · Química General 1` : 'Química General 1'
})

export default router
