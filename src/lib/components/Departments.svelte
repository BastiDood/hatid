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

<div
<<<<<<< HEAD
    class="bg-primary-backdrop-token flex w-full overflow-hidden pb-2 pt-2 border-token rounded-token"
=======
    class="bg-primary-backdrop-token text-token flex w-full overflow-hidden pb-2 pt-2 border-token rounded-token font-token"
>>>>>>> 2f9a92e... chore: refactor buttons, labels, and inputs
>
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
                    <div
                        class="bg-secondary-backdrop-token w-full flex-row overflow-hidden rounded p-4"
                    >
                        <div class="relative mb-3 w-full">
                            <label for="floatingInput" class="label"> Title </label>
                            <input
                                type="text"
                                class="input"
                                id="floatingInput"
                                bind:value="{dept}"
                                placeholder="{dept}"
                                disabled="{editableDepartment}"
                            />
                        </div>
                        <button
                            type="button"
                            class="btn variant-filled"
                            on:click="{() => toggleDepartmentEdit()}"
                        >
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
