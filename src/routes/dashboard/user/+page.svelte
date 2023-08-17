<script lang="ts">
    import type { PageServerData } from './$types';
    import Users from '$lib/components/Users.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ users } = data);
</script>

<Users users="{users}" />
