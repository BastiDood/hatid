<script lang="ts">
    import Fa from 'svelte-fa';
    import Logo from '$lib/icons/logo.svelte';
    import type { PageServerData } from './$types';
    import { faGoogle } from '@fortawesome/free-brands-svg-icons';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ user } = data);
</script>

<Logo />

{#if user === null}
    <a href="/auth/login" class="btn variant-filled-primary">
        <Fa icon="{faGoogle}" />
        <span>Sign in with Google</span>
    </a>
{:else}
    <a href="/dashboard" class="btn variant-filled-primary"> Go to Dashboard </a>
{/if}
