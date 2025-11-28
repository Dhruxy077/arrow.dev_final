# Arrow.dev

Arrow.dev is a powerful, web-based IDE and development environment designed to streamline your coding workflow. It combines a robust code editor, integrated terminal, and AI-powered chat assistance into a unified interface.

## Features

-   **Advanced Code Editor:** Built on Monaco Editor (the core of VS Code), providing syntax highlighting, code completion, and a familiar editing experience.
-   **Integrated Terminal:** Full-featured terminal support using xterm.js, allowing you to run commands directly within the browser.
-   **AI Assistance:** Integrated chat interface to interact with AI models for code generation, debugging, and assistance.
-   **File Management:** Intuitive file tree with icon support for easy navigation and management of your project files.
-   **Customizable Settings:** Configure your environment with a dedicated settings panel.
-   **Modern UI:** Sleek, dark-themed interface designed for focus and productivity.
-   **WebContainer Support:** Powered by WebContainers to run a full Node.js environment directly in the browser.

## Tech Stack

-   **Framework:** [Remix](https://remix.run/)
-   **Bundler:** [Vite](https://vitejs.dev/)
-   **Styling:** [UnoCSS](https://unocss.dev/) / SCSS
-   **Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/)
-   **Terminal:** [xterm.js](https://xtermjs.org/)
-   **State Management:** [Nanostores](https://github.com/nanostores/nanostores)
-   **Icons:** [Iconify](https://iconify.design/)

## Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   pnpm (v8 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd arrow.dev_final
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Running the Development Server

Start the development server:

```bash
pnpm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

-   `app/`: Main application source code.
    -   `components/`: Reusable UI components (Editor, Sidebar, Workbench, etc.).
    -   `lib/`: Utility libraries, stores, and hooks.
    -   `routes/`: Remix routes.
    -   `styles/`: Global styles and SCSS files.
    -   `utils/`: Helper functions.
-   `public/`: Static assets.

## License

[MIT](LICENSE)
