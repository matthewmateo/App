<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import loader from '@monaco-editor/loader';
  import type * as Monaco from 'monaco-editor';

  export let value: string = '';
  export let language: string = 'javascript';
  export let theme: string = 'vs-dark';
  export let onChange: (value: string) => void = () => {};

  let editorContainer: HTMLDivElement;
  let editor: Monaco.editor.IStandaloneCodeEditor;
  let monaco: typeof Monaco;

  onMount(async () => {
    monaco = await loader.init();

    editor = monaco.editor.create(editorContainer, {
      value,
      language,
      theme,
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      tabSize: 2,
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      folding: true,
      lineNumbers: 'on',
      renderWhitespace: 'selection'
    });

    editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      if (newValue !== value) {
        value = newValue;
        onChange(newValue);
      }
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.dispose();
    }
  });

  export function setValue(newValue: string) {
    if (editor && newValue !== value) {
      value = newValue;
      editor.setValue(newValue);
    }
  }

  export function setLanguage(newLanguage: string) {
    if (editor && monaco) {
      language = newLanguage;
      monaco.editor.setModelLanguage(editor.getModel()!, newLanguage);
    }
  }

  $: if (editor && value !== editor.getValue()) {
    editor.setValue(value);
  }

  $: if (editor && monaco && language) {
    monaco.editor.setModelLanguage(editor.getModel()!, language);
  }
</script>

<div bind:this={editorContainer} class="monaco-editor-container" />

<style>
  .monaco-editor-container {
    width: 100%;
    height: 100%;
  }
</style>
