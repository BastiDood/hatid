<script lang="ts">
    import { ArrowDownIcon as Demote, ArrowUpIcon as Promote } from '@krowten/svelte-heroicons';
    import List from './List.svelte';
    import Error from '$lib/components/alerts/Error.svelte';
    import type { PageServerData } from './$types';
    import Warning from '$lib/components/alerts/Warning.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ uid, users, admins } = data);
</script>

<List heading="Admins" uid="{uid}" users="{admins}">
    <Error slot="none">
        <span>Your system currently has no administrators. This is likely a bug.</span>
    </Error>
    <Demote slot="icon" class="h-4 w-4" />
</List>

<List heading="Users" uid="{uid}" users="{users}">
    <Warning slot="none">
        <span>Interestingly, there are no non-admin users in the system.</span>
    </Warning>
    <Promote slot="icon" class="h-4 w-4" />
</List>
