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

    const buttonClass =
        'btn variant-filled mb-2 block flex rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg';
</script>

<div
    class="bg-initial card flex w-full overflow-hidden pb-2 pt-2"
    style="background-color:#5F2E2E;"
>
    <Accordion>
        {#each priorities as prio}
            <AccordionItem autocollapse>
                <svelte:fragment slot="lead">
                    <h5 class="text-l font-medium leading-tight">
                        {prio[0]}
                    </h5>
                </svelte:fragment>
                <svelte:fragment slot="summary">
                    <section></section>
                </svelte:fragment>
                <svelte:fragment slot="content">
                    <div class="w-full flex-row overflow-hidden rounded bg-[#828282] p-4 shadow">
                        <div class="relative mb-3 w-full">
                            <label
                                for="floatingInput"
                                class="text-md mb-2 block font-medium tracking-widest text-gray-900 dark:text-white"
                                style="font-family: Bebas Neue"
                            >
                                Priority Title
                            </label>
                            <input
                                type="text"
                                class="focus:border-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-white transition duration-200 ease-linear focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200"
                                id="floatingInput"
                                bind:value="{prio[0]}"
                                placeholder="Priority Title..."
                                disabled="{editablePriorityTitle}"
                            />
                        </div>
                        <button
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            class="{buttonClass}"
                            style="background-color: white"
                            on:click="{() => priorityTitle()}"
                        >
                            {editablePriorityTitle ? 'EDIT' : 'SAVE'}
                        </button>
                        <div class="relative mb-3 w-full">
                            <label
                                for="floatingInput"
                                class="text-md mb-2 block font-medium tracking-widest text-gray-900 dark:text-white"
                                style="font-family: Bebas Neue"
                            >
                                Priority
                            </label>
                            <input
                                type="text"
                                class="focus:border-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-white transition duration-200 ease-linear focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200"
                                id="floatingInput"
                                bind:value="{prio[1]}"
                                placeholder="Priority..."
                                disabled="{editablePriority}"
                            />
                        </div>
                        <button
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            class="{buttonClass}"
                            style="background-color: white"
                            on:click="{() => priority()}"
                        >
                            {editablePriority ? 'EDIT' : 'SAVE'}
                        </button>
                    </div>
                </svelte:fragment>
            </AccordionItem>
        {/each}
    </Accordion>
</div>
