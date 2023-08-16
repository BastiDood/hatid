<script lang="ts">
    import { AppBar, AppShell, Avatar, LightSwitch } from '@skeletonlabs/skeleton';
    import Edit from '@krowten/svelte-heroicons/icons/PencilSquareIcon.svelte';
    import Home from '@krowten/svelte-heroicons/icons/HomeIcon.svelte';
    import type { LayoutServerData } from './$types';
    import Logout from '@krowten/svelte-heroicons/icons/ArrowRightOnRectangleIcon.svelte';
    import Settings from '@krowten/svelte-heroicons/icons/Cog6ToothIcon.svelte';
    import Ticket from '@krowten/svelte-heroicons/icons/TicketIcon.svelte';
    import User from '@krowten/svelte-heroicons/icons/UsersIcon.svelte';
    import logo from '$lib/images/HATiD.png';

    // eslint-disable-next-line init-declarations
    export let data: LayoutServerData;
    $: ({ name, email, picture } = data);
</script>

<AppShell>
    <AppBar slot="header" background="bg-primary-400-500-token">
        <a href="/" slot="lead"><img src="{logo}" alt="HATiD" class="h-8" /></a>
        <LightSwitch slot="trail" />
    </AppBar>
    <svelte:fragment slot="sidebarLeft">
        <aside class="flex h-full w-60 flex-col items-center space-y-7 pb-2 pt-5">
            <br />
            <Avatar src="{picture}" width="w-100" slot="lead" class="rounded-full" />
            <span class="flex text-center">{name}<br />{email}</span>
            <!-- menu items -->
            <div class="flex w-full flex-col gap-y-1 pr-3">
                <div class="pl-4 uppercase">Menu</div>

                <div class="group flex w-full select-none items-center gap-x-1.5">
                    <div class="relative h-8 w-1 overflow-hidden rounded-xl">
                        <div class="absolute left-0 top-0 h-[102%] w-full translate-y-0"></div>
                    </div>
                    <a
                        class="flex w-full items-center space-x-2 self-stretch rounded pl-2"
                        href="/dashboard"
                    >
                        <Home class="h-4 w-4" solid />
                        <span>Dashboard</span>
                    </a>
                </div>
                <div class="group flex w-full select-none items-center gap-x-1.5">
                    <div class="relative h-8 w-1 overflow-hidden rounded-xl">
                        <div class="absolute left-0 top-0 h-[102%] w-full translate-y-full"></div>
                    </div>
                    <a
                        class="flex w-full items-center space-x-2 self-stretch rounded pl-2"
                        href="/dashboard"
                    >
                        <Ticket class="h-4 w-4" solid />
                        <span>Tickets</span>
                    </a>
                </div>
                <div class="group flex w-full select-none items-center gap-x-1.5">
                    <div class="relative h-8 w-1 overflow-hidden rounded-xl">
                        <div class="absolute left-0 top-0 h-[102%] w-full translate-y-full"></div>
                    </div>
                    <a
                        class="flex w-full items-center space-x-2 self-stretch rounded pl-2"
                        href="/dashboard"
                    >
                        <User class="h-4 w-4" />
                        <span class="font-QuicksandMedium">Users</span>
                    </a>
                </div>
            </div>

            <!-- menu items -->
            <div class="flex w-full flex-col gap-y-1 pr-3">
                <div class="pl-4 uppercase">Profile</div>

                <div class="group flex w-full select-none items-center gap-x-1.5">
                    <div class="relative h-8 w-1 overflow-hidden rounded-xl">
                        <div class="absolute left-0 top-0 h-[102%] w-full translate-y-full"></div>
                    </div>
                    <a
                        class="flex w-full items-center space-x-2 self-stretch rounded pl-2"
                        href="/dashboard"
                    >
                        <Edit class="h-4 w-4" solid />
                        <span>Edit profile</span>
                    </a>
                </div>

                <div class="group flex w-full select-none items-center gap-x-1.5">
                    <div class="relative h-8 w-1 overflow-hidden rounded-xl">
                        <div class="absolute left-0 top-0 h-[102%] w-full translate-y-full"></div>
                    </div>
                    <a
                        class="flex w-full items-center space-x-2 self-stretch rounded pl-2"
                        href="/dashboard"
                    >
                        <Settings class="h-4 w-4" solid />
                        <span>Settings</span>
                    </a>
                </div>

                <div class="group flex w-full select-none items-center gap-x-1.5">
                    <div class="relative h-8 w-1 overflow-hidden rounded-xl">
                        <div class="absolute left-0 top-0 h-[102%] w-full translate-y-full"></div>
                    </div>
                    <a
                        class="flex w-full items-center space-x-2 self-stretch rounded pl-2 text-sm"
                        href="/"
                    >
                        <Logout class="h-4 w-4" />
                        <span>Log out</span>
                    </a>
                </div>
            </div>
        </aside>
    </svelte:fragment>
    <slot />

    <svelte:fragment slot="footer" />
</AppShell>
