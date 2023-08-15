<script lang="ts">
    import { AppBar, AppShell, Avatar } from '@skeletonlabs/skeleton';
    import Edit from 'svelte-material-icons/FileEditOutline.svelte';
    import Home from 'svelte-material-icons/Home.svelte';
    import type { LayoutServerData } from './$types';
    import Logout from 'svelte-material-icons/Logout.svelte';
    import Settings from 'svelte-material-icons/Cog.svelte';
    import Ticket from 'svelte-material-icons/TicketConfirmationOutline.svelte';
    import User from 'svelte-material-icons/AccountMultipleOutline.svelte';
    import logo from '$lib/images/HATiD.png';

    // eslint-disable-next-line init-declarations
    export let data: LayoutServerData;
    $: ({ name, email, picture } = data);
</script>

<AppShell>
    <AppBar slot="header">
        <svelte:fragment slot="lead"
            ><span class="h3 p-2">
                <a href="/"><img src="{logo}" alt="HATiD" class="h-10" /></a>
            </span></svelte:fragment
        >
        <svelte:fragment slot="trail" />
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
                        <Home />
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
                        <Ticket />
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
                        <User />
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
                        <Edit />
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
                        <Settings />
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
                        <Logout />
                        <span>Log out</span>
                    </a>
                </div>
            </div>
        </aside>
    </svelte:fragment>
    <slot />

    <svelte:fragment slot="footer" />
</AppShell>
