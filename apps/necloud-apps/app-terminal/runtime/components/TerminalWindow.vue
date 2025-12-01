<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

const props = defineProps<{
  window: IWindowController
}>()

interface TerminalLine {
  id: number
  text: string
  type: 'input' | 'output' | 'error' | 'prompt'
  timestamp: Date
}

const lines = ref<TerminalLine[]>([
  {
    id: 1,
    text: 'Necloud Terminal v1.0.0',
    type: 'output',
    timestamp: new Date()
  },
  {
    id: 2,
    text: 'Type "help" for available commands',
    type: 'prompt',
    timestamp: new Date()
  }
])

const commandInput = ref('')
const currentDir = ref('/home/user')
let lineCounter = 3
const terminalRef = ref<HTMLDivElement | null>(null)

const commands: Record<string, (args: string[]) => void> = {
  help: () => {
    addOutput('Available commands: help, ls, pwd, cd, echo, git, clear, exit')
  },
  ls: () => {
    addOutput('Documents/  Downloads/  Projects/  config.yaml')
  },
  pwd: () => {
    addOutput(currentDir.value)
  },
  cd: (args) => {
    if (args.length === 0) {
      currentDir.value = '/home/user'
    } else {
      currentDir.value = args[0].startsWith('/') ? args[0] : `${currentDir.value}/${args[0]}`
    }
    addOutput(`Changed directory to ${currentDir.value}`)
  },
  echo: (args) => {
    addOutput(args.join(' '))
  },
  git: (args) => {
    if (args[0] === 'status') {
      addOutput('On branch main\nYour branch is up to date')
    } else {
      addOutput(`git ${args.join(' ')}`)
    }
  },
  clear: () => {
    lines.value = []
  },
  exit: () => {
    addError('Use the window close button to exit')
  }
}

function addOutput(text: string) {
  lines.value.push({
    id: lineCounter++,
    text,
    type: 'output',
    timestamp: new Date()
  })
  scrollToBottom()
}

function addError(text: string) {
  lines.value.push({
    id: lineCounter++,
    text,
    type: 'error',
    timestamp: new Date()
  })
  scrollToBottom()
}

function executeCommand() {
  if (!commandInput.value.trim()) {
    addPrompt()
    return
  }

  // Add the command as input
  lines.value.push({
    id: lineCounter++,
    text: `$ ${commandInput.value}`,
    type: 'input',
    timestamp: new Date()
  })

  const parts = commandInput.value.trim().split(/\s+/)
  const cmd = parts[0]
  const args = parts.slice(1)

  if (commands[cmd]) {
    commands[cmd](args)
  } else {
    addError(`Command not found: ${cmd}`)
  }

  commandInput.value = ''
  addPrompt()
}

function addPrompt() {
  lines.value.push({
    id: lineCounter++,
    text: `$ `,
    type: 'prompt',
    timestamp: new Date()
  })
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (terminalRef.value) {
      terminalRef.value.scrollTop = terminalRef.value.scrollHeight
    }
  })
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    executeCommand()
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <Window :window="window">
    <div class="terminal">
      <div class="terminal-header">
        Terminal — bash
      </div>
      <div class="terminal-content" ref="terminalRef">
        <div
          v-for="line in lines"
          :key="line.id"
          :class="['terminal-line', `line-${line.type}`]"
        >
          <span class="timestamp">[{{ line.timestamp.toLocaleTimeString() }}]</span>
          <span class="text">{{ line.text }}</span>
        </div>
      </div>
      <div class="terminal-input">
        <input
          v-model="commandInput"
          type="text"
          @keydown="handleKeydown"
          placeholder="Enter command..."
          autofocus
        />
      </div>
    </div>
  </Window>
</template>

<style scoped>
.terminal {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

.terminal-header {
  padding: 8px;
  background: #2d2d2d;
  border-bottom: 1px solid #3e3e3e;
  color: #888;
  font-size: 11px;
}

.terminal-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.terminal-line {
  margin-bottom: 5px;
  display: flex;
  gap: 8px;
}

.timestamp {
  color: #666;
  font-size: 10px;
  flex-shrink: 0;
}

.line-input .text {
  color: #4ec9b0;
  font-weight: 600;
}

.line-output .text {
  color: #d4d4d4;
}

.line-error .text {
  color: #f48771;
}

.line-prompt .text {
  color: #ce9178;
}

.terminal-input {
  padding: 10px;
  background: #252526;
  border-top: 1px solid #3e3e3e;
}

.terminal-input input {
  width: 100%;
  background: transparent;
  border: none;
  color: #d4d4d4;
  font-family: inherit;
  font-size: inherit;
  outline: none;
}

.terminal-input input::placeholder {
  color: #666;
}
</style>
