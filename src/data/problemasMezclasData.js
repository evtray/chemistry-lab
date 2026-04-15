// Problemas de mezclas resueltos con factor unitario (análisis dimensional)
// Cada paso muestra la cadena de factores con unidades que se cancelan

export const problemasMezclas = [
  {
    id: 1,
    titulo: 'Gramos de soluto a partir de Molaridad',
    enunciado: '¿Cuántos gramos de NaCl se necesitan para preparar 250 mL de una solución 0.5 M?',
    datos: ['M = 0.5 mol/L', 'V = 250 mL', 'MM(NaCl) = 58.44 g/mol'],
    incognita: 'g de NaCl',
    categoria: 'molaridad',
    cadena: [
      {
        valor: '250 mL',
        factor: null,
        descripcion: 'Partimos del volumen dado'
      },
      {
        valor: '',
        factor: { num: '1 L', den: '1000 mL' },
        descripcion: 'Convertir mL a L',
        cancelaAnterior: 'mL'
      },
      {
        valor: '',
        factor: { num: '0.5 mol NaCl', den: '1 L' },
        descripcion: 'Usar la molaridad como factor (definición: mol/L)',
        cancelaAnterior: 'L'
      },
      {
        valor: '',
        factor: { num: '58.44 g NaCl', den: '1 mol NaCl' },
        descripcion: 'Usar la masa molar para convertir mol → g',
        cancelaAnterior: 'mol NaCl'
      }
    ],
    resultado: '250 × (1/1000) × 0.5 × 58.44 = 7.305 g NaCl',
    respuesta: '7.305 g de NaCl'
  },
  {
    id: 2,
    titulo: 'Molaridad a partir de densidad y %m/m',
    enunciado: 'El HCl concentrado tiene densidad 1.19 g/mL y es 37% m/m. ¿Cuál es su molaridad? (MM = 36.46 g/mol)',
    datos: ['ρ = 1.19 g/mL', '%m/m = 37%', 'MM(HCl) = 36.46 g/mol'],
    incognita: 'M (mol/L)',
    categoria: 'densidad',
    cadena: [
      {
        valor: '1.19 g sol.',
        factor: null,
        descripcion: 'Partimos de la densidad: 1.19 g de solución por cada mL'
      },
      {
        valor: '',
        factor: { num: '37 g HCl', den: '100 g sol.' },
        descripcion: 'El 37% m/m significa 37 g de HCl por 100 g de solución',
        cancelaAnterior: 'g sol.'
      },
      {
        valor: '',
        factor: { num: '1 mol HCl', den: '36.46 g HCl' },
        descripcion: 'Convertir gramos de HCl a moles',
        cancelaAnterior: 'g HCl'
      },
      {
        valor: '',
        factor: { num: '1000 mL', den: '1 L' },
        descripcion: 'Convertir de "por mL" a "por L" (molaridad es mol/L)',
        cancelaAnterior: null
      }
    ],
    resultado: '(1.19 × 37 / 100) × (1/36.46) × 1000 = 12.08 mol/L',
    respuesta: 'M = 12.08 mol/L'
  },
  {
    id: 3,
    titulo: 'Volumen de solución concentrada para dilución',
    enunciado: '¿Cuántos mL de HCl 12 M se necesitan para preparar 500 mL de HCl 0.1 M?',
    datos: ['M₁ = 12 mol/L', 'M₂ = 0.1 mol/L', 'V₂ = 500 mL'],
    incognita: 'V₁ (mL)',
    categoria: 'dilucion',
    cadena: [
      {
        valor: '500 mL',
        factor: null,
        descripcion: 'Volumen final deseado'
      },
      {
        valor: '',
        factor: { num: '1 L', den: '1000 mL' },
        descripcion: 'Convertir a litros',
        cancelaAnterior: 'mL'
      },
      {
        valor: '',
        factor: { num: '0.1 mol HCl', den: '1 L' },
        descripcion: 'Moles necesarios según concentración final',
        cancelaAnterior: 'L'
      },
      {
        valor: '',
        factor: { num: '1 L', den: '12 mol HCl' },
        descripcion: 'Volumen de solución concentrada que contiene esos moles (invertir M₁)',
        cancelaAnterior: 'mol HCl'
      },
      {
        valor: '',
        factor: { num: '1000 mL', den: '1 L' },
        descripcion: 'Convertir resultado a mL',
        cancelaAnterior: 'L'
      }
    ],
    resultado: '500 × (1/1000) × 0.1 × (1/12) × 1000 = 4.167 mL',
    respuesta: 'V₁ = 4.167 mL de HCl 12 M'
  },
  {
    id: 4,
    titulo: 'Masa de soluto en volumen dado con densidad y %m/m',
    enunciado: 'Una solución de NaOH es 20% m/m con densidad 1.22 g/mL. ¿Cuántos gramos de NaOH hay en 300 mL de solución?',
    datos: ['ρ = 1.22 g/mL', '%m/m = 20%', 'V = 300 mL'],
    incognita: 'g de NaOH',
    categoria: 'densidad',
    cadena: [
      {
        valor: '300 mL',
        factor: null,
        descripcion: 'Volumen de solución dado'
      },
      {
        valor: '',
        factor: { num: '1.22 g sol.', den: '1 mL' },
        descripcion: 'Usar densidad para convertir mL → g de solución',
        cancelaAnterior: 'mL'
      },
      {
        valor: '',
        factor: { num: '20 g NaOH', den: '100 g sol.' },
        descripcion: '20% m/m = 20 g NaOH por cada 100 g de solución',
        cancelaAnterior: 'g sol.'
      }
    ],
    resultado: '300 × 1.22 × (20/100) = 73.2 g NaOH',
    respuesta: '73.2 g de NaOH'
  },
  {
    id: 5,
    titulo: 'De %v/v a masa de soluto',
    enunciado: 'Una botella de ron tiene 750 mL y es 40% v/v de etanol. ¿Cuántos gramos de etanol contiene? (ρ_etanol = 0.789 g/mL)',
    datos: ['V_solución = 750 mL', '%v/v = 40%', 'ρ_etanol = 0.789 g/mL'],
    incognita: 'g de etanol',
    categoria: 'porcentaje',
    cadena: [
      {
        valor: '750 mL sol.',
        factor: null,
        descripcion: 'Volumen total de la botella'
      },
      {
        valor: '',
        factor: { num: '40 mL etanol', den: '100 mL sol.' },
        descripcion: '40% v/v = 40 mL de etanol por 100 mL de solución',
        cancelaAnterior: 'mL sol.'
      },
      {
        valor: '',
        factor: { num: '0.789 g etanol', den: '1 mL etanol' },
        descripcion: 'Densidad del etanol puro para convertir mL → g',
        cancelaAnterior: 'mL etanol'
      }
    ],
    resultado: '750 × (40/100) × 0.789 = 236.7 g etanol',
    respuesta: '236.7 g de etanol'
  },
  {
    id: 6,
    titulo: 'Preparar solución de %m/v a partir de sólido',
    enunciado: 'Se necesitan 2 L de solución de glucosa al 5% m/v. ¿Cuántos gramos de glucosa se requieren?',
    datos: ['V = 2 L = 2000 mL', '%m/v = 5%'],
    incognita: 'g de glucosa',
    categoria: 'porcentaje',
    cadena: [
      {
        valor: '2000 mL sol.',
        factor: null,
        descripcion: 'Volumen total a preparar (2 L = 2000 mL)'
      },
      {
        valor: '',
        factor: { num: '5 g glucosa', den: '100 mL sol.' },
        descripcion: '5% m/v = 5 g de soluto por cada 100 mL de solución',
        cancelaAnterior: 'mL sol.'
      }
    ],
    resultado: '2000 × (5/100) = 100 g glucosa',
    respuesta: '100 g de glucosa'
  },
  {
    id: 7,
    titulo: 'ppm a moles en volumen dado',
    enunciado: 'El agua potable contiene 2 ppm de flúor (F⁻). ¿Cuántos moles de F⁻ hay en 5 L de agua? (MM_F = 19.00 g/mol)',
    datos: ['Concentración = 2 ppm = 2 mg/L', 'V = 5 L', 'MM(F) = 19.00 g/mol'],
    incognita: 'mol de F⁻',
    categoria: 'ppm',
    cadena: [
      {
        valor: '5 L',
        factor: null,
        descripcion: 'Volumen de agua'
      },
      {
        valor: '',
        factor: { num: '2 mg F⁻', den: '1 L' },
        descripcion: '2 ppm = 2 mg de soluto por cada litro',
        cancelaAnterior: 'L'
      },
      {
        valor: '',
        factor: { num: '1 g', den: '1000 mg' },
        descripcion: 'Convertir mg a g',
        cancelaAnterior: 'mg'
      },
      {
        valor: '',
        factor: { num: '1 mol F⁻', den: '19.00 g F⁻' },
        descripcion: 'Masa molar para convertir g → mol',
        cancelaAnterior: 'g F⁻'
      }
    ],
    resultado: '5 × 2 × (1/1000) × (1/19.00) = 5.263 × 10⁻⁴ mol',
    respuesta: '5.263 × 10⁻⁴ mol de F⁻'
  },
  {
    id: 8,
    titulo: 'Conversión entre unidades de concentración',
    enunciado: 'Una solución de H₂SO₄ 3.0 M tiene densidad 1.18 g/mL. ¿Cuál es su %m/m? (MM = 98.08 g/mol)',
    datos: ['M = 3.0 mol/L', 'ρ = 1.18 g/mL', 'MM(H₂SO₄) = 98.08 g/mol'],
    incognita: '% m/m',
    categoria: 'conversion',
    cadena: [
      {
        valor: '3.0 mol H₂SO₄',
        factor: null,
        descripcion: 'Partimos de la molaridad: 3.0 mol por litro de solución'
      },
      {
        valor: '',
        factor: { num: '98.08 g H₂SO₄', den: '1 mol H₂SO₄' },
        descripcion: 'Convertir moles a gramos con la masa molar',
        cancelaAnterior: 'mol H₂SO₄'
      },
      {
        valor: '',
        factor: { num: '1 mL', den: '1.18 g sol.' },
        descripcion: 'Invertir densidad: de g de solución → mL (para 1 L hay 1180 g de sol.)',
        cancelaAnterior: null
      }
    ],
    resultado: 'g soluto = 3.0 × 98.08 = 294.24 g | g solución = 1000 × 1.18 = 1180 g | %m/m = (294.24/1180) × 100 = 24.94%',
    respuesta: '%m/m = 24.94%'
  },
  {
    id: 9,
    titulo: 'Volumen de solución para obtener masa de soluto',
    enunciado: '¿Qué volumen de H₂SO₄ al 96% m/m (ρ = 1.84 g/mL) se necesita para obtener 49.04 g de H₂SO₄ puro?',
    datos: ['m_soluto = 49.04 g', '%m/m = 96%', 'ρ = 1.84 g/mL'],
    incognita: 'mL de solución',
    categoria: 'densidad',
    cadena: [
      {
        valor: '49.04 g H₂SO₄',
        factor: null,
        descripcion: 'Masa de soluto puro que necesitamos'
      },
      {
        valor: '',
        factor: { num: '100 g sol.', den: '96 g H₂SO₄' },
        descripcion: 'Invertir % m/m: por cada 96 g de soluto hay 100 g de solución',
        cancelaAnterior: 'g H₂SO₄'
      },
      {
        valor: '',
        factor: { num: '1 mL', den: '1.84 g sol.' },
        descripcion: 'Invertir densidad para convertir g de solución → mL',
        cancelaAnterior: 'g sol.'
      }
    ],
    resultado: '49.04 × (100/96) × (1/1.84) = 27.76 mL',
    respuesta: '27.76 mL de H₂SO₄ concentrado'
  },
  {
    id: 10,
    titulo: 'Problema integrador: preparar solución diluida desde concentrada',
    enunciado: '¿Cuántos mL de HNO₃ concentrado (ρ = 1.42 g/mL, 70% m/m, MM = 63.01 g/mol) se necesitan para preparar 2 L de solución 0.5 M?',
    datos: ['ρ = 1.42 g/mL', '%m/m = 70%', 'MM = 63.01 g/mol', 'M₂ = 0.5 mol/L', 'V₂ = 2 L'],
    incognita: 'mL de HNO₃ concentrado',
    categoria: 'integrador',
    cadena: [
      {
        valor: '2 L',
        factor: null,
        descripcion: 'Volumen de solución diluida a preparar'
      },
      {
        valor: '',
        factor: { num: '0.5 mol HNO₃', den: '1 L' },
        descripcion: 'Moles necesarios según la molaridad deseada',
        cancelaAnterior: 'L'
      },
      {
        valor: '',
        factor: { num: '63.01 g HNO₃', den: '1 mol HNO₃' },
        descripcion: 'Convertir moles a gramos de soluto puro',
        cancelaAnterior: 'mol HNO₃'
      },
      {
        valor: '',
        factor: { num: '100 g sol.', den: '70 g HNO₃' },
        descripcion: 'Invertir %m/m: gramos de solución que contienen esa masa',
        cancelaAnterior: 'g HNO₃'
      },
      {
        valor: '',
        factor: { num: '1 mL', den: '1.42 g sol.' },
        descripcion: 'Invertir densidad: convertir g de solución → mL',
        cancelaAnterior: 'g sol.'
      }
    ],
    resultado: '2 × 0.5 × 63.01 × (100/70) × (1/1.42) = 63.38 mL',
    respuesta: '63.38 mL de HNO₃ concentrado'
  }
]
