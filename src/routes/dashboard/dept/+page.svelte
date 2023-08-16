<script lang="ts">
    import FormTrigger from '../FormTrigger.svelte';
    import Departments from './Departments.svelte';
    import type { PageServerData } from './$types';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ depts } = data);
</script>

<FormTrigger component="createDept" label="Create New Department" />
<Departments {depts} />
