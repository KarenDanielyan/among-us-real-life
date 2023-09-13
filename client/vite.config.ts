import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    
    'process.env.REACT_APP_redirect_link': process.env.REACT_APP_redirect_link,
    'process.env.REACT_APP_IP': JSON.stringify(process.env.REACT_APP_IP),
    'process.env.socket': JSON.stringify(process.env.socket),
    'process.env.GOOGLE_REDIRECT_URI': JSON.stringify(process.env.GOOGLE_REDIRECT_URI),
    'process.env.REDIRECT_URI': JSON.stringify(process.env.REDIRECT_URI),
    'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
  },
})
