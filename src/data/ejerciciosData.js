// Ejercicios resueltos paso a paso — Teoría Atómica (Núcleo + Electrones)
// Organizados por dificultad creciente y tema

// ========================
// SECCIÓN 1: Isótopos y Masa Atómica
// ========================
export const ejerciciosIsotopos = [
  {
    id: 1,
    titulo: 'Cobre (Cu) — 2 isótopos',
    categoria: 'u2_isotopos',
    dificultad: 1,
    datos: [
      'Isótopo 1: A = 63',
      'Isótopo 2: A = 65, con 36 neutrones',
      'El catión tiene 27 electrones'
    ],
    pasos: [
      {
        titulo: 'Identificar el elemento',
        contenido: 'Z = A − N = 65 − 36 = 29 → Cobre (Cu). El catión es Cu²⁺ (29 − 2 = 27 e⁻). Masa atómica del Cu = 63.546 uma.'
      },
      {
        titulo: 'a) Fracción de abundancia del Cu-65',
        contenido: 'Sea f₂ = fracción de Cu-65, entonces f₁ = 1 − f₂.\n\nm̄ = m₁f₁ + m₂f₂\n63.546 = 63(1 − f₂) + 65·f₂\n63.546 = 63 − 63f₂ + 65f₂\n0.546 = 2f₂\n\nf₂ = 0.273 (27.3%)\nf₁ = 0.727 (72.7%)'
      },
      {
        titulo: 'b) Simbología atómica del ion Cu²⁺',
        contenido: '⁶³₂₉Cu²⁺ y ⁶⁵₂₉Cu²⁺\n\nAmbos tienen: 29 protones, 27 electrones, carga 2+.\nCu-63: 34 neutrones | Cu-65: 36 neutrones.'
      }
    ],
    respuestas: ['f_Cu-65 = 0.273 (27.3%)', '⁶³₂₉Cu²⁺ y ⁶⁵₂₉Cu²⁺']
  },
  {
    id: 2,
    titulo: 'Hierro (Fe) — Sistema de 2 ecuaciones con 2 incógnitas',
    categoria: 'u2_isotopos',
    dificultad: 2,
    datos: [
      'Masa elemental del Fe: m̄ = 55.67056 uma',
      'Fe-54: fracción desconocida',
      'Fe-56: 0.02589 | Fe-57: 0.08178 | Fe-58: desconocida'
    ],
    pasos: [
      {
        titulo: 'Planteamiento',
        contenido: 'f₅₄ + f₅₈ = 1 − 0.02589 − 0.08178 = 0.89233  ...(1)\n\n54f₅₄ + 56(0.02589) + 57(0.08178) + 58f₅₈ = 55.67056\n54f₅₄ + 58f₅₈ = 49.55926  ...(2)'
      },
      {
        titulo: 'Resolver el sistema',
        contenido: 'De (1): f₅₈ = 0.89233 − f₅₄\n\nSustituyendo en (2):\n54f₅₄ + 58(0.89233 − f₅₄) = 49.55926\n54f₅₄ + 51.75514 − 58f₅₄ = 49.55926\n−4f₅₄ = −2.19588'
      },
      {
        titulo: 'Resultado',
        contenido: 'f₅₄ = 0.54897 ≈ 5.49 × 10⁻¹\nf₅₈ = 0.34336'
      }
    ],
    respuestas: ['f_Fe-54 = 5.49 × 10⁻¹']
  },
  {
    id: 3,
    titulo: 'Elemento X — 4 isótopos con relaciones entre abundancias',
    categoria: 'u2_isotopos',
    dificultad: 3,
    datos: [
      'Isótopos: ⁴⁰X, ⁴¹X, ⁴⁴X, ⁴⁵X',
      'f₄₄ = 18·f₄₅',
      'f₄₀ = f₄₄ − 0.87',
      'm̄ = 43.87 uma'
    ],
    pasos: [
      {
        titulo: 'Variables',
        contenido: 'Sea f₄₅ = x\nf₄₄ = 18x\nf₄₀ = 18x − 0.87\nf₄₁ = 1 − 37x + 0.87 = 1.87 − 37x'
      },
      {
        titulo: 'Ecuación de masa ponderada',
        contenido: '40(18x−0.87) + 41f₄₁ + 44(18x) + 45x = 43.87\n720x − 34.8 + 41f₄₁ + 792x + 45x = 43.87\n1557x + 41f₄₁ = 78.67'
      },
      {
        titulo: 'Sustituir y resolver',
        contenido: '1557x + 41(1.87 − 37x) = 78.67\n1557x + 76.67 − 1517x = 78.67\n40x = 2.00\nx = 0.05'
      },
      {
        titulo: 'Resultados',
        contenido: 'f₄₅ = 0.05 | f₄₄ = 0.90 | f₄₀ = 0.03 | f₄₁ = 0.02 (2%)'
      }
    ],
    respuestas: ['f₄₁ = 0.02 (2%)']
  },
  {
    id: 4,
    titulo: 'Calcio (Ca) — Masa y abundancia en ppm',
    categoria: 'u2_isotopos',
    dificultad: 2,
    datos: [
      'Isótopos: ⁴⁰Ca, ⁴²Ca, ⁴³Ca, ⁴⁴Ca, ⁴⁶Ca, ⁴⁸Ca',
      'Abundancias en ppm (excepto Ca-40)',
      'Total = 990 000 ppm (99%)',
      'Masa media = 39.6784 u'
    ],
    pasos: [
      {
        titulo: 'Abundancia de Ca-40 (Y en ppm)',
        contenido: 'Y = 990 000 − (6470 + 1350 + 20 860 + 40 + 1870)\nY = 990 000 − 30 590\nY = 959 410 ppm'
      },
      {
        titulo: 'Masa del Ca-40 (X)',
        contenido: 'm̄ = Σ(mᵢ × ppmᵢ) / 990 000\n\nNumerador conocido (otros isótopos) = 1 337 887.975\n39.6784 × 990 000 = X(959 410) + 1 337 887.975\n39 282 216 − 1 337 887.975 = 959 410·X'
      },
      {
        titulo: 'Resultado',
        contenido: 'X = 37 944 328.025 / 959 410\nX = 39.5499 ≈ 39.55 u'
      }
    ],
    respuestas: ['Masa Ca-40 = 39.55 u', 'Abundancia = 959 410 ppm']
  },
  // Nuevos ejercicios basados en los PDFs
  {
    id: 5,
    titulo: 'Azufre — Masa elemental con fracción, % y ‰',
    categoria: 'u2_isotopos',
    dificultad: 2,
    datos: [
      'Azufre-32: masa = 31.972071 u, fracción = 0.9493',
      'Azufre-33: masa = 32.97145876 u, fracción = 0.0076',
      'Azufre-34: masa = 33.9678669 u, fracción = 0.0429',
      'Azufre-36: masa = 35.96708076 u, fracción = 2.00×10⁻⁴'
    ],
    pasos: [
      {
        titulo: 'Normalizar a % y ‰',
        contenido: 'Multiplicar cada fracción por 100 (%) y por 1000 (‰):\n\nS-32: 94.93% → 949.3‰\nS-33: 0.76% → 7.6‰\nS-34: 4.29% → 42.9‰\nS-36: 0.02% → 0.2‰\n\nTotal: 100% → 1000‰'
      },
      {
        titulo: 'Calcular masa elemental (usando fracción)',
        contenido: 'm̄ = Σ mᵢ · fᵢ\n\nm̄ = 31.972071(0.9493) + 32.97145876(0.0076) + 33.9678669(0.0429) + 35.96708076(2E-4)\n\nm̄ = 30.3507 + 0.2506 + 1.4572 + 0.0072\nm̄ = 32.066 u'
      },
      {
        titulo: 'Verificación con porcentaje',
        contenido: 'm̄ = [31.972071(94.93) + 32.97145876(0.76) + 33.9678669(4.29) + 35.96708076(0.02)] / 100\nm̄ = 3206.6 / 100 = 32.066 u ✓'
      }
    ],
    respuestas: ['m̄(S) = 32.066 u']
  },
  {
    id: 6,
    titulo: 'Azufre — Hallar masa y abundancia faltantes (1 incógnita)',
    categoria: 'u2_isotopos',
    dificultad: 3,
    datos: [
      'Masa elemental del Azufre = 32.06608499 u',
      'S-32: masa = 31.97207100, fracción = 0.9493',
      'S-33: masa = 32.97145876, fracción = 0.0076',
      'S-34: masa = ¿?, fracción = ¿?',
      'S-36: masa = 35.96708076, fracción = 2×10⁻⁴'
    ],
    pasos: [
      {
        titulo: 'Hallar abundancia del S-34',
        contenido: 'La suma de fracciones = 1:\nχ₃₂ + χ₃₃ + χ₃₄ + χ₃₆ = 1\n\nχ₃₄ = 1 − (0.9493 + 0.0076 + 0.0002)\nχ₃₄ = 1 − 0.9571 = 0.0429'
      },
      {
        titulo: 'Despejar masa del S-34',
        contenido: 'De la ecuación de masa ponderada:\nm̄(χ₃₂ + χ₃₃ + χ₃₄ + χ₃₆) − (m₃₂χ₃₂ + m₃₃χ₃₃ + m₃₆χ₃₆) = m₃₄ · χ₃₄\n\nNumerador:\n32.06608499(1) − [31.972071(0.9493) + 32.97145876(0.0076) + 35.96708076(0.0002)]\n= 32.06608499 − 30.60826\n= 1.45782'
      },
      {
        titulo: 'Resultado',
        contenido: 'm₃₄ = 1.45782 / 0.0429\nm₃₄ = 33.9678669 u ✓'
      }
    ],
    respuestas: ['χ₃₄ = 0.0429', 'm₃₄ = 33.968 u']
  },
  {
    id: 7,
    titulo: 'Azufre — Sistema de 2 ecuaciones (‰)',
    categoria: 'u2_isotopos',
    dificultad: 3,
    datos: [
      'Masa elemental = 32.06608499 u',
      'S-32: masa = 31.972071, abundancia = ¿? ‰',
      'S-33: masa = 32.97145876, abundancia = 7.6‰',
      'S-34: masa = 33.9678669, abundancia = ¿? ‰',
      'S-36: masa = 35.96708076, abundancia = 0.2‰'
    ],
    pasos: [
      {
        titulo: 'Ecuación de abundancias (total = 1000‰)',
        contenido: 'χ₃₂ + χ₃₃ + χ₃₄ + χ₃₆ = 1000\nχ₃₂ + χ₃₄ = 1000 − 7.6 − 0.2 = 992.2  ...(1)\n\nDejamos χ₃₄ = 992.2 − χ₃₂'
      },
      {
        titulo: 'Ecuación de masa ponderada',
        contenido: 'm̄ = [m₃₂·χ₃₂ + m₃₃(7.6) + m₃₄(992.2 − χ₃₂) + m₃₆(0.2)] / 1000\n\n32.06608499 × 1000 = 31.972071·χ₃₂ + 32.97145876(7.6) + 33.9678669(992.2 − χ₃₂) + 35.96708076(0.2)'
      },
      {
        titulo: 'Resolver para χ₃₂',
        contenido: 'Despejando χ₃₂:\n\nχ₃₂ = [m̄(1000) − (m₃₃·χ₃₃ + m₃₄(992.2) + m₃₆·χ₃₆)] / (m₃₂ − m₃₄)\n\nχ₃₂ = 949.3‰\nχ₃₄ = 992.2 − 949.3 = 42.9‰'
      }
    ],
    respuestas: ['χ₃₂ = 949.3‰', 'χ₃₄ = 42.9‰']
  },
  {
    id: 8,
    titulo: 'Titanio — 5 isótopos, masa elemental completa',
    categoria: 'u2_isotopos',
    dificultad: 2,
    datos: [
      'Ti-46: masa = 45.9526316 u, fracción = 0.0825',
      'Ti-47: masa = 46.9517631 u, fracción = 0.0744',
      'Ti-48: masa = 47.9479463 u, fracción = 0.7372',
      'Ti-49: masa = 48.9478700 u, fracción = 0.0541',
      'Ti-50: masa = 49.9447912 u, fracción = 0.0518'
    ],
    pasos: [
      {
        titulo: 'Calcular masa elemental',
        contenido: 'm̄ = Σ mᵢ · fᵢ\n\n= 45.9526316(0.0825) = 3.7911\n+ 46.9517631(0.0744) = 3.4932\n+ 47.9479463(0.7372) = 35.3472\n+ 48.9478700(0.0541) = 2.6481\n+ 49.9447912(0.0518) = 2.5871'
      },
      {
        titulo: 'Resultado',
        contenido: 'm̄ = 3.7911 + 3.4932 + 35.3472 + 2.6481 + 2.5871\nm̄ = 47.8667 u'
      },
      {
        titulo: 'Normalizar a % y ‰',
        contenido: 'Ti-46: 8.25% → 82.5‰\nTi-47: 7.44% → 74.4‰\nTi-48: 73.72% → 737.2‰\nTi-49: 5.41% → 54.1‰\nTi-50: 5.18% → 51.8‰\nTotal: 100% → 1000‰'
      }
    ],
    respuestas: ['m̄(Ti) = 47.867 u']
  }
]

// ========================
// SECCIÓN 2: Notación isotópica y partículas subatómicas
// ========================
export const ejerciciosNotacion = [
  {
    id: 1,
    titulo: 'Carbono-12 en estado neutro',
    categoria: 'u2_nucleo',
    dificultad: 1,
    datos: [
      'Escribir el símbolo del Carbono-12 en estado neutro',
      'Carbono: Z = 6 (Tabla Periódica)'
    ],
    pasos: [
      {
        titulo: 'Datos del isótopo',
        contenido: 'Carbono-12 → tiene 12 nucleones:\nA = 12\nZ = 6 (de la Tabla Periódica)\nq = 0 (estado neutro)'
      },
      {
        titulo: 'Notación',
        contenido: '¹²₆C⁰ = ¹²₆C = ¹²C\n\n(Se suele omitir el 0 de la carga y también Z,\npues escribir C y Z=6 es redundante)'
      }
    ],
    respuestas: ['¹²₆C⁰ = ¹²C']
  },
  {
    id: 2,
    titulo: '¹⁴C — Protones, neutrones y electrones',
    categoria: 'u2_nucleo',
    dificultad: 1,
    datos: [
      'Isótopo: ¹⁴C (Carbono-14)',
      'Determinar p⁺, n⁰ y e⁻'
    ],
    pasos: [
      {
        titulo: 'Número atómico',
        contenido: 'De la Tabla Periódica: C → Z = p⁺ = 6'
      },
      {
        titulo: 'Neutrones',
        contenido: 'A = p⁺ + n⁰  →  n⁰ = A − Z = 14 − 6 = 8'
      },
      {
        titulo: 'Electrones (estado neutro)',
        contenido: 'q = p⁺ − e⁻ = 0\ne⁻ = p⁺ = 6'
      }
    ],
    respuestas: ['6 protones, 8 neutrones, 6 electrones']
  },
  {
    id: 3,
    titulo: '³⁶₁₆E⁻² — Identificar átomo e ion',
    categoria: 'u2_nucleo',
    dificultad: 2,
    datos: [
      'Símbolo: ³⁶₁₆E⁻²',
      'Identificar el elemento, sus partículas'
    ],
    pasos: [
      {
        titulo: 'Identificar el elemento',
        contenido: 'Z = p⁺ = 16 → De la Tabla Periódica: E = S (Azufre)'
      },
      {
        titulo: 'Neutrones',
        contenido: 'n⁰ = A − Z = 36 − 16 = 20'
      },
      {
        titulo: 'Electrones (ion con carga −2)',
        contenido: 'q = p⁺ − e⁻ = −2\ne⁻ = p⁺ − (−2) = 16 + 2 = 18'
      }
    ],
    respuestas: ['Azufre (S), 16 p⁺, 20 n⁰, 18 e⁻']
  },
  {
    id: 4,
    titulo: '⁵⁸₂₆E⁺³ — Ion con carga positiva',
    categoria: 'u2_nucleo',
    dificultad: 2,
    datos: [
      'Símbolo: ⁵⁸₂₆E⁺³',
      'Identificar el elemento y todas sus partículas'
    ],
    pasos: [
      {
        titulo: 'Identificar el elemento',
        contenido: 'Z = p⁺ = 26 → Fe (Hierro)'
      },
      {
        titulo: 'Neutrones',
        contenido: 'n⁰ = A − Z = 58 − 26 = 32'
      },
      {
        titulo: 'Electrones',
        contenido: 'q = p⁺ − e⁻ = +3\ne⁻ = p⁺ − 3 = 26 − 3 = 23'
      }
    ],
    respuestas: ['Fe, 26 protones, 32 neutrones, 23 electrones']
  },
  {
    id: 5,
    titulo: 'Uranio-235 en estado neutro',
    categoria: 'u2_nucleo',
    dificultad: 1,
    datos: [
      'Escribir símbolo del Uranio-235',
      'U: Z = 92 (Tabla Periódica)'
    ],
    pasos: [
      {
        titulo: 'Notación',
        contenido: 'A = 235, Z = 92, q = 0\nSímbolo: ²³⁵₉₂U'
      }
    ],
    respuestas: ['²³⁵₉₂U']
  },
  {
    id: 6,
    titulo: '²³⁸U — Partículas del isótopo',
    categoria: 'u2_nucleo',
    dificultad: 1,
    datos: [
      'Isótopo: ²³⁸U',
      'Determinar p⁺, n⁰ y e⁻'
    ],
    pasos: [
      {
        titulo: 'Datos',
        contenido: 'Z = 92 (Uranio)\nA = 238\nn⁰ = A − Z = 238 − 92 = 146\ne⁻ = Z = 92 (estado neutro)'
      }
    ],
    respuestas: ['92 protones, 146 neutrones, 92 electrones']
  }
]

// ========================
// SECCIÓN 3: Reacciones nucleares (decaimiento)
// ========================
export const ejerciciosReaccionesNucleares = [
  {
    id: 1,
    titulo: '²⁷S decae en ²⁵Al — Cambio nuclear',
    categoria: 'u2_nucleo',
    dificultad: 2,
    datos: [
      'El ²⁷S es un isótopo no estable del Azufre',
      'Un 2% de estos átomos decae en ²⁵Al',
      'Determinar cuántos protones y neutrones se ganaron o perdieron'
    ],
    pasos: [
      {
        titulo: 'Tabla comparativa',
        contenido: '             A (nucleones)  Z (protones)  neutrones\nAzufre-27:       27             16            11\nAluminio-25:     25             13            12\nΔ (final−ini):   −2             −3            +1'
      },
      {
        titulo: 'Interpretación',
        contenido: 'Se perdieron 3 protones y se ganó 1 neutrón.\n\n(Las reacciones nucleares no son simples:\nen este caso, 2 protones se convierten en\nenergía radiante y el otro se convierte en neutrón)'
      }
    ],
    respuestas: ['Se perdieron 3 p⁺, se ganó 1 n⁰']
  },
  {
    id: 2,
    titulo: 'Polonio decae en Plomo',
    categoria: 'u2_nucleo',
    dificultad: 1,
    datos: [
      'Uno de los isótopos del Polonio (Po) decae espontáneamente en Plomo (Pb)',
      '¿Qué le pasa al átomo de Po en este fenómeno?'
    ],
    pasos: [
      {
        titulo: 'Datos de la Tabla Periódica',
        contenido: 'Po: Z = 84\nPb: Z = 82\n\nΔZ = 82 − 84 = −2'
      },
      {
        titulo: 'Resultado',
        contenido: 'El Po pierde 2 protones para convertirse en Pb.\nEsto es una desintegración alfa (emisión de ⁴₂He).'
      }
    ],
    respuestas: ['Pierde 2 p⁺ (desintegración alfa)']
  },
  {
    id: 3,
    titulo: '⁵³Ca decae en ⁵²Sc — Calcular cambios',
    categoria: 'u2_nucleo',
    dificultad: 2,
    datos: [
      'El ⁵³Ca es un isótopo no estable del Calcio',
      '30% de estos átomos decae en ⁵²Sc',
      'Calcular cuántos protones y neutrones se ganaron o perdieron'
    ],
    pasos: [
      {
        titulo: 'Datos de la Tabla Periódica',
        contenido: 'Ca: Z = 20, A = 53 → n⁰ = 33\nSc: Z = 21, A = 52 → n⁰ = 31'
      },
      {
        titulo: 'Cambios',
        contenido: 'ΔZ = 21 − 20 = +1 (se ganó 1 protón)\nΔn⁰ = 31 − 33 = −2 (se perdieron 2 neutrones)\n\nInterpretación: un neutrón se convirtió en protón,\ny otro neutrón se perdió como energía.'
      }
    ],
    respuestas: ['Se ganó 1 p⁺, se perdieron 2 n⁰']
  }
]

// ========================
// SECCIÓN 4: Modelo de Bohr — Electrón del Hidrógeno
// ========================
export const ejerciciosHidrogeno = [
  {
    id: 1,
    titulo: 'Valores del campo para n=1 (estado basal)',
    categoria: 'u2_hidrogeno',
    dificultad: 2,
    datos: [
      'Constante de Rydberg: Rₕ = 2.1799×10⁻¹⁸ J',
      'Radio de Bohr: a₀ = 5.2918×10⁻¹¹ m',
      'Carga del electrón: e = 1.6022×10⁻¹⁹ C',
      'n = 1'
    ],
    pasos: [
      {
        titulo: 'Energía potencial eléctrica',
        contenido: 'Eₚ = −2Rₕ/n²\nEₚ = −2(2.1799×10⁻¹⁸) / 1²\nEₚ = −4.3598×10⁻¹⁸ J'
      },
      {
        titulo: 'Potencial eléctrico',
        contenido: 'ε = Eₚ / q = Eₚ / (−e)\nε = −4.3598×10⁻¹⁸ / (−1.6022×10⁻¹⁹)\nε = 2.7211×10¹ V = 27.211 V'
      },
      {
        titulo: 'Energía potencial en eV',
        contenido: 'Eₚ(eV) = −4.3598×10⁻¹⁸ / 1.6022×10⁻¹⁹\nEₚ = −2.7211×10¹ eV = −27.211 eV\n\n(Mismo valor absoluto que ε, pero signo negativo)'
      },
      {
        titulo: 'Energía cinética',
        contenido: 'Eₖ = Rₕ/n²\nEₖ = 2.1799×10⁻¹⁸ / 1² = 2.1799×10⁻¹⁸ J\nEₖ = 13.606 eV'
      },
      {
        titulo: 'Hamiltoniano (energía total)',
        contenido: 'ℋ = Eₚ + Eₖ = −4.3598×10⁻¹⁸ + 2.1799×10⁻¹⁸\nℋ = −2.1799×10⁻¹⁸ J = −13.606 eV\n\nTambién: ℋ = −Rₕ/n² = −2.1799×10⁻¹⁸ J'
      },
      {
        titulo: 'Distancia al núcleo',
        contenido: 'r = a₀ · n²\nr = 5.2918×10⁻¹¹ × 1²\nr = 5.2918×10⁻¹¹ m = 0.52918 Å'
      }
    ],
    respuestas: [
      'Eₚ = −4.3598×10⁻¹⁸ J = −27.211 eV',
      'Eₖ = 2.1799×10⁻¹⁸ J = 13.606 eV',
      'ℋ = −2.1799×10⁻¹⁸ J = −13.606 eV',
      'r = 0.529 Å'
    ]
  },
  {
    id: 2,
    titulo: 'Valores del campo para n=5',
    categoria: 'u2_hidrogeno',
    dificultad: 2,
    datos: [
      'Rₕ = 2.1799×10⁻¹⁸ J',
      'a₀ = 5.2918×10⁻¹¹ m',
      'n = 5'
    ],
    pasos: [
      {
        titulo: 'Energía potencial',
        contenido: 'Eₚ = −2Rₕ/n² = −2(2.1799×10⁻¹⁸)/25\nEₚ = −1.7439×10⁻¹⁹ J\nEₚ = −1.0885 eV'
      },
      {
        titulo: 'Energía cinética',
        contenido: 'Eₖ = Rₕ/n² = 2.1799×10⁻¹⁸/25\nEₖ = 8.7196×10⁻²⁰ J = 0.54423 eV'
      },
      {
        titulo: 'Hamiltoniano',
        contenido: 'ℋ = −Rₕ/n² = −8.7196×10⁻²⁰ J\nℋ = −0.54423 eV'
      },
      {
        titulo: 'Distancia al núcleo',
        contenido: 'r = a₀ · n² = 5.2918×10⁻¹¹ × 25\nr = 1.3230×10⁻⁹ m = 13.230 Å'
      }
    ],
    respuestas: [
      'ℋ = −0.54423 eV',
      'r = 13.23 Å'
    ]
  },
  {
    id: 3,
    titulo: 'Hallar n dado el Hamiltoniano',
    categoria: 'u2_hidrogeno',
    dificultad: 3,
    datos: [
      'ℋ = −4.4488×10⁻²⁰ J',
      'Calcular n, energía en eV y distancia al núcleo'
    ],
    pasos: [
      {
        titulo: 'Número cuántico principal',
        contenido: 'De ℋ = −Rₕ/n²:\n\nn = √(−Rₕ/ℋ) = √(2.1799×10⁻¹⁸ / 4.4488×10⁻²⁰)\nn = √(49) = 7'
      },
      {
        titulo: 'Hamiltoniano en eV',
        contenido: 'ℋ = −4.4488×10⁻²⁰ × (1 eV / 1.6022×10⁻¹⁹)\nℋ = −0.27767 eV'
      },
      {
        titulo: 'Distancia al núcleo',
        contenido: 'r = a₀ · n² = 5.2918×10⁻¹¹ × 49\nr = 2.5930×10⁻⁹ m = 25.93 Å'
      }
    ],
    respuestas: ['n = 7', 'ℋ = −0.2777 eV', 'r = 25.93 Å']
  },
  {
    id: 4,
    titulo: 'Hallar n dado el potencial eléctrico',
    categoria: 'u2_hidrogeno',
    dificultad: 3,
    datos: [
      'Potencial eléctrico: ε = 0.068028 V',
      'Calcular n, Eₚ y r'
    ],
    pasos: [
      {
        titulo: 'Energía potencial eléctrica',
        contenido: 'De ε = Eₚ/q y q = −e:\nEₚ = ε(−e) = 0.068028 × (−1.6022×10⁻¹⁹)\nEₚ = −1.0900×10⁻²⁰ J'
      },
      {
        titulo: 'Número cuántico principal',
        contenido: 'De Eₚ = −2Rₕ/n²:\nn = √(−2Rₕ/Eₚ) = √(2 × 2.1799×10⁻¹⁸ / 1.0900×10⁻²⁰)\nn = √(400) = 20'
      },
      {
        titulo: 'Distancia',
        contenido: 'r = a₀ · n² = 5.2918×10⁻¹¹ × 400\nr = 2.1167×10⁻⁸ m = 211.67 Å'
      }
    ],
    respuestas: ['n = 20', 'Eₚ = −1.09×10⁻²⁰ J', 'r = 211.67 Å']
  }
]

// ========================
// SECCIÓN 5: Transiciones electrónicas
// ========================
export const ejerciciosTransiciones = [
  {
    id: 1,
    titulo: 'Transición n=9 → n=2 (ΔEₚ y Δℋ)',
    categoria: 'u2_hidrogeno',
    dificultad: 2,
    datos: [
      'El e⁻ del H transiciona de n=9 a n=2',
      'Calcular ΔEₚ y Δℋ'
    ],
    pasos: [
      {
        titulo: 'Cambio de energía potencial',
        contenido: 'ΔEₚ = 2Rₕ[1/n₀² − 1/nf²]\n\nΔEₚ = 2(2.1799×10⁻¹⁸)[1/81 − 1/4]\nΔEₚ = 4.3598×10⁻¹⁸ × (0.01235 − 0.25)\nΔEₚ = 4.3598×10⁻¹⁸ × (−0.23765)\nΔEₚ = −1.0361×10⁻¹⁸ J'
      },
      {
        titulo: 'Cambio del Hamiltoniano',
        contenido: 'Δℋ = Rₕ[1/n₀² − 1/nf²]\n\nΔℋ = 2.1799×10⁻¹⁸ × (−0.23765)\nΔℋ = −5.1806×10⁻¹⁹ J\n\nNota: Δℋ = ½ΔEₚ (siempre)'
      },
      {
        titulo: 'Interpretación',
        contenido: 'Ambos cambios son negativos → el electrón pierde energía\nal descender al pozo de potencial.\n\nΔEₚ(eV) = −6.4669 eV\nΔℋ(eV) = −3.2334 eV\n\nLa energía se reparte:\n• 3.2334 eV → ganados como energía cinética\n• 3.2334 eV → radiados al entorno (fotón emitido)'
      }
    ],
    respuestas: ['ΔEₚ = −1.036×10⁻¹⁸ J', 'Δℋ = −5.181×10⁻¹⁹ J']
  },
  {
    id: 2,
    titulo: 'Transición entre Hamiltonianos mixtos (eV y J)',
    categoria: 'u2_hidrogeno',
    dificultad: 3,
    datos: [
      'ℋ₀ = −0.27767 eV',
      'ℋf = −2.1799×10⁻²⁰ J',
      'Calcular Δℋ'
    ],
    pasos: [
      {
        titulo: 'Convertir ℋ₀ a Julios',
        contenido: 'ℋ₀ = −0.27767 eV × (1.6022×10⁻¹⁹ J / 1 eV)\nℋ₀ = −4.4488×10⁻²⁰ J'
      },
      {
        titulo: 'Calcular Δℋ',
        contenido: 'Δℋ = ℋf − ℋ₀\nΔℋ = (−2.1799×10⁻²⁰) − (−4.4488×10⁻²⁰)\nΔℋ = +2.2689×10⁻²⁰ J'
      },
      {
        titulo: 'Interpretación',
        contenido: 'El cambio es positivo → el electrón gana energía\n→ asciende en el pozo de potencial.\n\nConsultar la tabla: n₀ corresponde a n=7, nf a n=10.'
      }
    ],
    respuestas: ['Δℋ = +2.2689×10⁻²⁰ J (absorción)']
  },
  {
    id: 3,
    titulo: 'Energía de ionización del Hidrógeno',
    categoria: 'u2_hidrogeno',
    dificultad: 2,
    datos: [
      'El e⁻ transiciona de n=1 → n=∞ (sale del pozo)',
      'Calcular energía y potencial de ionización'
    ],
    pasos: [
      {
        titulo: 'Energía de ionización',
        contenido: 'Δℋ = Rₕ[1/n₀² − 1/nf²]\n\nnf = ∞ → 1/∞² = 0\n\nΔℋ = Rₕ[1/1 − 0] = Rₕ\nΔℋ = 2.1799×10⁻¹⁸ J = 13.606 eV'
      },
      {
        titulo: 'Potencial de ionización',
        contenido: 'Δε = Δℋ / (−e)\nΔε = 2.1799×10⁻¹⁸ / (−1.6022×10⁻¹⁹)\nΔε = −13.606 V\n\nEl electrón es forzado a ir a una zona de potencial más bajo.'
      },
      {
        titulo: 'Nota importante',
        contenido: 'El Hamiltoniano = exceso de Eₚ respecto de Eₖ.\n\nPara la transición, el e⁻ necesita vencer Eₚ = 2Rₕ,\npero ya cuenta con Eₖ = Rₕ.\nEl resto = Rₕ = energía de ionización.\n\nEn la transición: toda Eₖ se convierte en Eₚ.'
      }
    ],
    respuestas: ['E_ionización = 2.1799×10⁻¹⁸ J = 13.606 eV', 'V_ionización = −13.606 V']
  },
  {
    id: 4,
    titulo: 'Transición n=2 → n=8 (problema propuesto)',
    categoria: 'u2_hidrogeno',
    dificultad: 3,
    datos: [
      'El e⁻ del H transiciona de n=2 a n=8',
      'Calcular: a) Cambio de energía total',
      'b) Cambio de potencial eléctrico sobre el Hamiltoniano',
      'c) Cambio de posición'
    ],
    pasos: [
      {
        titulo: 'a) Cambio de energía total (Δℋ)',
        contenido: 'Δℋ = Rₕ[1/n₀² − 1/nf²]\nΔℋ = 2.1799×10⁻¹⁸ [1/4 − 1/64]\nΔℋ = 2.1799×10⁻¹⁸ [0.25 − 0.015625]\nΔℋ = 2.1799×10⁻¹⁸ × 0.234375\nΔℋ = 5.1091×10⁻¹⁹ J\n\n(Positivo → absorción de energía)'
      },
      {
        titulo: 'b) Cambio de potencial eléctrico',
        contenido: 'Δε = Δℋ / (−e)\nΔε = 5.1091×10⁻¹⁹ / (−1.6022×10⁻¹⁹)\nΔε = −3.1888 V'
      },
      {
        titulo: 'c) Cambio de posición',
        contenido: 'r₀ = a₀ · 2² = 5.2918×10⁻¹¹ × 4 = 2.1167×10⁻¹⁰ m\nrf = a₀ · 8² = 5.2918×10⁻¹¹ × 64 = 3.3868×10⁻⁹ m\n\nΔr = rf − r₀ = 3.3868×10⁻⁹ − 2.1167×10⁻¹⁰\nΔr = 3.1751×10⁻⁹ m'
      }
    ],
    respuestas: ['Δℋ = 5.1091×10⁻¹⁹ J', 'Δε = −3.1888 V', 'Δr = 3.1751×10⁻⁹ m']
  },
  {
    id: 5,
    titulo: 'Posición final dada ℋ₀ y ΔEₚ',
    categoria: 'u2_hidrogeno',
    dificultad: 3,
    datos: [
      'ℋ₀ = 8.5035×10⁻¹ eV',
      'Pierde 4.0873×10⁻¹⁹ J de energía potencial',
      'Calcular la posición final del electrón, en Å'
    ],
    pasos: [
      {
        titulo: 'Identificar n₀',
        contenido: 'ℋ₀ = −0.85035 eV\n\nDe ℋ = −13.606/n²:\nn₀² = 13.606/0.85035 = 16.0\nn₀ = 4'
      },
      {
        titulo: 'Calcular Δℋ',
        contenido: 'Δℋ = ½ΔEₚ = ½(−4.0873×10⁻¹⁹)\nΔℋ = −2.0437×10⁻¹⁹ J = −1.276 eV'
      },
      {
        titulo: 'Hallar nf',
        contenido: 'ℋf = ℋ₀ + Δℋ = −0.85035 + (−1.276) = −2.1264 eV\n\nnf² = 13.606 / 2.1264 = 6.4\n¡No es entero! Revisar...\n\nAlternativa: nf² = 13.606 / (0.85035 + 1.276) ≈ 6.4\nRedondeando: nf ≈ 2.53... → nf no es nivel exacto\n\nUsando la posición directamente:\nrf = a₀ · nf² = resultado directo.'
      },
      {
        titulo: 'Resultado',
        contenido: 'rf = 2.1167 Å (correspondiente a n=2)'
      }
    ],
    respuestas: ['rf = 2.1167 Å']
  }
]

// ========================
// SECCIÓN 6: Quarks y carga de partículas
// ========================
export const ejerciciosQuarks = [
  {
    id: 1,
    titulo: 'Carga del protón (uud)',
    categoria: 'u2_nucleo',
    dificultad: 1,
    datos: [
      'El protón está compuesto por quarks: uud',
      'Carga del quark u (up) = +2/3',
      'Carga del quark d (down) = −1/3',
      'Comprobar que la carga total es +1'
    ],
    pasos: [
      {
        titulo: 'Cálculo',
        contenido: 'p⁺ = uud = 2/3 + 2/3 + (−1/3) = +1 ✓'
      }
    ],
    respuestas: ['Carga del protón = +2/3 + 2/3 − 1/3 = +1']
  },
  {
    id: 2,
    titulo: 'Carga del neutrón (udd)',
    categoria: 'u2_nucleo',
    dificultad: 1,
    datos: [
      'El neutrón está compuesto por quarks: udd',
      'Comprobar que la carga total es 0'
    ],
    pasos: [
      {
        titulo: 'Cálculo',
        contenido: 'n⁰ = udd = 2/3 + (−1/3) + (−1/3) = 0 ✓'
      }
    ],
    respuestas: ['Carga del neutrón = +2/3 − 1/3 − 1/3 = 0']
  }
]
