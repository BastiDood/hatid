<script lang="ts">
    import { Tab, TabGroup } from '@skeletonlabs/skeleton';
    import Agents from './Agents.svelte';
    import Users from './Users.svelte';

    let activeTab: number = 0;
</script>

<TabGroup>
    <Tab bind:group="{activeTab}" name="Users" value="{0}">Users</Tab>
    <Tab bind:group="{activeTab}" name="Agents" value="{1}">Agents</Tab>

    <svelte:fragment slot="panel">
        {#if activeTab === 0}
            <Users />
        {:else if activeTab === 1}
            <Agents />
        {/if}
    </svelte:fragment>
</TabGroup>
