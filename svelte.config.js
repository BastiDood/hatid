import node from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
export default {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors.
    preprocess: vitePreprocess(),
    kit: { adapter: node({ polyfill: false }) },
};
