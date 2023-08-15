<script lang="ts">
    import type { PageServerData } from './$types';
    import logo from '$lib/images/HATiD.png';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;

    $: ({ user } = data);
</script>

<img src="{logo}" alt="HATiD spelled with a ticket icon to emulate the letter H" />

{#if user === null}
    <a href="/auth/login" class="btn variant-filled">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"
                fill-rule="evenodd"
                clip-rule="evenodd"></path>
        </svg>
        Sign in with Google
    </a>
{:else}
    <header class="bold h4 card-header flex items-center justify-center">ALREADY LOGGED IN</header>
    <section class="p-4"></section>
    <footer class="card-footer flex items-center justify-center">
        <a
            href="/dashboard"
            class="btn variant-filled mb-2 flex w-full rounded px-6 py-2.5 text-xs"
        >
            Go to Dashboard
        </a>
    </footer>
{/if}
