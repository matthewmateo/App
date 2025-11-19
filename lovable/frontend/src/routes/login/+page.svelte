<script lang="ts">
  import { goto } from '$app/navigation';
  import { pb, currentUser } from '$lib/pocketbase';
  import { onMount } from 'svelte';

  let email = '';
  let password = '';
  let isLogin = true;
  let error = '';
  let loading = false;

  onMount(() => {
    if ($currentUser) {
      goto('/projects');
    }
  });

  async function handleSubmit() {
    error = '';
    loading = true;

    try {
      if (isLogin) {
        await pb.collection('users').authWithPassword(email, password);
        goto('/projects');
      } else {
        await pb.collection('users').create({
          email,
          password,
          passwordConfirm: password
        });
        await pb.collection('users').authWithPassword(email, password);
        goto('/projects');
      }
    } catch (err: any) {
      error = err.message || 'Authentication failed';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
  <div class="card p-8 w-full max-w-md">
    <h2 class="text-3xl font-bold mb-6 text-center">
      {isLogin ? 'Login' : 'Sign Up'}
    </h2>

    {#if error}
      <div class="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium mb-2">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          class="input w-full"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium mb-2">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          minlength="8"
          class="input w-full"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="btn btn-primary w-full"
      >
        {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
      </button>
    </form>

    <div class="mt-6 text-center">
      <button
        on:click={() => { isLogin = !isLogin; error = ''; }}
        class="text-indigo-400 hover:text-indigo-300"
      >
        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
      </button>
    </div>
  </div>
</div>
