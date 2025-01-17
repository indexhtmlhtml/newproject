<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'javascript'
  },
  theme: {
    type: String,
    default: 'vs-dark'
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const editorContainer = ref(null)
let editor = null

// 初始化编辑器
const initMonaco = () => {
  const defaultOptions = {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    automaticLayout: true,
    fontSize: 14,
    minimap: {
      enabled: false
    },
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollbar: {
      useShadows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
      alwaysConsumeMouseWheel: false
    },
    ...props.options
  }

  editor = monaco.editor.create(editorContainer.value, defaultOptions)

  // 监听内容变化
  editor.onDidChangeModelContent(() => {
    const value = editor.getValue()
    emit('update:modelValue', value)
    emit('change', value)
  })
}

// 更新编辑器内容
const updateContent = () => {
  if (editor) {
    const value = props.modelValue
    if (value !== editor.getValue()) {
      editor.setValue(value)
    }
  }
}

// 更新编辑器语言
const updateLanguage = () => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel(), props.language)
  }
}

// 更新编辑器主题
const updateTheme = () => {
  if (editor) {
    monaco.editor.setTheme(props.theme)
  }
}

// 监听属性变化
watch(() => props.modelValue, updateContent)
watch(() => props.language, updateLanguage)
watch(() => props.theme, updateTheme)

onMounted(() => {
  initMonaco()
})

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
})
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}
</style> 