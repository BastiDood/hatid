<script lang="ts">
    import { PlusIcon as Plus } from '@krowten/svelte-heroicons';
    import type { PageServerData } from './$types';
    import UserInbox from './UserInbox.svelte';
    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ tickets } = data);
</script>

<a href="/dashboard/ticket" class="btn variant-filled-secondary m-auto">
    <Plus class="h-4 w-4" />
    <span>Open a Ticket</span>
</a>

<UserInbox tickets="{tickets}" />
