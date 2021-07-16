import path from 'path';
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
	resolve: {
		alias: {
			"ipfs-core": path.resolve(__dirname, "node_modules/ipfs-core/dist/index.min.js"),
			"ipfs-http-client": path.resolve(__dirname, "node_modules/ipfs-http-client/dist/index.min.js")
		},
	},
	plugins: [
		reactRefresh(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "script",
			manifest: {
				name: "IPFS Gallery",
				short_name: "IPFS Gallery",
				description: "A simple IPFS app for managing image galleries",
				lang: "en",
				start_url: ".",
				display: "standalone",
				theme_color: "#0b3a53",
				background_color: "#ffffff",
				icons: [
					{
						src: "/icons/manifest-icon-192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable any",
					},
					{
						src: "/icons/manifest-icon-512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable any",
					},
				],
			},
			workbox: {
				skipWaiting: true,
			},
		}),
	],
	build: {
		emptyOutDir: true,
		sourcemap: true,
		target: "esnext",
	},
	define: {
		"process.env.NODE_ENV": `"${process.env.NODE_ENV || "development"}"`,
	},
	server: {
		port: 8080,
	},
});
