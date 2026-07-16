import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  integrations: [tailwind({ applyBaseStyles: false }), react()],
  adapter: cloudflare(),
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
