<script lang="ts">
    import Google from 'svelte-material-icons/Google.svelte';
    import type { PageServerData } from './$types';
    import logo from '$lib/images/HATiD.png';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;

    $: ({ user } = data);
</script>

<img src="{logo}" alt="HATiD spelled with a ticket icon to emulate the letter H" />

{#if user === null}
    <a href="/auth/login" class="btn variant-filled">
        <Google />
        <span>Sign in with Google</span>
    </a>
{:else}
    <a href="/dashboard" class="btn variant-filled"> Go to Dashboard </a>
{/if}
