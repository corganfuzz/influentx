import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'strip-module-type-for-file-url',
      transformIndexHtml(html) {
        // Strip out 'crossorigin' and change type="module" to standard defer scripts
        // Browsers block executing ES modules over file:// protocol due to strict CORS rules.
        return html
          .replace(/type="module" crossorigin/g, 'defer')
          .replace(/crossorigin/g, '');
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        // Build standard scripts instead of native ES modules to prevent 
        // strict file:// protocol CORS blocking
        format: 'iife',
        // Bundle into one file when using iife
        inlineDynamicImports: true
      }
    }
  },
  // Always use relative paths. The create-aspx-loader.js script rewrites
  // them to absolute SharePoint paths when generating index.aspx.
  base: './',
  server: {
    proxy: {
      '/api-templates': {
        target: 'https://q2d5ribl0g.execute-api.us-east-1.amazonaws.com/dev/templates',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-templates/, ''),
      },
      '/api-modify': {
        target: 'https://q2d5ribl0g.execute-api.us-east-1.amazonaws.com/dev/modify',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-modify/, ''),
      },
      '/api-download': {
        target: 'https://q2d5ribl0g.execute-api.us-east-1.amazonaws.com/dev/download',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-download/, ''),
      }
    }
  }
})
