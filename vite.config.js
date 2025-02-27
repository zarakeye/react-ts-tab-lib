/// <reference types="vite/client" />
/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import tailwindcss from '@tailwindcss/vite';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        libInjectCss(),
        dts({
            insertTypesEntry: true,
            //Exclude tests and stories if any
            exclude: ['src/**/*.test.ts', 'src/**/*.stories.ts'],
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
            // fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                entryFileNames: 'index.js',
                // assetFileNames: 'assets/index[extname]',
                assetFileNames: 'index[extname]',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'JSX',
                },
            },
        },
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
});
