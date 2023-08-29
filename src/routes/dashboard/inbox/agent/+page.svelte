<script lang="ts">
    import Inbox from '../Inbox.svelte';
    import OpenTicket from '../OpenTicket.svelte';
    import type { PageServerData } from './$types';
    import Success from '$lib/components/alerts/Success.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ tickets } = data);
</script>

<OpenTicket />

{#if tickets.length === 0}
    <Success>
        <span>There are currently no pending open tickets assigned to you. Great work!</span>
    </Success>
{:else}
    <Inbox {tickets} />
{/if}
