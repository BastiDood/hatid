<script lang="ts">
    import { ArrowUturnLeftIcon as Back } from '@krowten/svelte-heroicons';
    import type { PageServerData } from './$types';
    import Users from '$lib/components/Users.svelte';
    import Warning from '$lib/components/Alerts/Warning.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ users } = data);
</script>

<a href="/dashboard/dept" class="btn variant-filled-primary m-auto">
    <Back class="h-4 w-4" />
    <span>Go Back</span>
</a>
{#if users.length === 0}
    <Warning>
        <span>There are no agents in this department.</span>
    </Warning>
{:else}
    <Users users="{users}" />
{/if}
