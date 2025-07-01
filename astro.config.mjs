import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  // Since this is a library, it doesn't have a specific output target.
  // The project that *uses* your library will define its own output.
  // We include the Svelte integration as a default.
  integrations: [svelte()]
});