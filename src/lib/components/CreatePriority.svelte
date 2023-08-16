<script lang="ts">
    import { create } from '$lib/api/priority';
    let priorityTitle = '';
    let priority = 0;
    // eslint-disable-next-line init-declarations
    let result: number | null | undefined;
    async function handleClick(priorityTitle: string, priority: number) {
        result = await create(priorityTitle, priority);
    }
</script>

<div
    class="bg-primary-400-500-token flex w-full flex-col items-center justify-center overflow-hidden border-token rounded-container-token"
>
    <div class="relative mb-3 flex w-full flex-row">
        <section class="flex w-3/4 gap-7 p-4">
            <div class="relative mb-3 w-full">
                <label for="floatingInput" class="label"> Priority Title </label>
                <input
                    type="text"
                    class="input"
                    id="floatingInput"
                    bind:value="{priorityTitle}"
                    placeholder="Priority Title..."
                />
            </div>
            <div class="relative mb-3 w-full">
                <label for="floatingInput2" class="label"> Priority </label>
                <input
                    type="text"
                    class="input"
                    id="floatingInput2"
                    bind:value="{priority}"
                    placeholder="Priority..."
                />
            </div>
        </section>
        <section class="flex w-1/4 gap-7 p-4 pt-12">
            <div class="relative mb-3 w-full">
                <button
                    type="button"
                    class="btn variant-filled"
                    on:click="{() => handleClick(priorityTitle, priority)}"
                >
                    Create Priority
                </button>
            </div>
        </section>
    </div>
    <div class="relative mb-3 w-full">
        {result}
    </div>
</div>
