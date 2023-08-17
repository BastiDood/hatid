<script lang="ts">
    import { Tab, TabGroup } from '@skeletonlabs/skeleton';
    import Agents from './Agents.svelte';
    import type { PageServerData } from './$types';
    import Users from './Users.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ users } = data);

    let activeTab: number = 0;
</script>

<TabGroup>
    <Tab bind:group="{activeTab}" name="Users" value="{0}">Users</Tab>
    <Tab bind:group="{activeTab}" name="Agents" value="{1}">Agents</Tab>

    <svelte:fragment slot="panel">
        {#if activeTab === 0}
            <h2 class="h3 font-bold">Users Directory</h2>
            <Users users="{users}" />
        {:else if activeTab === 1}
            <h2 class="h3 font-bold">Agents Directory</h2>
            <Agents />
        {/if}
    </svelte:fragment>
</TabGroup>
