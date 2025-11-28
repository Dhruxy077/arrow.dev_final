import { useEffect, useRef, memo } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useStore } from '@nanostores/react';
import type { Theme } from '~/types/theme';
import { classNames } from '~/utils/classNames';
import { debounce } from '~/utils/debounce';
import { createScopedLogger, renderLogger } from '~/utils/logger';
import { isFileLocked, getCurrentChatId } from '~/utils/fileLocks';
import { BinaryContent } from '../BinaryContent';

const logger = createScopedLogger('MonacoEditor');

export interface EditorDocument {
  value: string;
  isBinary: boolean;
  filePath: string;
  scroll?: ScrollPosition;
}

export interface ScrollPosition {
  top?: number;
  left?: number;
  line?: number;
  column?: number;
}

export interface EditorSettings {
  fontSize?: string;
  gutterFontSize?: string;
  tabSize?: number;
}

export interface EditorUpdate {
  content: string;
}

export type OnChangeCallback = (update: EditorUpdate) => void;
export type OnScrollCallback = (position: ScrollPosition) => void;
export type OnSaveCallback = () => void;

interface Props {
  theme: Theme;
  id?: unknown;
  doc?: EditorDocument;
  editable?: boolean;
  debounceChange?: number;
  debounceScroll?: number;
  autoFocusOnDocumentChange?: boolean;
  onChange?: OnChangeCallback;
  onScroll?: OnScrollCallback;
  onSave?: OnSaveCallback;
  className?: string;
  settings?: EditorSettings;
}

export const MonacoEditor = memo(
  ({
    id,
    doc,
    debounceScroll = 100,
    debounceChange = 150,
    autoFocusOnDocumentChange = false,
    editable = true,
    onScroll,
    onChange,
    onSave,
    theme,
    settings,
    className = '',
  }: Props) => {
    renderLogger.trace('MonacoEditor');

    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const monacoRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      // Set initial tab size
      if (settings?.tabSize) {
        editor.getModel()?.updateOptions({ tabSize: settings.tabSize });
      }

      // Handle Save (Ctrl+S / Cmd+S)
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        onSave?.();
      });

      // Handle Scroll
      editor.onDidScrollChange(
        debounce(() => {
          const scrollTop = editor.getScrollTop();
          const scrollLeft = editor.getScrollLeft();
          onScroll?.({ top: scrollTop, left: scrollLeft });
        }, debounceScroll)
      );

      // Disable diagnostics (red squigglies)
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });
    };

    const handleEditorChange = (value: string | undefined) => {
      if (value !== undefined) {
        onChange?.({ content: value });
      }
    };

    // Update editor options when settings or theme change
    useEffect(() => {
      if (editorRef.current) {
        editorRef.current.updateOptions({
          readOnly: !editable,
          fontSize: settings?.fontSize ? parseInt(settings.fontSize) : 14,
          tabSize: settings?.tabSize || 2,
        });
      }
    }, [editable, settings]);

    // Handle Theme Change
    useEffect(() => {
      if (monacoRef.current) {
        monacoRef.current.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs');
      }
    }, [theme]);

    // Handle Document Change
    useEffect(() => {
      if (!editorRef.current || !doc) return;

      const editor = editorRef.current;
      const model = editor.getModel();

      if (model && model.getValue() !== doc.value) {
        // Only update if content is different to preserve cursor position/history if possible
        // But for full doc replacement (switching files), we usually want a fresh state or explicit value set.
        // If we are just typing, onChange handles it. This is for external updates.
        // However, Monaco's controlled mode via @monaco-editor/react handles `value` prop.
        // So we might not need to manually setValue if we pass `value` to the component.
        // But let's see if we need to do anything specific for file path changes (language).
      }

      // Scroll to position
      if (doc.scroll) {
        if (typeof doc.scroll.line === 'number') {
          editor.revealPositionInCenter({
            lineNumber: doc.scroll.line + 1,
            column: doc.scroll.column || 1,
          });
          editor.setPosition({
            lineNumber: doc.scroll.line + 1,
            column: doc.scroll.column || 1,
          });
        } else if (typeof doc.scroll.top === 'number') {
          editor.setScrollTop(doc.scroll.top);
          if (typeof doc.scroll.left === 'number') {
            editor.setScrollLeft(doc.scroll.left);
          }
        }
      }
    }, [doc?.filePath, doc?.scroll]);

    // Check lock state
    useEffect(() => {
      if (!editorRef.current || !doc) return;

      const currentChatId = getCurrentChatId();
      const { locked } = isFileLocked(doc.filePath, currentChatId);

      editorRef.current.updateOptions({
        readOnly: !editable || locked,
      });
    }, [doc?.filePath, editable]);

    if (doc?.isBinary) {
      return (
        <div className={classNames('relative h-full', className)}>
          <BinaryContent />
        </div>
      );
    }

    return (
      <div className={classNames('relative h-full', className)} ref={containerRef}>
        <Editor
          height="100%"
          path={doc?.filePath}
          language={undefined} // Let Monaco infer from path
          value={doc?.value}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14,
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            contextmenu: true,
            automaticLayout: true,
            readOnly: !editable,
          }}
        />
      </div>
    );
  }
);

MonacoEditor.displayName = 'MonacoEditor';
