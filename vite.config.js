import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

import { promises as fs } from 'fs'
// loader helpers
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

import Unocss from 'unocss/vite'
import presetIcons from '@unocss/preset-icons'

import { compareColors, stringToColor } from '@iconify/utils/lib/colors'
import {
	importDirectory,
	parseColors,
	runSVGO,
	deOptimisePaths
} from '@iconify/tools'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		Unocss({
			cli: {
				entry: {
					outFile: 'dist/assets/css/uno.css',
					patterns: ['src/**/*.html', 'index.html']
				}
			},
			// envMode: dev ? 'dev' : 'build',
			// theme: {
			// 	fontFamily: {
			// 		sans: "'Inter', sans-serif",
			// 		mono: "'Fira Code', monospace"
			// 	}
			// },

			presets: [
				presetIcons({
					prefix: '',
					autoInstall: true,
					collections: {
						// Loading IconifyJSON data from test.json
						test: async () => {
							const content = await fs.readFile(
								'src/assets/svg/test.json',
								'utf8'
							)
							return JSON.parse(content)
						},
						// key as the collection name
						// 'my-icons': {
						// 	account: '<svg><!-- ... --></svg>',
						// 	// load your custom icon lazily
						// 	settings: () => fs.readFile('./path/to/my-icon.svg', 'utf-8')
						// 	/* ... */
						// },

						// 'my-other-icons': async (iconName) => {
						// 	// your custom loader here. Do whatever you want.
						// 	// for example, fetch from a remote server:
						// 	return await fetch(
						// 		`https://example.com/icons/${iconName}.svg`
						// 	).then((res) => res.text())
						// },

						// // a helper to load icons from the file system
						// // files under `./assets/icons` with `.svg` extension will be loaded as it's file name
						// // you can also provide a transform callback to change each icon (optional)
						// 'my-yet-other-icons': FileSystemIconLoader('./assets/icons', (svg) =>
						// 	svg.replace(/#fff/, 'currentColor')
						// ),

						// Loading icon set
						'my-icons': async () => {
							// Load icons
							const iconSet = await importDirectory('src/assets/svg', {
								prefix: 'svg'
							})
							// // Clean up each icon
							// await iconSet.forEach(async (name) => {
							// 	const svg = iconSet.toSVG(name)!
							// 	// Change color to `currentColor`
							// 	const blackColor = stringToColor('black')!
							// 	await parseColors(svg, {
							// 		defaultColor: 'currentColor',
							// 		callback: (attr, colorStr, color) => {
							// 			// console.log('Color:', colorStr, color);
							// 			// Change black to 'currentColor'
							// 			if (color && compareColors(color, blackColor)) {
							// 				return 'currentColor'
							// 			}
							// 			switch (color?.type) {
							// 				case 'none':
							// 				case 'rgb':
							// 				case 'current':
							// 					return color
							// 			}
							// 			throw new Error(
							// 				`Unexpected color "${colorStr}" in attribute ${attr}`
							// 			)
							// 		}
							// 	})
							// 	// Optimise
							// 	runSVGO(svg)
							// 	// Update paths for compatibility with old software
							// 	await deOptimisePaths(svg)
							// 	// Update icon in icon set
							// 	iconSet.fromSVG(name, svg)
							// })
							// Export as IconifyJSON
							return iconSet.export()
						}
					}
				})
				// presetUno()
			],
			rules: [
				[
					'inline-icon',
					{
						'vertical-align': '-0.125em'
					}
				],
				[
					'icon16',
					{
						'font-size': '16px',
						'line-height': '1em'
					}
				],
				[
					'icon24',
					{
						'font-size': '24px',
						'line-height': '1em'
					}
				],
				[
					'icon48',
					{
						'font-size': '48px',
						'line-height': '5em',
						width: '3em'
					}
				],
				[
					'icon96',
					{
						'font-size': '96px',
						'line-height': '10em'
					}
				]
			]
		})
	],
	mode: 'development',
	// base: '/dist',
	define: {
		'process.env': process.env
	},
	server: {
		// port: '5174',
		// hmr: false
	},
	build: {
		// Disables minification of js only, doesn't disable css minify at the moment - https://github.com/vitejs/vite/issues/5619
		// minify: false,
		// sourcemap: true,
		outDir: 'dist',
		// Don't empty as the dist folder is updated simultaneously by both Vite & Unocss cli
		emptyOutDir: false,
		// https://vitejs.dev/config/build-options.html#build-lib
		lib: {
			entry: {
				// entry file that has es modules & the tailwind.css that contains the tailwind directives
				main: './src/main.js'
			},
			// fileName: '[name]',
			fileName: (format) => (format === 'cjs' ? `main.cjs` : `main.js`),
			formats: ['es' /*, 'cjs'*/]
		},

		// Vite uses Rollup under the hold, so rollup options & plugins can be used for advanced usage
		rollupOptions: {
			plugins: [visualizer()],
			output: {
				// Just a simple function to get the css file generated as output.css under dist/assets/css folder. And all the images under dist/assets/img folder.
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split('.').at(1)
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
						extType = 'img'
					}
					if (extType === 'css') {
						return `assets/${extType}/output[extname]`
					} else {
						// js & images
						return `assets/${extType}/[name]-[hash][extname]`
					}
				}
			}
		}
	},
	//...
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
})
