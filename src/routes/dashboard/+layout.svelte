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
    } from '@skeletonlabs/skeleton';
    import BuildingOffice from '@krowten/svelte-heroicons/icons/BuildingOfficeIcon.svelte';
    import CreateDepartment from './CreateDepartment.svelte';
    import CreateLabel from './CreateLabel.svelte';
    import CreatePriority from './CreatePriority.svelte';
    import Inbox from '@krowten/svelte-heroicons/icons/InboxIcon.svelte';
    import type { LayoutServerData } from './$types';
    import Logo from '$lib/icons/logo.svelte';
    import Logout from '@krowten/svelte-heroicons/icons/ArrowRightOnRectangleIcon.svelte';
    import QueueList from '@krowten/svelte-heroicons/icons/QueueListIcon.svelte';
    import Tag from '@krowten/svelte-heroicons/icons/TagIcon.svelte';
    import Users from '@krowten/svelte-heroicons/icons/UsersIcon.svelte';
    import { goto } from '$app/navigation';
    import { logout } from '$lib/api/session';
    import { page } from '$app/stores';

    $: ({ pathname } = $page.url);

    // eslint-disable-next-line init-declarations
    export let data: LayoutServerData;
    $: ({ name, email, picture } = data);

    async function exit() {
        const path = (await logout()) ? '/' : '/auth/login';
        await goto(path);
    }

    const components = {
        createLabel: { ref: CreateLabel },
        createPriority: { ref: CreatePriority },
        createDept: { ref: CreateDepartment },
    };
</script>

<Toast />
<Modal components="{components}" />
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
        <!-- TODO: Use `data.admin` to remove this for non-admin people. -->
        <AppRailAnchor
            href="/dashboard/priority"
            selected="{pathname.startsWith('/dashboard/priority')}"
        >
            <QueueList slot="lead" class="h-8 w-8" solid />
            <span>Priorities</span>
        </AppRailAnchor>
        <AppRailAnchor href="/dashboard/label" selected="{pathname.startsWith('/dashboard/label')}">
            <Tag slot="lead" class="h-8 w-8" solid />
            <span>Labels</span>
        </AppRailAnchor>
        <AppRailAnchor href="/dashboard/user" selected="{pathname.startsWith('/dashboard/user')}">
            <Users slot="lead" class="h-8 w-8" solid />
            <span>Users</span>
        </AppRailAnchor>
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
