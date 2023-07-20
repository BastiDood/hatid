<script>
    import { AppBar, AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
    <AppBar slot="header">Header</AppBar>
	<svelte:fragment slot="sidebarLeft">Sidebar Left</svelte:fragment>
    <svelte:fragment slot="footer"></svelte:fragment>
    <p>Hello world!</p>
</AppShell>
