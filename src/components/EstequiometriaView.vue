<script setup>
import { ref, computed, reactive } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { FlaskConical, Scale, Atom, ArrowRightLeft, Target, ChevronDown, ChevronUp } from 'lucide-vue-next'

const AVOGADRO = 6.022e23
const ATOMIC_MASSES = {
  H:1.008, He:4.003, Li:6.941, Be:9.012, B:10.81, C:12.011, N:14.007, O:15.999,
  F:18.998, Ne:20.180, Na:22.990, Mg:24.305, Al:26.982, Si:28.086, P:30.974, S:32.065,
  Cl:35.453, Ar:39.948, K:39.098, Ca:40.078, Fe:55.845, Cu:63.546, Zn:65.38,
  Br:79.904, Ag:107.87, I:126.90, Ba:137.33, Mn:54.938
}
const COMMON_MM = [
  { formula: 'H\u2082O', mm: 18.015 }, { formula: 'CO\u2082', mm: 44.01 },
  { formula: 'NaCl', mm: 58.44 }, { formula: 'H\u2082SO\u2084', mm: 98.08 },
  { formula: 'CaCO\u2083', mm: 100.09 }, { formula: 'O\u2082', mm: 32.00 },
  { formula: 'N\u2082', mm: 28.02 }, { formula: 'C\u2086H\u2081\u2082O\u2086', mm: 180.16 },
]

const activeSection = ref('mol')
const sections = [
  { id: 'mol', label: 'El Mol', icon: FlaskConical },
  { id: 'composicion', label: 'Composici\u00f3n', icon: Atom },
  { id: 'balanceo', label: 'Balanceo', icon: ArrowRightLeft },
  { id: 'relaciones', label: 'Relaciones', icon: Scale },
  { id: 'limitante', label: 'Limitante', icon: Target },
]

// ─── Helpers ───
function parseFormula(formula) {
  const tokens = []
  const re = /([A-Z][a-z]?)(\d*)/g
  let m
  while ((m = re.exec(formula)) !== null) {
    if (!m[1]) continue
    tokens.push({ el: m[1], count: parseInt(m[2] || '1') })
  }
  return tokens
}
function formulaMolarMass(tokens) {
  let total = 0
  for (const t of tokens) {
    const am = ATOMIC_MASSES[t.el]
    if (!am) return null
    total += am * t.count
  }
  return total
}
function fmt(n, d = 4) {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—'
  if (Math.abs(n) > 1e6 || (Math.abs(n) < 0.001 && n !== 0)) return n.toExponential(d)
  return parseFloat(n.toFixed(d)).toString()
}

// ─── Section 1: Mol ───
const molInput = ref('gramos')
const molGramos = ref('')
const molMoles = ref('')
const molParticulas = ref('')
const molMM = ref('18.015')

const molResults = computed(() => {
  const mm = parseFloat(molMM.value)
  if (!Number.isFinite(mm) || mm <= 0) return null
  let g, mol, p, steps = []
  if (molInput.value === 'gramos') {
    g = parseFloat(molGramos.value); if (!Number.isFinite(g)) return null
    mol = g / mm; p = mol * AVOGADRO
    steps = [
      `${fmt(g)} g \u00d7 (1 mol / ${fmt(mm)} g) = ${fmt(mol)} mol`,
      `${fmt(mol)} mol \u00d7 (6.022\u00d710\u00b2\u00b3 / 1 mol) = ${fmt(p)} part\u00edculas`
    ]
  } else if (molInput.value === 'moles') {
    mol = parseFloat(molMoles.value); if (!Number.isFinite(mol)) return null
    g = mol * mm; p = mol * AVOGADRO
    steps = [
      `${fmt(mol)} mol \u00d7 (${fmt(mm)} g / 1 mol) = ${fmt(g)} g`,
      `${fmt(mol)} mol \u00d7 (6.022\u00d710\u00b2\u00b3 / 1 mol) = ${fmt(p)} part\u00edculas`
    ]
  } else {
    p = parseFloat(molParticulas.value); if (!Number.isFinite(p)) return null
    mol = p / AVOGADRO; g = mol * mm
    steps = [
      `${fmt(p)} part. \u00d7 (1 mol / 6.022\u00d710\u00b2\u00b3) = ${fmt(mol)} mol`,
      `${fmt(mol)} mol \u00d7 (${fmt(mm)} g / 1 mol) = ${fmt(g)} g`
    ]
  }
  return { gramos: g, moles: mol, particulas: p, steps }
})

// ─── Section 2: Composicion ───
const compFormula = ref('H2SO4')
const compResults = computed(() => {
  const tokens = parseFormula(compFormula.value)
  if (!tokens.length) return null
  const mm = formulaMolarMass(tokens)
  if (!mm) return null
  return tokens.map(t => ({
    el: t.el, count: t.count,
    mass: ATOMIC_MASSES[t.el] * t.count,
    pct: ((ATOMIC_MASSES[t.el] * t.count) / mm * 100)
  })).concat([{ el: 'Total', count: 0, mass: mm, pct: 100 }])
})

// Empirica
const empElements = ref([
  { el: 'C', mass: '40.0' }, { el: 'H', mass: '6.7' }, { el: 'O', mass: '53.3' }
])
const empCount = ref(3)
function addEmpEl() { if (empCount.value < 6) { empCount.value++; empElements.value.push({ el: '', mass: '' }) } }
function removeEmpEl() { if (empCount.value > 2) { empCount.value--; empElements.value.pop() } }

const empResults = computed(() => {
  const els = empElements.value.slice(0, empCount.value)
  const parsed = els.map(e => ({
    el: e.el, mass: parseFloat(e.mass), am: ATOMIC_MASSES[e.el]
  }))
  if (parsed.some(p => !p.am || !Number.isFinite(p.mass))) return null
  const moles = parsed.map(p => ({ ...p, mol: p.mass / p.am }))
  const minMol = Math.min(...moles.map(m => m.mol))
  if (minMol <= 0) return null
  const ratios = moles.map(m => ({ ...m, ratio: m.mol / minMol }))
  const rounded = ratios.map(r => ({ ...r, rounded: Math.round(r.ratio) }))
  const formula = rounded.map(r => r.el + (r.rounded > 1 ? r.rounded : '')).join('')
  return { steps: rounded, formula, minMol }
})

const empMolMM = ref('')
const molecularFormula = computed(() => {
  if (!empResults.value) return null
  const expMM = parseFloat(empMolMM.value)
  if (!Number.isFinite(expMM)) return null
  const tokens = parseFormula(empResults.value.formula)
  const empMM = formulaMolarMass(tokens)
  if (!empMM) return null
  const n = Math.round(expMM / empMM)
  if (n < 1) return null
  const formula = tokens.map(t => t.el + (t.count * n > 1 ? t.count * n : '')).join('')
  return { n, empMM: fmt(empMM, 2), formula }
})

// ─── Section 3: Balanceo ───
const equations = reactive([
  { reactants: 'Fe + O2', products: 'Fe2O3', slots: [4,3,2], userSlots: ['','','',''], labels: ['Fe','O\u2082','Fe\u2082O\u2083',''], atomsR: [{Fe:1},{O:2}], atomsP: [{Fe:2,O:3}], numR: 2, numP: 1 },
  { reactants: 'CH4 + O2', products: 'CO2 + H2O', slots: [1,2,1,2], userSlots: ['','','',''], labels: ['CH\u2084','O\u2082','CO\u2082','H\u2082O'], atomsR: [{C:1,H:4},{O:2}], atomsP: [{C:1,O:2},{H:2,O:1}], numR: 2, numP: 2 },
  { reactants: 'Al + HCl', products: 'AlCl3 + H2', slots: [2,6,2,3], userSlots: ['','','',''], labels: ['Al','HCl','AlCl\u2083','H\u2082'], atomsR: [{Al:1},{H:1,Cl:1}], atomsP: [{Al:1,Cl:3},{H:2}], numR: 2, numP: 2 },
  { reactants: 'C3H8 + O2', products: 'CO2 + H2O', slots: [1,5,3,4], userSlots: ['','','',''], labels: ['C\u2083H\u2088','O\u2082','CO\u2082','H\u2082O'], atomsR: [{C:3,H:8},{O:2}], atomsP: [{C:1,O:2},{H:2,O:1}], numR: 2, numP: 2 },
  { reactants: 'KMnO4 + HCl', products: 'KCl + MnCl2 + Cl2 + H2O', slots: [2,16,2,2,5,8], userSlots: ['','','','','',''], labels: ['KMnO\u2084','HCl','KCl','MnCl\u2082','Cl\u2082','H\u2082O'], atomsR: [{K:1,Mn:1,O:4},{H:1,Cl:1}], atomsP: [{K:1,Cl:1},{Mn:1,Cl:2},{Cl:2},{H:2,O:1}], numR: 2, numP: 4 },
])
const activeEq = ref(0)

function countAtoms(eq) {
  const left = {}; const right = {}
  const rAtoms = eq.atomsR; const pAtoms = eq.atomsP
  for (let i = 0; i < eq.numR; i++) {
    const coeff = parseInt(eq.userSlots[i]) || 0
    for (const [el, cnt] of Object.entries(rAtoms[i])) {
      left[el] = (left[el] || 0) + coeff * cnt
    }
  }
  for (let i = 0; i < eq.numP; i++) {
    const coeff = parseInt(eq.userSlots[eq.numR + i]) || 0
    for (const [el, cnt] of Object.entries(pAtoms[i])) {
      right[el] = (right[el] || 0) + coeff * cnt
    }
  }
  return { left, right }
}
function isBalanced(eq) {
  const { left, right } = countAtoms(eq)
  const allEls = new Set([...Object.keys(left), ...Object.keys(right)])
  if (allEls.size === 0) return false
  for (const el of allEls) {
    if ((left[el] || 0) !== (right[el] || 0) || (left[el] || 0) === 0) return false
  }
  return true
}

// ─── Section 4: Relaciones ───
const relEq = ref('CH4 + 2O2 -> CO2 + 2H2O')
const relMolA = ref('')
const relCoeffA = ref('1')
const relCoeffB = ref('2')
const relMMA = ref('16.04')
const relMMB = ref('18.015')
const relGramsA = ref('16')
const relMode = ref('mol')

const relMolResult = computed(() => {
  const molA = parseFloat(relMolA.value)
  const cA = parseFloat(relCoeffA.value)
  const cB = parseFloat(relCoeffB.value)
  if (!Number.isFinite(molA) || !Number.isFinite(cA) || !Number.isFinite(cB) || cA <= 0) return null
  return { molB: molA * cB / cA, ratio: `${cB}/${cA}` }
})

const relMassResult = computed(() => {
  const gA = parseFloat(relGramsA.value)
  const mmA = parseFloat(relMMA.value)
  const mmB = parseFloat(relMMB.value)
  const cA = parseFloat(relCoeffA.value)
  const cB = parseFloat(relCoeffB.value)
  if ([gA, mmA, mmB, cA, cB].some(v => !Number.isFinite(v) || v <= 0)) return null
  const molA = gA / mmA
  const molB = molA * cB / cA
  const gB = molB * mmB
  return {
    steps: [
      `${fmt(gA)} g A \u00d7 (1 mol / ${fmt(mmA)} g) = ${fmt(molA)} mol A`,
      `${fmt(molA)} mol A \u00d7 (${cB} mol B / ${cA} mol A) = ${fmt(molB)} mol B`,
      `${fmt(molB)} mol B \u00d7 (${fmt(mmB)} g / 1 mol) = ${fmt(gB)} g B`
    ], gB
  }
})

const practiceProblems = [
  { q: '\u00bfCu\u00e1ntos gramos de H\u2082O se producen al quemar 16 g de CH\u2084?', a: 'CH\u2084 + 2O\u2082 \u2192 CO\u2082 + 2H\u2082O\n16 g CH\u2084 \u00d7 (1 mol/16.04 g) = 0.998 mol CH\u2084\n0.998 mol \u00d7 (2 mol H\u2082O/1 mol CH\u2084) = 1.996 mol H\u2082O\n1.996 mol \u00d7 18.015 g/mol = 35.96 g H\u2082O' },
  { q: '\u00bfCu\u00e1ntos gramos de Fe\u2082O\u2083 se forman a partir de 10 g de Fe?', a: '4Fe + 3O\u2082 \u2192 2Fe\u2082O\u2083\n10 g Fe \u00d7 (1 mol/55.845 g) = 0.1791 mol Fe\n0.1791 \u00d7 (2/4) = 0.0895 mol Fe\u2082O\u2083\n0.0895 \u00d7 159.69 g/mol = 14.30 g Fe\u2082O\u2083' },
  { q: 'Si reaccionan 5.0 g de Al con exceso de HCl, \u00bfcu\u00e1ntos gramos de H\u2082 se producen?', a: '2Al + 6HCl \u2192 2AlCl\u2083 + 3H\u2082\n5.0 g Al \u00d7 (1 mol/26.982 g) = 0.1853 mol Al\n0.1853 \u00d7 (3/2) = 0.2779 mol H\u2082\n0.2779 \u00d7 2.016 g/mol = 0.560 g H\u2082' },
  { q: '\u00bfCu\u00e1ntas moles de CO\u2082 se obtienen de 2 moles de C\u2083H\u2088?', a: 'C\u2083H\u2088 + 5O\u2082 \u2192 3CO\u2082 + 4H\u2082O\n2 mol C\u2083H\u2088 \u00d7 (3 mol CO\u2082/1 mol C\u2083H\u2088) = 6 mol CO\u2082' },
  { q: '\u00bfCu\u00e1ntos gramos de O\u2082 se necesitan para quemar 44 g de C\u2083H\u2088?', a: 'C\u2083H\u2088 + 5O\u2082 \u2192 3CO\u2082 + 4H\u2082O\n44 g \u00d7 (1 mol/44.096 g) = 0.998 mol C\u2083H\u2088\n0.998 \u00d7 5 = 4.990 mol O\u2082\n4.990 \u00d7 32.00 = 159.7 g O\u2082' },
]
const practiceRevealed = ref([false, false, false, false, false])

// ─── Section 5: Limitante ───
const limCoeffA = ref('1')
const limCoeffB = ref('2')
const limMMA = ref('16.04')
const limMMB = ref('32.00')
const limGramsA = ref('16')
const limGramsB = ref('50')
const limCoeffProd = ref('2')
const limMMProd = ref('18.015')

const limResult = computed(() => {
  const cA = parseFloat(limCoeffA.value), cB = parseFloat(limCoeffB.value)
  const mmA = parseFloat(limMMA.value), mmB = parseFloat(limMMB.value)
  const gA = parseFloat(limGramsA.value), gB = parseFloat(limGramsB.value)
  const cP = parseFloat(limCoeffProd.value), mmP = parseFloat(limMMProd.value)
  if ([cA,cB,mmA,mmB,gA,gB,cP,mmP].some(v => !Number.isFinite(v) || v <= 0)) return null
  const molA = gA / mmA, molB = gB / mmB
  const ratioA = molA / cA, ratioB = molB / cB
  const limiting = ratioA <= ratioB ? 'A' : 'B'
  const molProd = (limiting === 'A' ? molA * cP / cA : molB * cP / cB)
  const gProd = molProd * mmP
  return {
    molA: fmt(molA), molB: fmt(molB), ratioA: fmt(ratioA), ratioB: fmt(ratioB),
    limiting, molProd: fmt(molProd), gProd: fmt(gProd),
    steps: [
      `mol A = ${fmt(gA)} / ${fmt(mmA)} = ${fmt(molA)}`,
      `mol B = ${fmt(gB)} / ${fmt(mmB)} = ${fmt(molB)}`,
      `Raz\u00f3n A: ${fmt(molA)} / ${cA} = ${fmt(ratioA)}`,
      `Raz\u00f3n B: ${fmt(molB)} / ${cB} = ${fmt(ratioB)}`,
      `Reactivo limitante: ${limiting === 'A' ? 'A' : 'B'} (menor raz\u00f3n)`,
      `mol producto = ${limiting === 'A' ? fmt(molA) : fmt(molB)} \u00d7 ${cP}/${limiting === 'A' ? cA : cB} = ${fmt(molProd)}`,
      `g producto = ${fmt(molProd)} \u00d7 ${fmt(mmP)} = ${fmt(gProd)} g`
    ]
  }
})

const yieldReal = ref('')
const yieldTheoretical = ref('')
const yieldPct = computed(() => {
  const r = parseFloat(yieldReal.value), t = parseFloat(yieldTheoretical.value)
  if (!Number.isFinite(r) || !Number.isFinite(t) || t <= 0) return null
  return (r / t * 100).toFixed(2)
})

const limProblems = [
  { q: 'Se mezclan 10 g de H\u2082 con 80 g de O\u2082 para formar H\u2082O. \u00bfCu\u00e1l es el limitante y cu\u00e1ntos g de H\u2082O se forman?',
    a: '2H\u2082 + O\u2082 \u2192 2H\u2082O\nmol H\u2082 = 10/2.016 = 4.96\nmol O\u2082 = 80/32 = 2.50\nRaz\u00f3n: 4.96/2 = 2.48 vs 2.50/1 = 2.50\nLimitante: H\u2082\nmol H\u2082O = 4.96 \u00d7 (2/2) = 4.96\ng H\u2082O = 4.96 \u00d7 18.015 = 89.4 g' },
  { q: '50 g de Fe reaccionan con 30 g de O\u2082. \u00bfCu\u00e1ntos g de Fe\u2082O\u2083 se forman?',
    a: '4Fe + 3O\u2082 \u2192 2Fe\u2082O\u2083\nmol Fe = 50/55.845 = 0.895\nmol O\u2082 = 30/32 = 0.9375\nRaz\u00f3n: 0.895/4 = 0.224 vs 0.9375/3 = 0.3125\nLimitante: Fe\nmol Fe\u2082O\u2083 = 0.895 \u00d7 2/4 = 0.448\ng = 0.448 \u00d7 159.69 = 71.5 g' },
  { q: 'Si el rendimiento te\u00f3rico es 35.96 g de H\u2082O y se obtienen 30.0 g, \u00bfcu\u00e1l es el % de rendimiento?',
    a: '% rendimiento = (30.0 / 35.96) \u00d7 100 = 83.4%' },
]
const limRevealed = ref([false, false, false])
</script>

<template>
  <div class="space-y-6">
    <!-- Nav pills -->
    <div class="flex flex-wrap gap-2">
      <Button
        v-for="s in sections" :key="s.id"
        :variant="activeSection === s.id ? 'default' : 'outline'"
        size="sm" class="gap-2"
        @click="activeSection = s.id"
      >
        <component :is="s.icon" class="h-4 w-4" />
        {{ s.label }}
      </Button>
    </div>

    <!-- ══════════ SECTION 1: EL MOL ══════════ -->
    <template v-if="activeSection === 'mol'">
      <Card>
        <CardHeader><CardTitle class="flex items-center gap-2"><FlaskConical class="h-5 w-5 text-primary" /> El Mol y N&uacute;mero de Avogadro</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted p-4 space-y-2 text-sm">
            <p class="font-semibold text-base">Relaci&oacute;n fundamental:</p>
            <p class="text-center text-lg font-mono font-bold">1 mol = 6.022 &times; 10&sup2;&sup3; part&iacute;culas = masa molar (g)</p>
            <p>El mol es la unidad que conecta el mundo macrosc&oacute;pico (gramos) con el microsc&oacute;pico (part&iacute;culas). La masa molar (MM) de una sustancia es la masa en gramos de 1 mol de esa sustancia.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Conversor: Gramos &harr; Moles &harr; Part&iacute;culas</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Masa molar (g/mol)</Label>
              <Input v-model="molMM" type="number" placeholder="ej. 18.015" />
            </div>
            <div>
              <Label>Convertir desde:</Label>
              <div class="flex gap-2 mt-1">
                <Button v-for="opt in ['gramos','moles','part\u00edculas']" :key="opt"
                  :variant="molInput === opt ? 'default' : 'outline'" size="sm"
                  @click="molInput = opt">{{ opt }}</Button>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Gramos</Label>
              <Input v-model="molGramos" type="number" :disabled="molInput !== 'gramos'" placeholder="g" />
            </div>
            <div>
              <Label>Moles</Label>
              <Input v-model="molMoles" type="number" :disabled="molInput !== 'moles'" placeholder="mol" />
            </div>
            <div>
              <Label>Part&iacute;culas</Label>
              <Input v-model="molParticulas" type="number" :disabled="molInput !== 'part\u00edculas'" placeholder="part." />
            </div>
          </div>
          <div v-if="molResults" class="rounded-lg border p-4 space-y-3">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div class="rounded bg-muted p-3">
                <div class="text-xs text-muted-foreground">Gramos</div>
                <div class="font-mono font-bold">{{ fmt(molResults.gramos) }}</div>
              </div>
              <div class="rounded bg-muted p-3">
                <div class="text-xs text-muted-foreground">Moles</div>
                <div class="font-mono font-bold">{{ fmt(molResults.moles) }}</div>
              </div>
              <div class="rounded bg-muted p-3">
                <div class="text-xs text-muted-foreground">Part&iacute;culas</div>
                <div class="font-mono font-bold">{{ fmt(molResults.particulas) }}</div>
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-sm font-semibold">An&aacute;lisis dimensional:</p>
              <p v-for="(step, i) in molResults.steps" :key="i" class="text-sm font-mono bg-muted rounded px-3 py-1">{{ step }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Masas molares comunes</CardTitle></CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="c in COMMON_MM" :key="c.formula"
              class="rounded-lg border p-3 text-center cursor-pointer hover:bg-muted transition-colors"
              @click="molMM = String(c.mm)">
              <div class="font-bold text-lg">{{ c.formula }}</div>
              <div class="text-sm text-muted-foreground">{{ c.mm }} g/mol</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle><Scale class="h-5 w-5 inline mr-2 text-primary" />1 mol de distintas sustancias</CardTitle></CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-4 justify-center">
            <div v-for="c in COMMON_MM" :key="c.formula"
              class="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted min-w-[80px]">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                {{ c.mm }}g
              </div>
              <span class="text-sm font-semibold">{{ c.formula }}</span>
              <span class="text-xs text-muted-foreground">1 mol</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </template>

    <!-- ══════════ SECTION 2: COMPOSICION ══════════ -->
    <template v-if="activeSection === 'composicion'">
      <Card>
        <CardHeader><CardTitle class="flex items-center gap-2"><Atom class="h-5 w-5 text-primary" /> Composici&oacute;n Porcentual</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label>F&oacute;rmula molecular (ej. H2SO4, CaCO3)</Label>
            <Input v-model="compFormula" placeholder="H2SO4" />
          </div>
          <div v-if="compResults" class="overflow-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left p-2">Elemento</th>
                  <th class="text-right p-2">&Aacute;tomos</th>
                  <th class="text-right p-2">Masa (g/mol)</th>
                  <th class="text-right p-2">% Composici&oacute;n</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in compResults" :key="i"
                  :class="r.el === 'Total' ? 'border-t font-bold' : ''">
                  <td class="p-2">{{ r.el }}</td>
                  <td class="text-right p-2">{{ r.count || '' }}</td>
                  <td class="text-right p-2 font-mono">{{ fmt(r.mass, 3) }}</td>
                  <td class="text-right p-2 font-mono">{{ fmt(r.pct, 2) }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>F&oacute;rmula Emp&iacute;rica</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">Ingresa la masa (o %) de cada elemento para obtener la f&oacute;rmula emp&iacute;rica.</p>
          <div class="space-y-2">
            <div v-for="i in empCount" :key="i" class="grid grid-cols-2 gap-2">
              <Input v-model="empElements[i-1].el" placeholder="Elemento (ej. C)" />
              <Input v-model="empElements[i-1].mass" type="number" placeholder="Masa o %" />
            </div>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="addEmpEl">+ Elemento</Button>
              <Button variant="outline" size="sm" @click="removeEmpEl" :disabled="empCount <= 2">&minus; Elemento</Button>
            </div>
          </div>
          <div v-if="empResults" class="rounded-lg border p-4 space-y-2">
            <p class="font-semibold">Pasos:</p>
            <div class="overflow-auto">
              <table class="w-full text-sm">
                <thead><tr class="border-b">
                  <th class="text-left p-1">Elemento</th><th class="text-right p-1">Masa</th>
                  <th class="text-right p-1">MA</th><th class="text-right p-1">Moles</th>
                  <th class="text-right p-1">Raz&oacute;n</th><th class="text-right p-1">Entero</th>
                </tr></thead>
                <tbody>
                  <tr v-for="(s, i) in empResults.steps" :key="i">
                    <td class="p-1">{{ s.el }}</td>
                    <td class="text-right p-1 font-mono">{{ fmt(s.mass, 2) }}</td>
                    <td class="text-right p-1 font-mono">{{ fmt(s.am, 3) }}</td>
                    <td class="text-right p-1 font-mono">{{ fmt(s.mol) }}</td>
                    <td class="text-right p-1 font-mono">{{ fmt(s.ratio, 2) }}</td>
                    <td class="text-right p-1 font-mono font-bold">{{ s.rounded }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-center text-lg font-bold">F&oacute;rmula emp&iacute;rica: <Badge variant="secondary" class="text-lg">{{ empResults.formula }}</Badge></p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>F&oacute;rmula Molecular (desde emp&iacute;rica)</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">Ingresa la masa molar experimental para encontrar el multiplicador.</p>
          <div>
            <Label>Masa molar experimental (g/mol)</Label>
            <Input v-model="empMolMM" type="number" placeholder="ej. 180" />
          </div>
          <div v-if="molecularFormula && empResults" class="rounded-lg border p-4 space-y-2 text-center">
            <p class="text-sm">MM emp&iacute;rica = {{ molecularFormula.empMM }} g/mol</p>
            <p class="text-sm">n = MM<sub>exp</sub> / MM<sub>emp</sub> = {{ molecularFormula.n }}</p>
            <p class="text-lg font-bold">F&oacute;rmula molecular: <Badge class="text-lg">{{ molecularFormula.formula }}</Badge></p>
          </div>
        </CardContent>
      </Card>
    </template>

    <!-- ══════════ SECTION 3: BALANCEO ══════════ -->
    <template v-if="activeSection === 'balanceo'">
      <Card>
        <CardHeader><CardTitle class="flex items-center gap-2"><ArrowRightLeft class="h-5 w-5 text-primary" /> Balanceo de Ecuaciones Qu&iacute;micas</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted p-4 text-sm space-y-2">
            <p class="font-semibold">M&eacute;todo de tanteo:</p>
            <ol class="list-decimal ml-4 space-y-1">
              <li>Escribir la ecuaci&oacute;n sin balancear</li>
              <li>Contar &aacute;tomos de cada elemento en ambos lados</li>
              <li>Agregar coeficientes para igualar &aacute;tomos</li>
              <li>Verificar que todos los elementos est&eacute;n balanceados</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <div class="flex flex-wrap gap-2">
        <Button v-for="(eq, i) in equations" :key="i"
          :variant="activeEq === i ? 'default' : 'outline'" size="sm"
          @click="activeEq = i">
          Ecuaci&oacute;n {{ i + 1 }}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="font-mono text-base">
            {{ equations[activeEq].reactants }} &rarr; {{ equations[activeEq].products }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <template v-for="(label, i) in equations[activeEq].labels" :key="i">
              <span v-if="i === equations[activeEq].numR" class="font-bold text-lg">&rarr;</span>
              <span v-if="i > 0 && i !== equations[activeEq].numR" class="font-bold">+</span>
              <div v-if="label" class="flex items-center gap-1">
                <Input
                  v-model="equations[activeEq].userSlots[i]"
                  type="number" class="w-16 text-center font-mono"
                  placeholder="?" min="1"
                />
                <span class="font-mono text-sm">{{ label }}</span>
              </div>
            </template>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg border p-3">
              <p class="text-sm font-semibold mb-2">Reactivos:</p>
              <div v-for="(count, el) in countAtoms(equations[activeEq]).left" :key="el" class="flex justify-between text-sm">
                <span>{{ el }}</span>
                <Badge variant="outline">{{ count }}</Badge>
              </div>
              <p v-if="Object.keys(countAtoms(equations[activeEq]).left).length === 0" class="text-xs text-muted-foreground">Ingresa coeficientes</p>
            </div>
            <div class="rounded-lg border p-3">
              <p class="text-sm font-semibold mb-2">Productos:</p>
              <div v-for="(count, el) in countAtoms(equations[activeEq]).right" :key="el" class="flex justify-between text-sm">
                <span>{{ el }}</span>
                <Badge variant="outline">{{ count }}</Badge>
              </div>
              <p v-if="Object.keys(countAtoms(equations[activeEq]).right).length === 0" class="text-xs text-muted-foreground">Ingresa coeficientes</p>
            </div>
          </div>

          <div v-if="isBalanced(equations[activeEq])" class="rounded-lg bg-green-100 dark:bg-green-900/30 p-3 text-center font-bold text-green-700 dark:text-green-400">
            &iexcl;Ecuaci&oacute;n balanceada correctamente!
          </div>
          <div v-else class="rounded-lg bg-muted p-3 text-center text-sm text-muted-foreground">
            Ingresa los coeficientes para balancear la ecuaci&oacute;n.
          </div>
        </CardContent>
      </Card>
    </template>

    <!-- ══════════ SECTION 4: RELACIONES ══════════ -->
    <template v-if="activeSection === 'relaciones'">
      <Card>
        <CardHeader><CardTitle class="flex items-center gap-2"><Scale class="h-5 w-5 text-primary" /> Relaciones Estequiom&eacute;tricas</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div class="flex gap-2">
            <Button :variant="relMode === 'mol' ? 'default' : 'outline'" size="sm" @click="relMode = 'mol'">Mol a Mol</Button>
            <Button :variant="relMode === 'mass' ? 'default' : 'outline'" size="sm" @click="relMode = 'mass'">Masa a Masa</Button>
          </div>
        </CardContent>
      </Card>

      <Card v-if="relMode === 'mol'">
        <CardHeader><CardTitle>Conversor Mol &rarr; Mol</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Moles de A</Label>
              <Input v-model="relMolA" type="number" placeholder="mol A" />
            </div>
            <div>
              <Label>Coeficiente A</Label>
              <Input v-model="relCoeffA" type="number" placeholder="coef A" />
            </div>
            <div>
              <Label>Coeficiente B</Label>
              <Input v-model="relCoeffB" type="number" placeholder="coef B" />
            </div>
          </div>
          <div v-if="relMolResult" class="rounded-lg border p-4 text-center space-y-2">
            <p class="text-sm font-mono">mol A &times; ({{ relMolResult.ratio }}) = mol B</p>
            <p class="text-lg font-bold">{{ fmt(relMolResult.molB) }} mol B</p>
          </div>
        </CardContent>
      </Card>

      <Card v-if="relMode === 'mass'">
        <CardHeader><CardTitle>Conversor Masa &rarr; Masa (cadena de factores)</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground font-mono text-center">g A &rarr; mol A &rarr; mol B &rarr; g B</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <Label>Gramos de A</Label>
              <Input v-model="relGramsA" type="number" />
            </div>
            <div>
              <Label>MM de A (g/mol)</Label>
              <Input v-model="relMMA" type="number" />
            </div>
            <div>
              <Label>MM de B (g/mol)</Label>
              <Input v-model="relMMB" type="number" />
            </div>
            <div>
              <Label>Coeficiente A</Label>
              <Input v-model="relCoeffA" type="number" />
            </div>
            <div>
              <Label>Coeficiente B</Label>
              <Input v-model="relCoeffB" type="number" />
            </div>
          </div>
          <div v-if="relMassResult" class="rounded-lg border p-4 space-y-2">
            <p class="text-sm font-semibold">An&aacute;lisis dimensional:</p>
            <p v-for="(step, i) in relMassResult.steps" :key="i" class="text-sm font-mono bg-muted rounded px-3 py-1">
              {{ step }}
            </p>
            <p class="text-center text-lg font-bold mt-2">Resultado: {{ fmt(relMassResult.gB) }} g B</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Problemas de pr&aacute;ctica</CardTitle></CardHeader>
        <CardContent class="space-y-3">
          <div v-for="(p, i) in practiceProblems" :key="i" class="rounded-lg border p-4 space-y-2">
            <p class="font-semibold text-sm">{{ i + 1 }}. {{ p.q }}</p>
            <Button variant="outline" size="sm" @click="practiceRevealed[i] = !practiceRevealed[i]" class="gap-1">
              <component :is="practiceRevealed[i] ? ChevronUp : ChevronDown" class="h-4 w-4" />
              {{ practiceRevealed[i] ? 'Ocultar' : 'Ver soluci\u00f3n' }}
            </Button>
            <pre v-if="practiceRevealed[i]" class="text-sm font-mono bg-muted rounded p-3 whitespace-pre-wrap">{{ p.a }}</pre>
          </div>
        </CardContent>
      </Card>
    </template>

    <!-- ══════════ SECTION 5: LIMITANTE ══════════ -->
    <template v-if="activeSection === 'limitante'">
      <Card>
        <CardHeader><CardTitle class="flex items-center gap-2"><Target class="h-5 w-5 text-primary" /> Reactivo Limitante y Rendimiento</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted p-4 text-sm space-y-3">
            <p class="font-semibold text-base">Analog&iacute;a del s&aacute;ndwich:</p>
            <div class="flex flex-wrap items-center justify-center gap-4 text-center">
              <div class="rounded-lg border bg-background p-3">
                <div class="text-2xl">&#x1F35E;</div>
                <div class="font-bold">10 panes</div>
              </div>
              <span class="text-xl font-bold">+</span>
              <div class="rounded-lg border bg-background p-3">
                <div class="text-2xl">&#x1F969;</div>
                <div class="font-bold">3 hamburguesas</div>
              </div>
              <span class="text-xl font-bold">=</span>
              <div class="rounded-lg border bg-background p-3">
                <div class="text-2xl">&#x1F354;</div>
                <div class="font-bold">3 s&aacute;ndwiches</div>
              </div>
            </div>
            <p class="text-center">La <strong>hamburguesa</strong> es el <Badge variant="destructive">reactivo limitante</Badge> &mdash; se agota primero y determina cu&aacute;nto producto se forma. Sobran 4 panes (<em>reactivo en exceso</em>).</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Calculadora de Reactivo Limitante</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">Ecuaci&oacute;n: aA + bB &rarr; cProducto</p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Label>Coef. A (a)</Label>
              <Input v-model="limCoeffA" type="number" />
            </div>
            <div>
              <Label>Coef. B (b)</Label>
              <Input v-model="limCoeffB" type="number" />
            </div>
            <div>
              <Label>Coef. Prod (c)</Label>
              <Input v-model="limCoeffProd" type="number" />
            </div>
            <div></div>
            <div>
              <Label>Gramos A</Label>
              <Input v-model="limGramsA" type="number" />
            </div>
            <div>
              <Label>MM A (g/mol)</Label>
              <Input v-model="limMMA" type="number" />
            </div>
            <div>
              <Label>Gramos B</Label>
              <Input v-model="limGramsB" type="number" />
            </div>
            <div>
              <Label>MM B (g/mol)</Label>
              <Input v-model="limMMB" type="number" />
            </div>
          </div>
          <div>
            <Label>MM Producto (g/mol)</Label>
            <Input v-model="limMMProd" type="number" class="max-w-xs" />
          </div>

          <div v-if="limResult" class="rounded-lg border p-4 space-y-2">
            <p class="text-sm font-semibold">Pasos:</p>
            <p v-for="(step, i) in limResult.steps" :key="i" class="text-sm font-mono bg-muted rounded px-3 py-1">
              {{ step }}
            </p>
            <div class="flex gap-4 justify-center mt-3">
              <div class="rounded-lg p-3 text-center" :class="limResult.limiting === 'A' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-muted'">
                <div class="text-sm">Reactivo A</div>
                <div class="font-bold">{{ limResult.molA }} mol</div>
                <Badge v-if="limResult.limiting === 'A'" variant="destructive" class="mt-1">Limitante</Badge>
                <Badge v-else variant="secondary" class="mt-1">Exceso</Badge>
              </div>
              <div class="rounded-lg p-3 text-center" :class="limResult.limiting === 'B' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-muted'">
                <div class="text-sm">Reactivo B</div>
                <div class="font-bold">{{ limResult.molB }} mol</div>
                <Badge v-if="limResult.limiting === 'B'" variant="destructive" class="mt-1">Limitante</Badge>
                <Badge v-else variant="secondary" class="mt-1">Exceso</Badge>
              </div>
            </div>
            <p class="text-center text-lg font-bold mt-2">Rendimiento te&oacute;rico: {{ limResult.gProd }} g</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>% Rendimiento</CardTitle></CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm font-mono text-center">% rendimiento = (real / te&oacute;rico) &times; 100</p>
          <div class="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <Label>Rendimiento real (g)</Label>
              <Input v-model="yieldReal" type="number" placeholder="g obtenidos" />
            </div>
            <div>
              <Label>Rendimiento te&oacute;rico (g)</Label>
              <Input v-model="yieldTheoretical" type="number" placeholder="g te&oacute;ricos" />
            </div>
          </div>
          <div v-if="yieldPct" class="rounded-lg border p-4 text-center">
            <p class="text-2xl font-bold">{{ yieldPct }}%</p>
            <p class="text-sm text-muted-foreground">rendimiento</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Problemas de pr&aacute;ctica</CardTitle></CardHeader>
        <CardContent class="space-y-3">
          <div v-for="(p, i) in limProblems" :key="i" class="rounded-lg border p-4 space-y-2">
            <p class="font-semibold text-sm">{{ i + 1 }}. {{ p.q }}</p>
            <Button variant="outline" size="sm" @click="limRevealed[i] = !limRevealed[i]" class="gap-1">
              <component :is="limRevealed[i] ? ChevronUp : ChevronDown" class="h-4 w-4" />
              {{ limRevealed[i] ? 'Ocultar' : 'Ver soluci\u00f3n' }}
            </Button>
            <pre v-if="limRevealed[i]" class="text-sm font-mono bg-muted rounded p-3 whitespace-pre-wrap">{{ p.a }}</pre>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
