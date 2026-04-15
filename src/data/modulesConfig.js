export const modules = [
  {
    id: 'u1',
    label: 'Unidad 1',
    description: 'Ciencia y Medición',
    categories: [
      { id: 'u1_quimica', label: 'Química como ciencia' },
      { id: 'u1_medicion', label: 'Medición y sistemas' },
      { id: 'u1_cifras', label: 'Cifras significativas' },
      { id: 'u1_factor', label: 'Factor unitario y análisis dimensional' },
      { id: 'u1_materia', label: 'Clasificación de la materia' },
      { id: 'u1_propiedades', label: 'Propiedades y densidad' },
      { id: 'u1_soluciones', label: 'Soluciones y concentración' },
    ]
  },
  {
    id: 'u2',
    label: 'Unidad 2',
    description: 'Teoría Atómica',
    categories: [
      { id: 'u2_nucleo', label: 'Teoría del Núcleo' },
      { id: 'u2_isotopos', label: 'Isótopos y Masa Atómica' },
      { id: 'u2_foton', label: 'Energía Radiante y Fotón' },
      { id: 'u2_hidrogeno', label: 'Átomo de Hidrógeno' },
      { id: 'u2_fotoelectrico', label: 'Efecto Fotoeléctrico' },
      { id: 'u2_cuanticos', label: 'Números Cuánticos' },
      { id: 'u2_configuracion', label: 'Configuración Electrónica' },
    ]
  },
  {
    id: 'u3',
    label: 'Unidad 3',
    description: 'Clasificación Periódica',
    categories: [
      { id: 'u3_tabla', label: 'Sistema Periódico' },
      { id: 'u3_propiedades', label: 'Propiedades Periódicas' },
    ]
  },
  {
    id: 'u4',
    label: 'Unidad 4',
    description: 'Enlace Químico',
    categories: [
      { id: 'u4_tipos', label: 'Tipos de Enlace' },
      { id: 'u4_lewis', label: 'Estructuras de Lewis' },
      { id: 'u4_oxidacion', label: 'Números de Oxidación' },
    ]
  },
  {
    id: 'u5',
    label: 'Unidad 5',
    description: 'Nomenclatura',
    categories: [
      { id: 'u5_binarios', label: 'Compuestos Binarios' },
      { id: 'u5_ternarios', label: 'Compuestos Ternarios' },
    ]
  },
  {
    id: 'u6',
    label: 'Unidad 6',
    description: 'Estequiometría',
    categories: [
      { id: 'u6_composicion', label: 'Estequiometría de Composición' },
      { id: 'u6_reaccion', label: 'Estequiometría de Reacción' },
      { id: 'u6_limitante', label: 'Reactivo Limitante y Rendimiento' },
    ]
  },
  {
    id: 'u7',
    label: 'Unidad 7',
    description: 'Gases',
    categories: [
      { id: 'u7_leyes', label: 'Leyes de los Gases' },
      { id: 'u7_ideal', label: 'Gas Ideal (PV=nRT)' },
      { id: 'u7_estequiometria', label: 'Estequiometría de Gases' },
    ]
  }
]

export function getCategoryLabel(moduleId, categoryId) {
  const mod = modules.find((m) => m.id === moduleId)
  const cat = mod?.categories.find((c) => c.id === categoryId)
  return cat?.label ?? categoryId
}

export function getAllCategories() {
  return modules.flatMap((m) =>
    m.categories.map((c) => ({ ...c, moduleId: m.id, moduleLabel: m.label }))
  )
}
