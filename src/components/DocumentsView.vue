<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { documents } from '../data/documentsData.js'
import { FileText, BookOpen, FlaskConical, StickyNote, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const selectedDoc = ref(null)
const docContent = ref('')

// KaTeX extension for marked
const katexBlock = {
  name: 'katexBlock',
  level: 'block',
  start(src) { return src.indexOf('$$') },
  tokenizer(src) {
    const match = src.match(/^\$\$([\s\S]+?)\$\$/)
    if (match) {
      return { type: 'katexBlock', raw: match[0], text: match[1].trim() }
    }
  },
  renderer(token) {
    try {
      return `<div class="katex-display">${katex.renderToString(token.text, { displayMode: true, throwOnError: false })}</div>`
    } catch { return `<code>${token.text}</code>` }
  }
}

const katexInline = {
  name: 'katexInline',
  level: 'inline',
  start(src) { return src.indexOf('$') },
  tokenizer(src) {
    const match = src.match(/^\$([^\$\n]+?)\$/)
    if (match) {
      return { type: 'katexInline', raw: match[0], text: match[1].trim() }
    }
  },
  renderer(token) {
    try {
      return katex.renderToString(token.text, { displayMode: false, throwOnError: false })
    } catch { return `<code>${token.text}</code>` }
  }
}

marked.use({ extensions: [katexBlock, katexInline] })
marked.setOptions({ gfm: true, breaks: true })

const viewableDocs = computed(() => documents)
const currentDocIndex = computed(() =>
  selectedDoc.value ? viewableDocs.value.findIndex((d) => d.id === selectedDoc.value.id) : -1
)
const canGoPrev = computed(() => currentDocIndex.value > 0)
const canGoNext = computed(() => currentDocIndex.value >= 0 && currentDocIndex.value < viewableDocs.value.length - 1)

const isPdf = computed(() => selectedDoc.value?.type === 'pdf')
const isMd = computed(() => selectedDoc.value?.type === 'md')
const isTxt = computed(() => selectedDoc.value?.type === 'txt')

const renderedMd = computed(() =>
  isMd.value ? marked.parse(docContent.value) : ''
)

const iconMap = {
  book: BookOpen,
  flask: FlaskConical,
  note: StickyNote,
  file: FileText
}

function getDocUrl(doc) {
  return `/documents/${doc.file}`
}

function loadDoc(doc) {
  selectedDoc.value = doc
  if (doc.type === 'pdf') {
    docContent.value = ''
    return
  }
  fetch(getDocUrl(doc))
    .then((r) => r.text())
    .then((text) => {
      docContent.value = text
    })
    .catch(() => {
      docContent.value = '*No se pudo cargar el documento.*'
    })
}

function openDoc(doc) {
  loadDoc(doc)
}

function closeViewer() {
  selectedDoc.value = null
  docContent.value = ''
}

function goPrev() {
  if (!canGoPrev.value) return
  const prev = viewableDocs.value[currentDocIndex.value - 1]
  loadDoc(prev)
}

function goNext() {
  if (!canGoNext.value) return
  const next = viewableDocs.value[currentDocIndex.value + 1]
  loadDoc(next)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div v-if="!selectedDoc" class="space-y-4">
      <p class="text-sm text-muted-foreground">
        Documentos en la carpeta del proyecto. Todos se pueden ver aquí sin salir de la app.
      </p>
      <div class="grid gap-4 sm:grid-cols-2">
        <Card
          v-for="doc in documents"
          :key="doc.id"
          class="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
          @click="openDoc(doc)"
        >
          <CardHeader class="pb-2">
            <div class="mb-2 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <component :is="iconMap[doc.icon] || FileText" class="size-6" />
            </div>
            <CardTitle class="text-base">{{ doc.name }}</CardTitle>
            <CardDescription class="text-sm">{{ doc.description }}</CardDescription>
          </CardHeader>
          <CardContent class="pt-0">
            <span class="text-xs text-muted-foreground">.{{ doc.type }}</span>
          </CardContent>
        </Card>
      </div>
    </div>

    <div v-else class="flex flex-col flex-1 min-h-0">
      <div class="flex items-center justify-between gap-4 mb-4 shrink-0 flex-wrap">
        <div class="flex items-center gap-2">
          <Button variant="outline" size="icon" :disabled="!canGoPrev" @click="goPrev">
            <ChevronLeft class="size-4" />
          </Button>
          <span class="text-sm text-muted-foreground min-w-[6rem] text-center">
            {{ currentDocIndex + 1 }} / {{ viewableDocs.length }}
          </span>
          <Button variant="outline" size="icon" :disabled="!canGoNext" @click="goNext">
            <ChevronRight class="size-4" />
          </Button>
        </div>
        <h2 class="text-lg font-semibold flex-1 text-center">{{ selectedDoc.name }}</h2>
        <Button variant="ghost" size="sm" @click="closeViewer">
          ← Volver
        </Button>
      </div>
      <div class="flex-1 min-h-0 overflow-hidden rounded-lg border bg-background flex flex-col">
        <!-- PDF: iframe embebido -->
        <iframe
          v-if="isPdf"
          :src="getDocUrl(selectedDoc)"
          class="w-full flex-1 min-h-0 border-0"
          title="Visor PDF"
        />
        <!-- MD: renderizado Markdown -->
        <div v-else-if="isMd" class="flex-1 min-h-0 overflow-y-auto p-6">
          <article class="markdown-body" v-html="renderedMd" />
        </div>
        <!-- TXT: texto plano -->
        <div v-else-if="isTxt" class="flex-1 min-h-0 overflow-y-auto p-6">
          <pre class="whitespace-pre-wrap font-sans text-sm leading-relaxed">{{ docContent }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
