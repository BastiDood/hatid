<script lang="ts">
    import Departments from './Departments.svelte';
    import FormTrigger from '../FormTrigger.svelte';
    import type { PageServerData } from './$types';
    import Warning from '$lib/components/alerts/Warning.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ depts } = data);
</script>

<FormTrigger component="createDept" label="Create New Department" />

{#if depts.length === 0}
    <Warning>
        <span>There are currently no departments set up for this system.</span>
    </Warning>
{:else}
    <Departments depts="{depts}" />
{/if}
