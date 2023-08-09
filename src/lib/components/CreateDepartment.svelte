<script lang="ts">
    import { create } from '$lib/api/dept';
    // eslint-disable-next-line init-declarations
    let result: number | null | undefined;
    async function handleClick(departmentName: string) {
        result = await create(departmentName);
    }
    let DepartmentName = '';
</script>

<h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
    CREATE DEPARTMENT
</h2>
<div
    class="bg-initial card flex w-full flex-col items-center justify-center overflow-hidden"
    style="background-color:#5F2E2E;"
>
    <div class="relative mb-3 flex w-full flex-row">
        <section class="flex w-3/4 gap-7 p-4">
            <div class="relative mb-3 w-full">
                <label
                    for="floatingInput"
                    class="text-md mb-2 block font-medium tracking-widest text-gray-900 dark:text-white"
                    style="font-family: Bebas Neue"
                >
                    Department Name
                </label>
                <input
                    type="text"
                    class="focus:border-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-white transition duration-200 ease-linear focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200"
                    id="floatingInput"
                    bind:value="{DepartmentName}"
                    placeholder="Department Name..."
                />
            </div>
        </section>
        <section class="flex w-1/4 gap-7 p-4 pt-12">
            <!-- button -->
            <div class="relative mb-3 w-full">
                <button
                    data-te-ripple-init
                    data-te-ripple-color="light"
                    class="btn variant-filled mb-2 block flex w-full rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                    style="background-color: white"
                    on:click="{() => handleClick(DepartmentName)}"
                >
                    Create Department
                </button>
            </div>
        </section>
    </div>
    <div class="relative mb-3 w-full">
        {result}
    </div>
</div>
