import { defineConfig } from 'vitest/config';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [sveltekit(), purgeCss()],
    test: { include: ['src/**/*.{test,spec}.{js,ts}'] },
});
