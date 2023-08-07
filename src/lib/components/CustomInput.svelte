<script>
    export let label = '';
    export let defaultvalue = '';
    export let inputmode = '';
    export let type = '';
    export let colorValue = "#000000";
    export let disabled = false;
</script>

{#if inputmode === 'text'}
    <div class="relative mb-3 w-full">
        <label
            for="floatingInput"
            class="text-md mb-2 block font-medium tracking-widest text-gray-900 dark:text-white"
            style="font-family: Bebas Neue"
        >
            {label}
        </label>
        <input
            type="{type}"
            class="focus:border-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-white transition duration-200 ease-linear focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200"
            id="floatingInput"
            placeholder="{defaultvalue}"
            disabled={disabled}
        />
    </div>
{:else if inputmode === 'color'}
    <div class="relative mb-3 w-full">
        <label
            for="floatingColor"
            class="text-md mb-2 block font-medium tracking-widest text-gray-900 dark:text-white"
            style="font-family: Bebas Neue"
        >
            Color
        </label>
        <div class="grid w-full grid-cols-[auto_1fr] gap-2">
            <input class="input" type="color" bind:value="{colorValue}" placeholder="#000000" disabled={disabled}/>
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
{/if}
