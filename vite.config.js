import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  build:{
    minify:'terser',
    terserOptions:{
      compress:{
        drop_console:true,
        drop_debugger:true
      }
    }
  }
})
