<script setup lang="ts">
import { ref, computed } from 'vue'
import type { IWindowController } from '@owdproject/core'

const props = defineProps<{
  window: IWindowController
}>()

interface VaultItem {
  id: string
  type: number
  name: string
  login?: {
    username: string
    password: string
    uris?: { uri: string }[]
  }
  folderId: string | null
  favorite: boolean
}

interface Folder {
  id: string
  name: string
}

const isLocked = ref(true)
const masterPassword = ref('')
const items = ref<VaultItem[]>([])
const folders = ref<Folder[]>([])
const selectedFolder = ref<string | null>(null)
const searchQuery = ref('')
const showAddItem = ref(false)
const selectedItem = ref<VaultItem | null>(null)
const error = ref<string | null>(null)

const vaultConfig = ref({
  serverUrl: 'https://key.necloud.us',
  email: '',
  token: ''
})

// New item form
const newItem = ref({
  name: '',
  username: '',
  password: '',
  uri: '',
  notes: '',
  folderId: null as string | null
})

async function unlock(password: string) {
  try {
    error.value = null
    
    // Simulated authentication - replace with actual Vaultwarden API
    if (password) {
      vaultConfig.value.token = 'simulated-token'
      await loadVault()
      isLocked.value = false
      masterPassword.value = ''
    } else {
      throw new Error('Master password required')
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to unlock vault'
    console.error('Failed to unlock vault:', err)
  }
}

async function loadVault() {
  try {
    // Simulated data - replace with actual API calls
    folders.value = [
      { id: '1', name: 'Personal' },
      { id: '2', name: 'Work' },
      { id: '3', name: 'Banking' }
    ]
    
    items.value = [
      {
        id: '1',
        type: 1,
        name: 'GitHub',
        login: {
          username: 'user@example.com',
          password: '••••••••',
          uris: [{ uri: 'https://github.com' }]
        },
        folderId: '2',
        favorite: true
      },
      {
        id: '2',
        type: 1,
        name: 'Email Account',
        login: {
          username: 'myemail@example.com',
          password: '••••••••',
          uris: [{ uri: 'https://mail.example.com' }]
        },
        folderId: '1',
        favorite: false
      },
      {
        id: '3',
        type: 1,
        name: 'Bank Account',
        login: {
          username: 'johndoe',
          password: '••••••••',
          uris: [{ uri: 'https://bank.example.com' }]
        },
        folderId: '3',
        favorite: true
      }
    ]
  } catch (err: any) {
    error.value = err.message || 'Failed to load vault'
    console.error('Failed to load vault:', err)
  }
}

const filteredItems = computed(() => {
  let result = items.value
  
  if (selectedFolder.value === 'favorites') {
    result = result.filter(item => item.favorite)
  } else if (selectedFolder.value) {
    result = result.filter(item => item.folderId === selectedFolder.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.login?.username?.toLowerCase().includes(query)
    )
  }
  
  return result
})

function selectItem(item: VaultItem) {
  selectedItem.value = item
}

function closeItemView() {
  selectedItem.value = null
}

async function copyToClipboard(text: string, type: string) {
  try {
    await navigator.clipboard.writeText(text)
    // Show notification
    console.log(`${type} copied to clipboard`)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

function revealPassword(item: VaultItem) {
  // Toggle password visibility
  console.log('Reveal password for', item.name)
}

function addNewItem() {
  showAddItem.value = true
}

function cancelAddItem() {
  showAddItem.value = false
  resetNewItem()
}

function resetNewItem() {
  newItem.value = {
    name: '',
    username: '',
    password: '',
    uri: '',
    notes: '',
    folderId: null
  }
}

async function saveNewItem() {
  try {
    if (!newItem.value.name) {
      throw new Error('Name is required')
    }
    
    // Add to items list (simulated)
    const item: VaultItem = {
      id: Date.now().toString(),
      type: 1,
      name: newItem.value.name,
      login: {
        username: newItem.value.username,
        password: newItem.value.password,
        uris: newItem.value.uri ? [{ uri: newItem.value.uri }] : []
      },
      folderId: newItem.value.folderId,
      favorite: false
    }
    
    items.value.push(item)
    cancelAddItem()
  } catch (err: any) {
    error.value = err.message
  }
}

function lockVault() {
  isLocked.value = true
  items.value = []
  folders.value = []
  selectedItem.value = null
  vaultConfig.value.token = ''
}

function generatePassword() {
  const length = 16
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  newItem.value.password = password
}
</script>

<template>
  <Window :window="window">
    <div class="vaultwarden-app">
      <!-- Lock Screen -->
      <div v-if="isLocked" class="lock-screen">
        <div class="lock-card">
          <div class="lock-icon">🔒</div>
          <h2>Vault Locked</h2>
          <p>Enter your master password to unlock</p>
          
          <form @submit.prevent="unlock(masterPassword)">
            <div class="form-group">
              <input 
                v-model="masterPassword" 
                type="password" 
                placeholder="Master Password"
                required
                autofocus
              />
            </div>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <button type="submit" class="btn-primary">
              Unlock Vault
            </button>
          </form>
        </div>
      </div>

      <!-- Vault Content -->
      <div v-else class="vault-content">
        <!-- Sidebar -->
        <div class="sidebar">
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search vault..."
              class="search-input"
            />
          </div>
          
          <div class="folders">
            <div class="folder-section">
              <div class="section-title">FILTERS</div>
              <div 
                @click="selectedFolder = null"
                :class="{ active: !selectedFolder }"
                class="folder-item"
              >
                <span class="folder-icon">📋</span>
                <span class="folder-name">All Items</span>
                <span class="item-count">{{ items.length }}</span>
              </div>
              <div 
                @click="selectedFolder = 'favorites'"
                :class="{ active: selectedFolder === 'favorites' }"
                class="folder-item"
              >
                <span class="folder-icon">⭐</span>
                <span class="folder-name">Favorites</span>
                <span class="item-count">{{ items.filter(i => i.favorite).length }}</span>
              </div>
            </div>
            
            <div class="folder-section">
              <div class="section-title">FOLDERS</div>
              <div 
                v-for="folder in folders" 
                :key="folder.id"
                @click="selectedFolder = folder.id"
                :class="{ active: selectedFolder === folder.id }"
                class="folder-item"
              >
                <span class="folder-icon">📁</span>
                <span class="folder-name">{{ folder.name }}</span>
                <span class="item-count">{{ items.filter(i => i.folderId === folder.id).length }}</span>
              </div>
            </div>
          </div>
          
          <div class="sidebar-footer">
            <button @click="lockVault" class="btn-lock">
              🔒 Lock Vault
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          <div class="content-header">
            <h3>{{ selectedFolder === 'favorites' ? 'Favorites' : selectedFolder ? folders.find(f => f.id === selectedFolder)?.name : 'All Items' }}</h3>
            <button @click="addNewItem" class="btn-add">
              ➕ New Item
            </button>
          </div>
          
          <!-- Items List -->
          <div v-if="!showAddItem && !selectedItem" class="items-list">
            <div 
              v-for="item in filteredItems" 
              :key="item.id"
              @click="selectItem(item)"
              class="item-card"
            >
              <div class="item-icon">
                {{ item.favorite ? '⭐' : '🔑' }}
              </div>
              <div class="item-details">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-username">{{ item.login?.username }}</div>
              </div>
              <div class="item-arrow">›</div>
            </div>
            
            <div v-if="filteredItems.length === 0" class="empty-state">
              <p>No items found</p>
            </div>
          </div>
          
          <!-- Item Detail View -->
          <div v-if="selectedItem && !showAddItem" class="item-detail">
            <div class="detail-header">
              <button @click="closeItemView" class="btn-back">← Back</button>
              <h3>{{ selectedItem.name }}</h3>
            </div>
            
            <div class="detail-content">
              <div class="detail-field">
                <label>Name</label>
                <div class="field-value">{{ selectedItem.name }}</div>
              </div>
              
              <div class="detail-field">
                <label>Username</label>
                <div class="field-value">
                  {{ selectedItem.login?.username }}
                  <button 
                    @click="copyToClipboard(selectedItem.login?.username || '', 'Username')"
                    class="btn-copy"
                  >
                    📋
                  </button>
                </div>
              </div>
              
              <div class="detail-field">
                <label>Password</label>
                <div class="field-value">
                  ••••••••
                  <button 
                    @click="copyToClipboard(selectedItem.login?.password || '', 'Password')"
                    class="btn-copy"
                  >
                    📋
                  </button>
                </div>
              </div>
              
              <div v-if="selectedItem.login?.uris && selectedItem.login.uris.length" class="detail-field">
                <label>Website</label>
                <div class="field-value">
                  <a :href="selectedItem.login.uris[0].uri" target="_blank">
                    {{ selectedItem.login.uris[0].uri }}
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Add Item Form -->
          <div v-if="showAddItem" class="add-item-form">
            <div class="form-header">
              <h3>Add New Item</h3>
              <button @click="cancelAddItem" class="btn-close">✕</button>
            </div>
            
            <div class="form-content">
              <div class="form-group">
                <label>Name *</label>
                <input v-model="newItem.name" type="text" required />
              </div>
              
              <div class="form-group">
                <label>Folder</label>
                <select v-model="newItem.folderId">
                  <option :value="null">No Folder</option>
                  <option v-for="folder in folders" :key="folder.id" :value="folder.id">
                    {{ folder.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Username</label>
                <input v-model="newItem.username" type="text" />
              </div>
              
              <div class="form-group">
                <label>Password</label>
                <div class="password-group">
                  <input v-model="newItem.password" type="password" />
                  <button @click="generatePassword" type="button" class="btn-generate">
                    🎲
                  </button>
                </div>
              </div>
              
              <div class="form-group">
                <label>Website</label>
                <input v-model="newItem.uri" type="url" placeholder="https://" />
              </div>
              
              <div class="form-actions">
                <button @click="cancelAddItem" class="btn-secondary">Cancel</button>
                <button @click="saveNewItem" class="btn-primary">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.vaultwarden-app {
  width: 100%;
  height: 100%;
  display: flex;
  background: var(--surface-ground, #f5f5f5);
  font-family: system-ui, -apple-system, sans-serif;
}

/* Lock Screen */
.lock-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.lock-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.lock-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.lock-card h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.75rem;
}

.lock-card p {
  margin: 0 0 2rem 0;
  color: #666;
}

/* Vault Content */
.vault-content {
  display: flex;
  width: 100%;
  height: 100%;
}

.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
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
  border-color: #1e3c72;
}

.folders {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.folder-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #999;
  padding: 0.5rem 1rem;
  letter-spacing: 0.05em;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 0.25rem;
  transition: all 0.2s;
}

.folder-item:hover {
  background: #f5f5f5;
}

.folder-item.active {
  background: #1e3c72;
  color: white;
}

.folder-icon {
  font-size: 1.1rem;
}

.folder-name {
  flex: 1;
  font-size: 0.875rem;
}

.item-count {
  font-size: 0.75rem;
  opacity: 0.7;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
}

.btn-lock {
  width: 100%;
  padding: 0.6rem;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-lock:hover {
  background: #f5f5f5;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.content-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.btn-add {
  padding: 0.6rem 1.25rem;
  background: #1e3c72;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #2a5298;
}

.items-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.5rem;
}

.item-card:hover {
  border-color: #1e3c72;
  box-shadow: 0 2px 8px rgba(30, 60, 114, 0.1);
}

.item-icon {
  font-size: 1.5rem;
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.item-username {
  font-size: 0.875rem;
  color: #666;
}

.item-arrow {
  font-size: 1.5rem;
  color: #ccc;
}

/* Item Detail */
.item-detail {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-back {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-back:hover {
  background: #f5f5f5;
}

.detail-header h3 {
  margin: 0;
  color: #333;
}

.detail-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.detail-field {
  margin-bottom: 1.5rem;
}

.detail-field:last-child {
  margin-bottom: 0;
}

.detail-field label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.field-value {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #333;
}

.field-value a {
  color: #1e3c72;
  text-decoration: none;
}

.field-value a:hover {
  text-decoration: underline;
}

.btn-copy {
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-copy:hover {
  background: #f5f5f5;
}

/* Add Item Form */
.add-item-form {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-header h3 {
  margin: 0;
  color: #333;
}

.btn-close {
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.btn-close:hover {
  color: #333;
}

.form-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.875rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #1e3c72;
}

.password-group {
  display: flex;
  gap: 0.5rem;
}

.password-group input {
  flex: 1;
}

.btn-generate {
  padding: 0.6rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-generate:hover {
  background: #f5f5f5;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #1e3c72;
  color: white;
}

.btn-primary:hover {
  background: #2a5298;
}

.btn-secondary {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.error-message {
  padding: 0.75rem;
  background: #fee;
  color: #c33;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
</style>
