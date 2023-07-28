<script lang="ts">
    import type { PageServerData } from './$types';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
</script>

{#if data.user === null}
    <a href="/auth/login" class="btn variant-filled">Sign in with Google</a>
{:else}
    <a href="/dashboard" class="btn variant-filled">Go to Dashboard</a>
{/if}
