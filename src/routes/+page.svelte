<script>
    import { AppBar, AppShell, Drawer, drawerStore } from '@skeletonlabs/skeleton';
</script>

<Drawer />
<AppShell>
    <AppBar slot="header">Header</AppBar>
	<svelte:fragment slot="sidebarLeft">Sidebar Left</svelte:fragment>
    <svelte:fragment slot="footer"></svelte:fragment>
    <p>Hello world!</p>
</AppShell>
