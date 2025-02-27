import { defineConfig } from 'tsup'
import fs from 'fs/promises'
import path from 'path'
import tailwindcssPostcss from '@tailwindcss/postcss'
// import postcss from 'postcss'
// import postCssPlugin from 'esbuild-plugin-postcss2'

export default defineConfig({
  entry: ['src/index.ts'],      // Point d'entrée
  format: ['cjs', 'esm'],       // Génère CJS + ESM
  dts: true,                    // Génère les .d.ts
  outDir: 'dist',               // Dossier de sortie
  clean: true,                  // Nettoie le dossier avant build
  sourcemap: false,              // Désactive les sourcemaps (optionnel)
  tsconfig: 'tsconfig.app.json',
  splitting: false,
  loader: {
    '.css': 'file',
  },
  esbuildOptions: (options) => {
    options.jsx = 'automatic'
    options.loader = {
      '.ts': 'tsx',
    }
  },
  // esbuildPlugins: [
  //   {
  //     name: 'tailwindcss-plugin',
  //     setup(build) {
  //       build.onLoad({ filter: /\.css$/ }, async (args) => {
  //         const source = await fs.readFile(args.path, 'utf-8')
  //         const result = await postCssPlugin([
  //           tailwindcssPostcss(),
  //         ]).process(source, {
  //           from: args.path,
  //           to: args.path,
  //         })

  //         return {
  //           contents: result.css,
  //           loader: 'css',
  //           resolveDir: path.dirname(args.path),
  //         }
  //       })
  //     }
  //   }
  // ],
  minify: true,
  outExtension: ({ format }) => ({
    js: format === 'esm' ? '.mjs' : '.cjs'
  })
})