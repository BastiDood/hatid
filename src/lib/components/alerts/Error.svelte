<script lang="ts">
    import { ExclamationCircleIcon as Error } from '@krowten/svelte-heroicons';
</script>

<div class="alert variant-soft-error">
    <Error class="h-8 w-8" />
    <slot />
</div>
