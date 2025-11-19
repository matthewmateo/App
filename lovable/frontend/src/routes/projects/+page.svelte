<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentUser, projectsService, type Project } from '$lib/pocketbase';

  let projects: Project[] = [];
  let showNewProject = false;
  let newProjectName = '';
  let newProjectDescription = '';
  let loading = true;

  onMount(async () => {
    if (!$currentUser) {
      goto('/login');
      return;
    }
    await loadProjects();
  });

  async function loadProjects() {
    try {
      projects = await projectsService.list();
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      loading = false;
    }
  }

  async function createProject() {
    if (!newProjectName.trim()) return;

    try {
      const project = await projectsService.create({
        name: newProjectName,
        description: newProjectDescription
      });
      goto(`/editor?project=${project.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectsService.delete(id);
      projects = projects.filter(p => p.id !== id);
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-4xl font-bold">My Projects</h1>
    <button
      on:click={() => showNewProject = true}
      class="btn btn-primary"
    >
      + New Project
    </button>
  </div>

  {#if showNewProject}
    <div class="card p-6 mb-8">
      <h2 class="text-2xl font-bold mb-4">Create New Project</h2>
      <form on:submit|preventDefault={createProject} class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Project Name</label>
          <input
            bind:value={newProjectName}
            type="text"
            required
            class="input w-full"
            placeholder="My Awesome App"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Description</label>
          <textarea
            bind:value={newProjectDescription}
            class="input w-full"
            rows="3"
            placeholder="A brief description of your project..."
          />
        </div>
        <div class="flex gap-3">
          <button type="submit" class="btn btn-primary">
            Create Project
          </button>
          <button
            type="button"
            on:click={() => { showNewProject = false; newProjectName = ''; newProjectDescription = ''; }}
            class="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  {/if}

  {#if loading}
    <div class="text-center py-12">
      <div class="text-gray-400">Loading projects...</div>
    </div>
  {:else if projects.length === 0}
    <div class="text-center py-12">
      <div class="text-6xl mb-4">📂</div>
      <h3 class="text-2xl font-semibold mb-2">No projects yet</h3>
      <p class="text-gray-400 mb-6">Create your first project to get started!</p>
      <button
        on:click={() => showNewProject = true}
        class="btn btn-primary"
      >
        Create First Project
      </button>
    </div>
  {:else}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each projects as project}
        <div class="card p-6 hover:border-indigo-500 transition-colors">
          <h3 class="text-xl font-semibold mb-2">{project.name}</h3>
          <p class="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.description || 'No description'}
          </p>
          <div class="text-xs text-gray-500 mb-4">
            Created {formatDate(project.created)}
          </div>
          <div class="flex gap-2">
            <a
              href="/editor?project={project.id}"
              class="btn btn-primary flex-1 text-center"
            >
              Open
            </a>
            <button
              on:click={() => deleteProject(project.id)}
              class="btn btn-secondary"
              title="Delete project"
            >
              🗑️
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
