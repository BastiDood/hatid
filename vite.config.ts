import { defineConfig } from 'vitest/config';
import { sveltekit, vitePreprocess } from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [sveltekit()],
    preprocess: [vitePreprocess()],
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}'],
    },
});
