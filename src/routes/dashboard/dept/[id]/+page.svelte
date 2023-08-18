<script lang="ts">
    import Alert from '$lib/components/Alert.svelte';
    import { ArrowUturnLeftIcon as Back } from '@krowten/svelte-heroicons';
    import type { PageServerData } from './$types';
    import Users from '$lib/components/Users.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ users } = data);
</script>

<a href="/dashboard/dept" class="btn variant-filled-primary m-auto">
    <Back class="h-4 w-4" />
    <span>Go Back</span>
</a>
{#if users.length === 0}
    <Alert variant="soft-warning">
        <span>There are no agents in this department.</span>
    </Alert>
{:else}
    <Users users="{users}" />
{/if}
