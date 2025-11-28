import { globSync } from 'fast-glob';
import fs from 'node:fs/promises';
import { basename } from 'node:path';
import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss';

const iconPaths = globSync('./icons/*.svg');

const collectionName = 'arrow';

const customIconCollection = iconPaths.reduce(
  (acc, iconPath) => {
    const [iconName] = basename(iconPath).split('.');

    acc[collectionName] ??= {};
    acc[collectionName][iconName] = async () => fs.readFile(iconPath, 'utf8');

    return acc;
  },
  {} as Record<string, Record<string, () => Promise<string>>>,
);

const BASE_COLORS = {
  white: '#FFFFFF',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  accent: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16',
  },
  orange: {
    50: '#FFFAEB',
    100: '#FEEFC7',
    200: '#FEDF89',
    300: '#FEC84B',
    400: '#FDB022',
    500: '#F79009',
    600: '#DC6803',
    700: '#B54708',
    800: '#93370D',
    900: '#792E0D',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },
};

const COLOR_PRIMITIVES = {
  ...BASE_COLORS,
  alpha: {
    white: generateAlphaPalette(BASE_COLORS.white),
    gray: generateAlphaPalette(BASE_COLORS.gray[900]),
    red: generateAlphaPalette(BASE_COLORS.red[500]),
    accent: generateAlphaPalette(BASE_COLORS.accent[500]),
  },
};

export default defineConfig({
  safelist: [
    ...Object.keys(customIconCollection[collectionName] || {}).map((x) => `i-arrow:${x}`),
    'i-logos:typescript-icon',
    'i-logos:javascript',
    'i-logos:html-5',
    'i-logos:css-3',
    'i-logos:json',
    'i-logos:markdown',
    'i-logos:python',
    'i-logos:go',
    'i-logos:rust',
    'i-logos:java',
    'i-logos:c-plus-plus',
    'i-logos:ruby',
    'i-logos:php',
    'i-logos:vue',
    'i-logos:svelte-icon',
    'i-logos:astro-icon',
    'i-logos:yaml',
    'i-logos:xml',
    'i-logos:svg',
    'i-logos:git-icon',
    'i-logos:nodejs-icon',
    'i-logos:vitejs',
    'i-logos:nextjs-icon',
    'i-logos:tailwindcss-icon',
    'i-logos:unocss',
    'i-logos:docker-icon',
  ],
  shortcuts: {
    'arrow-ease-cubic-bezier': 'ease-[cubic-bezier(0.4,0,0.2,1)]',
    'transition-theme': 'transition-[background-color,border-color,color] duration-150 arrow-ease-cubic-bezier',
    kdb: 'bg-arrow-elements-code-background text-arrow-elements-code-text py-1 px-1.5 rounded-md',
    'max-w-chat': 'max-w-[var(--chat-max-width)]',
  },
  rules: [
    /**
     * This shorthand doesn't exist in Tailwind and we overwrite it to avoid
     * any conflicts with minified CSS classes.
     */
    ['b', {}],
  ],
  theme: {
    fontFamily: {
      sans: 'Ubuntu, sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
    colors: {
      ...COLOR_PRIMITIVES,
      arrow: {
        elements: {
          borderColor: 'var(--arrow-elements-borderColor)',
          borderColorActive: 'var(--arrow-elements-borderColorActive)',
          background: {
            depth: {
              1: 'var(--arrow-elements-bg-depth-1)',
              2: 'var(--arrow-elements-bg-depth-2)',
              3: 'var(--arrow-elements-bg-depth-3)',
              4: 'var(--arrow-elements-bg-depth-4)',
            },
          },
          textPrimary: 'var(--arrow-elements-textPrimary)',
          textSecondary: 'var(--arrow-elements-textSecondary)',
          textTertiary: 'var(--arrow-elements-textTertiary)',
          code: {
            background: 'var(--arrow-elements-code-background)',
            text: 'var(--arrow-elements-code-text)',
          },
          button: {
            primary: {
              background: 'var(--arrow-elements-button-primary-background)',
              backgroundHover: 'var(--arrow-elements-button-primary-backgroundHover)',
              text: 'var(--arrow-elements-button-primary-text)',
            },
            secondary: {
              background: 'var(--arrow-elements-button-secondary-background)',
              backgroundHover: 'var(--arrow-elements-button-secondary-backgroundHover)',
              text: 'var(--arrow-elements-button-secondary-text)',
            },
            danger: {
              background: 'var(--arrow-elements-button-danger-background)',
              backgroundHover: 'var(--arrow-elements-button-danger-backgroundHover)',
              text: 'var(--arrow-elements-button-danger-text)',
            },
          },
          item: {
            contentDefault: 'var(--arrow-elements-item-contentDefault)',
            contentActive: 'var(--arrow-elements-item-contentActive)',
            contentAccent: 'var(--arrow-elements-item-contentAccent)',
            contentDanger: 'var(--arrow-elements-item-contentDanger)',
            backgroundDefault: 'var(--arrow-elements-item-backgroundDefault)',
            backgroundActive: 'var(--arrow-elements-item-backgroundActive)',
            backgroundAccent: 'var(--arrow-elements-item-backgroundAccent)',
            backgroundDanger: 'var(--arrow-elements-item-backgroundDanger)',
          },
          actions: {
            background: 'var(--arrow-elements-actions-background)',
            code: {
              background: 'var(--arrow-elements-actions-code-background)',
            },
          },
          artifacts: {
            background: 'var(--arrow-elements-artifacts-background)',
            backgroundHover: 'var(--arrow-elements-artifacts-backgroundHover)',
            borderColor: 'var(--arrow-elements-artifacts-borderColor)',
            inlineCode: {
              background: 'var(--arrow-elements-artifacts-inlineCode-background)',
              text: 'var(--arrow-elements-artifacts-inlineCode-text)',
            },
          },
          messages: {
            background: 'var(--arrow-elements-messages-background)',
            linkColor: 'var(--arrow-elements-messages-linkColor)',
            code: {
              background: 'var(--arrow-elements-messages-code-background)',
            },
            inlineCode: {
              background: 'var(--arrow-elements-messages-inlineCode-background)',
              text: 'var(--arrow-elements-messages-inlineCode-text)',
            },
          },
          icon: {
            success: 'var(--arrow-elements-icon-success)',
            error: 'var(--arrow-elements-icon-error)',
            primary: 'var(--arrow-elements-icon-primary)',
            secondary: 'var(--arrow-elements-icon-secondary)',
            tertiary: 'var(--arrow-elements-icon-tertiary)',
          },
          preview: {
            addressBar: {
              background: 'var(--arrow-elements-preview-addressBar-background)',
              backgroundHover: 'var(--arrow-elements-preview-addressBar-backgroundHover)',
              backgroundActive: 'var(--arrow-elements-preview-addressBar-backgroundActive)',
              text: 'var(--arrow-elements-preview-addressBar-text)',
              textActive: 'var(--arrow-elements-preview-addressBar-textActive)',
            },
          },
          terminals: {
            background: 'var(--arrow-elements-terminals-background)',
            buttonBackground: 'var(--arrow-elements-terminals-buttonBackground)',
          },
          dividerColor: 'var(--arrow-elements-dividerColor)',
          loader: {
            background: 'var(--arrow-elements-loader-background)',
            progress: 'var(--arrow-elements-loader-progress)',
          },
          prompt: {
            background: 'var(--arrow-elements-prompt-background)',
          },
          sidebar: {
            dropdownShadow: 'var(--arrow-elements-sidebar-dropdownShadow)',
            buttonBackgroundDefault: 'var(--arrow-elements-sidebar-buttonBackgroundDefault)',
            buttonBackgroundHover: 'var(--arrow-elements-sidebar-buttonBackgroundHover)',
            buttonText: 'var(--arrow-elements-sidebar-buttonText)',
          },
          cta: {
            background: 'var(--arrow-elements-cta-background)',
            text: 'var(--arrow-elements-cta-text)',
          },
        },
      },
    },
  },
  transformers: [transformerDirectives()],
  presets: [
    presetUno({
      dark: {
        light: '[data-theme="light"]',
        dark: '[data-theme="dark"]',
      },
    }),
    presetIcons({
      warn: true,
      collections: {
        ...customIconCollection,
      },
      unit: 'em',
    }),
  ],
});

/**
 * Generates an alpha palette for a given hex color.
 *
 * @param hex - The hex color code (without alpha) to generate the palette from.
 * @returns An object where keys are opacity percentages and values are hex colors with alpha.
 *
 * Example:
 *
 * ```
 * {
 *   '1': '#FFFFFF03',
 *   '2': '#FFFFFF05',
 *   '3': '#FFFFFF08',
 * }
 * ```
 */
function generateAlphaPalette(hex: string) {
  return [1, 2, 3, 4, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].reduce(
    (acc, opacity) => {
      const alpha = Math.round((opacity / 100) * 255)
        .toString(16)
        .padStart(2, '0');

      acc[opacity] = `${hex}${alpha}`;

      return acc;
    },
    {} as Record<number, string>,
  );
}
