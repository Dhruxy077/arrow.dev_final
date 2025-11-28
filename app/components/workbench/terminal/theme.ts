import type { ITheme } from '@xterm/xterm';

const style = getComputedStyle(document.documentElement);
const cssVar = (token: string) => style.getPropertyValue(token) || undefined;

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: cssVar('--arrow-elements-terminal-cursorColor'),
    cursorAccent: cssVar('--arrow-elements-terminal-cursorColorAccent'),
    foreground: cssVar('--arrow-elements-terminal-textColor'),
    background: cssVar('--arrow-elements-terminal-backgroundColor'),
    selectionBackground: cssVar('--arrow-elements-terminal-selection-backgroundColor'),
    selectionForeground: cssVar('--arrow-elements-terminal-selection-textColor'),
    selectionInactiveBackground: cssVar('--arrow-elements-terminal-selection-backgroundColorInactive'),

    // ansi escape code colors
    black: cssVar('--arrow-elements-terminal-color-black'),
    red: cssVar('--arrow-elements-terminal-color-red'),
    green: cssVar('--arrow-elements-terminal-color-green'),
    yellow: cssVar('--arrow-elements-terminal-color-yellow'),
    blue: cssVar('--arrow-elements-terminal-color-blue'),
    magenta: cssVar('--arrow-elements-terminal-color-magenta'),
    cyan: cssVar('--arrow-elements-terminal-color-cyan'),
    white: cssVar('--arrow-elements-terminal-color-white'),
    brightBlack: cssVar('--arrow-elements-terminal-color-brightBlack'),
    brightRed: cssVar('--arrow-elements-terminal-color-brightRed'),
    brightGreen: cssVar('--arrow-elements-terminal-color-brightGreen'),
    brightYellow: cssVar('--arrow-elements-terminal-color-brightYellow'),
    brightBlue: cssVar('--arrow-elements-terminal-color-brightBlue'),
    brightMagenta: cssVar('--arrow-elements-terminal-color-brightMagenta'),
    brightCyan: cssVar('--arrow-elements-terminal-color-brightCyan'),
    brightWhite: cssVar('--arrow-elements-terminal-color-brightWhite'),

    ...overrides,
  };
}
