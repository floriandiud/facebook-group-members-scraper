import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: ['browser-scraping-utils'],
  },
  build: {
    lib: {
      formats: ['es'],
      entry: resolve(__dirname, '/src/main.ts'),
      name: 'fb-group-scraper',
      fileName: 'main',
    },
    commonjsOptions: {
      include: [/browser-scraping-utils/, /node_modules/],
    }
  }
})