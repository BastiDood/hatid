<script>
    // import { create } from "$lib/api/label";
    // async function handleClick (){
    //     let returnValue = await create(title, colorValue, deadline);
    // }
    // function handleClick() {}
    let title = '';
    let deadline = '';
    let colorValue = 0x000000;
</script>

<div
    class="card bg-primary-backdrop-token flex w-full overflow-hidden border-token rounded-container-token"
>
    <div class="relative mb-3 flex w-full flex-row">
        <section class="flex grid w-full grid-cols-4 place-items-end gap-7 p-4">
            <!-- title -->
            <div class="relative mb-3 w-full">
                <label for="floatingInput" class="mb-2 block"> Title </label>
                <input
                    type="text"
                    class="input"
                    id="floatingInput"
                    placeholder="Title..."
                    bind:value="{title}"
                />
            </div>

            <!-- date -->
            <div class="relative mb-3 w-full">
                <label for="floatingInput" class="text-md mb-2 block"> Deadline </label>
                <input
                    type="date"
                    class="input"
                    id="floatingInput"
                    placeholder="yyyy-mm-dd..."
                    bind:value="{deadline}"
                />
            </div>

            <!-- color picker -->
            <div class="relative mb-3 w-full">
                <label for="floatingColor"> Color </label>
                <div class="grid w-full grid-cols-[auto_1fr] gap-2">
                    <input
                        class="input"
                        type="color"
                        bind:value="{colorValue}"
                        placeholder="#000000"
                    />
                    <input
                        class="input"
                        id="floatingColor"
                        type="text"
                        bind:value="{colorValue}"
                        placeholder="#000000"
                        readonly
                        tabindex="-1"
                    />
                </div>
            </div>

            <!-- button -->
            <div class="relative mb-3 w-full">
                <button type="button" class="btn variant-filled">
                    <!-- on:click="{handleClick}"
                > -->
                    Create Label
                </button>
            </div>
        </section>
    </div>
</div>
