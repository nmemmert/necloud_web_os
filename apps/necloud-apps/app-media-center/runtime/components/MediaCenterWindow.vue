<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { IWindowController } from '@owdproject/core'

const props = defineProps<{
  window: IWindowController
}>()

interface MediaItem {
  id: string
  title: string
  type: 'movie' | 'series' | 'music' | 'playlist'
  poster?: string
  watched: boolean
  watchedPercentage: number
  duration?: string
  releaseYear?: number
}

const mediaItems = ref<MediaItem[]>([
  {
    id: '1',
    title: 'Introduction to TypeScript',
    type: 'series',
    watched: true,
    watchedPercentage: 100,
    duration: '45 min'
  },
  {
    id: '2',
    title: 'Building Web Apps with Svelte',
    type: 'series',
    watched: false,
    watchedPercentage: 65,
    duration: '2h 30m'
  },
  {
    id: '3',
    title: 'JavaScript Deep Dive',
    type: 'series',
    watched: false,
    watchedPercentage: 0,
    duration: '3h 15m'
  },
  {
    id: '4',
    title: 'Frontend Development Fundamentals',
    type: 'series',
    watched: false,
    watchedPercentage: 20,
    duration: '1h 45m'
  },
  {
    id: '5',
    title: 'Docker & Containerization',
    type: 'series',
    watched: true,
    watchedPercentage: 100,
    duration: '2h 10m'
  },
  {
    id: '6',
    title: 'DevOps Best Practices',
    type: 'series',
    watched: false,
    watchedPercentage: 30,
    duration: '1h 50m'
  }
])

const selectedCategory = ref<string>('all')
const selectedMedia = ref<MediaItem | null>(null)

const continueWatching = computed(() =>
  mediaItems.value.filter(m => m.watchedPercentage > 0 && m.watchedPercentage < 100)
)

const filteredMedia = computed(() => {
  if (selectedCategory.value === 'all') return mediaItems.value
  if (selectedCategory.value === 'watching') {
    return mediaItems.value.filter(m => m.watchedPercentage > 0 && m.watchedPercentage < 100)
  }
  if (selectedCategory.value === 'watched') {
    return mediaItems.value.filter(m => m.watchedPercentage === 100)
  }
  return mediaItems.value
})

function playMedia(media: MediaItem) {
  selectedMedia.value = media
}

function markAsWatched(mediaId: string) {
  const media = mediaItems.value.find(m => m.id === mediaId)
  if (media) {
    media.watchedPercentage = 100
    media.watched = true
  }
}

function removeFromContinueWatching(mediaId: string) {
  const media = mediaItems.value.find(m => m.id === mediaId)
  if (media) {
    media.watchedPercentage = 0
    media.watched = false
  }
}

function closePlayer() {
  selectedMedia.value = null
}
</script>

<template>
  <Window :window="window">
    <div class="media-center">
      <div class="header">
        <h1>📺 Media Center</h1>
        <div class="filters">
          <button
            class="filter-btn"
            :class="{ active: selectedCategory === 'all' }"
            @click="selectedCategory = 'all'"
          >
            All
          </button>
          <button
            class="filter-btn"
            :class="{ active: selectedCategory === 'watching' }"
            @click="selectedCategory = 'watching'"
          >
            Continue Watching ({{ continueWatching.length }})
          </button>
          <button
            class="filter-btn"
            :class="{ active: selectedCategory === 'watched' }"
            @click="selectedCategory = 'watched'"
          >
            Watched
          </button>
        </div>
      </div>

      <div class="media-grid">
        <div
          v-for="media in filteredMedia"
          :key="media.id"
          class="media-card"
          @click="playMedia(media)"
          role="button"
          tabindex="0"
        >
          <div class="media-poster">
            <div class="poster-placeholder">
              <span v-if="media.type === 'series'">📺</span>
              <span v-else-if="media.type === 'movie'">🎬</span>
              <span v-else-if="media.type === 'music'">🎵</span>
              <span v-else>📻</span>
            </div>
            <div v-if="media.watchedPercentage > 0" class="progress-bar">
              <div class="progress" :style="{ width: media.watchedPercentage + '%' }"></div>
            </div>
            <div v-if="media.watchedPercentage === 100" class="watched-badge">✓ Watched</div>
          </div>
          <div class="media-info">
            <h3 class="media-title">{{ media.title }}</h3>
            <p v-if="media.duration" class="media-meta">{{ media.duration }}</p>
            <p v-if="media.watchedPercentage > 0 && media.watchedPercentage < 100" class="watching-indicator">
              {{ media.watchedPercentage }}% watched
            </p>
          </div>
        </div>
      </div>

      <!-- Media Player Overlay -->
      <div v-if="selectedMedia" class="media-player-overlay" @click="closePlayer">
        <div class="media-player" @click.stop>
          <div class="player-close">
            <button @click="closePlayer">✕</button>
          </div>
          <div class="player-screen">
            <div class="player-placeholder">
              <span v-if="selectedMedia.type === 'series'">📺</span>
              <span v-else-if="selectedMedia.type === 'movie'">🎬</span>
              <span v-else>🎵</span>
            </div>
          </div>
          <div class="player-info">
            <h2>{{ selectedMedia.title }}</h2>
            <p v-if="selectedMedia.duration" class="duration">Duration: {{ selectedMedia.duration }}</p>
            <p v-if="selectedMedia.watchedPercentage > 0 && selectedMedia.watchedPercentage < 100" class="resume">
              Resume from {{ selectedMedia.watchedPercentage }}%
            </p>
            <div class="player-controls">
              <button class="play-btn">▶ Play</button>
              <button
                v-if="selectedMedia.watchedPercentage < 100"
                class="secondary-btn"
                @click="markAsWatched(selectedMedia.id); closePlayer()"
              >
                ✓ Mark as Watched
              </button>
              <button
                v-if="selectedMedia.watchedPercentage > 0"
                class="secondary-btn"
                @click="removeFromContinueWatching(selectedMedia.id); closePlayer()"
              >
                🔄 Reset Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.media-center {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  overflow: hidden;
}

.header {
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header h1 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.filters {
  display: flex;
  gap: 0.75rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.media-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  overflow-y: auto;
}

.media-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.media-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

.media-poster {
  position: relative;
  aspect-ratio: 2/3;
  background: linear-gradient(135deg, #2d3561 0%, #1f2544 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.poster-placeholder {
  font-size: 4rem;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s;
}

.watched-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(34, 197, 94, 0.9);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.media-info {
  padding: 1rem;
}

.media-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.3;
}

.media-meta {
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.watching-indicator {
  margin: 0.25rem 0 0 0;
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
}

.media-player-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.media-player {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  position: relative;
}

.player-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.player-close button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.player-close button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.player-screen {
  background: linear-gradient(135deg, #2d3561 0%, #1f2544 100%);
  border-radius: 12px;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.player-placeholder {
  font-size: 5rem;
}

.player-info h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.player-info p {
  margin: 0.5rem 0;
  color: rgba(255, 255, 255, 0.7);
}

.duration {
  font-size: 0.9rem;
}

.resume {
  color: #667eea;
  font-weight: 500;
}

.player-controls {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.play-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.play-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.secondary-btn {
  padding: 0.875rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}
</style>
