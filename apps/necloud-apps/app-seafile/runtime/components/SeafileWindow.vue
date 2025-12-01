<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { IWindowController } from '@owdproject/core'

const props = defineProps<{
  window: IWindowController
}>()

const isAuthenticated = ref(false)
const libraries = ref<any[]>([])
const currentPath = ref('/')
const currentRepoId = ref<string | null>(null)
const files = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Login form
const loginForm = ref({
  serverUrl: 'https://seafile.necloud.us',
  username: '',
  password: ''
})

// Seafile API configuration
const seafileConfig = ref({
  serverUrl: 'https://seafile.necloud.us',
  token: ''
})

// Load from localStorage
onMounted(() => {
  const saved = localStorage.getItem('necloud-seafile-config')
  if (saved) {
    try {
      const config = JSON.parse(saved)
      if (config.serverUrl) loginForm.value.serverUrl = config.serverUrl
      if (config.token) {
        seafileConfig.value.token = config.token
        seafileConfig.value.serverUrl = config.serverUrl
        isAuthenticated.value = true
        loadLibraries()
      }
    } catch (e) {
      console.error('Failed to load Seafile config:', e)
    }
  }
})

function saveConfig() {
  localStorage.setItem('necloud-seafile-config', JSON.stringify({
    serverUrl: seafileConfig.value.serverUrl,
    token: seafileConfig.value.token
  }))
}

async function authenticate() {
  try {
    loading.value = true
    error.value = null
    
    seafileConfig.value.serverUrl = loginForm.value.serverUrl
    
    const response = await fetch(`${seafileConfig.value.serverUrl}/api2/auth-token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginForm.value.username,
        password: loginForm.value.password
      })
    })
    
    if (!response.ok) {
      throw new Error('Authentication failed')
    }
    
    const data = await response.json()
    seafileConfig.value.token = data.token
    isAuthenticated.value = true
    
    // Save config to localStorage
    saveConfig()
    
    // Load libraries after authentication
    await loadLibraries()
  } catch (err: any) {
    error.value = err.message || 'Failed to authenticate'
    console.error('Authentication failed:', err)
  } finally {
    loading.value = false
  }
}

async function loadLibraries() {
  try {
    loading.value = true
    const response = await fetch(`${seafileConfig.value.serverUrl}/api2/repos/`, {
      headers: { 'Authorization': `Token ${seafileConfig.value.token}` }
    })
    
    if (!response.ok) {
      throw new Error('Failed to load libraries')
    }
    
    libraries.value = await response.json()
  } catch (err: any) {
    error.value = err.message || 'Failed to load libraries'
    console.error('Failed to load libraries:', err)
  } finally {
    loading.value = false
  }
}

async function loadDirectory(repoId: string, path: string = '/') {
  try {
    loading.value = true
    error.value = null
    currentRepoId.value = repoId
    
    const encodedPath = encodeURIComponent(path)
    const response = await fetch(
      `${seafileConfig.value.serverUrl}/api2/repos/${repoId}/dir/?p=${encodedPath}`,
      { headers: { 'Authorization': `Token ${seafileConfig.value.token}` } }
    )
    
    if (!response.ok) {
      throw new Error('Failed to load directory')
    }
    
    files.value = await response.json()
    currentPath.value = path
  } catch (err: any) {
    error.value = err.message || 'Failed to load directory'
    console.error('Failed to load directory:', err)
  } finally {
    loading.value = false
  }
}

function openFile(file: any) {
  if (file.type === 'dir' && currentRepoId.value) {
    const newPath = currentPath.value === '/' 
      ? `/${file.name}` 
      : `${currentPath.value}/${file.name}`
    loadDirectory(currentRepoId.value, newPath)
  } else {
    // Handle file download/preview
    console.log('Open file:', file)
  }
}

function goBack() {
  if (currentPath.value === '/' || !currentRepoId.value) return
  
  const parts = currentPath.value.split('/').filter(p => p)
  parts.pop()
  const newPath = parts.length > 0 ? '/' + parts.join('/') : '/'
  loadDirectory(currentRepoId.value, newPath)
}

function goToLibraries() {
  currentRepoId.value = null
  files.value = []
  currentPath.value = '/'
}

const currentLibrary = computed(() => {
  if (!currentRepoId.value) return null
  return libraries.value.find(lib => lib.id === currentRepoId.value)
})

const breadcrumbs = computed(() => {
  const parts = currentPath.value.split('/').filter(p => p)
  const crumbs = [{ name: 'Root', path: '/' }]
  
  let currentPathBuild = ''
  parts.forEach(part => {
    currentPathBuild += '/' + part
    crumbs.push({ name: part, path: currentPathBuild })
  })
  
  return crumbs
})
</script>

<template>
  <Window :window="window">
    <div class="seafile-app">
      <!-- Login Form -->
      <div v-if="!isAuthenticated" class="login-container">
        <div class="login-card">
          <h2>🌊 Seafile Login</h2>
          <p class="login-subtitle">Connect to your Seafile server</p>
          
          <form @submit.prevent="authenticate">
            <div class="form-group">
              <label for="serverUrl">Server URL</label>
              <input 
                id="serverUrl"
                v-model="loginForm.serverUrl" 
                type="text" 
                placeholder="http://localhost:8000"
                required 
              />
            </div>
            
            <div class="form-group">
              <label for="username">Username</label>
              <input 
                id="username"
                v-model="loginForm.username" 
                type="text" 
                placeholder="username"
                required 
              />
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                id="password"
                v-model="loginForm.password" 
                type="password" 
                placeholder="••••••••"
                required 
              />
            </div>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Connecting...' : 'Login' }}
            </button>
          </form>
        </div>
      </div>

      <!-- File Browser -->
      <div v-else class="file-browser">
        <div class="toolbar">
          <div class="toolbar-left">
            <button 
              @click="goToLibraries" 
              class="btn-icon"
              :disabled="!currentRepoId"
              title="Back to libraries"
            >
              🏠
            </button>
            <button 
              @click="goBack" 
              class="btn-icon"
              :disabled="currentPath === '/' || !currentRepoId"
              title="Go back"
            >
              ←
            </button>
          </div>
          
          <div class="breadcrumb">
            <span v-if="currentLibrary" class="library-name">
              {{ currentLibrary.name }}
            </span>
            <template v-if="currentRepoId">
              <span v-for="(crumb, index) in breadcrumbs" :key="index">
                <span class="separator">/</span>
                <span class="crumb">{{ crumb.name }}</span>
              </template>
            </template>
          </div>
          
          <div class="toolbar-right">
            <span class="user-info">{{ loginForm.username }}</span>
          </div>
        </div>

        <div class="content-area">
          <!-- Libraries View -->
          <div v-if="!currentRepoId && libraries.length" class="libraries-grid">
            <div 
              v-for="lib in libraries" 
              :key="lib.id"
              @click="loadDirectory(lib.id, '/')"
              class="library-card"
            >
              <div class="library-icon">📚</div>
              <div class="library-info">
                <div class="library-name">{{ lib.name }}</div>
                <div class="library-meta">
                  {{ lib.size_formatted || 'N/A' }}
                </div>
              </div>
            </div>
          </div>

          <!-- Files View -->
          <div v-else-if="files.length" class="files-list">
            <div 
              v-for="file in files" 
              :key="file.name"
              @click="openFile(file)"
              @dblclick="openFile(file)"
              class="file-item"
            >
              <span class="file-icon">{{ file.type === 'dir' ? '📁' : '📄' }}</span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-meta">{{ file.size ? `${Math.round(file.size / 1024)} KB` : '' }}</span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!loading && !error" class="empty-state">
            <div class="empty-icon">📭</div>
            <p>No files or folders here</p>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading...</p>
          </div>

          <!-- Error State -->
          <div v-if="error && isAuthenticated" class="error-state">
            <div class="error-icon">⚠️</div>
            <p>{{ error }}</p>
            <button @click="loadLibraries" class="btn-secondary">Retry</button>
          </div>
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.seafile-app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--surface-ground, #f8f9fa);
  font-family: system-ui, -apple-system, sans-serif;
}

/* Login Styles */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.login-subtitle {
  margin: 0 0 1.5rem 0;
  color: #666;
  font-size: 0.875rem;
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

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  padding: 0.75rem;
  background: #fee;
  color: #c33;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* File Browser Styles */
.file-browser {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-icon:hover:not(:disabled) {
  background: #f0f0f0;
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.breadcrumb {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #666;
  overflow-x: auto;
}

.library-name {
  font-weight: 600;
  color: #333;
}

.separator {
  color: #999;
}

.crumb {
  white-space: nowrap;
}

.user-info {
  font-size: 0.875rem;
  color: #666;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* Libraries Grid */
.libraries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.library-card {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.library-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.library-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.library-info {
  width: 100%;
}

.library-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.library-meta {
  font-size: 0.75rem;
  color: #999;
}

/* Files List */
.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.file-item:hover {
  background: #f8f9fa;
  border-color: #667eea;
}

.file-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.file-name {
  flex: 1;
  font-size: 0.875rem;
  color: #333;
}

.file-meta {
  font-size: 0.75rem;
  color: #999;
}

/* States */
.empty-state, .loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.empty-icon, .error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-secondary {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}
</style>
