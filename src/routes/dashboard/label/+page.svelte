<script lang="ts">
    import FormTrigger from '../FormTrigger.svelte';
    import Labels from './Labels.svelte';
    import type { PageServerData } from './$types';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ labels } = data);
</script>

<FormTrigger component="createLabel" label="Create New Label" />
<Labels labels="{labels}" />
