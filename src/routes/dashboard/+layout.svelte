<script lang="ts">
    import {
        AppBar,
        AppRail,
        AppRailAnchor,
        AppShell,
        Avatar,
        LightSwitch,
        Modal,
    } from '@skeletonlabs/skeleton';
    import BuildingOffice from '@krowten/svelte-heroicons/icons/BuildingOfficeIcon.svelte';
    import CreateDepartment from './CreateDepartment.svelte';
    import CreateLabel from './CreateLabel.svelte';
    import CreatePriority from './CreatePriority.svelte';
    import CreateTicket from './CreateTicket.svelte';
    import Inbox from '@krowten/svelte-heroicons/icons/InboxIcon.svelte';
    import type { LayoutServerData } from './$types';
    import Logout from '@krowten/svelte-heroicons/icons/ArrowRightOnRectangleIcon.svelte';
    import QueueList from '@krowten/svelte-heroicons/icons/QueueListIcon.svelte';
    import Tag from '@krowten/svelte-heroicons/icons/TagIcon.svelte';
    import logo from '$lib/images/HATiD.png';

    // eslint-disable-next-line init-declarations
    export let data: LayoutServerData;
    $: ({ name, email, picture } = data);

    const components = {
        createLabel: { ref: CreateLabel },
        createPriority: { ref: CreatePriority },
        createDept: { ref: CreateDepartment },
        createTicket: { ref: CreateTicket },
    };
</script>

<Modal components="{components}" />
<AppShell>
    <AppBar slot="header" background="bg-primary-active-token">
        <a href="/" slot="lead"><img src="{logo}" alt="HATiD" class="h-8" /></a>
        <svelte:fragment slot="trail">
            <LightSwitch />
            <a href="mailto:{email}">{name}</a>
            <Avatar src="{picture}" class="w-8" />
        </svelte:fragment>
    </AppBar>
    <AppRail slot="sidebarLeft" regionTrail="mb-4">
        <AppRailAnchor href="/dashboard/inbox">
            <Inbox slot="lead" class="h-8 w-8" solid />
            <span>Inbox</span>
        </AppRailAnchor>
        <!-- TODO: Use `data.admin` to remove this for non-admin people. -->
        <AppRailAnchor href="/dashboard/priority">
            <QueueList slot="lead" class="h-8 w-8" solid />
            <span>Priorities</span>
        </AppRailAnchor>
        <AppRailAnchor href="/dashboard/label">
            <Tag slot="lead" class="h-8 w-8" solid />
            <span>Labels</span>
        </AppRailAnchor>
        <AppRailAnchor href="/dashboard/dept">
            <BuildingOffice slot="lead" class="h-8 w-8" solid />
            <span>Departments</span>
        </AppRailAnchor>
        <!-- TODO: Use the logout endpoint here. -->
        <button
            type="button"
            slot="trail"
            class="flex w-full appearance-none flex-col items-center justify-center gap-1"
        >
            <Logout class="block h-8 w-8" />
            <span class="app-rail-label text-xs font-bold">Logout</span>
        </button>
    </AppRail>
    <div class="m-10 flex flex-col space-y-4">
        <slot />
    </div>
</AppShell>
