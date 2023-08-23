<script lang="ts">
    import Inbox from '../Inbox.svelte';
    import OpenTicket from '../OpenTicket.svelte';
    import type { PageServerData } from './$types';
    import Warning from '$lib/components/alerts/Warning.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ tickets } = data);
</script>

<OpenTicket />

{#if tickets.length === 0}
    <Warning>
        <span>You have not yet opened any tickets.</span>
    </Warning>
{:else}
    <Inbox tickets="{tickets}" />
{/if}
