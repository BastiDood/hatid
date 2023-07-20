<script>
    import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
    import '@skeletonlabs/skeleton/styles/skeleton.css';
    import '../app.css';

    import { AppBar, AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
    <AppBar slot="header">Header</AppBar>
	<svelte:fragment slot="sidebarLeft">Sidebar Left</svelte:fragment>
    <svelte:fragment slot="footer"></svelte:fragment>
    <slot />
</AppShell>
