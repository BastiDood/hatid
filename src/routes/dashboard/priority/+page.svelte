<script lang="ts">
    import type { PageServerData } from './$types';
    import Plus from '@krowten/svelte-heroicons/icons/PlusIcon.svelte';
    import Priorities from '$lib/components/Priorities.svelte';
    import { modalStore } from '@skeletonlabs/skeleton';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ priorities } = data);

    function onClick() {
        modalStore.trigger({
            type: 'component',
            component: 'createPriority',
        });
    }
</script>

<button type="submit" class="m-auto btn variant-filled-primary" on:click="{onClick}">
    <Plus class="h-4 w-4" />
    <span>Create New Priority</span>
</button>
<Priorities priorities="{priorities}" />
