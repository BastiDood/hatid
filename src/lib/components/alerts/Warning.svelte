<script lang="ts">
    import { ExclamationTriangleIcon as Warning } from '@krowten/svelte-heroicons';
</script>

<div class="alert variant-soft-warning flex-row gap-x-2 items-center">
    <Warning class="h-8 w-8" />
    <div class="!mt-0">
        <slot />
    </div>
</div>
