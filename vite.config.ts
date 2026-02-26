import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
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
          target: env.VITE_TEMPLATES_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-templates/, ''),
        },
        '/api-modify': {
          target: env.VITE_MODIFY_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-modify/, ''),
        },
        '/api-download': {
          target: env.VITE_DOWNLOAD_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-download/, ''),
        }
      }
    }
  }
})
