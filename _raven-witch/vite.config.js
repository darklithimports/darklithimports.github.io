import { defineConfig } from 'vite';

// caminhos relativos: o build funciona em qualquer pasta (GitHub Pages serve o site em /<repo>/)
export default defineConfig({ base: './' });
