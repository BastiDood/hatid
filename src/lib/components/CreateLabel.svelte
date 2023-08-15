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

<div class="bg-initial card flex w-full overflow-hidden" style="background-color:#5F2E2E;">
    <div class="relative mb-3 flex w-full flex-row">
        <section class="flex grid w-full grid-cols-4 place-items-end gap-7 p-4">
            <!-- title -->
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
                    placeholder="Title..."
                    bind:value="{title}"
                />
            </div>

            <!-- date -->
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
                    placeholder="yyyy-mm-dd..."
                    bind:value="{deadline}"
                />
            </div>

            <!-- color picker -->
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
                        bind:value="{colorValue}"
                        placeholder="#000000"
                    />
                    <input
                        class="focus:border-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-white transition duration-200 ease-linear focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200"
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
                    data-te-ripple-init
                    data-te-ripple-color="light"
                    class="btn variant-filled mb-2 block flex w-full rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                    style="background-color: white"
                >
                    <!-- on:click="{handleClick}"
                > -->
                    Create Label
                </button>
            </div>
        </section>
    </div>
</div>
