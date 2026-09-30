import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import markdownMedia from './src/lib/markdown-media.mjs';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  markdown: { processor: satteri({ hastPlugins: [markdownMedia] }) },
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
