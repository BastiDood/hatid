<script lang="ts">
    import FormTrigger from '../FormTrigger.svelte';
    import type { PageServerData } from './$types';
    import Priorities from './Priorities.svelte';
    import Warning from '$lib/components/alerts/Warning.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ priorities } = data);
</script>

<FormTrigger component="createPriority" label="Create New Priority" />

{#if priorities.length === 0}
    <Warning>
        <span>There are currently no priority levels set up for this system.</span>
    </Warning>
{:else}
    <Priorities priorities="{priorities}" />
{/if}
