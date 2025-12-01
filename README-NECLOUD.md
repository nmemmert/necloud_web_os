# necloudOS + Open Web Desktop Integration

This project merges the necloudOS applications into the Open Web Desktop (OWD) framework, converting them from Svelte to Vue 3 with TypeScript.

## Status: ~85% Complete ✅

### Completed Applications (7/8)

1. **Media Center** ✅
   - Continue watching with progress tracking
   - Media grid with poster placeholders
   - Watch status indicators
   - Media player overlay

2. **Terminal** ✅
   - Bash-like command execution
   - Command history with timestamps
   - Built-in commands: help, ls, pwd, cd, echo, git, clear, exit
   - Themed terminal interface

3. **Code Editor** ✅
   - Multi-file tab interface
   - Line numbering
   - Syntax highlighting support
   - File status indicators (modified/saved)

4. **Task Board** ✅
   - Kanban-style three-column layout
   - Task cards with priority indicators
   - Due date tracking
   - Add, update, and delete functionality

5. **Notes** ✅
   - Markdown-based note editing
   - Tag system with search
   - Edit/preview mode toggle
   - Note creation and deletion

6. **Seafile File Manager** ⚠️
   - Authentication with Seafile server
   - Library browsing
   - File/folder navigation
   - Server: https://seafile.necloud.us
   - *Needs: Upload/download functionality*

7. **Vaultwarden Password Manager** ⚠️
   - Master password unlock
   - Folder organization
   - Password item management
   - Server: https://key.necloud.us
   - *Needs: Real API integration*

## Project Structure

```
owd-fork/
├── desktop/                    # Main OWD desktop application
│   ├── owd.config.ts          # Desktop configuration with app list
│   └── app/
├── apps/
│   └── necloud-apps/          # necloudOS applications
│       ├── app-media-center/
│       ├── app-terminal/
│       ├── app-code-editor/
│       ├── app-task-board/
│       ├── app-notes/
│       ├── app-seafile/
│       └── app-vaultwarden/
└── packages/
    └── core/                   # OWD core framework
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (install with `npm install -g pnpm`)

### Installation

1. **Install dependencies:**
   ```bash
   cd owd-fork
   pnpm install
   ```

2. **Start development server:**
   ```bash
   cd desktop
   pnpm dev
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Configuration

### Seafile Integration
- **Server**: https://seafile.necloud.us
- Configure credentials in the Seafile app on first launch
- Credentials stored in browser localStorage

### Vaultwarden Integration
- **Server**: https://key.necloud.us
- Enter master password to unlock vault
- Currently uses simulated data (real API integration pending)

## Development

### Adding a New App

1. Create app directory in `apps/necloud-apps/`:
   ```bash
   mkdir apps/necloud-apps/app-myapp
   cd apps/necloud-apps/app-myapp
   ```

2. Create `package.json`:
   ```json
   {
     "name": "@necloud/app-myapp",
     "version": "1.0.0",
     "type": "module",
     "main": "index.ts",
     "dependencies": {
       "@owdproject/core": "workspace:*"
     }
   }
   ```

3. Create `index.ts`:
   ```typescript
   import { defineDesktopApp } from '@owdproject/core'

   export default defineDesktopApp({
     id: 'myapp',
     title: 'My App',
     icon: 'i-mdi-apps',
     category: 'Utilities',
     windows: {
       default: {
         title: 'My App',
         component: () => import('./components/MyAppWindow.vue'),
         size: { width: 800, height: 600 }
       }
     },
     async onLaunch(app) {
       app.openWindow('default')
     }
   })
   ```

4. Create Vue component in `components/MyAppWindow.vue`

5. Add to `desktop/owd.config.ts`:
   ```typescript
   apps: [
     // ... other apps
     '@necloud/app-myapp'
   ]
   ```

## Key Technologies

- **OWD Core**: Desktop framework
- **Vue 3**: UI framework with Composition API
- **TypeScript**: Type safety
- **Nuxt 3**: Application framework
- **PrimeVue**: UI component library
- **Tailwind CSS**: Styling

## Svelte to Vue 3 Conversion Notes

### Reactive Variables
```svelte
<!-- Svelte -->
let count = 0
```
```vue
<!-- Vue 3 -->
const count = ref(0)
// Access: count.value
```

### Props
```svelte
<!-- Svelte -->
export let title: string
```
```vue
<!-- Vue 3 -->
const props = defineProps<{
  title: string
}>()
```

### Events
```svelte
<!-- Svelte -->
const dispatch = createEventDispatcher()
dispatch('close')
```
```vue
<!-- Vue 3 -->
const emit = defineEmits<{
  close: []
}>()
emit('close')
```

## TODO

- [ ] Complete Seafile upload/download functionality
- [ ] Integrate real Vaultwarden API
- [ ] Add Settings app for global configuration
- [ ] Implement keyboard shortcuts at desktop level
- [ ] Add workspace management
- [ ] Create app installation/management system
- [ ] Add Git integration to Code Editor
- [ ] Implement live preview for Markdown
- [ ] Add Docker/SSH support to Terminal

## Contributing

1. Follow the existing app structure
2. Use TypeScript for type safety
3. Keep components focused and reusable
4. Test with the OWD development server
5. Update this README with new features

## License

MIT

## Credits

- **necloudOS**: Original Svelte implementation
- **Open Web Desktop**: Vue/Nuxt framework
- **necloud.us**: Cloud service providers (Seafile, Vaultwarden)
