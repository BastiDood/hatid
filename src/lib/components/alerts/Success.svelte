<script lang="ts">
    import { CheckCircleIcon as Success } from '@krowten/svelte-heroicons';
</script>

<div class="alert variant-soft-success flex flex-row items-center gap-x-2">
    <Success class="h-8 w-8" />
    <div class="!mt-0 contents">
        <slot />
    </div>
</div>
