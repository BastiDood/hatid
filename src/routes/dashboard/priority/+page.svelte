<script lang="ts">
    import FormTrigger from '../FormTrigger.svelte';
    import type { PageServerData } from './$types';
    import Priorities from './Priorities.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ priorities } = data);
</script>

<FormTrigger component="createPriority" label="Create New Priority" />
<Priorities priorities="{priorities}" />
