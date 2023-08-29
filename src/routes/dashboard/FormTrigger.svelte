<script lang="ts">
    import { PlusIcon as Plus } from '@krowten/svelte-heroicons';
    import { getModalStore } from '@skeletonlabs/skeleton';

    // eslint-disable-next-line init-declarations
    export let component: string;
    // eslint-disable-next-line init-declarations
    export let label: string;

    const modalStore = getModalStore();

    function triggerModalComponent() {
        modalStore.trigger({
            type: 'component',
            component,
        });
    }
</script>

<button
    type="submit"
    class="variant-filled-secondary btn m-auto"
    on:click="{triggerModalComponent}"
>
    <Plus class="h-4 w-4" />
    <span>{label}</span>
</button>
