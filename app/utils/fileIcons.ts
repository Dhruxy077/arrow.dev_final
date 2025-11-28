export const getFileIcon = (filename: string, model?: any) => {
    const extension = filename.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'ts':
        case 'tsx':
            return 'i-logos:typescript-icon';
        case 'js':
        case 'jsx':
            return 'i-logos:javascript';
        case 'html':
            return 'i-logos:html-5';
        case 'css':
            return 'i-logos:css-3';
        case 'json':
            return 'i-logos:json';
        case 'md':
            return 'i-logos:markdown';
        case 'py':
            return 'i-logos:python';
        case 'go':
            return 'i-logos:go';
        case 'rs':
            return 'i-logos:rust';
        case 'java':
            return 'i-logos:java';
        case 'c':
        case 'cpp':
        case 'h':
            return 'i-logos:c-plus-plus';
        case 'rb':
            return 'i-logos:ruby';
        case 'php':
            return 'i-logos:php';
        case 'vue':
            return 'i-logos:vue';
        case 'svelte':
            return 'i-logos:svelte-icon';
        case 'astro':
            return 'i-logos:astro-icon';
        case 'yaml':
        case 'yml':
            return 'i-logos:yaml';
        case 'xml':
            return 'i-logos:xml';
        case 'svg':
            return 'i-logos:svg';
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'webp':
        case 'ico':
            return 'i-ph:image-duotone text-purple-500';
        case 'gitignore':
        case 'gitattributes':
            return 'i-logos:git-icon';
        case 'env':
            return 'i-ph:gear-duotone text-yellow-500';
        case 'lock':
            return 'i-ph:lock-key-duotone text-orange-500';
        default:
            if (filename === 'package.json') return 'i-logos:nodejs-icon';
            if (filename === 'tsconfig.json') return 'i-logos:typescript-icon';
            if (filename.startsWith('vite.config')) return 'i-logos:vitejs';
            if (filename.startsWith('next.config')) return 'i-logos:nextjs-icon';
            if (filename.startsWith('tailwind.config')) return 'i-logos:tailwindcss-icon';
            if (filename.startsWith('uno.config')) return 'i-logos:unocss';
            if (filename.startsWith('docker')) return 'i-logos:docker-icon';
            return 'i-ph:file-duotone';
    }
};
