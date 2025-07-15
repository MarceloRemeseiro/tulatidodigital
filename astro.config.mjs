import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  build: {
    assets: 'assets'
  },
  vite: {
    assetsInclude: ['**/*.mp4', '**/*.webm', '**/*.ogg'] // Incluir archivos de vídeo como assets
  }
}); 