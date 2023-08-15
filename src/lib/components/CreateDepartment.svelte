<script lang="ts">
    import { create } from '$lib/api/dept';
    // eslint-disable-next-line init-declarations
    let result: number | null | undefined;
    async function handleClick(departmentName: string) {
        result = await create(departmentName);
    }
    let deptName = '';
</script>

<div class="bg-initial card flex w-full flex-col items-center justify-center overflow-hidden">
    <div class="relative flex w-full flex-row">
        <section class="flex w-3/4 gap-7 p-4">
            <div class="relative w-full">
                <label for="floatingInput" class="text-md mb-2 block font-medium tracking-widest">
                    Department Name
                </label>
                <input
                    type="text"
                    class="peer m-0 block w-full rounded bg-clip-padding px-3 py-4 text-base font-normal leading-tight placeholder-white ease-linear"
                    id="floatingInput"
                    bind:value="{deptName}"
                    placeholder="Department Name..."
                />
            </div>
        </section>
        <section class="flex w-1/4 gap-7 p-4 pt-12">
            <!-- button -->
            <div class="relative mb-3 w-full">
                <button
                    class="btn variant-filled mb-2 block flex w-full rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal"
                    on:click="{() => handleClick(deptName)}"
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
