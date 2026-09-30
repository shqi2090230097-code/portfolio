import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import markdownMedia from './src/lib/markdown-media.mjs';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  markdown: { processor: satteri({ hastPlugins: [markdownMedia] }) },
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
