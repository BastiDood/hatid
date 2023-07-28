<script lang="ts">
    import { AppBar, AppShell, Avatar } from '@skeletonlabs/skeleton';
    import type { LayoutServerData } from './$types';

    // eslint-disable-next-line init-declarations
    export let data: LayoutServerData;

    $: ({ name, email, picture } = data);
</script>

<AppShell>
    <AppBar slot="header">
        <Avatar src={picture} width="w-8" slot="lead" />
        {name} &lt;{email}&gt;
    </AppBar>
	<svelte:fragment slot="sidebarLeft">Sidebar Left</svelte:fragment>
    <svelte:fragment slot="footer"></svelte:fragment>
    <slot />
</AppShell>
