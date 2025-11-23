import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'server', // O 'server' si necesitas SSR, pero 'static' va bien para este dashboard SPA
  adapter: vercel()
});