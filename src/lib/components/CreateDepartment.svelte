<script lang="ts">
    import { create } from '$lib/api/dept';
    // eslint-disable-next-line init-declarations
    let result: number | null | undefined;
    async function handleClick(departmentName: string) {
        result = await create(departmentName);
    }
    let deptName = '';
</script>

<div class="card flex w-full flex-col items-center justify-center overflow-hidden rounded-token">
    <div class="relative flex w-full flex-row">
        <section class="flex w-3/4 gap-7 p-4">
            <div class="relative w-full">
                <label for="floatingInput" class="mb-2 block tracking-widest">
                    Department Name
                </label>
                <input
                    type="text"
                    class="input"
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
                    type="button"
                    class="btn variant-filled"
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
