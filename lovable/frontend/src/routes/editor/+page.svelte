<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { currentUser, projectsService, type Project } from '$lib/pocketbase';
  import { aiService } from '$lib/ai-service';
  import MonacoEditor from '$lib/components/MonacoEditor.svelte';

  let project: Project | null = null;
  let currentFile: string = 'index.html';
  let currentContent: string = '';
  let files: Record<string, string> = {};
  let showAIPanel = false;
  let aiPrompt = '';
  let aiLoading = false;
  let previewContent = '';
  let showPreview = true;
  let fileLanguageMap: Record<string, string> = {
    '.html': 'html',
    '.css': 'css',
    '.js': 'javascript',
    '.ts': 'typescript',
    '.jsx': 'javascript',
    '.tsx': 'typescript',
    '.json': 'json',
    '.md': 'markdown',
    '.py': 'python',
    '.svelte': 'html'
  };

  onMount(async () => {
    if (!$currentUser) {
      goto('/login');
      return;
    }

    const projectId = $page.url.searchParams.get('project');
    if (projectId) {
      try {
        project = await projectsService.getOne(projectId);
        files = project.files || {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: #0f172a;
      color: #f1f5f9;
    }
    h1 { color: #818cf8; }
  </style>
</head>
<body>
  <h1>Welcome to ${project.name}</h1>
  <p>Start building your app here!</p>
  <script>
    console.log('Hello from ${project.name}');
  </script>
</body>
</html>`,
          'style.css': '',
          'script.js': ''
        };
        currentContent = files[currentFile] || '';
        updatePreview();
      } catch (error) {
        console.error('Failed to load project:', error);
        goto('/projects');
      }
    } else {
      goto('/projects');
    }
  });

  function getLanguageFromFilename(filename: string): string {
    const ext = filename.substring(filename.lastIndexOf('.'));
    return fileLanguageMap[ext] || 'plaintext';
  }

  function selectFile(filename: string) {
    // Save current file
    if (currentFile && currentContent !== files[currentFile]) {
      files[currentFile] = currentContent;
      saveProject();
    }

    currentFile = filename;
    currentContent = files[filename] || '';
  }

  function addNewFile() {
    const filename = prompt('Enter filename:');
    if (filename && !files[filename]) {
      files[filename] = '';
      selectFile(filename);
    }
  }

  function deleteFile(filename: string) {
    if (confirm(`Delete ${filename}?`)) {
      delete files[filename];
      files = files;
      if (currentFile === filename) {
        currentFile = Object.keys(files)[0] || '';
        currentContent = files[currentFile] || '';
      }
      saveProject();
    }
  }

  async function saveProject() {
    if (!project) return;

    files[currentFile] = currentContent;

    try {
      await projectsService.update(project.id, { files });
      updatePreview();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  }

  function updatePreview() {
    const htmlFile = files['index.html'] || '';
    const cssFile = files['style.css'] || '';
    const jsFile = files['script.js'] || '';

    // Inject CSS and JS into HTML
    let preview = htmlFile;
    if (cssFile && !preview.includes('<style>')) {
      preview = preview.replace('</head>', `<style>${cssFile}</style></head>`);
    }
    if (jsFile && !preview.includes('<script>')) {
      preview = preview.replace('</body>', `<script>${jsFile}</script></body>`);
    }

    previewContent = preview;
  }

  async function generateWithAI() {
    if (!aiPrompt.trim()) return;

    aiLoading = true;
    try {
      const result = await aiService.generateCode({
        prompt: aiPrompt,
        context: `Current file: ${currentFile}\nContent: ${currentContent}`,
        framework: 'html/css/js'
      });

      if (result.files) {
        // Multiple files generated
        Object.entries(result.files).forEach(([filename, content]) => {
          files[filename] = content;
        });
        files = files;
        const firstFile = Object.keys(result.files)[0];
        if (firstFile) selectFile(firstFile);
      } else {
        // Single code block
        currentContent = result.code;
        files[currentFile] = currentContent;
      }

      saveProject();
      aiPrompt = '';
      showAIPanel = false;
    } catch (error: any) {
      alert(error.message);
    } finally {
      aiLoading = false;
    }
  }

  function handleEditorChange(newValue: string) {
    currentContent = newValue;
    files[currentFile] = newValue;
    // Auto-save after typing stops
    clearTimeout((window as any).saveTimeout);
    (window as any).saveTimeout = setTimeout(() => {
      saveProject();
    }, 1000);
  }
</script>

<div class="h-[calc(100vh-4rem)] flex">
  <!-- Sidebar - File Tree -->
  <div class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
    <div class="p-4 border-b border-gray-700">
      <h2 class="font-semibold text-lg truncate">{project?.name || 'Project'}</h2>
      <button on:click={addNewFile} class="btn btn-primary text-xs mt-2 w-full">
        + New File
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-2">
      {#each Object.keys(files) as filename}
        <div class="flex items-center gap-2 mb-1">
          <button
            on:click={() => selectFile(filename)}
            class="flex-1 text-left px-3 py-2 rounded hover:bg-gray-700 {currentFile === filename ? 'bg-gray-700 text-indigo-400' : 'text-gray-300'}"
          >
            📄 {filename}
          </button>
          <button
            on:click={() => deleteFile(filename)}
            class="text-red-400 hover:text-red-300 px-2"
            title="Delete"
          >
            ×
          </button>
        </div>
      {/each}
    </div>

    <div class="p-4 border-t border-gray-700">
      <button
        on:click={() => showAIPanel = !showAIPanel}
        class="btn btn-success w-full"
      >
        🤖 AI Generate
      </button>
    </div>
  </div>

  <!-- Main Editor Area -->
  <div class="flex-1 flex flex-col">
    {#if showAIPanel}
      <div class="bg-indigo-900/30 border-b border-indigo-700 p-4">
        <h3 class="font-semibold mb-2">AI Code Generation</h3>
        <div class="flex gap-2">
          <input
            bind:value={aiPrompt}
            on:keydown={(e) => e.key === 'Enter' && generateWithAI()}
            placeholder="Describe what you want to build..."
            class="input flex-1"
            disabled={aiLoading}
          />
          <button
            on:click={generateWithAI}
            disabled={aiLoading}
            class="btn btn-success"
          >
            {aiLoading ? 'Generating...' : 'Generate'}
          </button>
          <button
            on:click={() => showAIPanel = false}
            class="btn btn-secondary"
          >
            Close
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-2">
          Configure AI provider in settings (OpenAI, Anthropic, or Local Ollama)
        </p>
      </div>
    {/if}

    <div class="flex-1 flex">
      <!-- Editor -->
      <div class="flex-1 flex flex-col">
        <div class="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
          <span class="font-medium">{currentFile}</span>
          <div class="flex gap-2">
            <button on:click={saveProject} class="btn btn-primary text-sm">
              💾 Save
            </button>
            <button
              on:click={() => showPreview = !showPreview}
              class="btn btn-secondary text-sm"
            >
              {showPreview ? '👁️ Hide' : '👁️ Show'} Preview
            </button>
          </div>
        </div>

        <div class="flex-1">
          <MonacoEditor
            bind:value={currentContent}
            language={getLanguageFromFilename(currentFile)}
            onChange={handleEditorChange}
          />
        </div>
      </div>

      <!-- Live Preview -->
      {#if showPreview}
        <div class="w-1/2 border-l border-gray-700 flex flex-col">
          <div class="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <span class="font-medium">Preview</span>
          </div>
          <div class="flex-1 bg-white overflow-auto">
            <iframe
              title="Preview"
              srcdoc={previewContent}
              class="w-full h-full border-0"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
