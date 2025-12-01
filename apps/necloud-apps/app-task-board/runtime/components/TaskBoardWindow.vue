<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  window: IWindowController
}>()

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
}

const tasks = ref<Task[]>([
  { id: '1', title: 'Setup project', description: 'Initialize the project repository', status: 'done', priority: 'high', createdAt: new Date('2024-01-01') },
  { id: '2', title: 'Design UI', description: 'Create mockups for the interface', status: 'in-progress', priority: 'medium', createdAt: new Date('2024-01-02') },
  { id: '3', title: 'Implement features', description: 'Add core functionality', status: 'todo', priority: 'high', createdAt: new Date('2024-01-03') }
])

const showAddTask = ref(false)
const newTask = ref({
  title: '',
  description: '',
  priority: 'medium' as const
})

const columns = [
  { id: 'todo', title: 'To Do', icon: '📋' },
  { id: 'in-progress', title: 'In Progress', icon: '⚡' },
  { id: 'done', title: 'Done', icon: '✅' }
]

function getTasksByStatus(status: string) {
  return tasks.value.filter(task => task.status === status)
}

function addTask() {
  if (!newTask.value.title) return
  
  tasks.value.push({
    id: Date.now().toString(),
    title: newTask.value.title,
    description: newTask.value.description,
    status: 'todo',
    priority: newTask.value.priority,
    createdAt: new Date()
  })
  
  newTask.value = { title: '', description: '', priority: 'medium' }
  showAddTask.value = false
}

function moveTask(task: Task, newStatus: 'todo' | 'in-progress' | 'done') {
  task.status = newStatus
}

function deleteTask(id: string) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

function getPriorityColor(priority: string) {
  return {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336'
  }[priority]
}
</script>

<template>
  <Window :window="window">
    <div class="task-board">
      <div class="board-header">
        <h2>📋 Task Board</h2>
        <button @click="showAddTask = !showAddTask" class="btn-add">
          {{ showAddTask ? '✕' : '+ New Task' }}
        </button>
      </div>
      
      <!-- Add Task Form -->
      <div v-if="showAddTask" class="add-task-form">
        <input
          v-model="newTask.title"
          placeholder="Task title..."
          class="task-title-input"
          @keyup.enter="addTask"
        />
        <textarea
          v-model="newTask.description"
          placeholder="Description..."
          class="task-desc-input"
        />
        <div class="task-form-footer">
          <select v-model="newTask.priority" class="priority-select">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button @click="addTask" class="btn-save">Save Task</button>
        </div>
      </div>
      
      <!-- Kanban Board -->
      <div class="board-columns">
        <div v-for="column in columns" :key="column.id" class="column">
          <div class="column-header">
            <span class="column-icon">{{ column.icon }}</span>
            <span class="column-title">{{ column.title }}</span>
            <span class="column-count">{{ getTasksByStatus(column.id).length }}</span>
          </div>
          
          <div class="column-content">
            <div
              v-for="task in getTasksByStatus(column.id)"
              :key="task.id"
              class="task-card"
            >
              <div class="task-header">
                <div class="task-priority" :style="{ background: getPriorityColor(task.priority) }"></div>
                <button @click="deleteTask(task.id)" class="btn-delete">×</button>
              </div>
              <h4 class="task-title">{{ task.title }}</h4>
              <p v-if="task.description" class="task-description">{{ task.description }}</p>
              
              <div class="task-actions">
                <button
                  v-if="task.status !== 'todo'"
                  @click="moveTask(task, task.status === 'done' ? 'in-progress' : 'todo')"
                  class="btn-move"
                >
                  ← Move Back
                </button>
                <button
                  v-if="task.status !== 'done'"
                  @click="moveTask(task, task.status === 'todo' ? 'in-progress' : 'done')"
                  class="btn-move"
                >
                  Move Forward →
                </button>
              </div>
            </div>
            
            <div v-if="getTasksByStatus(column.id).length === 0" class="empty-column">
              No tasks
            </div>
          </div>
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.task-board {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  font-family: system-ui, -apple-system, sans-serif;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-bottom: 2px solid #e0e0e0;
}

.board-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #5568d3;
}

.add-task-form {
  background: white;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-title-input {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
}

.task-desc-input {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
  min-height: 80px;
  font-family: inherit;
  resize: vertical;
}

.task-title-input:focus,
.task-desc-input:focus {
  outline: none;
  border-color: #667eea;
}

.task-form-footer {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.priority-select {
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.875rem;
}

.btn-save {
  padding: 0.5rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-save:hover {
  background: #5568d3;
}

.board-columns {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
  overflow-x: auto;
}

.column {
  background: #e8eaf6;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  min-width: 300px;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px 12px 0 0;
  font-weight: 600;
  color: #333;
}

.column-icon {
  font-size: 1.25rem;
}

.column-title {
  flex: 1;
}

.column-count {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.column-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.task-priority {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.btn-delete {
  background: transparent;
  border: none;
  color: #999;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  line-height: 1;
}

.btn-delete:hover {
  color: #f44336;
}

.task-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #333;
  font-weight: 600;
}

.task-description {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-move {
  padding: 0.4rem 0.75rem;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
}

.btn-move:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.empty-column {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 0.875rem;
}
</style>
