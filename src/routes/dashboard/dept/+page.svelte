<script lang="ts">
    import type { PageServerData } from './$types';
    import Departments from './Departments.svelte';
    import FormTrigger from '../FormTrigger.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ depts } = data);
</script>

<FormTrigger component="createDept" label="Create New Department" />
<Departments depts="{depts}" />
