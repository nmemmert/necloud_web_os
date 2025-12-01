<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  window: IWindowController
}>()

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const notes = ref<Note[]>([
  {
    id: '1',
    title: 'Welcome to Notes',
    content: '# Welcome!\n\nThis is a simple markdown notes app.\n\n## Features\n- Create and edit notes\n- Markdown support\n- Quick search\n\n**Start writing your ideas!**',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
])

const selectedNote = ref<Note | null>(notes.value[0] || null)
const searchQuery = ref('')
const showPreview = ref(false)

const filteredNotes = computed(() => {
  if (!searchQuery.value) return notes.value
  
  const query = searchQuery.value.toLowerCase()
  return notes.value.filter(note =>
    note.title.toLowerCase().includes(query) ||
    note.content.toLowerCase().includes(query)
  )
})

function createNote() {
  const newNote: Note = {
    id: Date.now().toString(),
    title: 'New Note',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  notes.value.unshift(newNote)
  selectedNote.value = newNote
}

function selectNote(note: Note) {
  selectedNote.value = note
}

function deleteNote(id: string) {
  notes.value = notes.value.filter(n => n.id !== id)
  if (selectedNote.value?.id === id) {
    selectedNote.value = notes.value[0] || null
  }
}

function updateTitle(event: Event) {
  if (!selectedNote.value) return
  const target = event.target as HTMLInputElement
  selectedNote.value.title = target.value
  selectedNote.value.updatedAt = new Date()
}

function updateContent(event: Event) {
  if (!selectedNote.value) return
  const target = event.target as HTMLTextAreaElement
  selectedNote.value.content = target.value
  selectedNote.value.updatedAt = new Date()
}

// Simple markdown to HTML (basic support)
function renderMarkdown(text: string): string {
  return text
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])/gm, '<p>')
    .replace(/(?<![>])$/gm, '</p>')
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<template>
  <Window :window="window">
    <div class="notes-app">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h3>📝 Notes</h3>
          <button @click="createNote" class="btn-new">+</button>
        </div>
        
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search notes..."
            class="search-input"
          />
        </div>
        
        <div class="notes-list">
          <div
            v-for="note in filteredNotes"
            :key="note.id"
            @click="selectNote(note)"
            :class="{ active: selectedNote?.id === note.id }"
            class="note-item"
          >
            <div class="note-item-header">
              <span class="note-title">{{ note.title || 'Untitled' }}</span>
              <button @click.stop="deleteNote(note.id)" class="btn-delete-small">×</button>
            </div>
            <div class="note-preview">
              {{ note.content.substring(0, 60) }}...
            </div>
            <div class="note-date">
              {{ formatDate(note.updatedAt) }}
            </div>
          </div>
          
          <div v-if="filteredNotes.length === 0" class="empty-list">
            No notes found
          </div>
        </div>
      </div>
      
      <!-- Editor -->
      <div v-if="selectedNote" class="editor">
        <div class="editor-header">
          <input
            :value="selectedNote.title"
            @input="updateTitle"
            placeholder="Note title..."
            class="title-input"
          />
          <div class="editor-actions">
            <button
              @click="showPreview = !showPreview"
              class="btn-preview"
              :class="{ active: showPreview }"
            >
              {{ showPreview ? '📝 Edit' : '👁 Preview' }}
            </button>
          </div>
        </div>
        
        <div class="editor-content">
          <textarea
            v-if="!showPreview"
            :value="selectedNote.content"
            @input="updateContent"
            placeholder="Start writing... (Markdown supported)"
            class="content-textarea"
          />
          
          <div v-else class="preview-content" v-html="renderMarkdown(selectedNote.content)"></div>
        </div>
        
        <div class="editor-footer">
          <span class="word-count">
            {{ selectedNote.content.split(/\s+/).filter(w => w).length }} words
          </span>
          <span class="updated-at">
            Last updated: {{ formatDate(selectedNote.updatedAt) }}
          </span>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="empty-editor">
        <div class="empty-icon">📝</div>
        <p>Select a note or create a new one</p>
        <button @click="createNote" class="btn-create">Create Note</button>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.notes-app {
  width: 100%;
  height: 100%;
  display: flex;
  background: #f5f5f5;
  font-family: system-ui, -apple-system, sans-serif;
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.btn-new {
  width: 32px;
  height: 32px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-new:hover {
  background: #5568d3;
}

.search-box {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.search-input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.notes-list {
  flex: 1;
  overflow-y: auto;
}

.note-item {
  padding: 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.note-item:hover {
  background: #f8f9fa;
}

.note-item.active {
  background: #e8eaf6;
  border-left: 3px solid #667eea;
}

.note-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.note-title {
  font-weight: 600;
  color: #333;
  font-size: 0.875rem;
}

.btn-delete-small {
  background: transparent;
  border: none;
  color: #999;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
}

.btn-delete-small:hover {
  color: #f44336;
}

.note-preview {
  font-size: 0.75rem;
  color: #666;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-date {
  font-size: 0.7rem;
  color: #999;
}

.empty-list {
  padding: 2rem;
  text-align: center;
  color: #999;
  font-size: 0.875rem;
}

.editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.editor-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.title-input {
  flex: 1;
  border: none;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  padding: 0.5rem 0;
}

.title-input:focus {
  outline: none;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-preview {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-preview:hover,
.btn-preview.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.editor-content {
  flex: 1;
  overflow: hidden;
}

.content-textarea {
  width: 100%;
  height: 100%;
  padding: 1.5rem;
  border: none;
  font-size: 1rem;
  line-height: 1.6;
  font-family: inherit;
  resize: none;
}

.content-textarea:focus {
  outline: none;
}

.preview-content {
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
  line-height: 1.6;
}

.preview-content :deep(h1) {
  font-size: 2rem;
  margin: 1rem 0;
}

.preview-content :deep(h2) {
  font-size: 1.5rem;
  margin: 0.875rem 0;
}

.preview-content :deep(h3) {
  font-size: 1.25rem;
  margin: 0.75rem 0;
}

.preview-content :deep(p) {
  margin: 0.5rem 0;
}

.preview-content :deep(ul) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.preview-content :deep(li) {
  margin: 0.25rem 0;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
  font-size: 0.75rem;
  color: #666;
}

.empty-editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  color: #999;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.empty-editor p {
  margin-bottom: 1.5rem;
}

.btn-create {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.btn-create:hover {
  background: #5568d3;
}
</style>
