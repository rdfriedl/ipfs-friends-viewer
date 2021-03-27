import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
  plugins: [
    reactRefresh(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'html',
      manifest: {
        name: "IPFS Gallery",
        short_name: "IPFS Gallery",
        description: "A simple IPFS app for managing image galleries",
        lang: 'en',
        start_url: ".",
        display: "standalone",
        theme_color: "#0b3a53",
        background_color: "#ffffff"
      },
      workbox: {
        skipWaiting: true,
      }
    })
  ],
  build: {
    emptyOutDir: true,
    sourcemap: true,
    target: 'esnext',
  },
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`
  }
})
