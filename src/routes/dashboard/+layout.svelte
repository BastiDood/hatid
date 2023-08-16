<script lang="ts">
    import {
        AppBar,
        AppRail,
        AppRailAnchor,
        AppShell,
        Avatar,
        LightSwitch,
    } from '@skeletonlabs/skeleton';
    import Home from '@krowten/svelte-heroicons/icons/HomeIcon.svelte';
    import type { LayoutServerData } from './$types';
    import Logout from '@krowten/svelte-heroicons/icons/ArrowRightOnRectangleIcon.svelte';
    import logo from '$lib/images/HATiD.png';

    // eslint-disable-next-line init-declarations
    export let data: LayoutServerData;
    $: ({ name, email, picture } = data);
</script>

<AppShell>
    <AppBar slot="header" background="bg-primary-active-token">
        <a href="/" slot="lead"><img src="{logo}" alt="HATiD" class="h-8" /></a>
        <svelte:fragment slot="trail">
            <LightSwitch />
            <a href="mailto:{email}">{name}</a>
            <Avatar src="{picture}" class="w-8" />
        </svelte:fragment>
    </AppBar>
    <slot />
    <AppRail slot="sidebarLeft" width="w-24" regionTrail="mb-4">
        <AppRailAnchor href="/dashboard">
            <Home slot="lead" class="h-8 w-8" solid />
            <span>Dashboard</span>
        </AppRailAnchor>
        <!-- TODO: Use the logout endpoint here. -->
        <button
            type="button"
            slot="trail"
            class="flex w-full appearance-none flex-col items-center justify-center gap-1"
        >
            <Logout class="block h-8 w-8" />
            <span>Logout</span>
        </button>
    </AppRail>
</AppShell>
