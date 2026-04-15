// category: 'p1' | 'p2' | 'p3' | 'manual' | 'formulas'
export const flashcards = [
  // Práctica 3
  { front: "Gravedad específica", back: "GE = ρ_destilado / ρ_agua. Ambas a 15,56°C. Se usa para determinar % etanol con tablas.", category: 'p3' },
  { front: "Azeótropo etanol-agua", back: "Mezcla al 95,6% etanol que hierve a 78,2°C. Vapor = líquido en composición. No se supera por destilación simple.", category: 'p3' },
  { front: "Grados Gay-Lussac (°GL)", back: "Equivalen al % v/v de etanol a 15,56°C. Ej: 40° GL = 40% v/v.", category: 'p3' },
  { front: "Contracorriente en condensador", back: "Agua fría abajo, vapor arriba. Máximo gradiente → condensación eficiente.", category: 'p3' },
  { front: "Destilación simple vs fraccionada", back: "Simple: P.E. difieren >25°C. Fraccionada: P.E. cercanos, columna de fraccionamiento.", category: 'p3' },
  { front: "Temperatura 15,56 °C", back: "60 °F. Temperatura estándar para tablas de gravedad específica y % etanol.", category: 'p3' },
  // Práctica 1
  { front: "Menisco", back: "Curva del líquido en tubo. Se lee en la parte INFERIOR para medición correcta.", category: 'p1' },
  { front: "Cifras significativas - suma/resta", back: "Resultado con el mismo nº de decimales que el dato con menos decimales.", category: 'p1' },
  { front: "Cifras significativas - mult/div", back: "Resultado con el mismo nº de cifras significativas que el dato con menos.", category: 'p1' },
  { front: "Observables fundamentales", back: "Longitud (m), masa (kg), tiempo (s). La densidad es derivada.", category: 'p1' },
  { front: "Método directo vs indirecto (densidad)", back: "Directo: sólido regular (medir dimensiones). Indirecto: sólido irregular (Arquímedes).", category: 'p1' },
  { front: "Masa vs Peso", back: "Masa: cantidad de materia (kg), invariante. Peso: F=mg (N), depende de g.", category: 'p1' },
  { front: "Burbujas en volumen", back: "Aumentan volumen aparente → densidad calculada menor que la real.", category: 'p1' },
  // Práctica 2
  { front: "Calibración", back: "Determinar relación entre indicación del instrumento y valor real. En volumetría: masa agua + densidad.", category: 'p2' },
  { front: "Precisión", back: "Reproducibilidad. Concordancia entre mediciones repetidas. Errores aleatorios.", category: 'p2' },
  { front: "Exactitud", back: "Cercanía al valor verdadero. Errores sistemáticos.", category: 'p2' },
  { front: "Corrección a 20°C", back: "Temperatura de fabricación del vidrio. Tabla: mL que ocupa 1 g agua a cada T.", category: 'p2' },
  { front: "Incertidumbre relativa", back: "(Incertidumbre absoluta / valor) × 100. Compara precisión entre instrumentos.", category: 'p2' },
  { front: "Pipeta serológica vs volumétrica", back: "Serológica: graduada, vierte todo. Volumétrica: una marca de aforo, más precisa.", category: 'p2' },
  // Manual / Normas
  { front: "Ácido + Agua", back: "NUNCA agua en ácido. Siempre ácido lentamente en agua, en campana.", category: 'manual' },
  { front: "Derrame ácido/base", back: "Carbonato hidrogenado de sodio para neutralizar, luego enjuagar.", category: 'manual' },
  { front: "Olfateo de sustancias", back: "A una cuarta de la nariz. Llevar aire con la mano. Inhalar lentamente. No directo.", category: 'manual' },
  { front: "Fuente lavado de ojos", back: "15 min mínimo. Agua en ambos ojos. Avisar al instructor.", category: 'manual' },
  { front: "Extintor - prohibición", back: "NUNCA usar extintor sobre una persona. Solo sobre material combustible.", category: 'manual' },
  { front: "Kit de seguridad", back: "2 mascarillas 3M (8246/8247/8515/8577), papel mayordomo, paño Scotch-Brite.", category: 'manual' },
  // Fórmulas
  { front: "Densidad", back: "ρ = m / V. Unidades: kg/m³, g/mL.", category: 'formulas' },
  { front: "Gravedad específica (fórmula)", back: "GE = ρ_sustancia / ρ_agua. Adimensional.", category: 'formulas' },
  { front: "% v/v", back: "% v/v = (V_soluto / V_solución) × 100", category: 'formulas' },
  { front: "Error relativo %", back: "E% = |valor medido - valor real| / valor real × 100", category: 'formulas' },
  // === UNIDAD 2: Teoría Atómica ===
  {
    front: "Partículas subatómicas",
    back: "Protón (p⁺, +1, núcleo), Neutrón (n⁰, 0, núcleo), Electrón (e⁻, -1, corteza). Z = protones, A = Z + N.",
    category: 'u2_nucleo'
  },
  {
    front: "Modelos atómicos (cronología)",
    back: "Dalton (1803) → Thomson (1897) → Rutherford (1911) → Bohr (1913) → Schrödinger (1926).",
    category: 'u2_nucleo'
  },
  {
    front: "Isótopos",
    back: "Mismo Z (mismo elemento), diferente A (diferente nº neutrones). Ej: ¹²C, ¹³C, ¹⁴C.",
    category: 'u2_isotopos'
  },
  {
    front: "Masa atómica promedio",
    back: "m̄ = Σ mᵢ · fᵢ. fᵢ = fracción de abundancia (decimal). Si % → dividir entre 100.",
    category: 'u2_isotopos'
  },
  {
    front: "c = λ · f",
    back: "Velocidad de la luz = longitud de onda × frecuencia. c = 3×10⁸ m/s.",
    category: 'u2_foton'
  },
  {
    front: "Energía del fotón",
    back: "E = h·f = hc/λ. h = 6.626×10⁻³⁴ J·s. 1 eV = 1.602×10⁻¹⁹ J.",
    category: 'u2_foton'
  },
  {
    front: "Energía del átomo de hidrógeno (Bohr)",
    back: "E_n = -13.6/n² eV. E_k = -E_n, V = 2E_n. Hidrogenoide: E_n = -13.6·Z²/n².",
    category: 'u2_hidrogeno'
  },
  {
    front: "Transiciones electrónicas",
    back: "n_f > n_i → absorbe fotón. n_f < n_i → emite fotón. E_fotón = |E_nf - E_ni|.",
    category: 'u2_hidrogeno'
  },
  {
    front: "Series espectrales del H",
    back: "Lyman (nf=1, UV), Balmer (nf=2, visible), Paschen (nf=3, IR), Brackett (nf=4, IR lejano).",
    category: 'u2_hidrogeno'
  },
  {
    front: "Efecto fotoeléctrico",
    back: "Emisión de e⁻ al iluminar metal. Condición: E_fotón ≥ φ. hf = φ + E_k^max.",
    category: 'u2_fotoelectrico'
  },
  {
    front: "Frecuencia y longitud de onda umbral",
    back: "f₀ = φ/h. λ₀ = hc/φ. Si f < f₀: no hay efecto, sin importar intensidad.",
    category: 'u2_fotoelectrico'
  },
  {
    front: "Potencial de frenado",
    back: "V_f = E_k^max/e. Voltaje para detener fotoelectrones. En eV: V_f = E_k (eV).",
    category: 'u2_fotoelectrico'
  },
  {
    front: "Números cuánticos",
    back: "n (1,2,3...), l (0..n-1), m_l (-l..+l), m_s (+½ o -½). Describen orbital y espín.",
    category: 'u2_cuanticos'
  },
  {
    front: "Subniveles s, p, d, f",
    back: "l=0→s (2e⁻), l=1→p (6e⁻), l=2→d (10e⁻), l=3→f (14e⁻). Máx por nivel: 2n².",
    category: 'u2_cuanticos'
  },
  {
    front: "Orden de llenado (Aufbau)",
    back: "1s→2s→2p→3s→3p→4s→3d→4p→5s→4d→5p→6s→4f→5d→6p→...",
    category: 'u2_configuracion'
  },
  {
    front: "Regla de Hund",
    back: "En orbitales degenerados: uno por orbital con mismo espín antes de emparejar.",
    category: 'u2_configuracion'
  },
  {
    front: "Principio de exclusión de Pauli",
    back: "Máx 2 e⁻ por orbital (espines opuestos). No pueden tener los 4 números cuánticos iguales.",
    category: 'u2_configuracion'
  },
  {
    front: "Paramagnético vs Diamagnético",
    back: "Paramagnético: e⁻ desapareados → atraído por imán. Diamagnético: todos apareados → repelido.",
    category: 'u2_configuracion'
  },
  {
    front: "Carga nuclear efectiva",
    back: "Z* = Z - σ. σ = constante de apantallamiento (reglas de Slater). Mayor Z* → menor tamaño.",
    category: 'u2_configuracion'
  },
  // === Nuevas flashcards — PDFs Teoría Atómica ===
  {
    front: "Quarks del protón y neutrón",
    back: "Protón = uud (2/3+2/3−1/3=+1). Neutrón = udd (2/3−1/3−1/3=0). 6 tipos: up, down, charm, strange, top, bottom.",
    category: 'u2_nucleo'
  },
  {
    front: "Notación isotópica ᴬ_Z E^q",
    back: "A = número masa (p⁺+n⁰). Z = número atómico (p⁺). q = carga (p⁺−e⁻). Para iones: q≠0.",
    category: 'u2_nucleo'
  },
  {
    front: "Uma (unidad de masa atómica)",
    back: "1 u = 1/12 masa del ¹²C. m(p⁺) ≈ m(n⁰) ≈ 1 u. m(e⁻) ≈ 0 (despreciable). Masa atómica ≈ A.",
    category: 'u2_isotopos'
  },
  {
    front: "Masa elemental vs masa isotópica",
    back: "Masa isotópica: masa de un isótopo (≈ A u). Masa elemental: media ponderada de TODOS los isótopos del elemento.",
    category: 'u2_isotopos'
  },
  {
    front: "Normalización de abundancias",
    back: "Fracción: total=1. Porcentaje (%): total=100. Por millar (‰): total=1000. ppm: total=1 000 000.",
    category: 'u2_isotopos'
  },
  {
    front: "REEMPE (orbital)",
    back: "Región Espacio-Energética de Manifestación Probabilística Electrónica. Máx 2 e⁻ por REEMPE (espines opuestos).",
    category: 'u2_cuanticos'
  },
  {
    front: "Ecuaciones del e⁻ del H (Bohr)",
    back: "Eₚ = −2Rₕ/n², Eₖ = Rₕ/n², ℋ = −Rₕ/n², r = a₀n². Rₕ=2.1799×10⁻¹⁸ J, a₀=5.2918×10⁻¹¹ m.",
    category: 'u2_hidrogeno'
  },
  {
    front: "Potencial eléctrico ε",
    back: "ε = Eₚ/q. Unidad: Voltio (V=J/C). Para e⁻: q=−e. |Eₚ en eV| = |ε en V|, signo opuesto.",
    category: 'u2_hidrogeno'
  },
  {
    front: "Hamiltoniano (ℋ)",
    back: "ℋ = Eₚ + Eₖ = energía mecánica total = −Rₕ/n². Siempre negativo dentro del pozo. ℋ = 0 fuera.",
    category: 'u2_hidrogeno'
  },
  {
    front: "Transición: ΔEₚ y Δℋ",
    back: "ΔEₚ = 2Rₕ[1/n₀²−1/nf²]. Δℋ = Rₕ[1/n₀²−1/nf²]. Siempre Δℋ = ½ΔEₚ.",
    category: 'u2_hidrogeno'
  },
  {
    front: "Energía de ionización del H",
    back: "E_ion = Rₕ = 2.1799×10⁻¹⁸ J = 13.606 eV. Transición n=1→∞. Toda Eₖ se convierte en Eₚ.",
    category: 'u2_hidrogeno'
  },
  {
    front: "Decaimiento: ΔEₚ se reparte",
    back: "Al decaer (n alto → n bajo): pierde |ΔEₚ|. La mitad → Eₖ (se queda). La otra mitad → fotón emitido (= |Δℋ|).",
    category: 'u2_hidrogeno'
  },

  // === UNIDAD 1: Ciencia y Medición ===
  { front: "Química", back: "Ciencia que estudia la composición, estructura, propiedades y transformaciones de la materia.", category: 'u1_quimica' },
  { front: "Método científico", back: "Observación → hipótesis → experimento → análisis → conclusión → ley/teoría.", category: 'u1_quimica' },
  { front: "Magnitudes fundamentales SI", back: "Longitud (m), masa (kg), tiempo (s), corriente (A), temperatura (K), cantidad (mol), luminosidad (cd).", category: 'u1_medicion' },
  { front: "Magnitudes derivadas", back: "Se obtienen de las fundamentales. Ejemplos: densidad (kg/m³), velocidad (m/s), energía (J = kg·m²/s²).", category: 'u1_medicion' },
  { front: "Cifras significativas — reglas clave", back: "1) Dígitos no cero: siempre sig. 2) Ceros entre no ceros: sig. 3) Ceros al final con decimal: sig. 4) Ceros a la izquierda: NO sig.", category: 'u1_cifras' },
  { front: "Operaciones con cifras significativas", back: "+/−: mismo nº de decimales que el dato con menos. ×/÷: mismo nº de cifras sig. que el dato con menos.", category: 'u1_cifras' },
  { front: "Notación científica", back: "A × 10ⁿ donde 1 ≤ A < 10. Todos los dígitos del coeficiente A son significativos.", category: 'u1_cifras' },
  { front: "Factor unitario", back: "Fracción igual a 1 que convierte unidades. Ejemplo: (1000 m / 1 km). La unidad a eliminar va en el denominador.", category: 'u1_factor' },
  { front: "Análisis dimensional", back: "Método para verificar ecuaciones comprobando que las unidades de ambos lados sean iguales.", category: 'u1_factor' },
  { front: "Conversión de temperatura", back: "K = °C + 273.15 | °C = (°F − 32)/1.8 | °F = °C × 1.8 + 32", category: 'u1_medicion' },
  { front: "Clasificación de la materia", back: "Materia → Sustancias puras (Elementos / Compuestos) y Mezclas (Homogéneas / Heterogéneas).", category: 'u1_materia' },
  { front: "Elemento vs Compuesto", back: "Elemento: un solo tipo de átomo (H₂, Fe). Compuesto: dos o más elementos en proporción fija (H₂O, NaCl).", category: 'u1_materia' },
  { front: "Densidad", back: "ρ = m / V. Propiedad intensiva. Unidades: g/mL, kg/m³. No depende de la cantidad de muestra.", category: 'u1_propiedades' },
  { front: "Gravedad específica (GE)", back: "GE = ρ_sustancia / ρ_agua. Adimensional. GE < 1 → flota; GE > 1 → se hunde.", category: 'u1_propiedades' },
  { front: "Solución vs mezcla heterogénea", back: "Solución (homogénea): composición uniforme, no se distinguen componentes. Heterogénea: se distinguen fases.", category: 'u1_materia' },
  { front: "Concentración %(m/m)", back: "%(m/m) = (m_soluto / m_solución) × 100. Gramos de soluto por 100 g de solución.", category: 'u1_soluciones' },
  { front: "Concentración %(v/v)", back: "%(v/v) = (V_soluto / V_solución) × 100. Mililitros de soluto por 100 mL de solución.", category: 'u1_soluciones' },
  { front: "Dilución: C₁V₁ = C₂V₂", back: "Al diluir, los moles se conservan. C₁V₁ = C₂V₂. Siempre: C₂ < C₁ y V₂ > V₁.", category: 'u1_soluciones' },
  { front: "Solución madre", back: "Solución concentrada de la que se preparan soluciones más diluidas. Se usa C₁V₁ = C₂V₂ para calcular volúmenes.", category: 'u1_soluciones' },

  // === UNIDAD 3: Clasificación Periódica ===
  { front: "Período en la tabla periódica", back: "Indica el número de niveles de energía (n) del e⁻ diferencial. Hay 7 períodos.", category: 'u3_tabla' },
  { front: "Grupo en la tabla periódica", back: "Para elementos representativos (A): indica el nº de e⁻ de valencia. Grupos IA–VIIIA.", category: 'u3_tabla' },
  { front: "Bloques de la tabla periódica", back: "s: grupos IA, IIA | p: IIIA–VIIIA | d: transición | f: tierras raras (lantánidos y actínidos).", category: 'u3_tabla' },
  { front: "Electrón diferencial", back: "El último e⁻ en incorporarse al átomo. Determina el período y grupo del elemento.", category: 'u3_tabla' },
  { front: "Potencial de ionización (PI)", back: "Energía para quitar 1 e⁻ al átomo gaseoso neutro. ↑ → en el período; ↓ en el grupo.", category: 'u3_propiedades' },
  { front: "Electronegatividad (EN)", back: "Capacidad de atraer e⁻ de enlace. Escala Pauling: F=4.0 (máximo). ↑ → período; ↓ grupo.", category: 'u3_propiedades' },
  { front: "Afinidad electrónica (AE)", back: "Energía al ganar 1 e⁻. Máxima en halógenos. ↑ → período; ↓ grupo. Gases nobles ≈ 0.", category: 'u3_propiedades' },
  { front: "Radio atómico", back: "↑ al bajar en el grupo (mayor n). ↓ al avanzar en el período (mayor Z* → contracción).", category: 'u3_propiedades' },
  { front: "Catión vs Anión — radio", back: "Catión (pierde e⁻): más pequeño que el átomo. Anión (gana e⁻): más grande que el átomo.", category: 'u3_propiedades' },
  { front: "Carácter metálico", back: "Tendencia a perder e⁻. ↑ al bajar en el grupo y al ir a la izquierda del período.", category: 'u3_propiedades' },

  // === UNIDAD 4: Enlace Químico ===
  { front: "Enlace covalente apolar", back: "ΔEN < 0.4. Compartición igualitaria. Ejemplo: H₂, O₂, N₂, Cl₂.", category: 'u4_tipos' },
  { front: "Enlace covalente polar", back: "ΔEN 0.4–1.7. Compartición desigual → dipolo δ+/δ−. Ejemplo: H₂O, HCl, NH₃.", category: 'u4_tipos' },
  { front: "Enlace iónico", back: "ΔEN > 1.7. Transferencia de e⁻ → catión + anión. Ejemplo: NaCl, MgO, CaF₂.", category: 'u4_tipos' },
  { front: "Enlace metálico", back: "Mar de e⁻ deslocalizados entre cationes metálicos. Explica conductividad, maleabilidad y brillo.", category: 'u4_tipos' },
  { front: "Enlace covalente coordinado (dativo)", back: "Un átomo aporta ambos e⁻ del par compartido. Ejemplo: NH₄⁺ (N → H⁺).", category: 'u4_tipos' },
  { front: "Pasos para estructura de Lewis", back: "1) Contar e⁻ valencia total. 2) Conectar con enlaces simples. 3) Completar octetos periféricos. 4) Asignar restantes al central. 5) Dobles/triples si falta octeto.", category: 'u4_lewis' },
  { front: "Regla del octeto", back: "Los átomos tienden a rodearse de 8 e⁻ (4 pares) en sus enlaces para alcanzar estabilidad (excepción: H → 2 e⁻).", category: 'u4_lewis' },
  { front: "Carga formal (CF)", back: "CF = e⁻_val − e⁻_no enlazantes − ½ e⁻_enlazantes. La mejor estructura tiene CF cercanas a 0.", category: 'u4_lewis' },
  { front: "Resonancia", back: "Cuando una molécula tiene >1 estructura de Lewis válida. La real es un híbrido. Ejemplo: O₃, NO₂⁻, SO₃.", category: 'u4_lewis' },
  { front: "N° de oxidación — elemento libre", back: "Siempre 0. Ejemplo: Fe, H₂, O₂, Na, Cl₂ → N.O. = 0.", category: 'u4_oxidacion' },
  { front: "N° de oxidación — reglas clave", back: "H = +1 (−1 en hidruros). O = −2 (−1 en peróxidos). Grupo IA = +1. Grupo IIA = +2. F = −1 siempre.", category: 'u4_oxidacion' },
  { front: "N° de oxidación — verificación", back: "Compuesto neutro: suma N.O. = 0. Ion: suma N.O. = carga del ion.", category: 'u4_oxidacion' },

  // === UNIDAD 5: Nomenclatura ===
  { front: "Sistema Stock", back: "Indica la valencia del metal en números romanos entre paréntesis. Ejemplo: FeCl₂ = cloruro de hierro(II).", category: 'u5_binarios' },
  { front: "Sistema IUPAC (sistemático)", back: "Usa prefijos grecolatinos (mono, di, tri…) para indicar cantidad de átomos. Ejemplo: CO₂ = dióxido de carbono.", category: 'u5_binarios' },
  { front: "Sistema tradicional (-oso/-ico)", back: "-oso = menor valencia del metal. -ico = mayor valencia. Ejemplo: FeCl₂ = cloruro ferroso; FeCl₃ = cloruro férrico.", category: 'u5_binarios' },
  { front: "Óxidos básicos (metálicos)", back: "Metal + O. Reaccionan con H₂O → hidróxido. Ejemplo: CaO + H₂O → Ca(OH)₂.", category: 'u5_binarios' },
  { front: "Anhídridos (óxidos no metálicos)", back: "No metal + O. Reaccionan con H₂O → oxácido. Ejemplo: SO₃ + H₂O → H₂SO₄.", category: 'u5_binarios' },
  { front: "Hidróxidos", back: "Metal + OH⁻. Nombre: hidróxido de [metal]. Ejemplo: NaOH = hidróxido de sodio, Ca(OH)₂ = hidróxido de calcio.", category: 'u5_ternarios' },
  { front: "Oxácidos — sufijos", back: "Per-ico (máximo N.O.) > -ico > -oso > hipo-oso (mínimo). Ejemplo Cl: HClO₄, HClO₃, HClO₂, HClO.", category: 'u5_ternarios' },
  { front: "Aniones de oxácidos", back: "Ácido -ico → anión -ato. Ácido -oso → anión -ito. Ejemplo: H₂SO₄ → SO₄²⁻ (sulfato); H₂SO₃ → SO₃²⁻ (sulfito).", category: 'u5_ternarios' },
  { front: "Sales ternarias (oxisales)", back: "Metal + anión de oxácido. Ejemplo: Na₂SO₄ = sulfato de sodio; KNO₃ = nitrato de potasio.", category: 'u5_ternarios' },

  // === UNIDAD 6: Estequiometría ===
  { front: "El mol", back: "Unidad de cantidad de sustancia. 1 mol = 6.022 × 10²³ partículas (número de Avogadro).", category: 'u6_composicion' },
  { front: "Masa molar (M)", back: "Masa de 1 mol de sustancia en g/mol. Numéricamente igual a la masa atómica/molecular en uma.", category: 'u6_composicion' },
  { front: "Conversión mol-gramos", back: "m = n × M | n = m / M. Ejemplo: 2 mol H₂O × 18 g/mol = 36 g.", category: 'u6_composicion' },
  { front: "Composición porcentual", back: "%(elemento) = (n × M_elemento / M_compuesto) × 100. Ejemplo: %O en H₂O = 16/18 × 100 = 88.9%.", category: 'u6_composicion' },
  { front: "Balanceo de ecuaciones", back: "Se ajustan coeficientes (no subíndices) para igualar el nº de átomos de cada elemento a ambos lados.", category: 'u6_reaccion' },
  { front: "Tipos de reacciones", back: "Síntesis (A+B→AB), descomposición (AB→A+B), desplazamiento simple, doble desplazamiento, combustión.", category: 'u6_reaccion' },
  { front: "Reactivo limitante", back: "El que se consume completamente primero y determina la cantidad máxima de producto posible.", category: 'u6_limitante' },
  { front: "Reactivo en exceso", back: "El que sobra después de que el reactivo limitante se consume. Cantidad sobrante = dado − consumido.", category: 'u6_limitante' },
  { front: "Rendimiento porcentual", back: "% rendimiento = (masa real obtenida / masa teórica esperada) × 100.", category: 'u6_limitante' },
  { front: "Ley de conservación de masa", back: "Lavoisier: la masa total de reactivos = masa total de productos. Nada se crea ni se destruye.", category: 'u6_composicion' },

  // === UNIDAD 7: Gases ===
  { front: "Ley de Boyle", back: "T, n ctes: P₁V₁ = P₂V₂. P y V son inversamente proporcionales.", category: 'u7_leyes' },
  { front: "Ley de Charles", back: "P, n ctes: V₁/T₁ = V₂/T₂. V y T (en K) son directamente proporcionales.", category: 'u7_leyes' },
  { front: "Ley combinada", back: "n cte: P₁V₁/T₁ = P₂V₂/T₂. Une Boyle y Charles.", category: 'u7_leyes' },
  { front: "Ley de Avogadro", back: "P, T ctes: V/n = cte. 1 mol de cualquier gas ideal a CNTP = 22.4 L.", category: 'u7_leyes' },
  { front: "Ley del gas ideal: PV = nRT", back: "R = 0.08206 L·atm/(mol·K). T siempre en Kelvin. Despeja la variable desconocida.", category: 'u7_ideal' },
  { front: "Ley de Dalton", back: "P_total = Σ Pᵢ. Pᵢ = χᵢ × P_total, donde χᵢ = nᵢ / n_total (fracción molar).", category: 'u7_leyes' },
  { front: "Ley de Graham", back: "r₁/r₂ = √(M₂/M₁). Gas más liviano difunde más rápido. Inverso de la raíz cuadrada de la masa molar.", category: 'u7_leyes' },
  { front: "Conversiones de presión", back: "1 atm = 760 mmHg = 760 torr = 101.325 kPa = 1.01325 bar.", category: 'u7_ideal' },
  { front: "Gas colectado sobre agua", back: "P_gas_seco = P_total − P_vapor(H₂O). La presión del vapor del agua se resta para obtener P del gas.", category: 'u7_estequiometria' },
  { front: "Estequiometría de gases", back: "Ruta: P,V,T → PV=nRT → moles A → razón molar → moles B → PV=nRT → respuesta.", category: 'u7_estequiometria' }
]
