import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineConfig(({ command }) => ({
  plugins: [
    {
      name: 'runtime-config-no-cache',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/config.js')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
            res.setHeader('Pragma', 'no-cache')
            res.setHeader('Expires', '0')
          }
          next()
        })
      },
    },
    vue({
      template: { transformAssetUrls },
    }),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      vuex: fileURLToPath(new URL('./src/shared/lib/vuex-compat/index.ts', import.meta.url)),
      ...(command === 'serve'
        ? {
            inferno: fileURLToPath(
              new URL('./node_modules/inferno/dist/index.dev.esm.js', import.meta.url),
            ),
          }
        : {}),
    },
  },
}))
