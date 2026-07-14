import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind(), react()],
  server: {
    port: 4200,
  },
  vite: {
    resolve: {
      alias: {
        '@nexlynk/shared': '../../../libs/shared/src',
      },
    },
  },
});
