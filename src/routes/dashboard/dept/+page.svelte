<script lang="ts">
    import Departments from './Departments.svelte';
    import FormTrigger from '../FormTrigger.svelte';
    import type { PageServerData } from './$types';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ depts } = data);
</script>

<FormTrigger component="createDept" label="Create New Department" />
<Departments depts="{depts}" />
