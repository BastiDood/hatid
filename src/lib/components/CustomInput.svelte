<script>
    export let label = '';
    export let defaultvalue = '';
    export let inputmode = '';
    export let type = '';
    let colorValue = '#000000';
</script>
{#if inputmode === 'text'}
    <div class="relative mb-3 w-full">
        <label
        for="floatingInput"
        class="block mb-2 text-md tracking-widest font-medium text-gray-900 dark:text-white"
        style="font-family: Bebas Neue">
            {label}
        </label>
        <input
        type={type}
        class="peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-white transition duration-200 ease-linear focus:border-primary focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-600 dark:text-neutral-200 dark:focus:border-primary dark:peer-focus:text-primary"
        id="floatingInput"
        placeholder={defaultvalue} />
    </div>
{:else if inputmode === 'color'}
    <div class="relative mb-3 w-full"> 
        <label
        for="floatingColor"
        class="block mb-2 text-md tracking-widest font-medium text-gray-900 dark:text-white"
        style="font-family: Bebas Neue">
            Color
        </label>
        <div class="grid grid-cols-[auto_1fr] gap-2 w-full">
            <input class="input" type="color" bind:value={colorValue} />
            <input 
            class="peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-[#5F2E2E] transition duration-200 ease-linear focus:border-primary focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-600 dark:text-neutral-200 dark:focus:border-primary dark:peer-focus:text-primary"
            id="floatingColor" type="text" bind:value={colorValue} readonly tabindex="-1" />
        </div>
    </div>
{/if}

