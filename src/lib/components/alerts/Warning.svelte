<script lang="ts">
    import { ExclamationTriangleIcon as Warning } from '@krowten/svelte-heroicons';
</script>

<div class="alert variant-soft-warning">
    <Warning class="h-8 w-8" />
    <slot />
</div>
