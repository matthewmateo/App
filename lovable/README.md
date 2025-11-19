# 🚀 Self-Hosted Lovable

A powerful, self-hosted AI-powered application builder that runs completely on your infrastructure. Build web applications using AI code generation, a Monaco Editor IDE, and live preview - all from your browser.

## ✨ Features

- **🤖 AI-Powered Code Generation**: Integrate with OpenAI, Anthropic Claude, or run local models using Ollama
- **💻 Monaco Editor**: Full VS Code editing experience with IntelliSense, syntax highlighting, and auto-completion
- **⚡ Live Preview**: See your changes instantly with hot reload
- **🗄️ PocketBase Backend**: Lightweight, fast database with built-in authentication
- **🎨 SvelteKit Frontend**: Modern, reactive UI framework
- **📁 Project Management**: Organize and manage multiple projects
- **🔒 Self-Hosted**: Complete control over your data and infrastructure
- **🐳 Docker Support**: Easy deployment with Docker Compose

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           SvelteKit Frontend (Port 3000)    │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Monaco       │  │ Project Management   │ │
│  │ Editor       │  │ & File System        │ │
│  └──────────────┘  └──────────────────────┘ │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ AI Code      │  │ Live Preview         │ │
│  │ Generation   │  │ (iframe)             │ │
│  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│         PocketBase Backend (Port 8090)      │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │ Auth &       │  │ Projects &           │ │
│  │ Users        │  │ Files Storage        │ │
│  └──────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) Docker and Docker Compose for containerized deployment

### Installation

1. **Clone the repository**
   ```bash
   cd lovable
   ```

2. **Run setup script**
   ```bash
   npm run setup
   ```

   This will:
   - Download PocketBase for your platform
   - Install frontend dependencies
   - Set up the project structure

3. **Start the application**
   ```bash
   npm run dev
   ```

   This starts both:
   - Frontend: http://localhost:3000
   - PocketBase: http://localhost:8090

4. **Create admin account**
   - Visit http://localhost:8090/_/
   - Create your admin account
   - The PocketBase collections will be created automatically

5. **Sign up and start building!**
   - Go to http://localhost:3000
   - Create an account
   - Start your first project

## 🐳 Docker Deployment

For production deployment using Docker:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access:
- Frontend: http://localhost:3000
- PocketBase Admin: http://localhost:8090/_/

## 🤖 AI Configuration

Self-Hosted Lovable supports multiple AI providers:

### Option 1: OpenAI

1. Get API key from https://platform.openai.com/api-keys
2. In the app, go to Settings → AI Configuration
3. Select "OpenAI" and enter your API key
4. Uses GPT-4 Turbo for code generation

### Option 2: Anthropic Claude

1. Get API key from https://console.anthropic.com/
2. In the app, go to Settings → AI Configuration
3. Select "Anthropic" and enter your API key
4. Uses Claude 3 Sonnet for code generation

### Option 3: Local AI (Ollama)

1. Install Ollama: https://ollama.ai/download
2. Pull a code model:
   ```bash
   ollama pull codellama
   # or
   ollama pull deepseek-coder
   ```
3. In the app, select "Local" as AI provider
4. No API key needed - completely free and private!

## 📖 Usage Guide

### Creating a Project

1. Click "New Project" from the dashboard
2. Enter project name and description
3. Click "Create Project" - opens in the editor

### Using the Editor

- **File Tree**: Left sidebar shows all files
  - Click to switch between files
  - Click + to add new files
  - Click × to delete files

- **Monaco Editor**: Center panel
  - Full VS Code experience
  - Auto-completion and IntelliSense
  - Syntax highlighting for HTML, CSS, JS, and more

- **Live Preview**: Right panel (toggle with 👁️ button)
  - Real-time preview of your HTML
  - Auto-updates on save
  - Sandboxed iframe for security

- **AI Generation**: Click "🤖 AI Generate"
  - Describe what you want to build
  - AI generates complete code
  - Can generate multiple files at once
  - Integrates with your existing code

### Project Management

- **Auto-Save**: Files save automatically after 1 second of inactivity
- **Manual Save**: Click "💾 Save" button
- **View All Projects**: Click "Projects" in nav
- **Delete Project**: From projects list, click 🗑️

## 🛠️ Development

### Project Structure

```
lovable/
├── frontend/               # SvelteKit application
│   ├── src/
│   │   ├── routes/        # Pages
│   │   │   ├── +page.svelte          # Home
│   │   │   ├── login/                # Authentication
│   │   │   ├── projects/             # Project list
│   │   │   └── editor/               # Main IDE
│   │   ├── lib/
│   │   │   ├── components/           # Reusable components
│   │   │   │   └── MonacoEditor.svelte
│   │   │   ├── pocketbase.ts         # DB integration
│   │   │   └── ai-service.ts         # AI integration
│   │   ├── app.html       # HTML template
│   │   └── app.css        # Global styles
│   ├── package.json
│   └── vite.config.ts
├── pocketbase/            # Database & backend
│   ├── pb_data/           # Data files (gitignored)
│   ├── pb_migrations/     # Database migrations
│   └── pb_schema.json     # Schema definition
├── scripts/               # Setup & utility scripts
│   ├── setup.sh
│   └── start-pocketbase.sh
├── generated-apps/        # Built applications (gitignored)
├── docker-compose.yml     # Docker configuration
└── package.json           # Root package.json
```

### Running in Development

```bash
# Frontend only (with hot reload)
npm run dev:frontend

# PocketBase only
npm run dev:pocketbase

# Both together
npm run dev
```

### Building for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# PocketBase
POCKETBASE_URL=http://127.0.0.1:8090

# AI Keys (optional - can configure in UI)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
OLLAMA_URL=http://localhost:11434
```

### PocketBase Collections

The app uses two main collections:

1. **users**: Authentication and user profiles
2. **projects**: Project data and files

Schema is defined in `pocketbase/pb_schema.json`

## 🔒 Security

- **Authentication**: Required for all operations
- **Authorization**: Users can only access their own projects
- **Sandbox**: Preview runs in sandboxed iframe
- **Data Privacy**: Self-hosted - your data never leaves your server
- **API Keys**: Stored in browser localStorage (use environment variables in production)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

Built with:
- [SvelteKit](https://kit.svelte.dev/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [PocketBase](https://pocketbase.io/)
- [TailwindCSS](https://tailwindcss.com/)

---

**Made with ❤️ for self-hosted AI development**
