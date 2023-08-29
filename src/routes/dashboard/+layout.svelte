<script lang="ts">
    import {
        AppBar,
        AppRail,
        AppRailAnchor,
        AppShell,
        Avatar,
        LightSwitch,
        Modal,
        Toast,
        initializeStores,
    } from '@skeletonlabs/skeleton';
    import {
        BuildingOfficeIcon as BuildingOffice,
        InboxIcon as Inbox,
        ArrowRightOnRectangleIcon as Logout,
        QueueListIcon as QueueList,
        TagIcon as Tag,
        UsersIcon as Users,
    } from '@krowten/svelte-heroicons';
    import CreateDepartment from './CreateDepartment.svelte';
    import CreateLabel from './CreateLabel.svelte';
    import CreatePriority from './CreatePriority.svelte';
    import type { LayoutServerData } from './$types';
    import Logo from '$lib/icons/logo.svelte';
    import { goto } from '$app/navigation';
    import { logout } from '$lib/api/session';
    import { page } from '$app/stores';

    // https://github.com/skeletonlabs/skeleton/wiki/SvelteKit-SSR-Warning
    initializeStores();

    $: ({ pathname } = $page.url);

    // eslint-disable-next-line init-declarations
    export let data: LayoutServerData;
    $: ({ name, email, picture, admin } = data);

    async function exit() {
        // TODO: Somehow make use of the return value.
        await logout();
        await goto('/');
    }

    const components = {
        createLabel: { ref: CreateLabel },
        createPriority: { ref: CreatePriority },
        createDept: { ref: CreateDepartment },
    };
</script>

<Toast />
<Modal {components} />
<AppShell>
    <AppBar slot="header" shadow="shadow-xl">
        <a href="/" slot="lead"><Logo /></a>
        <svelte:fragment slot="trail">
            <LightSwitch />
            <a href="mailto:{email}">{name}</a>
            <Avatar src="{picture}" class="w-8" />
        </svelte:fragment>
    </AppBar>
    <AppRail slot="sidebarLeft" width="w-24">
        <AppRailAnchor href="/dashboard/inbox" selected="{pathname.startsWith('/dashboard/inbox')}">
            <Inbox slot="lead" class="h-8 w-8" solid />
            <span>Inbox</span>
        </AppRailAnchor>
        {#if admin}
            <AppRailAnchor
                href="/dashboard/priority"
                selected="{pathname.startsWith('/dashboard/priority')}"
            >
                <QueueList slot="lead" class="h-8 w-8" solid />
                <span>Priorities</span>
            </AppRailAnchor>
            <AppRailAnchor
                href="/dashboard/label"
                selected="{pathname.startsWith('/dashboard/label')}"
            >
                <Tag slot="lead" class="h-8 w-8" solid />
                <span>Labels</span>
            </AppRailAnchor>
            <AppRailAnchor
                href="/dashboard/user"
                selected="{pathname.startsWith('/dashboard/user')}"
            >
                <Users slot="lead" class="h-8 w-8" solid />
                <span>Users</span>
            </AppRailAnchor>
        {/if}
        <!-- TODO: Check against department head permissions. -->
        <AppRailAnchor href="/dashboard/dept" selected="{pathname.startsWith('/dashboard/dept')}">
            <BuildingOffice slot="lead" class="h-8 w-8" solid />
            <span>Departments</span>
        </AppRailAnchor>
        <button
            type="button"
            slot="trail"
            class="flex aspect-square w-full appearance-none flex-col items-center justify-center gap-1 hover:bg-error-hover-token active:bg-error-active-token"
            on:click="{exit}"
        >
            <Logout class="block h-8 w-8" />
            <span class="app-rail-label text-xs font-bold">Logout</span>
        </button>
    </AppRail>
    <div class="m-10 flex flex-col space-y-4">
        <slot />
    </div>
</AppShell>
