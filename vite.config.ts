/// <reference types="vite/client" />
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'
import { libInjectCss} from 'vite-plugin-lib-inject-css' // injecte le css dans le composant qui est exporté
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Permet de compiler les tailwindcss
    libInjectCss(),  // injecte le css compilé dans le composant qui est exporté
    dts({
      insertTypesEntry: true,
      //Exclude tests and stories if any
      exclude: [
        'src/**/*.stories.ts',
      ],
      entryRoot: 'src',
      tsconfigPath: 'tsconfig.app.json',
      outDir: 'dist/types',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactTableLibrary',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        entryFileNames: 'index.js',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'JSX',
        },
      },
    },
    minify:'esbuild',
  },
})
