<script lang="ts">
    import {
        ArrowUturnLeftIcon as Back,
        ExclamationTriangleIcon as Warning,
    } from '@krowten/svelte-heroicons';
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
    <div class="alert variant-soft-warning">
        <Warning class="h-8 w-8" />
        <span>There are no agents in this department.</span>
    </div>
{:else}
    <Users users="{users}" />
{/if}
