<script lang="ts">
    import { AppBar, AppShell, Avatar } from '@skeletonlabs/skeleton';
    import type { LayoutServerData } from './$types';

    // eslint-disable-next-line init-declarations
    export let data: LayoutServerData;
</script>

<AppShell>
    <AppBar slot="header">
        <Avatar src={data.picture} />
    </AppBar>
	<svelte:fragment slot="sidebarLeft">Sidebar Left</svelte:fragment>
    <svelte:fragment slot="footer"></svelte:fragment>
    <slot />
</AppShell>
