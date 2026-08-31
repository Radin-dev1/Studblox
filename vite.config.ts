import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({command,mode})=>({
  plugins:[react()],
  // GitHub Pages serves project sites below /Studblox/.
  // Keep / during local development so the dev server remains simple.
  base:mode==='desktop'?'./':command==='build'?'/Studblox/':'/',
  build:{rollupOptions:{input:{index:'app.html'}}}
}));
