// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://assemblyscript.halil07.dev',

  integrations: [
      starlight({
          // Site kimliği
          title: 'AssemblyScript Dökümantasyonu',
          description: 'TypeScript benzeri sözdizimi ile WebAssembly geliştirmeyi öğrenin. Yüksek performanslı web uygulamaları için kapsamlı rehber.',
          logo: {
              src: './src/assets/logo.svg',
              replacesTitle: true,
          },
          // Favicon
          favicon: './public/favicon.svg',

          // Navigasyon
          sidebar: [
              {
                  label: 'Giriş',
                  autogenerate: { directory: 'assemblyscript' },
              },
          ],

          // Sosyal medya
          social: [
              {
                  icon: 'github',
                  label: 'GitHub',
                  href: 'https://github.com/halil07/assemblyscriptdocs',
              },
          ],

          // Edit butonu
          editLink: {
              baseUrl: 'https://github.com/halil07/assemblyscriptdocs',
          },
      }),
	],

  adapter: cloudflare(),
});