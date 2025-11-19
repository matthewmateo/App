<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { pb, currentUser } from '$lib/pocketbase';

  onMount(() => {
    // Listen for auth changes
    pb.authStore.onChange(() => {
      currentUser.set(pb.authStore.model);
    });
  });
</script>

<div class="min-h-screen bg-gray-900">
  <nav class="bg-gray-800 border-b border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center">
          <a href="/" class="text-2xl font-bold text-indigo-500">
            🚀 Self-Hosted Lovable
          </a>
        </div>
        <div class="flex items-center gap-4">
          {#if $currentUser}
            <a href="/projects" class="text-gray-300 hover:text-white">Projects</a>
            <a href="/editor" class="text-gray-300 hover:text-white">Editor</a>
            <a href="/settings" class="text-gray-300 hover:text-white">Settings</a>
            <button
              on:click={() => {
                pb.authStore.clear();
                goto('/login');
              }}
              class="btn btn-secondary text-sm"
            >
              Logout
            </button>
          {:else}
            <a href="/login" class="btn btn-primary text-sm">Login</a>
          {/if}
        </div>
      </div>
    </div>
  </nav>

  <main>
    <slot />
  </main>
</div>
