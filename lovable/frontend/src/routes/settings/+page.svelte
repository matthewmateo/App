<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/pocketbase';
  import { aiService } from '$lib/ai-service';

  let provider: 'openai' | 'anthropic' | 'local' = 'local';
  let apiKey = '';
  let saved = false;

  onMount(() => {
    if (!$currentUser) {
      goto('/login');
      return;
    }

    // Load saved settings
    if (typeof window !== 'undefined') {
      provider = (localStorage.getItem('ai_provider') as any) || 'local';
      apiKey = localStorage.getItem('ai_api_key') || '';
    }
  });

  function saveSettings() {
    aiService.setConfig(provider, apiKey);
    saved = true;
    setTimeout(() => saved = false, 3000);
  }

  function testConnection() {
    alert('Testing AI connection...\n\nThis will make a test API call to generate simple code.');

    aiService.generateCode({
      prompt: 'Create a simple hello world HTML page',
      language: 'html'
    })
      .then(() => {
        alert('✅ Connection successful! AI is working correctly.');
      })
      .catch((error) => {
        alert(`❌ Connection failed:\n\n${error.message}`);
      });
  }
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8">Settings</h1>

  <div class="card p-6">
    <h2 class="text-2xl font-semibold mb-6">AI Configuration</h2>

    {#if saved}
      <div class="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-4">
        ✅ Settings saved successfully!
      </div>
    {/if}

    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium mb-2">AI Provider</label>
        <select
          bind:value={provider}
          class="input w-full"
        >
          <option value="local">Local (Ollama) - Free & Private</option>
          <option value="openai">OpenAI (GPT-4)</option>
          <option value="anthropic">Anthropic (Claude)</option>
        </select>

        {#if provider === 'local'}
          <p class="text-sm text-gray-400 mt-2">
            📌 Make sure Ollama is running on http://localhost:11434
            <br />
            Install from: <a href="https://ollama.ai/download" target="_blank" class="text-indigo-400 hover:text-indigo-300">ollama.ai/download</a>
            <br />
            Run: <code class="bg-gray-800 px-2 py-1 rounded">ollama pull codellama</code>
          </p>
        {/if}
      </div>

      {#if provider !== 'local'}
        <div>
          <label class="block text-sm font-medium mb-2">API Key</label>
          <input
            bind:value={apiKey}
            type="password"
            class="input w-full font-mono"
            placeholder="sk-..."
          />

          {#if provider === 'openai'}
            <p class="text-sm text-gray-400 mt-2">
              Get your API key from: <a href="https://platform.openai.com/api-keys" target="_blank" class="text-indigo-400 hover:text-indigo-300">platform.openai.com/api-keys</a>
            </p>
          {:else if provider === 'anthropic'}
            <p class="text-sm text-gray-400 mt-2">
              Get your API key from: <a href="https://console.anthropic.com/" target="_blank" class="text-indigo-400 hover:text-indigo-300">console.anthropic.com</a>
            </p>
          {/if}
        </div>
      {/if}

      <div class="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
        <h3 class="font-semibold mb-2">💡 Pro Tip</h3>
        <p class="text-sm text-gray-300">
          For complete privacy and no API costs, use the <strong>Local (Ollama)</strong> option.
          It runs AI models directly on your machine with no internet connection required.
        </p>
      </div>

      <div class="flex gap-3">
        <button
          on:click={saveSettings}
          class="btn btn-primary"
        >
          💾 Save Settings
        </button>

        <button
          on:click={testConnection}
          class="btn btn-secondary"
        >
          🧪 Test Connection
        </button>
      </div>
    </div>
  </div>

  <div class="card p-6 mt-6">
    <h2 class="text-2xl font-semibold mb-4">About</h2>
    <div class="space-y-2 text-gray-300">
      <p><strong>Version:</strong> 1.0.0</p>
      <p><strong>Frontend:</strong> SvelteKit + Monaco Editor</p>
      <p><strong>Backend:</strong> PocketBase</p>
      <p><strong>License:</strong> MIT</p>
    </div>
  </div>

  <div class="card p-6 mt-6">
    <h2 class="text-2xl font-semibold mb-4">Danger Zone</h2>
    <p class="text-gray-400 mb-4">
      These actions cannot be undone. Please be careful.
    </p>
    <button
      on:click={() => {
        if (confirm('Are you sure you want to clear all settings?')) {
          localStorage.clear();
          alert('Settings cleared. Please refresh the page.');
        }
      }}
      class="btn bg-red-700 hover:bg-red-600 text-white"
    >
      🗑️ Clear All Settings
    </button>
  </div>
</div>
