<script lang="ts">
    import { create } from '$lib/api/ticket';
    const labels = [1, 2, 3];

    const buttonClass =
        'btn variant-filled mb-2 block flex rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg';

    let optionValue = 0;
    let ticketTitle = '';
    let ticketLabel = '';
    let ticketDescription = '';
    // eslint-disable-next-line init-declarations
    let result: Awaited<ReturnType<typeof create>> | null;

    async function createTicket(title: string, content: string, label: number[]) {
        result = await create(title, content, label);
    }
</script>

<h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
    CREATE TICKET
</h2>
<div
    class="bg-initial card w-full flex-col items-center justify-center overflow-hidden"
    style="background-color:#5F2E2E;"
>
    <div class="flex grid w-full grid-cols-2 gap-7 p-4">
        <div class="relative mb-3 w-full">
            <label
                for="floatingInput"
                class="text-md mb-2 block font-medium tracking-widest text-gray-900 dark:text-white"
                style="font-family: Bebas Neue"
            >
                Ticket Title
            </label>
            <input
                type="text"
                class="focus:border-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-white transition duration-200 ease-linear focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200"
                id="floatingInput"
                bind:value="{ticketTitle}"
                placeholder="Ticket Title..."
            />
        </div>

        <div class="relative mb-3 w-full">
            <label
                for="floatingSelect"
                class="text-md mb-2 block font-medium tracking-widest text-gray-900 dark:text-white"
                style="font-family: Bebas Neue"
            >
                Labels
            </label>
            <select
                class="block w-full w-full rounded bg-red-950 bg-clip-padding p-2.5 px-3 py-4 text-sm text-gray-900 dark:bg-red-950 dark:text-white"
                bind:value="{ticketLabel}"
            >
                {#each labels as label}
                    <option value="{optionValue++}">{label}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="flex w-full pl-4 pr-4">
        <div class="relative mb-3 w-full">
            <label
                for="floatingInput"
                class="text-md mb-2 block font-medium tracking-widest text-gray-900 dark:text-white"
                style="font-family: Bebas Neue"
            >
                Description
            </label>
            <textarea
                class="focus:border-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 placeholder-white transition duration-200 ease-linear focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200"
                id="floatingInput"
                rows="{4}"
                placeholder="Description..."
                bind:value="{ticketDescription}"></textarea>
        </div>
    </div>
    <div class="flex w-full gap-7 p-4">
        <div class="relative mb-3 w-full">
            <button
                data-te-ripple-init
                data-te-ripple-color="light"
                class="{buttonClass}"
                style="background-color: white"
                on:click="{() => createTicket(ticketTitle, ticketDescription, labels)}"
            >
                Create Ticket
            </button>
        </div>
    </div>
    <div class="flex w-full gap-7 p-4">
        {result}
    </div>
</div>
