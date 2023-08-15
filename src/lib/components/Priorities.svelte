<script lang="ts">
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    // import { edit, editTitle } from '$lib/api/priority';
    const priorities = [
        ['PRIORITY TITLE 1', 'PRIORITY'],
        ['PRIORITY TITLE 2', 'PRIORITY'],
    ];
    let editablePriorityTitle = true;
    let editablePriority = true;
    function priorityTitle() {
        // function priorityTitle(pid:number, title:string) {
        if (editablePriorityTitle) editablePriorityTitle = !editablePriorityTitle;
        // editTitle(pid, title);
        else editablePriorityTitle = !editablePriorityTitle;
    }

    function priority() {
        // function priority(pid:number, priority:number) {
        if (editablePriority) editablePriority = !editablePriority;
        // edit(pid, priority);
        else editablePriority = !editablePriority;
    }

    const buttonClass = 'btn variant-filled mb-2 block flex rounded px-6 py-2.5 text-xs';
</script>

<div class="bg-initial card flex w-full overflow-hidden pb-2 pt-2">
    <Accordion>
        {#each priorities as prio}
            <AccordionItem autocollapse>
                <svelte:fragment slot="lead">
                    <h5 class="text-l">
                        {prio[0]}
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
                                bind:value="{prio[0]}"
                                placeholder="Priority Title..."
                                disabled="{editablePriorityTitle}"
                            />
                        </div>
                        <button class="{buttonClass}" on:click="{() => priorityTitle()}">
                            {editablePriorityTitle ? 'EDIT' : 'SAVE'}
                        </button>
                        <div class="relative mb-3 w-full">
                            <label for="floatingInput" class="text-md mb-2 block"> Priority </label>
                            <input
                                type="text"
                                class="peer m-0 block w-full rounded bg-clip-padding px-3 py-4 placeholder-white"
                                id="floatingInput"
                                bind:value="{prio[1]}"
                                placeholder="Priority..."
                                disabled="{editablePriority}"
                            />
                        </div>
                        <button class="{buttonClass}" on:click="{() => priority()}">
                            {editablePriority ? 'EDIT' : 'SAVE'}
                        </button>
                    </div>
                </svelte:fragment>
            </AccordionItem>
        {/each}
    </Accordion>
</div>
