<script lang="ts">
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    const data = [
        { label: 'LABEL 1', deadline: '2001-09-06', color: '#000000' },
        { label: 'LABEL 2', deadline: '2001-09-07', color: '#cccccc' },
        { label: 'LABEL 3', deadline: '2001-09-08', color: '#ffffff' },
    ];

    // let colorValue = '#000000';
    let editableTitle = true;
    let editableDeadline = true;
    let editableColor = true;

    const buttonClass = 'btn variant-filled mb-2 block flex rounded px-6 py-2.5 text-xs uppercase';

    function toggleTitleEdit() {
        // function title(lid: number, title: string) {
        if (editableTitle) editableTitle = !editableTitle;
        // editTitle(lid, title);
        else editableTitle = !editableTitle;
    }

    function toggleColorEdit() {
        // function color(lid: number, color: any) {
        if (editableColor) editableColor = !editableColor;
        // editColor(lid, color);
        else editableColor = !editableColor;
    }

    function toggleDeadlineEdit() {
        // function deadline(lid: number, deadline: any) {
        if (editableDeadline) editableDeadline = !editableDeadline;
        // editDeadline(lid, deadline);
        else editableDeadline = !editableDeadline;
    }
</script>

<div class="card flex w-full overflow-hidden pb-2 pt-2">
    <Accordion>
        {#each data as { label, deadline, color }}
            <AccordionItem autocollapse>
                <svelte:fragment slot="lead">
                    <h4 class="mb-2.5 text-2xl">
                        <span
                            class="inline-block whitespace-nowrap rounded-[0.27rem] px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em]"
                        ></span>
                    </h4>
                </svelte:fragment>
                <svelte:fragment slot="summary">
                    <h5 class="text-l">
                        {label}
                    </h5>
                </svelte:fragment>
                <svelte:fragment slot="content">
                    <div class="w-full flex-row overflow-hidden p-4">
                        <!-- edit title -->
                        <div class="relative mb-3 w-full">
                            <label for="floatingInput" class="text-md mb-2 block"> Title </label>
                            <input
                                type="text"
                                class="peer m-0 block w-full rounded bg-clip-padding px-3 py-4 placeholder-white"
                                id="floatingInput"
                                bind:value="{label}"
                                placeholder="{label}"
                                disabled="{editableTitle}"
                            />
                        </div>
                        <button class="{buttonClass}" on:click="{() => toggleTitleEdit()}">
                            {#if editableTitle}
                                EDIT
                            {:else}
                                SAVE
                            {/if}
                        </button>

                        <!-- edit deadline -->
                        <div class="relative mb-3 w-full">
                            <label for="floatingInput" class="text-md mb-2 block"> Deadline </label>
                            <input
                                type="date"
                                class="peer m-0 block w-full rounded bg-clip-padding px-3 py-4 placeholder-white"
                                id="floatingInput"
                                placeholder="{deadline}"
                                bind:value="{deadline}"
                                disabled="{editableDeadline}"
                            />
                        </div>

                        <button class="{buttonClass}" on:click="{() => toggleDeadlineEdit()}">
                            {#if editableDeadline}
                                EDIT
                            {:else}
                                SAVE
                            {/if}
                        </button>

                        <!-- edit color -->
                        <div class="relative mb-3 w-full">
                            <label for="floatingColor" class="text-md mb-2 block"> Color </label>
                            <div class="grid w-full grid-cols-[auto_1fr] gap-2">
                                <input
                                    class="input"
                                    type="color"
                                    bind:value="{color}"
                                    placeholder="#000000"
                                    disabled="{editableColor}"
                                />
                                <input
                                    class="peer m-0 block w-full rounded bg-clip-padding px-3 py-4 placeholder-white"
                                    id="floatingColor"
                                    type="text"
                                    bind:value="{color}"
                                    placeholder="#000000"
                                    readonly
                                    tabindex="-1"
                                />
                            </div>
                        </div>
                        <button class="{buttonClass}" on:click="{() => toggleColorEdit()}">
                            {#if editableColor}
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
