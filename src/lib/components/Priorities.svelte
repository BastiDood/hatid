<script lang="ts">
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    // import { edit, editTitle } from '$lib/api/priority';
    const priorities = [
        { title: 'PRIORITY TITLE 1', prio: 'PRIORITY' },
        { title: 'PRIORITY TITLE 2', prio: 'PRIORITY' },
    ];
    let editablePriorityTitle = true;
    let editablePriority = true;
    function priorityTitle() {
        editablePriorityTitle = !editablePriorityTitle;
    }

    function priority() {
        editablePriority = !editablePriority;
    }
</script>

<div class="text-tokenflex w-full overflow-hidden pb-2 pt-2 border-token rounded-token">
    <Accordion>
        {#each priorities as { title, prio }}
            <AccordionItem autocollapse>
                <svelte:fragment slot="lead">
                    <h5 class="text-l font-medium leading-tight">
                        {title}
                    </h5>
                </svelte:fragment>
                <svelte:fragment slot="summary">
                    <section></section>
                </svelte:fragment>
                <svelte:fragment slot="content">
                    <div class="w-full flex-row overflow-hidden rounded p-4 rounded-token">
                        <div class="relative mb-3 w-full">
                            <label for="floatingInput" class="label"> Priority Title </label>
                            <input
                                type="text"
                                class="input"
                                id="floatingInput"
                                bind:value="{title}"
                                placeholder="Priority Title..."
                                disabled="{editablePriorityTitle}"
                            />
                        </div>
                        <button
                            type="button"
                            class="btn variant-filled-primary"
                            on:click="{() => priorityTitle()}"
                        >
                            {#if editablePriorityTitle}
                                EDIT
                            {:else}
                                SAVE
                            {/if}
                        </button>
                        <div class="relative mb-3 w-full">
                            <label for="floatingInput" class="label"> Priority </label>
                            <input
                                type="text"
                                class="input"
                                id="floatingInput"
                                bind:value="{prio}"
                                placeholder="Priority..."
                                disabled="{editablePriority}"
                            />
                        </div>
                        <button
                            type="button"
                            class="btn variant-filled-primary"
                            on:click="{() => priority()}"
                        >
                            {#if editablePriority}
                                EDIT
                            {:else}
                                SAVE
                            {/if}
                        </button>
                    </div>
                </svelte:fragment>
            </AccordionItem>
        {/each}
    </Accordion>
</div>
