# Quick Start Guide - necloudOS on OWD

## ✅ Merge Complete!

All 7 necloudOS apps have been successfully converted from Svelte to Vue 3 and integrated into the Open Web Desktop framework.

## Starting the Development Server

### Option 1: PowerShell Command (Recommended)
```powershell
cd c:\Users\NateEmmert\owd-fork\desktop
Start-Process powershell -ArgumentList "-NoExit", "-WorkingDirectory", "c:\Users\NateEmmert\owd-fork\desktop", "-Command", "`$env:PATH = 'c:\Users\NateEmmert\owd-fork\node_modules\.bin;' + `$env:PATH; nuxt dev"
```

### Option 2: Direct Command
```powershell
cd c:\Users\NateEmmert\owd-fork\desktop
..\node_modules\.bin\nuxt dev
```

### Option 3: Using pnpm
```powershell
cd c:\Users\NateEmmert\owd-fork\desktop
npx -y pnpm@latest run dev
```

## Access the Application

Open your browser to: **http://localhost:3000**

## Available Apps

1. **📺 Media Center** - Watch tracking with progress bars
2. **💻 Terminal** - Command-line interface with history  
3. **📝 Code Editor** - Multi-file editor with syntax highlighting
4. **📋 Task Board** - Kanban-style task management
5. **📄 Notes** - Markdown note-taking with tags
6. **📁 Seafile** - Cloud file management (seafile.necloud.us)
7. **🔐 Vaultwarden** - Password manager (key.necloud.us)

## Troubleshooting

### If the server won't start:

1. **Clear npm cache:**
   ```powershell
   npm cache clean --force
   ```

2. **Reinstall dependencies:**
   ```powershell
   cd c:\Users\NateEmmert\owd-fork
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   npx -y pnpm@latest install
   ```

3. **Check if port 3000 is in use:**
   ```powershell
   netstat -ano | findstr :3000
   ```

### If you see module not found errors:

The workspace dependencies need pnpm to be properly linked. Make sure to run:
```powershell
cd c:\Users\NateEmmert\owd-fork
npx -y pnpm@latest install
```

## Project Structure

```
owd-fork/
├── desktop/                          # Main OWD application
│   ├── owd.config.ts                # Apps configuration
│   └── nuxt.config.ts               # Nuxt configuration
├── apps/necloud-apps/               # Your converted apps
│   ├── app-media-center/
│   ├── app-terminal/
│   ├── app-code-editor/
│   ├── app-task-board/
│   ├── app-notes/
│   ├── app-seafile/
│   └── app-vaultwarden/
└── packages/core/                   # OWD framework
```

## Configuration Files

- **Desktop Config**: `owd-fork/desktop/owd.config.ts`
- **Nuxt Config**: `owd-fork/desktop/nuxt.config.ts`  
- **Package Manager**: pnpm (required for workspaces)

## Cloud Services

### Seafile (File Storage)
- **URL**: https://seafile.necloud.us
- Configure credentials in the Seafile app

### Vaultwarden (Password Manager)
- **URL**: https://key.necloud.us
- Enter master password to unlock

## Development

### Adding a New App

1. Create directory: `apps/necloud-apps/app-yourapp/`
2. Add `package.json`, `index.ts`, and components
3. Register in `desktop/owd.config.ts`
4. Reinstall dependencies: `npx -y pnpm@latest install`

### Hot Reload

The development server supports hot module replacement. Changes to your app files will automatically reload in the browser.

## Build for Production

```powershell
cd c:\Users\NateEmmert\owd-fork\desktop
npx -y pnpm@latest run build
```

The static site will be generated in `desktop/.output/public/`

## Documentation

- **OWD Docs**: https://owdproject.org/
- **Nuxt 3 Docs**: https://nuxt.com/
- **Vue 3 Docs**: https://vuejs.org/

## Support

For issues with:
- **OWD Framework**: Check OWD documentation
- **necloudOS Apps**: Review the README-NECLOUD.md file
- **Dependency Issues**: Use `npx -y pnpm@latest install --force`

---

**Happy coding!** 🚀
