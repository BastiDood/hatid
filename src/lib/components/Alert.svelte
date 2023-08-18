<script lang="ts">
    import {
        ExclamationCircleIcon as Error,
        ExclamationTriangleIcon as Warning,
    } from '@krowten/svelte-heroicons';

    export let variant = 'soft-warning';
</script>

<div class="alert variant-{variant}">
    {#if variant.includes('warning')}
        <Warning class="h-8 w-8" />
    {:else if variant.includes('error')}
        <Error class="h-8 w-8" />
    {/if}
    <slot />
</div>
