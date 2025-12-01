<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  window: IWindowController
}>()

interface EditorFile {
  id: string
  name: string
  content: string
  language: string
  modified: boolean
}

const files = ref<EditorFile[]>([
  {
    id: '1',
    name: 'example.md',
    content: '# Welcome to Code Editor\n\n## Features\n- Syntax highlighting\n- Git integration\n- Live preview',
    language: 'markdown',
    modified: false
  },
  {
    id: '2',
    name: 'config.yaml',
    content: 'app:\n  name: Necloud\n  version: 1.0.0\n  theme: dark',
    language: 'yaml',
    modified: false
  }
])

const activeFileId = ref(files.value[0].id)
const editorContent = ref(files.value[0].content)

const activeFile = computed(() => files.value.find(f => f.id === activeFileId.value))

const lineCount = computed(() => editorContent.value.split('\n').length)
const charCount = computed(() => editorContent.value.length)

function updateContent() {
  const file = activeFile.value
  if (file) {
    file.content = editorContent.value
    file.modified = true
  }
}

function saveFile() {
  if (activeFile.value) {
    activeFile.value.modified = false
    // In a real app, save to file system or API
  }
}

function switchFile(fileId: string) {
  activeFileId.value = fileId
  const file = files.value.find(f => f.id === fileId)
  if (file) {
    editorContent.value = file.content
  }
}

function closeFile(fileId: string) {
  files.value = files.value.filter(f => f.id !== fileId)
  if (activeFileId.value === fileId) {
    if (files.value.length > 0) {
      activeFileId.value = files.value[0].id
      editorContent.value = files.value[0].content
    } else {
      activeFileId.value = ''
      editorContent.value = ''
    }
  }
}
</script>

<template>
  <Window :window="window">
    <div class="editor">
      <div class="editor-tabs">
        <div
          v-for="file in files"
          :key="file.id"
          :class="['tab', { active: activeFileId === file.id }]"
          @click="switchFile(file.id)"
          role="button"
          tabindex="0"
        >
          <span class="file-icon">
            <span v-if="file.language === 'markdown'">📝</span>
            <span v-else-if="file.language === 'yaml'">⚙</span>
            <span v-else>📄</span>
          </span>
          <span class="file-name">{{ file.name }}</span>
          <span v-if="file.modified" class="modified-dot">●</span>
          <button
            class="close-btn"
            @click.stop="closeFile(file.id)"
          >
            ×
          </button>
        </div>
      </div>

      <div class="editor-controls">
        <button @click="saveFile">💾 Save</button>
        <button>🔍 Find</button>
        <button>📋 Git</button>
      </div>

      <div v-if="activeFile" class="editor-content">
        <div class="line-numbers">
          <div
            v-for="(_, i) in editorContent.split('\n')"
            :key="i"
            class="line-number"
          >
            {{ i + 1 }}
          </div>
        </div>
        <textarea
          v-model="editorContent"
          @input="updateContent"
          spellcheck="false"
          autocomplete="off"
        />
      </div>

      <div v-if="activeFile" class="editor-status">
        <span>{{ activeFile.language }}</span>
        <span>{{ lineCount }} lines</span>
        <span>{{ charCount }} characters</span>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Monaco', 'Menlo', monospace;
}

.editor-tabs {
  display: flex;
  background: #252526;
  border-bottom: 1px solid #3e3e3e;
  overflow-x: auto;
  gap: 2px;
  padding: 0 5px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #2d2d30;
  color: #cccccc;
  cursor: pointer;
  border-right: 1px solid #3e3e3e;
  white-space: nowrap;
}

.tab:hover {
  background: #3e3e42;
}

.tab.active {
  background: #1e1e1e;
  border-bottom: 2px solid #007acc;
}

.file-icon {
  font-size: 14px;
}

.file-name {
  font-size: 12px;
}

.modified-dot {
  color: #f48771;
  font-size: 8px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #cccccc;
  cursor: pointer;
  font-size: 14px;
  padding: 0 4px;
}

.close-btn:hover {
  color: #f48771;
}

.editor-controls {
  display: flex;
  gap: 5px;
  padding: 5px;
  background: #2d2d30;
  border-bottom: 1px solid #3e3e3e;
}

.editor-controls button {
  padding: 4px 8px;
  background: #3e3e42;
  color: #cccccc;
  border: 1px solid #555;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
}

.editor-controls button:hover {
  background: #4e4e54;
}

.editor-content {
  flex: 1;
  position: relative;
  display: flex;
  overflow: hidden;
}

.line-numbers {
  background: #1e1e1e;
  color: #858585;
  padding: 10px 8px;
  text-align: right;
  border-right: 1px solid #3e3e3e;
  font-size: 12px;
  line-height: 1.5;
  user-select: none;
  min-width: 40px;
}

.line-number {
  min-width: 30px;
}

textarea {
  flex: 1;
  background: #1e1e1e;
  color: #d4d4d4;
  border: none;
  outline: none;
  padding: 10px;
  font-family: inherit;
  font-size: 12px;
  line-height: 1.5;
  resize: none;
  tab-size: 2;
}

.editor-status {
  display: flex;
  gap: 15px;
  padding: 4px 10px;
  background: #007acc;
  color: white;
  font-size: 11px;
}
</style>
