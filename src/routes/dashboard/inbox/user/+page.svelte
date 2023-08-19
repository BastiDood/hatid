<script lang="ts">
    import Inbox from '../Inbox.svelte';
    import OpenTicket from '../OpenTicket.svelte';
    import type { PageServerData } from './$types';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ tickets } = data);
</script>

<OpenTicket />
<Inbox tickets="{tickets}" />
