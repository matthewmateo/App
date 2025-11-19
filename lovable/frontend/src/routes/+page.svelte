<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/pocketbase';

  onMount(() => {
    if ($currentUser) {
      goto('/projects');
    }
  });
</script>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
      Self-Hosted Lovable
    </h1>
    <p class="text-2xl text-gray-300 mb-8">
      Build apps with AI, on your own server
    </p>
    <p class="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
      A powerful AI-powered development environment that runs completely on your infrastructure.
      Generate code, build UIs, and deploy apps - all from your browser.
    </p>

    <div class="grid md:grid-cols-3 gap-8 mb-12">
      <div class="card p-6">
        <div class="text-4xl mb-4">🤖</div>
        <h3 class="text-xl font-semibold mb-2">AI-Powered</h3>
        <p class="text-gray-400">
          Generate code using OpenAI, Anthropic, or run local models with Ollama
        </p>
      </div>

      <div class="card p-6">
        <div class="text-4xl mb-4">💻</div>
        <h3 class="text-xl font-semibold mb-2">Monaco Editor</h3>
        <p class="text-gray-400">
          Full VS Code editing experience with IntelliSense and syntax highlighting
        </p>
      </div>

      <div class="card p-6">
        <div class="text-4xl mb-4">🚀</div>
        <h3 class="text-xl font-semibold mb-2">Live Preview</h3>
        <p class="text-gray-400">
          See your changes instantly with hot reload and live preview
        </p>
      </div>
    </div>

    <div class="flex gap-4 justify-center">
      <a href="/login" class="btn btn-primary text-lg px-8 py-3">
        Get Started
      </a>
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-secondary text-lg px-8 py-3"
      >
        View on GitHub
      </a>
    </div>

    <div class="mt-16 text-left card p-8 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Features</h2>
      <ul class="space-y-3 text-gray-300">
        <li class="flex items-start gap-3">
          <span class="text-green-500 mt-1">✓</span>
          <span><strong>PocketBase Backend:</strong> Lightweight, fast database with built-in auth</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-green-500 mt-1">✓</span>
          <span><strong>SvelteKit Frontend:</strong> Modern, reactive UI framework</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-green-500 mt-1">✓</span>
          <span><strong>Monaco Editor:</strong> The same editor that powers VS Code</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-green-500 mt-1">✓</span>
          <span><strong>Multi-AI Support:</strong> Works with OpenAI, Anthropic Claude, or local models</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-green-500 mt-1">✓</span>
          <span><strong>Project Management:</strong> Organize and manage multiple projects</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-green-500 mt-1">✓</span>
          <span><strong>Self-Hosted:</strong> Complete control over your data and infrastructure</span>
        </li>
      </ul>
    </div>
  </div>
</div>
