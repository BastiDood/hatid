<script lang="ts">
    import Error from '$lib/components/alerts/Error.svelte';
    import FormTrigger from '../FormTrigger.svelte';
    import Labels from './Labels.svelte';
    import type { PageServerData } from './$types';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ labels } = data);
</script>

<FormTrigger component="createLabel" label="Create New Label" />

{#if labels.length === 0}
    <Error>
        <span
            >There are currently no labels set up for this system. Until then, no tickets may be
            opened.</span
        >
    </Error>
{:else}
    <Labels labels="{labels}" />
{/if}
