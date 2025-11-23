import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'static', // O 'server' si necesitas SSR, pero 'static' va bien para este dashboard SPA
  adapter: vercel()
});