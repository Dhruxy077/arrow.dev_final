# Arrow.dev

Arrow.dev is a powerful, AI-powered web-based IDE and development environment designed to streamline your coding workflow. Built with modern web technologies, it combines a robust code editor, integrated terminal, and AI-powered chat assistance into a unified interface with stunning visual effects.

![Arrow.dev](https://via.placeholder.com/800x400/2d3748/ffffff?text=Arrow.dev)

## ✨ Features

### Core Capabilities
- 🤖 **AI-Powered Development:** Integrated chat interface with Google Gemini AI for intelligent code generation, debugging, and assistance
- 📝 **Advanced Code Editor:** Built on Monaco Editor (the core of VS Code), providing syntax highlighting, IntelliSense, and a familiar editing experience
- 💻 **Integrated Terminal:** Full-featured terminal support using xterm.js, allowing you to run commands directly within the browser
- 🌐 **WebContainer Support:** Powered by WebContainers to run a full Node.js environment directly in the browser
- 📁 **File Management:** Intuitive file tree with comprehensive icon support for easy navigation and management

### UI & Experience
- 🎨 **Stunning Silk Background:** Animated WebGL shader background with customizable parameters
- 🌙 **Dark Theme:** Sleek, modern dark-themed interface designed for focus and productivity
- ⚙️ **Customizable Settings:** Configure your environment through a dedicated settings panel
- 🎯 **Starter Templates:** Quick-start templates for various frameworks including React, Next.js, Astro, Remix, Qwik, and more

### Integration & Deployment
- 🚀 **Git Integration:** Built-in GitHub support for cloning and managing repositories
- ☁️ **Deployment Options:** Direct deployment to Netlify, Vercel, and other platforms
- 📊 **Project Analytics:** GitHub repository stats and insights
- 🔄 **Version Control:** Integrated Git operations and branch management

## 🛠️ Tech Stack

### Core Framework
- **Framework:** [Reactjs](https://reactjs.org/),[Remix](https://remix.run/) - Full-stack web framework
- **Runtime:** [Cloudflare Pages](https://pages.cloudflare.com/) - Edge deployment platform
- **Bundler:** [Vite](https://vitejs.dev/) - Next-generation frontend tooling

### UI & Styling
- **Styling:** [UnoCSS](https://unocss.dev/) - Instant on-demand atomic CSS engine
- **CSS Preprocessor:** SCSS for advanced styling
- **Components:** [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- **Icons:** [Iconify](https://iconify.design/) + [Phosphor Icons](https://phosphoricons.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) + GSAP

### Editor & Terminal
- **Code Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Terminal:** [xterm.js](https://xtermjs.org/)
- **Syntax Highlighting:** [Shiki](https://shiki.matsu.io/)

### State & Data Management
- **State Management:** [Nanostores](https://github.com/nanostores/nanostores)
- **AI SDK:** [Vercel AI SDK](https://sdk.vercel.ai/)
- **WebContainers:** [@webcontainer/api](https://webcontainers.io/)

### 3D Graphics
- **WebGL:** Custom WebGL shaders for background effects
- **Three.js Types:** TypeScript definitions for 3D graphics

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js:** v18.18.0 or higher
- **pnpm:** v9 or higher (recommended package manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd arrow.dev_final
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   
   Copy the example environment file and configure your API keys:
   ```bash
   cp .env.example .env.production
   ```
   
   Edit `.env.production` and add your API keys:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   # Add other API keys as needed
   ```

### Running the Development Server

Start the development server:

```bash
pnpm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal if 5173 is in use).

### Building for Production

Create an optimized production build:

```bash
pnpm run build
```

### Deployment

Deploy to Cloudflare Pages:

```bash
pnpm run deploy
```

## 📂 Project Structure

```
arrow.dev_final/
├── app/                          # Main application source
│   ├── components/              # React components
│   │   ├── chat/               # Chat and AI interaction components
│   │   ├── editor/             # Code editor components
│   │   ├── header/             # Header and navigation
│   │   ├── home/               # Landing page components
│   │   ├── settings/           # Settings and configuration
│   │   ├── sidebar/            # Sidebar navigation
│   │   ├── ui/                 # Reusable UI components
│   │   ├── workbench/          # Main workbench and terminal
│   │   └── Silk.client.tsx     # WebGL Silk background component
│   ├── lib/                     # Utility libraries
│   │   ├── hooks/              # Custom React hooks
│   │   ├── persistence/        # Data persistence layer
│   │   ├── stores/             # Nanostores state management
│   │   └── webcontainer/       # WebContainer integration
│   ├── routes/                  # Remix routes
│   ├── styles/                  # Global styles and themes
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Helper functions and constants
├── public/                       # Static assets
├── src/                         # Additional source files
│   └── component/              # Shared components
├── icons/                       # Custom icon assets
├── functions/                   # Cloudflare Functions
└── vite.config.ts              # Vite configuration
```

## 🎨 Customization

### Silk Background

The animated Silk background can be customized by editing the props in `/app/routes/_index.tsx`:

```tsx
<SilkBackground 
  speed={1}              // Animation speed
  scale={0.7}           // Pattern scale
  color="#767577ff"     // Base color (hex)
  noiseIntensity={1}    // Noise effect intensity
  rotation={0}          // Pattern rotation in radians
/>
```

### Theme Configuration

Customize the theme by editing the UnoCSS configuration in `uno.config.ts`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of modern web technologies and open-source libraries
- Inspired by the need for a powerful, browser-based development environment
- Special thanks to the Remix, Vite, and WebContainers communities

## 📧 Support

For support, questions, or feedback, please open an issue on GitHub.

---

**Made with ❤️ using Arrow.dev**
