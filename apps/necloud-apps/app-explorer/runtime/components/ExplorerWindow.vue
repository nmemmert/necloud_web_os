<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ window: IWindowController }>()

interface FsItem {
  id: string
  name: string
  type: 'file' | 'dir'
  ext?: string
  children?: FsItem[]
}

// Placeholder mock filesystem until real module-fs integration
const rootItems: FsItem[] = [
  {
    id: 'home',
    name: 'home',
    type: 'dir',
    children: [
      { id: 'readme', name: 'README.md', type: 'file', ext: 'md' },
      { id: 'notes', name: 'notes.txt', type: 'file', ext: 'txt' },
      {
        id: 'projects',
        name: 'projects',
        type: 'dir',
        children: [
          { id: 'app1', name: 'app1.vue', type: 'file', ext: 'vue' },
          { id: 'data', name: 'data.json', type: 'file', ext: 'json' }
        ]
      }
    ]
  },
  {
    id: 'etc',
    name: 'etc',
    type: 'dir',
    children: [
      { id: 'config', name: 'config.yaml', type: 'file', ext: 'yaml' }
    ]
  }
]

const currentPath = ref<string[]>([])
const currentItems = computed(() => {
  let items = rootItems
  for (const seg of currentPath.value) {
    const dir = items.find(i => i.type === 'dir' && i.name === seg)
    if (!dir || !dir.children) return []
    items = dir.children
  }
  return items
})

const selected: FsItem | null = null
const selectedItem = ref<FsItem | null>(selected)
const renameDraft = ref<string>('')
const search = ref('')

const filteredItems = computed(() => {
  if (!search.value) return currentItems.value
  return currentItems.value.filter(i => i.name.toLowerCase().includes(search.value.toLowerCase()))
})

function openDir(item: FsItem) {
  if (item.type !== 'dir') return
  currentPath.value.push(item.name)
  selectedItem.value = null
}

function goUp() {
  currentPath.value.pop()
  selectedItem.value = null
}

function select(item: FsItem) {
  selectedItem.value = item
  renameDraft.value = item.name
}

function startRename() {
  if (!selectedItem.value) return
  renameDraft.value = selectedItem.value.name
}

function commitRename() {
  if (!selectedItem.value) return
  if (!renameDraft.value.trim()) return
  selectedItem.value.name = renameDraft.value.trim()
}

function deleteItem() {
  if (!selectedItem.value) return
  const pathItems = getItemsAtCurrentPath()
  const idx = pathItems.indexOf(selectedItem.value)
  if (idx >= 0) pathItems.splice(idx, 1)
  selectedItem.value = null
}

function getItemsAtCurrentPath(): FsItem[] {
  let items = rootItems
  for (const seg of currentPath.value) {
    const dir = items.find(i => i.type === 'dir' && i.name === seg)
    if (!dir || !dir.children) return []
    items = dir.children
  }
  return items
}

function openFile(item: FsItem) {
  if (item.type === 'file') {
    // Placeholder: integrate with file open system or viewer app later
    alert(`Open file: ${item.name}`)
  }
}
</script>

<template>
  <Window :window="window">
    <div class="explorer">
      <div class="sidebar">
        <div class="path-bar">
          <button class="btn" :disabled="currentPath.length===0" @click="goUp">⬆</button>
          <span class="path">/{{ currentPath.join('/') }}</span>
        </div>
        <div class="search-box">
          <input v-model="search" placeholder="Search..." />
        </div>
        <div class="items">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="item"
            :class="{ selected: selectedItem?.id === item.id }"
            @click="select(item)"
            @dblclick="item.type==='dir' ? openDir(item) : openFile(item)"
          >
            <span class="icon">{{ item.type==='dir' ? '📁' : '📄' }}</span>
            <span class="name">{{ item.name }}</span>
          </div>
          <div v-if="filteredItems.length===0" class="empty">No items</div>
        </div>
      </div>

      <div class="detail" v-if="selectedItem">
        <h3>{{ selectedItem.type==='dir' ? 'Directory' : 'File' }} Details</h3>
        <div class="field">
          <label>Name</label>
          <input v-model="renameDraft" @keyup.enter="commitRename" />
          <button class="btn" @click="commitRename">Rename</button>
        </div>
        <div class="field">
          <label>Type</label>
          <div>{{ selectedItem.type }}</div>
        </div>
        <div class="actions">
          <button class="btn danger" @click="deleteItem">Delete</button>
          <button v-if="selectedItem.type==='file'" class="btn" @click="openFile(selectedItem)">Open</button>
        </div>
      </div>

      <div v-else class="detail empty-state">
        <p>Select an item to view details</p>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.explorer { display: flex; height: 100%; background: #f6f7f9; font-family: system-ui, sans-serif; }
.sidebar { width: 320px; border-right: 1px solid #ddd; background: #fff; display: flex; flex-direction: column; }
.path-bar { display: flex; gap: .5rem; align-items: center; padding: .5rem .75rem; border-bottom: 1px solid #eee; font-size: .85rem; }
.path { color: #555; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.search-box { padding: .5rem .75rem; border-bottom: 1px solid #eee; }
.search-box input { width: 100%; padding: .4rem .6rem; border: 1px solid #ccc; border-radius: 4px; font-size: .85rem; }
.items { overflow-y: auto; flex: 1; }
.item { display: flex; align-items: center; gap: .5rem; padding: .4rem .6rem; cursor: pointer; font-size: .85rem; }
.item:hover { background: #f0f3f7; }
.item.selected { background: #e0e6f3; }
.icon { width: 20px; text-align: center; }
.detail { flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: .75rem; }
.detail.empty-state { justify-content: center; align-items: center; color: #666; }
.field { display: flex; flex-direction: column; gap: .35rem; }
.field input { padding: .45rem .6rem; border: 1px solid #ccc; border-radius: 4px; font-size: .85rem; }
.actions { display: flex; gap: .5rem; margin-top: .5rem; }
.btn { background: #4a6ff0; color: #fff; border: none; padding: .35rem .7rem; border-radius: 4px; font-size: .75rem; cursor: pointer; }
.btn:hover { background: #375ad1; }
.btn.danger { background: #e45454; }
.btn.danger:hover { background: #c03f3f; }
.empty { padding: .75rem; color: #777; font-size: .75rem; }
</style>
