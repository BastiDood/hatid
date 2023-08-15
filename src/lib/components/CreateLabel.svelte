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

<div class="card flex w-full overflow-hidden">
    <div class="relative mb-3 flex w-full flex-row">
        <section class="flex grid w-full grid-cols-4 place-items-end gap-7 p-4">
            <!-- title -->
            <div class="relative mb-3 w-full">
                <label for="floatingInput" class="text-md mb-2 block font-medium tracking-widest">
                    Title
                </label>
                <input
                    type="text"
                    class="peer m-0 block w-full bg-clip-padding px-3 py-4 text-base"
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
                    class="peer m-0 block w-full rounded bg-clip-padding px-3 py-4 text-base leading-tight"
                    id="floatingInput"
                    placeholder="yyyy-mm-dd..."
                    bind:value="{deadline}"
                />
            </div>

            <!-- color picker -->
            <div class="relative mb-3 w-full">
                <label for="floatingColor" class="text-md mb-2 block font-medium tracking-widest">
                    Color
                </label>
                <div class="grid w-full grid-cols-[auto_1fr] gap-2">
                    <input
                        class="input"
                        type="color"
                        bind:value="{colorValue}"
                        placeholder="#000000"
                    />
                    <input
                        class="peer m-0 block w-full bg-clip-padding px-3 py-4"
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
                <button
                    class="btn variant-filled mb-2 block flex w-full px-6 py-2.5 text-xs uppercase"
                >
                    <!-- on:click="{handleClick}"
                > -->
                    Create Label
                </button>
            </div>
        </section>
    </div>
</div>
