<script lang="ts">
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    // import { editColor, editDeadline, editTitle } from '$lib/api/label';
    const data = [
        ['LABEL 1', '2001-09-06', '#000000'],
        ['LABEL 2', '2001-09-07', '#cccccc'],
        ['LABEL 3', '2001-09-08', '#ffffff'],
    ];

    // let colorValue = '#000000';
    let editableTitle = true;
    let editableDeadline = true;
    let editableColor = true;

    const buttonClass =
        'btn variant-filled mb-2 block flex rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg';

    function title() {
        // function title(lid: number, title: string) {
        if (editableTitle) editableTitle = !editableTitle;
        // editTitle(lid, title);
        else editableTitle = !editableTitle;
    }

    function color() {
        // function color(lid: number, color: any) {
        if (editableColor) editableColor = !editableColor;
        // editColor(lid, color);
        else editableColor = !editableColor;
    }

    function deadline() {
        // function deadline(lid: number, deadline: any) {
        if (editableDeadline) editableDeadline = !editableDeadline;
        // editDeadline(lid, deadline);
        else editableDeadline = !editableDeadline;
    }
</script>

<h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
    LABELS
</h2>
<div
    class="bg-initial card flex w-full overflow-hidden pb-2 pt-2"
    style="background-color:#5F2E2E;"
>
    <Accordion>
        {#each data as label}
            <AccordionItem autocollapse>
                <svelte:fragment slot="lead">
                    <h4 class="mb-2.5 text-2xl font-medium leading-tight">
                        <span
                            class="inline-block whitespace-nowrap rounded-[0.27rem] px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none"
                            style="background-color: {label[2]};"></span>
                    </h4>
                </svelte:fragment>
                <svelte:fragment slot="summary">
                    <h5 class="text-l font-medium leading-tight">
                        {label[0]}
                    </h5>
                </svelte:fragment>
                <svelte:fragment slot="content">
                    <div class="w-full flex-row overflow-hidden rounded bg-[#828282] p-4 shadow">
                        <!-- edit title -->
                        <div class="relative mb-3 w-full">
                            <label
                                for="floatingInput"
                                class="text-md mb-2 block font-medium tracking-widest text-gray-900 dark:text-white"
                                style="font-family: Bebas Neue"
                            >
                                Title
                            </label>
                            <input
                                type="text"
                                class="focus:border-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-white transition duration-200 ease-linear focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200"
                                id="floatingInput"
                                bind:value="{label[0]}"
                                placeholder="{label[0]}"
                                disabled="{editableTitle}"
                            />
                        </div>

                        <button
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            class="{buttonClass}"
                            style="background-color: white"
                            on:click="{() => title()}"
                        >
                            {editableTitle ? 'EDIT' : 'SAVE'}
                        </button>

                        <!-- edit deadline -->
                        <div class="relative mb-3 w-full">
                            <label
                                for="floatingInput"
                                class="text-md mb-2 block font-medium tracking-widest text-gray-900 dark:text-white"
                                style="font-family: Bebas Neue"
                            >
                                Deadline
                            </label>
                            <input
                                type="date"
                                class="focus:border-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-white transition duration-200 ease-linear focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200"
                                id="floatingInput"
                                placeholder="{label[1]}"
                                bind:value="{label[1]}"
                                disabled="{editableDeadline}"
                            />
                        </div>

                        <button
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            class="{buttonClass}"
                            style="background-color: white"
                            on:click="{() => deadline()}"
                        >
                            {editableDeadline ? 'EDIT' : 'SAVE'}
                        </button>

                        <!-- edit color -->
                        <div class="relative mb-3 w-full">
                            <label
                                for="floatingColor"
                                class="text-md mb-2 block font-medium tracking-widest text-gray-900 dark:text-white"
                                style="font-family: Bebas Neue"
                            >
                                Color
                            </label>
                            <div class="grid w-full grid-cols-[auto_1fr] gap-2">
                                <input
                                    class="input"
                                    type="color"
                                    bind:value="{label[2]}"
                                    placeholder="#000000"
                                    disabled="{editableColor}"
                                />
                                <input
                                    class="focus:border-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-white transition duration-200 ease-linear focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200"
                                    id="floatingColor"
                                    type="text"
                                    bind:value="{label[2]}"
                                    placeholder="#000000"
                                    readonly
                                    tabindex="-1"
                                />
                            </div>
                        </div>

                        <button
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            class="{buttonClass}"
                            style="background-color: white"
                            on:click="{() => color()}"
                        >
                            {editableColor ? 'EDIT' : 'SAVE'}
                        </button>
                    </div>
                </svelte:fragment>
            </AccordionItem>
        {/each}
    </Accordion>
</div>
