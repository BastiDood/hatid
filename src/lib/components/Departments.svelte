<script lang="ts">
    // import { editName } from '$lib/api/dept';
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    // import { editName } from '$lib/api/dept';
    const departments = ['DEPARTMENT 1', 'DEPARTMENT 2', 'DEPARTMENT 3'];
    let editableDepartment = true;
    function toggleDepartmentEdit() {
        editableDepartment = !editableDepartment;
    }
</script>

<div class="card flex w-full overflow-hidden pb-2 pt-2">
    <Accordion>
        {#each departments as dept (dept)}
            <AccordionItem autocollapse>
                <svelte:fragment slot="lead">
                    <h5 class="text-l">
                        {dept}
                    </h5>
                </svelte:fragment>
                <svelte:fragment slot="summary">
                    <section></section>
                </svelte:fragment>
                <svelte:fragment slot="content">
                    <div class="w-full flex-row overflow-hidden rounded p-4">
                        <div class="relative mb-3 w-full">
                            <label for="floatingInput" class="text-md mb-2 block"> Title </label>
                            <input
                                type="text"
                                class="peer m-0 block w-full rounded bg-clip-padding px-3 py-4 placeholder-white"
                                id="floatingInput"
                                bind:value="{dept}"
                                placeholder="{dept}"
                                disabled="{editableDepartment}"
                            />
                        </div>
                        <button on:click="{() => toggleDepartmentEdit()}">
                            {#if editableDepartment}
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
