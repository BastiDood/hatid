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

<div class="bg-initial card flex w-full overflow-hidden pb-2 pt-2">
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
                    <div class="w-full flex-row overflow-hidden rounded bg-[#828282] p-4">
                        <div class="relative mb-3 w-full">
                            <label for="floatingInput" class="text-md mb-2 block">
                                Priority Title
                            </label>
                            <input
                                type="text"
                                class="peer m-0 block w-full rounded bg-clip-padding px-3 py-4 placeholder-white"
                                id="floatingInput"
                                bind:value="{title}"
                                placeholder="Priority Title..."
                                disabled="{editablePriorityTitle}"
                            />
                        </div>
                        <button on:click="{() => priorityTitle()}">
                            {#if editablePriorityTitle}
                                EDIT
                            {:else}
                                SAVE
                            {/if}
                        </button>
                        <div class="relative mb-3 w-full">
                            <label for="floatingInput" class="text-md mb-2 block"> Priority </label>
                            <input
                                type="text"
                                class="peer m-0 block w-full rounded bg-clip-padding px-3 py-4 placeholder-white"
                                id="floatingInput"
                                bind:value="{prio}"
                                placeholder="Priority..."
                                disabled="{editablePriority}"
                            />
                        </div>
                        <button on:click="{() => priority()}">
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
