<script lang="ts">
    import { ArrowDownIcon as Demote, ArrowUpIcon as Promote } from '@krowten/svelte-heroicons';
    import Error from '$lib/components/alerts/Error.svelte';
    import List from './List.svelte';
    import type { PageServerData } from './$types';
    import type { User } from '$lib/model/user';
    import Warning from '$lib/components/alerts/Warning.svelte';
    import { getToastStore } from '@skeletonlabs/skeleton';
    import { invalidateAll } from '$app/navigation';
    import { setAdmin } from '$lib/api/user';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ uid, users, admins } = data);

    const toastStore = getToastStore();

    async function action(admin: User['admin'], { detail }: CustomEvent<User['user_id']>) {
        const result = await setAdmin(detail, admin);
        await invalidateAll();
        if (result === null)
            toastStore.trigger({
                message: 'The user does not exist. Please report this bug.',
                background: 'variant-filled-error',
            });
        else if (result) {
            const partial = admin ? 'promoted' : 'demoted';
            toastStore.trigger({
                message: `Successfully ${partial} the user.`,
                background: 'variant-filled-success',
            });
        } else
            toastStore.trigger({
                message: 'Action already taken. Page was refreshed.',
                background: 'variant-filled-warning',
            });
    }
</script>

<List
    heading="Admins"
    uid="{uid}"
    users="{admins}"
    variant="variant-ghost-error"
    on:button="{action.bind(null, false)}"
>
    <Error slot="none">
        <span>Your system currently has no administrators. This is likely a bug.</span>
    </Error>
    <Demote slot="icon" class="h-4 w-4" />
</List>

<List
    heading="Users"
    uid="{uid}"
    users="{users}"
    variant="variant-ghost-success"
    on:button="{action.bind(null, true)}"
>
    <Warning slot="none">
        <span>Interestingly, there are no non-admin users in the system.</span>
    </Warning>
    <Promote slot="icon" class="h-4 w-4" />
</List>
