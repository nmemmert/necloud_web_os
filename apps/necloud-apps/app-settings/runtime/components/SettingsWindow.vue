<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{ window: any }>()

// Simple preferences composable inline (could be split out later)
interface Preferences {
  theme: string
  accentColor: string
}

const defaultPrefs: Preferences = {
  theme: '@owdproject/theme-gnome',
  accentColor: '#4a6ff0'
}

const prefs = ref<Preferences>({ ...defaultPrefs })
const loaded = ref(false)

function loadPrefs() {
  try {
    const raw = localStorage.getItem('owd:prefs')
    if (raw) Object.assign(prefs.value, JSON.parse(raw))
  } catch (e) { /* ignore */ }
  loaded.value = true
}

function savePrefs() {
  localStorage.setItem('owd:prefs', JSON.stringify(prefs.value))
}

watch(prefs, savePrefs, { deep: true })

loadPrefs()

// At runtime we only have gnome theme installed; stub for future themes
const availableThemes = computed(() => [
  { id: '@owdproject/theme-gnome', name: 'GNOME' }
])

function applyTheme(themeId: string) {
  prefs.value.theme = themeId
  // Real dynamic theme switching would require desktop API; placeholder notice
  themeNotice.value = 'Saved. Reload to apply theme.'
}

const themeNotice = ref('')
</script>

<template>
  <Window :window="window">
    <div class="settings-root">
      <aside class="settings-nav">
        <h3>Settings</h3>
        <ul>
          <li class="section">Appearance</li>
          <li class="section disabled">System (coming soon)</li>
          <li class="section disabled">Accounts (coming soon)</li>
        </ul>
      </aside>
      <main class="settings-content">
        <section class="panel">
          <h2>Appearance</h2>
          <div class="field">
            <label>Theme</label>
            <div class="theme-list">
              <button
                v-for="t in availableThemes"
                :key="t.id"
                :class="['theme-btn', { active: prefs.theme === t.id }]"
                @click="applyTheme(t.id)"
              >{{ t.name }}</button>
            </div>
            <p v-if="themeNotice" class="notice">{{ themeNotice }}</p>
          </div>
          <div class="field">
            <label>Accent Color</label>
            <input type="color" v-model="prefs.accentColor" />
          </div>
        </section>
        <section class="panel">
          <h2>Data & Persistence</h2>
          <p>Preferences are saved to <code>localStorage</code> under key <code>owd:prefs</code>.</p>
          <button class="btn" @click="savePrefs">Save Now</button>
        </section>
      </main>
    </div>
  </Window>
</template>

<style scoped>
.settings-root { display: flex; height: 100%; font-family: system-ui, sans-serif; background: #f7f8fa; }
.settings-nav { width: 220px; background: #fff; border-right: 1px solid #ddd; padding: 1rem; }
.settings-nav h3 { margin: 0 0 .75rem; font-size: 1.1rem; }
.settings-nav ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .4rem; }
.section { padding: .45rem .6rem; border-radius: 4px; font-size: .85rem; background: #eef1f5; }
.section.disabled { opacity: .5; background: #f1f3f6; }
.settings-content { flex: 1; overflow-y: auto; padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
.panel { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 1rem 1.1rem; display: flex; flex-direction: column; gap: .9rem; }
.panel h2 { margin: 0; font-size: 1rem; color: #333; }
.field { display: flex; flex-direction: column; gap: .45rem; }
.field label { font-size: .75rem; text-transform: uppercase; letter-spacing: .05em; font-weight: 600; color: #555; }
.theme-list { display: flex; gap: .5rem; flex-wrap: wrap; }
.theme-btn { padding: .5rem .75rem; border: 1px solid #ccc; background: #fff; border-radius: 6px; cursor: pointer; font-size: .8rem; }
.theme-btn.active { border-color: #4a6ff0; background: #e5edff; }
.notice { font-size: .7rem; color: #555; margin: 0; }
.btn { background: #4a6ff0; color: #fff; border: none; padding: .5rem .9rem; font-size: .8rem; border-radius: 6px; cursor: pointer; align-self: flex-start; }
.btn:hover { background: #3658d4; }
</style>
