<script lang="ts">
    // import { editName } from '$lib/api/dept';
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    // import { editName } from '$lib/api/dept';
    const departments = ['DEPARTMENT 1', 'DEPARTMENT 2', 'DEPARTMENT 3'];
    let editableDepartment = true;
    // let result:any;
    const buttonClass =
        'btn variant-filled mb-2 block flex rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg';
    function department() {
        // function department(did: number, name: string) {
        if (editableDepartment) editableDepartment = !editableDepartment;
        // editName(did, name);
        else editableDepartment = !editableDepartment;
    }
</script>

<div
    class="bg-initial card flex w-full overflow-hidden pb-2 pt-2"
    style="background-color:#5F2E2E;"
>
    <Accordion>
        {#each departments as dept}
            <AccordionItem autocollapse>
                <svelte:fragment slot="lead">
                    <h5 class="text-l font-medium leading-tight">
                        {dept}
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
                                Title
                            </label>
                            <input
                                type="text"
                                class="focus:border-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-white transition duration-200 ease-linear focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200"
                                id="floatingInput"
                                bind:value="{dept}"
                                placeholder="{dept}"
                                disabled="{editableDepartment}"
                            />
                        </div>
                        <button
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            class="{buttonClass}"
                            style="background-color: white"
                            on:click="{() => department()}"
                        >
                            {editableDepartment ? 'EDIT' : 'SAVE'}
                        </button>
                    </div>
                </svelte:fragment>
            </AccordionItem>
        {/each}
    </Accordion>
</div>
