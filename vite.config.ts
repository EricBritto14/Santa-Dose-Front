import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@Components" : path.resolve(__dirname, 'src/components'),
      "@Styles": path.resolve(__dirname, "src/styles"),
      "@Pages": path.resolve(__dirname, "src/pages"),
      "@Models": path.resolve(__dirname, "src/models"),
      "@Utils": path.resolve(__dirname, "src/utils"),
      "@Api": path.resolve(__dirname, "src/api"),
    }
  },
})
