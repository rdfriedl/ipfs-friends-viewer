import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
  plugins: [
    reactRefresh(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "IPFS Gallery",
        short_name: "IPFS Gallery",
        lang: 'en',
        start_url: ".",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#ffffff"
      }
    })
  ],
  build: {
    emptyOutDir: true,
    sourcemap: true,
    target: 'esnext'
  },
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`
  }
})
