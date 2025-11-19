import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new PocketBase('http://127.0.0.1:8090');

// Disable auto cancellation
pb.autoCancellation(false);

export const currentUser = writable(pb.authStore.model);

export interface Project {
  id: string;
  name: string;
  description: string;
  files: Record<string, string>;
  created: string;
  updated: string;
  user: string;
}

export interface GeneratedFile {
  id: string;
  project: string;
  filename: string;
  content: string;
  language: string;
  created: string;
}

export const projectsService = {
  async list() {
    return await pb.collection('projects').getFullList<Project>({
      sort: '-created'
    });
  },

  async create(data: { name: string; description: string }) {
    return await pb.collection('projects').create<Project>({
      ...data,
      files: {},
      user: pb.authStore.model?.id
    });
  },

  async update(id: string, data: Partial<Project>) {
    return await pb.collection('projects').update<Project>(id, data);
  },

  async delete(id: string) {
    return await pb.collection('projects').delete(id);
  },

  async getOne(id: string) {
    return await pb.collection('projects').getOne<Project>(id);
  }
};
