/// <reference types="vite/client" />
import /*path,*/ { resolve } from 'path'
// import { fileURLToPath } from 'url'
// import { glob } from 'glob'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      // entryRoot: 'src',
      // outDir: 'dist/types',
      // beforeWriteFile: (filePath, content) => {
        // This function is called before writing each declaration file
        // return { filePath, content };
      // },
      insertTypesEntry: true,
      // Exclude tests and stories if any
      exclude: ['src/**/*.test.ts', 'src/**/*.stories.ts']
    })
  ],
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'ReactTableLibrary',
      formats: ['es'],
      fileName: 'main'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      // input: Object.fromEntries(
      //   glob.sync('src/**/*.{js,jsx,ts,tsx}').map((file) => {
      //     // This remove `src/` as well as the file extension from each
      //     // file, so e.g. src/nested/foo.js becomes nested/foo
      //     const entryName = path.relative(
      //       'src',
      //       file.slice(0, file.length - path.extname(file).length)
      //     )
      //     // This expands the relative paths to absolute paths, so e.g.
      //     // src/nested/foo becomes /project/src/nested/foo.js
      //     const entryUrl = fileURLToPath(new URL(file, import.meta.url))
      //     return [entryName, entryUrl]
      //   }),
      // ),
      output: {
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'JSX',
        },
      },
    },
  }
})
