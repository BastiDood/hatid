// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
    interface Locals {
        user?: string;
    }

    // interface PageData {}
    // interface Error {}
    // interface Platform {}
}

declare module 'svelte-autosize' {
    import type { Action } from 'svelte/action';
    export default Action<HTMLElement>;
}
