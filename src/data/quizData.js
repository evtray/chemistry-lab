// practice: 'p1' | 'p2' | 'p3'
export const quizQuestions = [
  // === PRÁCTICA 3 ===
  {
    id: 1,
    practice: 'p3',
    question: "¿Cómo influye la temperatura en la densidad de los líquidos?",
    options: [
      "La densidad aumenta al aumentar la temperatura",
      "La densidad disminuye al aumentar la temperatura",
      "La temperatura no afecta la densidad",
      "Solo afecta a los gases"
    ],
    correct: 1,
    explanation: "Al calentar, las moléculas se mueven más y ocupan más espacio, por lo que la densidad disminuye."
  },
  {
    id: 2,
    practice: 'p3',
    question: "¿Qué tipo de propiedad es la concentración de una solución?",
    options: ["Extensiva", "Intensiva", "Física", "Química"],
    correct: 1,
    explanation: "La concentración es una propiedad intensiva: no depende de la cantidad de materia."
  },
  {
    id: 3,
    practice: 'p3',
    question: "¿Qué significa 40% v/v de etanol?",
    options: [
      "40 g de etanol en 100 g de solución",
      "40 mL de etanol en 100 mL de bebida",
      "40 moles por litro",
      "40 grados Gay-Lussac"
    ],
    correct: 1,
    explanation: "% v/v = volumen de soluto / volumen de solución × 100."
  },
  {
    id: 4,
    practice: 'p3',
    question: "¿Cuándo se usa destilación simple?",
    options: [
      "Para mezclas con puntos de ebullición muy cercanos",
      "Para separar líquidos con diferencia de P.E. > 25°C",
      "Para sustancias que se descomponen al calentar",
      "Para sustancias inmiscibles con agua"
    ],
    correct: 1,
    explanation: "La destilación simple se usa cuando hay diferencia grande de puntos de ebullición (>25°C)."
  },
  {
    id: 5,
    practice: 'p3',
    question: "¿Por qué las mediciones se hacen a 15,56 °C?",
    options: [
      "Es la temperatura ambiente estándar",
      "Las tablas de gravedad específica están referidas a esa temperatura",
      "El etanol hierve a esa temperatura",
      "Es más fácil medir a esa temperatura"
    ],
    correct: 1,
    explanation: "Las tablas de GE y concentración de etanol están referidas a 15,56 °C (60 °F)."
  },
  {
    id: 6,
    practice: 'p3',
    question: "¿Qué es un azeótropo etanol-agua?",
    options: [
      "Una mezcla que no se puede destilar",
      "Mezcla que hierve a T constante; vapor tiene la misma composición que el líquido",
      "Etanol puro al 100%",
      "Una mezcla que hierve a 100°C"
    ],
    correct: 1,
    explanation: "El azeótropo etanol-agua es ~95,6% etanol a 78,2°C."
  },
  {
    id: 7,
    practice: 'p3',
    question: "¿Por qué el agua de refrigeración va en contracorriente?",
    options: [
      "Para ahorrar agua",
      "Para tener máximo gradiente de temperatura y condensar eficientemente",
      "Por costumbre en laboratorio",
      "Para evitar congelar el condensador"
    ],
    correct: 1,
    explanation: "El vapor caliente entra por arriba; el agua fría por abajo. Máximo gradiente en todo el condensador."
  },
  {
    id: 8,
    practice: 'p3',
    question: "¿Qué velocidad de destilación es óptima?",
    options: [
      "Lo más rápido posible",
      "1-2 gotas por segundo",
      "Un chorro continuo",
      "Muy lento, 1 gota cada 10 segundos"
    ],
    correct: 1,
    explanation: "Gotas regulares (1-2 por segundo) permiten buen equilibrio líquido-vapor."
  },
  {
    id: 9,
    practice: 'p3',
    question: "¿Qué error es sistemático al medir volumen con probeta?",
    options: [
      "Variación en la posición del ojo",
      "Probeta mal calibrada",
      "Temperatura ambiente variable",
      "Pérdida al transferir"
    ],
    correct: 1,
    explanation: "Los errores sistemáticos son constantes (calibración)."
  },
  {
    id: 10,
    practice: 'p3',
    question: "¿Qué factores disminuyen la exactitud de la separación por destilación?",
    options: [
      "Destilación lenta",
      "Destilación muy rápida, fugas, temperatura incorrecta",
      "Usar hielo en el baño",
      "Medir a 15,56 °C"
    ],
    correct: 1,
    explanation: "Destilación rápida, fugas, temperatura distinta a 15,56°C y burbujas reducen la exactitud."
  },
  // === PRÁCTICA 1 ===
  {
    id: 11,
    practice: 'p1',
    question: "¿Dónde se debe leer el menisco al medir volumen?",
    options: [
      "En la parte superior de la curva",
      "En la parte inferior de la curva (concavidad)",
      "En el punto medio",
      "No importa"
    ],
    correct: 1,
    explanation: "Se lee en la parte inferior del menisco para evitar error por capilaridad."
  },
  {
    id: 12,
    practice: 'p1',
    question: "¿La densidad es una propiedad fundamental o derivada?",
    options: ["Fundamental", "Derivada (masa/volumen)", "Intensiva solamente", "Extensiva"],
    correct: 1,
    explanation: "La densidad se deriva de masa y volumen: ρ = m/V."
  },
  {
    id: 13,
    practice: 'p1',
    question: "¿Cómo se determina la densidad de un sólido irregular?",
    options: [
      "Midiendo sus dimensiones con vernier",
      "Por desplazamiento de volumen (principio de Arquímedes)",
      "Pesándolo solamente",
      "No se puede determinar"
    ],
    correct: 1,
    explanation: "Se usa el método indirecto: volumen por desplazamiento en probeta con agua."
  },
  {
    id: 14,
    practice: 'p1',
    question: "¿Cómo afectan las burbujas en una medición de volumen?",
    options: [
      "No afectan",
      "Aumentan el volumen aparente; la densidad calculada sería menor",
      "Disminuyen el volumen",
      "Solo afectan a los gases"
    ],
    correct: 1,
    explanation: "El aire en burbujas ocupa espacio, aumentando el volumen aparente."
  },
  {
    id: 15,
    practice: 'p1',
    question: "¿Cuál es la diferencia entre masa y peso?",
    options: [
      "Son lo mismo",
      "Masa = cantidad de materia (kg); Peso = fuerza de gravedad (N)",
      "Peso se mide en kg",
      "Masa depende de la gravedad"
    ],
    correct: 1,
    explanation: "Masa es invariante; peso = mg, varía con la gravedad."
  },
  {
    id: 16,
    practice: 'p1',
    question: "¿Las unidades de densidad en el SI son?",
    options: ["g/mL", "kg/L", "kg/m³", "g/cm³"],
    correct: 2,
    explanation: "En SI: kg/m³. También se usan g/mL o g/cm³ en laboratorio."
  },
  {
    id: 17,
    practice: 'p1',
    question: "¿Si un sólido no está totalmente sumergido, qué pasa con la densidad calculada por Arquímedes?",
    options: [
      "No afecta",
      "La densidad calculada sería menor que la real",
      "La densidad sería mayor",
      "No se puede calcular"
    ],
    correct: 1,
    explanation: "El volumen desplazado sería menor que el volumen real del sólido."
  },
  // === PRÁCTICA 2 ===
  {
    id: 18,
    practice: 'p2',
    question: "¿Qué es la calibración de un instrumento?",
    options: [
      "Limpiar el instrumento",
      "Determinar la relación entre indicación y valor real de la magnitud medida",
      "Ajustar la temperatura",
      "Medir una sola vez"
    ],
    correct: 1,
    explanation: "Calibración = comparar indicación con valor real (ej: masa de agua, densidad)."
  },
  {
    id: 19,
    practice: 'p2',
    question: "¿Diferencia entre precisión y exactitud?",
    options: [
      "Son lo mismo",
      "Precisión = reproducibilidad; Exactitud = cercanía al valor verdadero",
      "Exactitud = reproducibilidad",
      "Precisión depende de errores sistemáticos"
    ],
    correct: 1,
    explanation: "Precisión: errores aleatorios. Exactitud: errores sistemáticos."
  },
  {
    id: 20,
    practice: 'p2',
    question: "¿Por qué se corrige el volumen a 20°C en calibración?",
    options: [
      "Porque hace frío en el laboratorio",
      "Es la temperatura de fabricación del vidrio; las tablas están referidas a ella",
      "El agua hierve a 20°C",
      "No se corrige"
    ],
    correct: 1,
    explanation: "El vidrio se calibró a 20°C. El volumen del agua varía con la temperatura."
  },
  {
    id: 21,
    practice: 'p2',
    question: "¿Qué utilidad tiene la incertidumbre relativa al calibrar?",
    options: [
      "Ninguna",
      "Comparar precisión entre instrumentos; el de menor incert. relativa es más preciso",
      "Solo para buretas",
      "Para calcular la masa"
    ],
    correct: 1,
    explanation: "Incertidumbre relativa = (incert. absoluta / valor) × 100."
  },
  {
    id: 22,
    practice: 'p2',
    question: "¿Las gotas que quedan fuera del recipiente afectan la medición?",
    options: [
      "No",
      "Sí; la masa sería menor y el volumen calculado también",
      "Solo en pipetas",
      "Aumentan la exactitud"
    ],
    correct: 1,
    explanation: "Pérdida de líquido = masa menor = volumen calculado menor."
  },
  {
    id: 23,
    practice: 'p2',
    question: "¿Qué tipo de pipeta vierte hasta vaciarse completamente?",
    options: ["Volumétrica", "Serológica", "Ambas", "Ninguna"],
    correct: 1,
    explanation: "La pipeta serológica tiene graduaciones y vierte todo; la volumétrica tiene una marca de aforo."
  },
  // === MANUAL / NORMAS ===
  {
    id: 24,
    practice: 'manual',
    question: "¿Qué hacer si cae ácido o base en mesa o piso?",
    options: [
      "Limpiar con agua solamente",
      "Espolvorear carbonato hidrogenado de sodio para neutralizar, luego enjuagar",
      "Ignorarlo",
      "Usar extintor"
    ],
    correct: 1,
    explanation: "El carbonato neutraliza ácidos y bases antes de limpiar."
  },
  {
    id: 25,
    practice: 'manual',
    question: "¿Cómo se debe verter ácido concentrado en agua?",
    options: [
      "Agua en el ácido",
      "Ácido lentamente en el agua, dentro de la campana",
      "Ambos a la vez",
      "No importa el orden"
    ],
    correct: 1,
    explanation: "Nunca agua en ácido: reacción exotérmica violenta. Siempre ácido en agua, lentamente."
  },
  {
    id: 26,
    practice: 'manual',
    question: "¿Para oler una sustancia correctamente?",
    options: [
      "Inhalar directamente del frasco",
      "Colocar a una cuarta de la nariz, llevar aire con la mano, inhalar lentamente",
      "Acercar la nariz al frasco",
      "No se debe oler"
    ],
    correct: 1,
    explanation: "Técnica de olfateo: no inhalar directamente para evitar irritación."
  },
  {
    id: 27,
    practice: 'manual',
    question: "¿Cuántas faltas se permiten al laboratorio?",
    options: ["Ninguna", "Una", "Dos", "Tres"],
    correct: 1,
    explanation: "Solo 1 falta permitida. Se pierden los puntos del informe de esa práctica."
  },
  {
    id: 28,
    practice: 'manual',
    question: "¿Qué incluye el kit de seguridad obligatorio?",
    options: [
      "Solo bata",
      "2 mascarillas 3M, papel mayordomo, paño absorbente Scotch-Brite",
      "Extintor personal",
      "Guantes de látex"
    ],
    correct: 1,
    explanation: "Kit: mascarillas 8246/8247/8515/8577, papel mayordomo, paño Scotch-Brite."
  },
  // === UNIDAD 2: Teoría Atómica ===
  {
    id: 29,
    practice: 'u2_nucleo',
    question: "¿Qué define el número atómico Z?",
    options: ["Número de neutrones", "Número de protones (define el elemento)", "Número de electrones", "Protones + neutrones"],
    correct: 1,
    explanation: "Z = número de protones. Define el elemento. A = Z + N (número másico)."
  },
  {
    id: 30,
    practice: 'u2_nucleo',
    question: "¿Qué modelo atómico introdujo el núcleo pequeño y positivo?",
    options: ["Dalton", "Thomson", "Rutherford", "Bohr"],
    correct: 2,
    explanation: "Rutherford (1911): núcleo positivo pequeño + electrones orbitando."
  },
  {
    id: 31,
    practice: 'u2_isotopos',
    question: "¿Qué son los isótopos?",
    options: [
      "Átomos de diferentes elementos",
      "Átomos del mismo elemento (mismo Z) con diferente número de neutrones (diferente A)",
      "Átomos con mismo número másico",
      "Solo átomos de hidrógeno"
    ],
    correct: 1,
    explanation: "Mismo Z (mismo elemento), diferente A (diferente N). Ej: ¹²C, ¹³C, ¹⁴C."
  },
  {
    id: 32,
    practice: 'u2_isotopos',
    question: "¿Cómo se calcula la masa atómica promedio?",
    options: [
      "Promedio simple de las masas",
      "m̄ = Σ mᵢ · fᵢ (masa × fracción de abundancia)",
      "Solo la masa del isótopo más abundante",
      "A + Z"
    ],
    correct: 1,
    explanation: "m̄ = Σ mᵢ · fᵢ. fᵢ = fracción decimal (si es % dividir entre 100)."
  },
  {
    id: 33,
    practice: 'u2_foton',
    question: "¿Cuál es la relación entre longitud de onda y frecuencia?",
    options: ["λ = c/f", "c = λ · f", "E = hf", "f = λ/c"],
    correct: 1,
    explanation: "c = λ · f. c = 3×10⁸ m/s. Mayor λ → menor f."
  },
  {
    id: 34,
    practice: 'u2_foton',
    question: "¿Cuál es la energía de un fotón?",
    options: ["E = mc²", "E = h·f = hc/λ", "E = kT", "E = qV"],
    correct: 1,
    explanation: "E = hf = hc/λ. h = 6.626×10⁻³⁴ J·s."
  },
  {
    id: 35,
    practice: 'u2_hidrogeno',
    question: "¿Cuál es la energía del electrón en el nivel n del átomo de hidrógeno (Bohr)?",
    options: ["E_n = 13.6/n²", "E_n = -13.6/n² eV", "E_n = 0", "E_n = hf"],
    correct: 1,
    explanation: "E_n = -13.6/n² eV. Para hidrogenoide: E_n = -13.6·Z²/n²."
  },
  {
    id: 36,
    practice: 'u2_hidrogeno',
    question: "Si un electrón pasa de n=3 a n=1, ¿qué ocurre?",
    options: ["Absorbe un fotón", "Emite un fotón", "No hay transición", "Se ioniza"],
    correct: 1,
    explanation: "n_f < n_i → baja de nivel → emite fotón. E_fotón = |E₁ - E₃|."
  },
  {
    id: 37,
    practice: 'u2_fotoelectrico',
    question: "¿Cuál es la condición para que ocurra el efecto fotoeléctrico?",
    options: ["Alta intensidad de luz", "E_fotón ≥ φ (función de trabajo)", "Baja frecuencia", "Cualquier longitud de onda"],
    correct: 1,
    explanation: "E_fotón debe ser ≥ φ. Si f < f₀, no hay efecto sin importar la intensidad."
  },
  {
    id: 38,
    practice: 'u2_fotoelectrico',
    question: "¿Qué es el potencial de frenado V_f?",
    options: [
      "Voltaje que acelera los electrones",
      "Voltaje necesario para detener completamente los fotoelectrones (E_k = e·V_f)",
      "La función de trabajo",
      "La frecuencia umbral"
    ],
    correct: 1,
    explanation: "V_f = E_k^max / e. En eV: V_f (voltios) = E_k (eV)."
  },
  {
    id: 39,
    practice: 'u2_cuanticos',
    question: "¿Qué valores puede tomar el número cuántico l para n=3?",
    options: ["0, 1, 2", "0, 1, 2, 3", "1, 2, 3", "Solo 0"],
    correct: 0,
    explanation: "l = 0, 1, ..., n-1. Para n=3: l = 0, 1, 2 (s, p, d)."
  },
  {
    id: 40,
    practice: 'u2_cuanticos',
    question: "¿Cuántos electrones caben como máximo en el nivel n=2?",
    options: ["2", "4", "8", "18"],
    correct: 2,
    explanation: "Máximo por nivel: 2n². Para n=2: 2(4) = 8 electrones."
  },
  {
    id: 41,
    practice: 'u2_configuracion',
    question: "¿Qué establece la regla de Hund?",
    options: [
      "Máximo 2 electrones por orbital",
      "En orbitales degenerados: uno por orbital con mismo espín antes de emparejar",
      "Los electrones se emparejan primero",
      "Orden de llenado por energía"
    ],
    correct: 1,
    explanation: "En subnivel p con 3 electrones: ↑ ↑ ↑ (no ↑↓ ↑ __)."
  },
  {
    id: 42,
    practice: 'u2_configuracion',
    question: "¿Qué es una sustancia paramagnética?",
    options: [
      "Todos los electrones apareados",
      "Tiene electrones desapareados; es atraída por un imán",
      "Repelida por imán",
      "No tiene electrones"
    ],
    correct: 1,
    explanation: "Paramagnético: e⁻ desapareados → atracción. Diamagnético: todos apareados → repulsión leve."
  },
  {
    id: 43,
    practice: 'u2_configuracion',
    question: "¿Qué significa Z* (carga nuclear efectiva)?",
    options: [
      "Número atómico",
      "Z* = Z - σ; efectividad de la atracción nuclear considerando apantallamiento",
      "Número de electrones",
      "Masa atómica"
    ],
    correct: 1,
    explanation: "σ = constante de apantallamiento. Mayor Z* → electrón más atraído → menor tamaño atómico."
  },
  // === NUEVAS PREGUNTAS — Basadas en PDFs de Teoría Atómica ===
  // --- Quarks y partículas fundamentales ---
  {
    id: 44,
    practice: 'u2_nucleo',
    question: "¿De qué quarks está compuesto el protón?",
    options: ["uud (up, up, down)", "udd (up, down, down)", "uuu", "ddd"],
    correct: 0,
    explanation: "Protón = uud. Carga: 2/3 + 2/3 + (−1/3) = +1."
  },
  {
    id: 45,
    practice: 'u2_nucleo',
    question: "¿Cuál es la carga del quark 'down' (d)?",
    options: ["+2/3", "−1/3", "+1/3", "−2/3"],
    correct: 1,
    explanation: "Quark up (u) = +2/3, quark down (d) = −1/3."
  },
  {
    id: 46,
    practice: 'u2_nucleo',
    question: "El neutrón tiene composición udd. ¿Cuál es su carga total?",
    options: ["+1", "−1", "0", "+2/3"],
    correct: 2,
    explanation: "n⁰ = udd = +2/3 + (−1/3) + (−1/3) = 0."
  },
  {
    id: 47,
    practice: 'u2_nucleo',
    question: "¿Qué partículas son fundamentales (sin estructura interna)?",
    options: ["Protones y neutrones", "Electrones", "Nucleones", "Átomos"],
    correct: 1,
    explanation: "Los electrones son fundamentales. Los nucleones (p⁺, n⁰) están compuestos por quarks."
  },
  // --- Notación isotópica con iones ---
  {
    id: 48,
    practice: 'u2_nucleo',
    question: "El ion ³⁶₁₆S²⁻ tiene: ¿cuántos electrones?",
    options: ["16", "14", "18", "20"],
    correct: 2,
    explanation: "q = p⁺ − e⁻ = −2. e⁻ = p⁺ − (−2) = 16 + 2 = 18."
  },
  {
    id: 49,
    practice: 'u2_nucleo',
    question: "¿Cuántos neutrones tiene el ⁵⁸₂₆Fe³⁺?",
    options: ["26", "32", "58", "23"],
    correct: 1,
    explanation: "n⁰ = A − Z = 58 − 26 = 32. La carga no afecta los neutrones."
  },
  {
    id: 50,
    practice: 'u2_nucleo',
    question: "¿Cuántos electrones tiene el ⁵⁸₂₆Fe³⁺?",
    options: ["26", "29", "23", "32"],
    correct: 2,
    explanation: "q = +3 = p⁺ − e⁻. e⁻ = 26 − 3 = 23."
  },
  {
    id: 51,
    practice: 'u2_nucleo',
    question: "Si un átomo tiene Z=82 y A=207, ¿qué elemento es y cuántos neutrones tiene?",
    options: ["Pb, 125 neutrones", "Au, 128 neutrones", "Hg, 125 neutrones", "Tl, 126 neutrones"],
    correct: 0,
    explanation: "Z=82 → Plomo (Pb). n⁰ = A − Z = 207 − 82 = 125."
  },
  // --- Reacciones nucleares ---
  {
    id: 52,
    practice: 'u2_nucleo',
    question: "Si el Polonio (Z=84) decae a Plomo (Z=82), ¿qué pierde?",
    options: ["2 electrones", "2 protones", "2 neutrones", "1 protón y 1 neutrón"],
    correct: 1,
    explanation: "ΔZ = 82 − 84 = −2. Pierde 2 protones (desintegración alfa)."
  },
  {
    id: 53,
    practice: 'u2_nucleo',
    question: "Si ²⁷S decae en ²⁵Al, ¿qué pasó con los protones y neutrones?",
    options: [
      "Se perdieron 3 p⁺ y se ganó 1 n⁰",
      "Se ganaron 3 p⁺",
      "Se perdieron 2 n⁰",
      "No cambió nada"
    ],
    correct: 0,
    explanation: "S(Z=16)→Al(Z=13): ΔZ=−3. S-27: 11 n⁰, Al-25: 12 n⁰: Δn⁰=+1."
  },
  // --- Masa atómica y uma ---
  {
    id: 54,
    practice: 'u2_isotopos',
    question: "¿Cómo se define 1 uma (u)?",
    options: [
      "Masa del protón",
      "1/12 de la masa del núcleo del Carbono-12",
      "Masa del neutrón",
      "Masa del electrón"
    ],
    correct: 1,
    explanation: "1 u = 1/12 m(¹²C). La masa del C-12 es exactamente 12 u."
  },
  {
    id: 55,
    practice: 'u2_isotopos',
    question: "¿Por qué la masa del ¹²C es exactamente 12 u?",
    options: [
      "Porque tiene 12 protones",
      "Es la definición: 1 u = 1/12 de la masa del ¹²C",
      "Coincidencia",
      "Porque tiene 6p + 6n"
    ],
    correct: 1,
    explanation: "La uma se definió a partir del ¹²C: su masa es exactamente 12.000000 u por definición."
  },
  {
    id: 56,
    practice: 'u2_isotopos',
    question: "Si la masa elemental del S es 32.066 u, ¿es la masa de un isótopo específico?",
    options: [
      "Sí, es la masa del S-32",
      "No, es la media ponderada de todos los isótopos estables del S",
      "Sí, es la masa del S-34",
      "Es un valor teórico sin relación con isótopos"
    ],
    correct: 1,
    explanation: "La masa elemental = Σ mᵢ · fᵢ (media ponderada por abundancia de todos los isótopos)."
  },
  {
    id: 57,
    practice: 'u2_isotopos',
    question: "En un cálculo de masa elemental: si la abundancia está en %, ¿cuál es el total de abundancias?",
    options: ["1", "100", "1000", "Depende del elemento"],
    correct: 1,
    explanation: "Fracción: total=1. Porcentaje: total=100. Por millar (‰): total=1000."
  },
  {
    id: 58,
    practice: 'u2_isotopos',
    question: "¿La relación m(n⁰)/m(p⁺) es aproximadamente?",
    options: ["Exactamente 1", "1.0013", "0.000545", "2.0"],
    correct: 1,
    explanation: "m(n⁰)/m(p⁺) = 1.0013. Son casi iguales; en Química se consideran iguales."
  },
  {
    id: 59,
    practice: 'u2_isotopos',
    question: "¿La masa del electrón comparada con la del protón es?",
    options: ["Igual", "0.000545 veces la del protón (despreciable)", "La mitad", "El doble"],
    correct: 1,
    explanation: "m(e⁻)/m(p⁺) = 0.000545. La masa del e⁻ se desprecia en el cálculo de masa atómica."
  },
  // --- Modelo de Bohr / Electrón del Hidrógeno ---
  {
    id: 60,
    practice: 'u2_hidrogeno',
    question: "¿Cuál es la constante de Rydberg (Rₕ) en Julios?",
    options: ["2.1799×10⁻¹⁸ J", "1.6022×10⁻¹⁹ J", "5.2918×10⁻¹¹ J", "6.626×10⁻³⁴ J"],
    correct: 0,
    explanation: "Rₕ = 2.1799×10⁻¹⁸ J. Se usa en las ecuaciones de energía del átomo de H."
  },
  {
    id: 61,
    practice: 'u2_hidrogeno',
    question: "La energía potencial eléctrica del e⁻ del H en el nivel n es: Eₚ = ?",
    options: ["−Rₕ/n²", "−2Rₕ/n²", "Rₕ/n²", "2Rₕ/n²"],
    correct: 1,
    explanation: "Eₚ = −2Rₕ/n². Es negativa (atracción electrostática)."
  },
  {
    id: 62,
    practice: 'u2_hidrogeno',
    question: "La energía cinética del e⁻ del H es Eₖ = Rₕ/n². ¿Cuánto vale para n=1?",
    options: ["2.1799×10⁻¹⁸ J = 13.606 eV", "−2.1799×10⁻¹⁸ J", "4.3598×10⁻¹⁸ J", "0 J"],
    correct: 0,
    explanation: "Eₖ = Rₕ/1² = 2.1799×10⁻¹⁸ J. La Eₖ siempre es positiva."
  },
  {
    id: 63,
    practice: 'u2_hidrogeno',
    question: "El Hamiltoniano (ℋ) del e⁻ del H para n=1 es:",
    options: [
      "−2.1799×10⁻¹⁸ J = −13.606 eV",
      "+2.1799×10⁻¹⁸ J",
      "−4.3598×10⁻¹⁸ J",
      "0 J"
    ],
    correct: 0,
    explanation: "ℋ = Eₚ + Eₖ = −2Rₕ/n² + Rₕ/n² = −Rₕ/n². Para n=1: ℋ = −Rₕ = −13.606 eV."
  },
  {
    id: 64,
    practice: 'u2_hidrogeno',
    question: "La distancia del e⁻ al núcleo en el modelo de Bohr es r = a₀n². Para n=1, ¿cuánto vale?",
    options: ["0.529 Å", "5.29 Å", "52.9 Å", "0.0529 Å"],
    correct: 0,
    explanation: "r = a₀ · 1² = 5.2918×10⁻¹¹ m = 0.52918 Å. Es el radio de Bohr."
  },
  {
    id: 65,
    practice: 'u2_hidrogeno',
    question: "¿Qué relación existe entre Eₚ y Eₖ en el modelo de Bohr?",
    options: [
      "Eₚ = −2Eₖ (siempre)",
      "Eₚ = Eₖ",
      "No tienen relación fija",
      "Eₚ = −Eₖ/2"
    ],
    correct: 0,
    explanation: "Eₚ = −2Rₕ/n² y Eₖ = Rₕ/n². Por tanto Eₚ = −2Eₖ. El Hamiltoniano ℋ = −Eₖ."
  },
  {
    id: 66,
    practice: 'u2_hidrogeno',
    question: "El potencial eléctrico ε = Eₚ/q. Si Eₚ = −4.3598×10⁻¹⁸ J y q = −e, ε vale:",
    options: [
      "27.211 V",
      "−27.211 V",
      "13.606 V",
      "−13.606 V"
    ],
    correct: 0,
    explanation: "ε = Eₚ/(−e) = −4.3598×10⁻¹⁸/(−1.6022×10⁻¹⁹) = +27.211 V."
  },
  {
    id: 67,
    practice: 'u2_hidrogeno',
    question: "¿La Eₚ en eV tiene el mismo valor absoluto que ε en V?",
    options: [
      "Sí, pero con signo contrario",
      "No, son magnitudes incomparables",
      "Sí, con mismo signo",
      "Solo para n=1"
    ],
    correct: 0,
    explanation: "Eₚ(eV) = −27.211 eV, ε = +27.211 V. Mismo valor absoluto, signo opuesto."
  },
  // --- Transiciones electrónicas ---
  {
    id: 68,
    practice: 'u2_hidrogeno',
    question: "Si un e⁻ pasa de n=9 a n=2, ¿qué signo tiene Δℋ?",
    options: [
      "Negativo (pierde energía, emite fotón)",
      "Positivo (gana energía)",
      "Cero",
      "Depende del elemento"
    ],
    correct: 0,
    explanation: "nf < n₀ → baja en el pozo → Δℋ < 0. Emite energía (fotón)."
  },
  {
    id: 69,
    practice: 'u2_hidrogeno',
    question: "Δℋ = Rₕ[1/n₀² − 1/nf²]. Si Δℋ > 0, ¿qué ocurre?",
    options: [
      "El e⁻ absorbe energía y sube de nivel",
      "El e⁻ emite un fotón",
      "El e⁻ se ioniza",
      "No ocurre nada"
    ],
    correct: 0,
    explanation: "Δℋ > 0 → absorción. Ocurre cuando nf > n₀ (el e⁻ asciende)."
  },
  {
    id: 70,
    practice: 'u2_hidrogeno',
    question: "¿Cuánta energía se necesita para ionizar al H desde n=1?",
    options: [
      "13.606 eV (= Rₕ)",
      "27.211 eV (= 2Rₕ)",
      "6.803 eV",
      "0 eV"
    ],
    correct: 0,
    explanation: "Ionización: n=1→∞. Δℋ = Rₕ[1/1² − 0] = Rₕ = 2.1799×10⁻¹⁸ J = 13.606 eV."
  },
  {
    id: 71,
    practice: 'u2_hidrogeno',
    question: "En una transición, la relación entre Δℋ y ΔEₚ es:",
    options: [
      "Δℋ = ½ΔEₚ (siempre)",
      "Δℋ = ΔEₚ",
      "Δℋ = 2ΔEₚ",
      "No hay relación fija"
    ],
    correct: 0,
    explanation: "Δℋ = ½ΔEₚ siempre en el modelo de Bohr, ya que Eₚ = −2ℋ."
  },
  {
    id: 72,
    practice: 'u2_hidrogeno',
    question: "Cuando el e⁻ decae (emite), ¿qué pasa con su energía cinética?",
    options: [
      "Aumenta (gana Eₖ a expensas de Eₚ)",
      "Disminuye",
      "No cambia",
      "Se hace cero"
    ],
    correct: 0,
    explanation: "Al decaer: pierde Eₚ. La mitad se convierte en Eₖ, la otra mitad se radia como fotón."
  },
  {
    id: 73,
    practice: 'u2_hidrogeno',
    question: "¿Qué energía radia el e⁻ como fotón al decaer?",
    options: [
      "|Δℋ| (el valor absoluto del cambio del Hamiltoniano)",
      "|ΔEₚ|",
      "|ΔEₖ|",
      "Eₚ + Eₖ"
    ],
    correct: 0,
    explanation: "La energía radiada = |Δℋ|. La mitad de |ΔEₚ| va a Eₖ y la otra mitad se radia."
  },
  // --- REEMPE y conceptos de electrón ---
  {
    id: 74,
    practice: 'u2_cuanticos',
    question: "¿Qué es la REEMPE?",
    options: [
      "Región Espacio-Energética de Manifestación Probabilística Electrónica (el orbital)",
      "Red Electromagnética de Protones y Electrones",
      "Resonancia Electrónica de Masa del Protón",
      "Región de Energía Mínima"
    ],
    correct: 0,
    explanation: "REEMPE = orbital. Región donde hay altísima probabilidad de hallar al e⁻."
  },
  {
    id: 75,
    practice: 'u2_cuanticos',
    question: "¿Cuántos electrones caben como máximo en una REEMPE (orbital)?",
    options: ["1", "2", "4", "Depende de n"],
    correct: 1,
    explanation: "Máximo 2 e⁻ por orbital (con espines opuestos: principio de exclusión de Pauli)."
  },
  {
    id: 76,
    practice: 'u2_cuanticos',
    question: "El número cuántico n describe:",
    options: [
      "La energía potencial eléctrica del e⁻ (distancia al núcleo)",
      "La forma del orbital",
      "La orientación en el espacio",
      "El espín"
    ],
    correct: 0,
    explanation: "n = número cuántico principal. Mayor n → mayor Eₚ → más lejos del núcleo."
  },
  {
    id: 77,
    practice: 'u2_hidrogeno',
    question: "¿Por qué las energías dentro del pozo de potencial son negativas?",
    options: [
      "Por convención, Eₚ = 0 fuera del pozo (n=∞). Dentro, el e⁻ está ligado → Eₚ < 0",
      "Porque el electrón es negativo",
      "Por error de cálculo",
      "Solo en el modelo de Bohr"
    ],
    correct: 0,
    explanation: "Se necesita invertir energía para sacar al e⁻ del pozo. Fuera: Eₚ=0, Eₖ=0, ℋ=0."
  },
  {
    id: 78,
    practice: 'u2_hidrogeno',
    question: "Si ℋ = −Rₕ/n², ¿para qué valor de n la energía total se acerca a cero?",
    options: ["n → ∞", "n = 1", "n = 0", "n = 2"],
    correct: 0,
    explanation: "A medida que n → ∞, ℋ → 0. El e⁻ se aleja hasta salir del pozo (ionización)."
  },

  // === UNIDAD 1: Ciencia y Medición ===
  {
    id: 79,
    practice: 'u1_quimica',
    question: "¿Cuál es el objeto de estudio de la química?",
    options: ["La energía y el movimiento", "La composición, estructura y transformaciones de la materia", "Los fenómenos físicos del universo", "Los seres vivos y sus procesos"],
    correct: 1,
    explanation: "La química estudia la composición, estructura, propiedades y transformaciones de la materia."
  },
  {
    id: 80,
    practice: 'u1_quimica',
    question: "¿Cuál de estas es una contribución de la Química Moderna?",
    options: ["La teoría geocéntrica", "El desarrollo de materiales semiconductores y fármacos sintéticos", "El modelo ptolemaico", "La clasificación de los seres vivos"],
    correct: 1,
    explanation: "La Química Moderna contribuye con materiales avanzados, fármacos, polímeros y nanomateriales."
  },
  {
    id: 81,
    practice: 'u1_medicion',
    question: "¿Cuál es la unidad SI de masa?",
    options: ["gramo (g)", "kilogramo (kg)", "libra (lb)", "tonelada (t)"],
    correct: 1,
    explanation: "El kilogramo (kg) es la unidad fundamental de masa en el Sistema Internacional (SI)."
  },
  {
    id: 82,
    practice: 'u1_medicion',
    question: "¿Cuál de estas es una magnitud derivada?",
    options: ["Longitud", "Tiempo", "Densidad", "Masa"],
    correct: 2,
    explanation: "La densidad (ρ = m/V) se deriva de la masa y el volumen, que son fundamentales."
  },
  {
    id: 83,
    practice: 'u1_medicion',
    question: "¿Qué es el análisis dimensional?",
    options: ["Medir objetos en 3D", "Verificar que las unidades de una ecuación son consistentes", "Contar cifras significativas", "Calibrar instrumentos de medición"],
    correct: 1,
    explanation: "El análisis dimensional verifica que las unidades de ambos lados de una ecuación sean iguales."
  },
  {
    id: 84,
    practice: 'u1_cifras',
    question: "¿Cuántas cifras significativas tiene el número 0.00450?",
    options: ["5", "3", "6", "2"],
    correct: 1,
    explanation: "Los ceros a la izquierda no son significativos. Los ceros finales después del punto decimal SÍ lo son. 0.00450 → 4, 5, 0 = 3 cifras."
  },
  {
    id: 85,
    practice: 'u1_cifras',
    question: "Al multiplicar 2.5 × 3.14, el resultado debe tener…",
    options: ["4 cifras significativas", "3 cifras significativas", "2 cifras significativas", "1 cifra significativa"],
    correct: 2,
    explanation: "En multiplicación/división: el resultado tiene el mismo número de cifras que el dato con menos cifras. 2.5 tiene 2 → resultado con 2 cifras."
  },
  {
    id: 86,
    practice: 'u1_cifras',
    question: "¿Cuántas cifras significativas tiene 1.00 × 10³?",
    options: ["1", "2", "3", "4"],
    correct: 2,
    explanation: "En notación científica, todos los dígitos del coeficiente son significativos: 1.00 tiene 3 cifras."
  },
  {
    id: 87,
    practice: 'u1_factor',
    question: "Para convertir 5 km a metros usando el factor unitario, ¿qué factor se usa?",
    options: ["(1 km / 1000 m)", "(1000 m / 1 km)", "(5 m / 1 km)", "(1 km / 5 m)"],
    correct: 1,
    explanation: "5 km × (1000 m / 1 km) = 5000 m. El factor unitario cancela la unidad no deseada."
  },
  {
    id: 88,
    practice: 'u1_factor',
    question: "¿Cuántos segundos hay en 2.5 horas?",
    options: ["150 s", "9000 s", "1500 s", "250 s"],
    correct: 1,
    explanation: "2.5 h × (60 min/h) × (60 s/min) = 2.5 × 3600 = 9000 s."
  },
  {
    id: 89,
    practice: 'u1_materia',
    question: "¿Cuál de estas es una mezcla heterogénea?",
    options: ["Agua salada", "Aire", "Arena y agua", "Vinagre"],
    correct: 2,
    explanation: "Arena y agua: se pueden distinguir los componentes a simple vista → heterogénea."
  },
  {
    id: 90,
    practice: 'u1_materia',
    question: "¿Qué diferencia a un compuesto de una mezcla?",
    options: ["El compuesto se puede separar físicamente", "El compuesto tiene proporciones fijas y solo se separa químicamente", "La mezcla tiene propiedades únicas distintas a sus componentes", "No hay diferencia"],
    correct: 1,
    explanation: "Compuesto: proporciones fijas, separación química. Mezcla: variable, separación física."
  },
  {
    id: 91,
    practice: 'u1_propiedades',
    question: "La densidad del agua a 4°C es 1.00 g/mL. Un objeto con densidad 0.85 g/mL…",
    options: ["Se hunde", "Flota", "Se disuelve", "No se puede determinar"],
    correct: 1,
    explanation: "GE = 0.85/1.00 = 0.85 < 1 → el objeto flota en agua."
  },
  {
    id: 92,
    practice: 'u1_propiedades',
    question: "¿Cuál es la fórmula de la gravedad específica?",
    options: ["GE = m × V", "GE = ρ_sustancia / ρ_agua", "GE = V / m", "GE = ρ_agua / ρ_sustancia"],
    correct: 1,
    explanation: "GE = ρ_sustancia / ρ_agua. Es adimensional (sin unidades)."
  },
  {
    id: 93,
    practice: 'u1_soluciones',
    question: "¿Qué significa una solución de NaCl al 5% m/m?",
    options: ["5 g NaCl por 100 mL de agua", "5 g NaCl por 100 g de solución", "5 mol NaCl por litro", "5 mL NaCl por 100 mL solución"],
    correct: 1,
    explanation: "%(m/m) = g de soluto / g de solución total × 100. Aquí: 5 g NaCl en 100 g de solución."
  },
  {
    id: 94,
    practice: 'u1_soluciones',
    question: "Al diluir una solución (C₁V₁ = C₂V₂), ¿qué se conserva?",
    options: ["El volumen total", "La concentración", "Los moles de soluto", "La densidad"],
    correct: 2,
    explanation: "C₁V₁ = C₂V₂ deriva de n = C×V = constante. Los moles de soluto no cambian al diluir."
  },

  // === UNIDAD 3: Clasificación Periódica ===
  {
    id: 95,
    practice: 'u3_tabla',
    question: "¿Qué indica el período de un elemento en la tabla periódica?",
    options: ["El número de protones", "El número de niveles de energía ocupados (valor de n)", "La carga del ion más estable", "El número de electrones de valencia"],
    correct: 1,
    explanation: "El período corresponde al número cuántico principal n del electrón diferencial."
  },
  {
    id: 96,
    practice: 'u3_tabla',
    question: "¿Qué caracteriza a los elementos del bloque p?",
    options: ["Su electrón diferencial entra en un orbital s", "Su electrón diferencial entra en un orbital p (grupos IIIA–VIIIA)", "Son todos metales de transición", "Forman siempre iones +2"],
    correct: 1,
    explanation: "Bloque p: grupos IIIA a VIIIA. Electrón diferencial en orbital p."
  },
  {
    id: 97,
    practice: 'u3_propiedades',
    question: "¿En qué dirección aumenta el potencial de ionización dentro de un período?",
    options: ["De derecha a izquierda", "De izquierda a derecha (→)", "De arriba hacia abajo", "No varía en el período"],
    correct: 1,
    explanation: "Al avanzar en el período, Z* aumenta → e⁻ más fuertemente atraído → mayor PI."
  },
  {
    id: 98,
    practice: 'u3_propiedades',
    question: "¿Cuál es el elemento más electronegativo de la tabla periódica?",
    options: ["Oxígeno (O)", "Cloro (Cl)", "Flúor (F)", "Nitrógeno (N)"],
    correct: 2,
    explanation: "Flúor (F) tiene EN = 4.0 en la escala de Pauling, la mayor de todos los elementos."
  },
  {
    id: 99,
    practice: 'u3_propiedades',
    question: "¿En qué dirección aumenta el radio atómico en la tabla periódica?",
    options: ["Hacia arriba y a la derecha", "Hacia abajo y a la izquierda", "Solo hacia la derecha", "Solo hacia arriba"],
    correct: 1,
    explanation: "Radio ↑ al bajar en el grupo (mayor n) y al ir a la izquierda del período (menor Z*)."
  },
  {
    id: 100,
    practice: 'u3_propiedades',
    question: "Los cationes (iones positivos) son… respecto al átomo neutro:",
    options: ["Más grandes", "Del mismo tamaño", "Más pequeños", "Depende del elemento"],
    correct: 2,
    explanation: "Al perder e⁻, la Z* efectiva sobre los restantes aumenta → se contraen → catión más pequeño."
  },
  {
    id: 101,
    practice: 'u3_propiedades',
    question: "¿Cuál tiene mayor afinidad electrónica (mayor energía al ganar e⁻)?",
    options: ["Na", "Cl", "Ar", "K"],
    correct: 1,
    explanation: "Los halógenos (Cl, F…) tienen la mayor AE. Ar (gas noble) no gana e⁻ fácilmente."
  },

  // === UNIDAD 4: Enlace Químico ===
  {
    id: 102,
    practice: 'u4_tipos',
    question: "¿Qué tipo de enlace se forma cuando ΔEN > 1.7?",
    options: ["Covalente apolar", "Covalente polar", "Iónico", "Metálico"],
    correct: 2,
    explanation: "ΔEN > 1.7 → transferencia de electrones → enlace iónico."
  },
  {
    id: 103,
    practice: 'u4_tipos',
    question: "¿Cuál de los siguientes es un ejemplo de enlace covalente apolar?",
    options: ["HCl", "NaCl", "N₂", "MgO"],
    correct: 2,
    explanation: "N₂: mismo tipo de átomo, ΔEN = 0 → covalente apolar puro."
  },
  {
    id: 104,
    practice: 'u4_tipos',
    question: "El enlace metálico se describe como…",
    options: ["Transferencia de e⁻ entre dos átomos", "Compartición de un par de e⁻", "Mar de electrones deslocalizados entre cationes metálicos", "Puente de hidrógeno"],
    correct: 2,
    explanation: "Enlace metálico: e⁻ de valencia libres (mar de e⁻) → conductividad eléctrica y maleabilidad."
  },
  {
    id: 105,
    practice: 'u4_lewis',
    question: "¿Cuántos electrones de valencia tiene el carbono (C)?",
    options: ["2", "4", "6", "8"],
    correct: 1,
    explanation: "C está en el grupo IVA → 4 electrones de valencia."
  },
  {
    id: 106,
    practice: 'u4_lewis',
    question: "En la molécula H₂O, ¿cuántos pares de electrones libres tiene el oxígeno?",
    options: ["0", "1", "2", "3"],
    correct: 2,
    explanation: "O tiene 6 e⁻ de valencia. Forma 2 enlaces con H (usa 4). Quedan 4 e⁻ = 2 pares libres."
  },
  {
    id: 107,
    practice: 'u4_lewis',
    question: "¿Qué son las estructuras de resonancia?",
    options: ["Moléculas que cambian de forma al vibrar", "Estructuras de Lewis equivalentes con distinta distribución de e⁻ pero misma posición atómica", "Isómeros estructurales", "Moléculas con enlace coordinado"],
    correct: 1,
    explanation: "La resonancia ocurre cuando se pueden dibujar varias estructuras de Lewis igualmente válidas. La molécula real es un híbrido."
  },
  {
    id: 108,
    practice: 'u4_oxidacion',
    question: "¿Cuál es el N° de oxidación de S en H₂SO₄?",
    options: ["+4", "+6", "+8", "-2"],
    correct: 1,
    explanation: "2(+1) + x + 4(−2) = 0 → 2 + x − 8 = 0 → x = +6."
  },
  {
    id: 109,
    practice: 'u4_oxidacion',
    question: "El N° de oxidación de O en H₂O₂ (peróxido de hidrógeno) es…",
    options: ["-2", "-1", "0", "+1"],
    correct: 1,
    explanation: "Excepción: en peróxidos, O tiene N.O. = −1. H es +1: 2(+1) + 2x = 0 → x = −1."
  },
  {
    id: 110,
    practice: 'u4_oxidacion',
    question: "En un ion monoatómico como Fe³⁺, el N° de oxidación es…",
    options: ["0", "+3", "-3", "Depende del compuesto"],
    correct: 1,
    explanation: "El N.O. de un ion monoatómico es igual a su carga: Fe³⁺ → N.O. = +3."
  },

  // === UNIDAD 5: Nomenclatura ===
  {
    id: 111,
    practice: 'u5_binarios',
    question: "¿Cómo se llama CuO en el sistema Stock?",
    options: ["óxido cuproso", "óxido de cobre(II)", "monóxido de cobre", "óxido cúprico"],
    correct: 1,
    explanation: "Sistema Stock: indica la valencia en romanos. CuO → Cu tiene N.O. +2 → óxido de cobre(II)."
  },
  {
    id: 112,
    practice: 'u5_binarios',
    question: "¿Cuál es el nombre IUPAC de SO₂?",
    options: ["anhídrido sulfuroso", "sulfato", "dióxido de azufre", "ácido sulfuroso"],
    correct: 2,
    explanation: "IUPAC usa prefijos: SO₂ = di-óxido de azufre = dióxido de azufre."
  },
  {
    id: 113,
    practice: 'u5_binarios',
    question: "El sufijo -oso en el sistema tradicional indica…",
    options: ["La mayor valencia del metal", "La menor valencia del metal", "Que es un no metal", "Que tiene oxígeno"],
    correct: 1,
    explanation: "-oso = menor valencia; -ico = mayor valencia. Ejemplo: Fe²⁺ = ferroso; Fe³⁺ = férrico."
  },
  {
    id: 114,
    practice: 'u5_ternarios',
    question: "¿Cómo se llama NaOH?",
    options: ["Óxido de sodio", "Ácido nítrico", "Hidróxido de sodio", "Carbonato de sodio"],
    correct: 2,
    explanation: "NaOH = Na⁺ + OH⁻ = hidróxido de sodio (también llamado sosa cáustica)."
  },
  {
    id: 115,
    practice: 'u5_ternarios',
    question: "¿Cuál es la fórmula del ácido nítrico?",
    options: ["H₂SO₄", "HNO₃", "HCl", "H₃PO₄"],
    correct: 1,
    explanation: "HNO₃ = ácido nítrico. H₂SO₄ = sulfúrico. HCl = clorhídrico. H₃PO₄ = fosfórico."
  },
  {
    id: 116,
    practice: 'u5_ternarios',
    question: "El anión SO₄²⁻ se llama…",
    options: ["sulfito", "sulfato", "sulfuro", "tiosulfato"],
    correct: 1,
    explanation: "SO₄²⁻ = sulfato (S con N.O. +6). SO₃²⁻ = sulfito (S con N.O. +4)."
  },
  {
    id: 117,
    practice: 'u5_ternarios',
    question: "¿Qué sistema de nomenclatura usa 'ácido perclórico' para HClO₄?",
    options: ["Stock", "IUPAC", "Tradicional", "Ninguno"],
    correct: 2,
    explanation: "Sistema tradicional: hipo-oso < -oso < -ico < per-ico. HClO₄ → Cl = +7 (máximo) → perclórico."
  },

  // === UNIDAD 6: Estequiometría ===
  {
    id: 118,
    practice: 'u6_composicion',
    question: "¿Cuántos gramos hay en 2 moles de H₂O? (M_agua = 18 g/mol)",
    options: ["9 g", "18 g", "36 g", "72 g"],
    correct: 2,
    explanation: "m = n × M = 2 mol × 18 g/mol = 36 g."
  },
  {
    id: 119,
    practice: 'u6_composicion',
    question: "El número de Avogadro (6.022 × 10²³) representa…",
    options: ["El número de gramos por mol", "El número de partículas (átomos, moléculas…) en 1 mol", "La masa del protón", "El volumen molar"],
    correct: 1,
    explanation: "1 mol de cualquier sustancia contiene 6.022 × 10²³ partículas (moléculas, átomos, iones)."
  },
  {
    id: 120,
    practice: 'u6_composicion',
    question: "¿Cuál es el % en masa de O en H₂O? (H=1, O=16)",
    options: ["11.1%", "88.9%", "16%", "50%"],
    correct: 1,
    explanation: "M(H₂O) = 18. %(O) = 16/18 × 100 = 88.9%."
  },
  {
    id: 121,
    practice: 'u6_reaccion',
    question: "Al balancear H₂ + O₂ → H₂O, los coeficientes correctos son:",
    options: ["1, 1, 1", "2, 1, 2", "1, 2, 2", "2, 2, 2"],
    correct: 1,
    explanation: "2H₂ + O₂ → 2H₂O. Se conservan: 4H y 2O en ambos lados."
  },
  {
    id: 122,
    practice: 'u6_reaccion',
    question: "¿Qué es el reactivo limitante?",
    options: ["El que está en exceso", "El que se consume completamente primero y determina la cantidad máxima de producto", "El más barato", "El de mayor masa molar"],
    correct: 1,
    explanation: "El reactivo limitante se agota primero → limita la cantidad de producto formado."
  },
  {
    id: 123,
    practice: 'u6_limitante',
    question: "Se producen 45 g de producto real cuando se esperaban 50 g teóricos. El rendimiento % es:",
    options: ["45%", "90%", "55%", "110%"],
    correct: 1,
    explanation: "Rendimiento % = (masa real / masa teórica) × 100 = (45/50) × 100 = 90%."
  },
  {
    id: 124,
    practice: 'u6_limitante',
    question: "En N₂ + 3H₂ → 2NH₃, si hay 2 mol N₂ y 3 mol H₂, ¿cuál es el limitante?",
    options: ["N₂", "H₂", "Ninguno, están en proporción exacta", "NH₃"],
    correct: 1,
    explanation: "2 mol N₂ necesitan 6 mol H₂. Solo hay 3 mol H₂ → H₂ es el limitante."
  },
  {
    id: 125,
    practice: 'u6_limitante',
    question: "¿Qué establece la Ley de conservación de la masa?",
    options: ["La masa aumenta en reacciones exotérmicas", "La masa total de reactivos = masa total de productos", "La masa de los gases no se conserva", "Solo se conserva en reacciones inorgánicas"],
    correct: 1,
    explanation: "Ley de Lavoisier: nada se crea ni se destruye; la masa se conserva en toda reacción química."
  },

  // === UNIDAD 7: Gases ===
  {
    id: 126,
    practice: 'u7_leyes',
    question: "Un gas a 1 atm y 10 L se comprime a 5 L (T cte). La nueva presión es:",
    options: ["0.5 atm", "2 atm", "5 atm", "10 atm"],
    correct: 1,
    explanation: "Boyle: P₁V₁ = P₂V₂ → 1×10 = P₂×5 → P₂ = 2 atm."
  },
  {
    id: 127,
    practice: 'u7_leyes',
    question: "Un gas a 300 K ocupa 6 L. A 450 K (P cte), ocupa:",
    options: ["4 L", "9 L", "12 L", "3 L"],
    correct: 1,
    explanation: "Charles: V₁/T₁ = V₂/T₂ → 6/300 = V₂/450 → V₂ = 9 L."
  },
  {
    id: 128,
    practice: 'u7_ideal',
    question: "¿Cuántos moles ocupa 24.6 L de gas a 1 atm y 300 K? (R=0.08206)",
    options: ["0.5 mol", "1 mol", "2 mol", "24.6 mol"],
    correct: 1,
    explanation: "n = PV/RT = (1×24.6)/(0.08206×300) = 24.6/24.618 ≈ 1 mol."
  },
  {
    id: 129,
    practice: 'u7_ideal',
    question: "¿Cuál afirmación describe un gas ideal?",
    options: ["Sus moléculas tienen volumen apreciable", "Sus moléculas no ejercen fuerzas entre sí y tienen colisiones elásticas", "Solo existe por encima de los 100°C", "Su presión siempre es 1 atm"],
    correct: 1,
    explanation: "Gas ideal: volumen de moléculas despreciable, sin fuerzas intermoleculares, colisiones elásticas."
  },
  {
    id: 130,
    practice: 'u7_estequiometria',
    question: "En la reacción 2H₂ + O₂ → 2H₂O, ¿qué relación volumétrica hay entre H₂ y H₂O a la misma T y P?",
    options: ["1:1", "2:1", "1:2", "2:3"],
    correct: 0,
    explanation: "Ley de Avogadro: volúmenes son proporcionales a moles. 2 mol H₂ : 2 mol H₂O → 1:1."
  },
  {
    id: 131,
    practice: 'u7_estequiometria',
    question: "¿Cómo se calcula la presión de un gas seco recogido sobre agua?",
    options: ["P_gas = P_total + P_vapor", "P_gas = P_total − P_vapor(H₂O)", "P_gas = P_vapor × P_total", "P_gas = P_total / 2"],
    correct: 1,
    explanation: "Ley de Dalton: P_total = P_gas + P_vapor(H₂O) → P_gas = P_total − P_vapor(H₂O)."
  }
]
