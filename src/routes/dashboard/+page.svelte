<script>
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    import CustomButton from '$lib/components/CustomButton.svelte';
    import CustomInput from '$lib/components/CustomInput.svelte';
    const data = [
        ['LABEL 1', '09/06/2001', '#000000'],
        ['LABEL 2', '09/07/2001', '#cccccc'],
        ['LABEL 3', '09/08/2001', '#ffffff'],
    ];
    let editableTitle = true;
    let editableDeadline = true;
    let editableColor = true;

    const buttonClass =
        'btn variant-filled mb-2 block flex rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg';
</script>

<div class="ml-10 mr-10 mt-10 flex h-full flex-col space-y-7 pb-2 pl-5 pr-5 pt-5">
    <h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
        CREATE LABEL
    </h2>
    <div class="bg-initial card flex w-full overflow-hidden" style="background-color:#5F2E2E;">
        <section class="flex grid w-full grid-cols-4 place-items-end gap-7 p-4">
            <CustomInput label="Title" defaultvalue="Title..." type="text" inputmode="text" />
            <CustomInput
                label="Deadline"
                defaultvalue="mm/dd/yyyy..."
                type="date"
                inputmode="text"
            />
            <CustomInput label="Color" inputmode="color" />
            <CustomButton title="Create Label" link="/dashboard" />
        </section>
    </div>
    <h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
        LABELS
    </h2>
    <div class="bg-initial card flex w-full overflow-hidden pt-2" style="background-color:#5F2E2E;">
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
                        <div
                            class="w-full flex-row overflow-hidden rounded bg-[#828282] p-4 shadow"
                        >
                            <CustomInput
                                label="Title"
                                defaultvalue="{label[0]}"
                                type="text"
                                inputmode="text"
                                disabled="{editableTitle}"
                            />

                            <button
                                data-te-ripple-init
                                data-te-ripple-color="light"
                                class="{buttonClass}"
                                style="background-color: white"
                                on:click="{() => (editableTitle = !editableTitle)}"
                            >
                                {editableTitle ? 'EDIT' : 'SAVE'}
                            </button>

                            <CustomInput
                                label="Deadline"
                                defaultvalue="{label[1]}"
                                type="date"
                                inputmode="text"
                                disabled="{editableDeadline}"
                            />

                            <button
                                data-te-ripple-init
                                data-te-ripple-color="light"
                                class="{buttonClass}"
                                style="background-color: white"
                                on:click="{() => (editableDeadline = !editableDeadline)}"
                            >
                                {editableDeadline ? 'EDIT' : 'SAVE'}
                            </button>

                            <CustomInput
                                label="Color"
                                inputmode="color"
                                colorValue="{label[2]}"
                                disabled="{editableColor}"
                            />

                            <button
                                data-te-ripple-init
                                data-te-ripple-color="light"
                                class="{buttonClass}"
                                style="background-color: white"
                                on:click="{() => (editableColor = !editableColor)}"
                            >
                                {editableColor ? 'EDIT' : 'SAVE'}
                            </button>
                        </div>
                    </svelte:fragment>
                </AccordionItem>
            {/each}
        </Accordion>
    </div>
</div>
