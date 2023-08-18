<script lang="ts">
    import { PlusIcon as Plus } from '@krowten/svelte-heroicons';
    import { modalStore } from '@skeletonlabs/skeleton';

    // eslint-disable-next-line init-declarations
    export let component: string;
    // eslint-disable-next-line init-declarations
    export let label: string;

    function triggerModalComponent() {
        modalStore.trigger({
            type: 'component',
            component,
        });
    }
</script>

<button
    type="submit"
    class="btn variant-filled-secondary m-auto"
    on:click="{triggerModalComponent}"
>
    <Plus class="h-4 w-4" />
    <span>{label}</span>
</button>
