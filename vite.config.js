import { defineConfig } from 'vite'
import { resolve } from 'path'
import node_resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript'
import mkcert from'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
    // port: 3002,
    hmr: {
    //   port: 3002
    }
  },
  base: './',
  publicPath: './',
  build: {
    minify: true,  // change to false to not compress build output
    outDir: "dist",
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html')
      },
      output: {
        // entryFileNames: '[name].js',
        // chunkFileNames: '[name].js',
        format: 'es'
      }, 
      plugins: [
        typescript({
            typescript: require('typescript'),
        }),
         
        node_resolve(),
      ]
    }
  },
  plugins: [mkcert()]
})