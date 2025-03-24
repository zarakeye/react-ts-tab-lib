/// <reference types="vite/client" />
/// <reference types="vitest" />
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'
import { libInjectCss} from 'vite-plugin-lib-inject-css' // injecte le css dans le composant qui est exporté
import { visualizer } from 'rollup-plugin-visualizer';

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
        'src/**/*.test.ts',
        'src/**/*.stories.ts',
      ],
      entryRoot: 'src/components',
      tsconfigPath: 'tsconfig.app.json',
      outDir: 'dist/types',
    }),
    visualizer({
      open: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/components/Table/index.tsx'),
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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/vitest.setup.ts',
    css: true,
    coverage: {
      include: ['src/components/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}'],
    },
  },
})
