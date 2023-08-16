<script lang="ts">
    import Plus from '@krowten/svelte-heroicons/icons/PlusIcon.svelte';
    import { modalStore } from '@skeletonlabs/skeleton';

    export let component: string;
    export let label: string;

    function triggerModalComponent() {
        modalStore.trigger({
            type: 'component',
            component,
        });
    }
</script>

<button type="submit" class="btn variant-filled-primary m-auto" on:click="{triggerModalComponent}">
    <Plus class="h-4 w-4" />
    <span>{label}</span>
</button>
