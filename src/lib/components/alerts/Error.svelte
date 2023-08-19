<script lang="ts">
    import { ExclamationCircleIcon as Error } from '@krowten/svelte-heroicons';
</script>

<div class="alert variant-soft-error flex flex-row items-center gap-x-2">
    <Error class="h-8 w-8" />
    <div class="!mt-0">
        <slot />
    </div>
</div>
