import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from 'vite-plugin-react-mdx'

export default defineConfig({
  plugins: [react(), mdx()],
  base: process.env.NODE_ENV === 'production' ? ' /obsidian-public-notes/ ' : '/'
})
