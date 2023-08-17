<script lang="ts">
    import { Tab, TabGroup } from '@skeletonlabs/skeleton';
    import Agents from './Agents.svelte';
    import type { PageServerData } from './$types';
    import Users from './Users.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ users } = data);

    // eslint-disable-next-line init-declarations
    let activeTab = 0;
</script>

<TabGroup>
    <Tab bind:group="{activeTab}" value="{0}" name="users" selected>Users</Tab>
    <Tab bind:group="{activeTab}" value="{1}" name="agents">Agents</Tab>
    <svelte:fragment slot="panel">
        {#if activeTab === 0}
            <Users users="{users}" />
        {:else if activeTab === 1}
            <Agents />
        {/if}
    </svelte:fragment>
</TabGroup>
