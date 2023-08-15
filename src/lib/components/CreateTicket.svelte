<script lang="ts">
    import { create } from '$lib/api/ticket';
    const labels = [1, 2, 3];

    let ticketTitle = '';
    let ticketLabel = '';
    let ticketDescription = '';
    // eslint-disable-next-line init-declarations
    let result: Awaited<ReturnType<typeof create>> | null;

    async function createTicket(title: string, content: string, label: number[]) {
        result = await create(title, content, label);
    }
</script>

<div class="card w-full flex-col items-center justify-center overflow-hidden">
    <div class="flex grid w-full grid-cols-2 gap-7 p-4">
        <div class="relative mb-3 w-full">
            <label for="floatingInput" class="text-md mb-2 block"> Ticket Title </label>
            <input
                type="text"
                class="peer m-0 block w-full rounded bg-clip-padding px-3 py-4 placeholder-white"
                id="floatingInput"
                bind:value="{ticketTitle}"
                placeholder="Ticket Title..."
            />
        </div>

        <div class="relative mb-3 w-full">
            <label for="floatingSelect" class="text-md mb-2 block"> Labels </label>
            <select
                class="block w-full w-full rounded bg-clip-padding p-2.5 px-3 py-4 text-sm"
                bind:value="{ticketLabel}"
            >
                {#each labels as label (label)}
                    <option value="{label}">{label}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="flex w-full pl-4 pr-4">
        <div class="relative mb-3 w-full">
            <label for="floatingInput" class="text-md mb-2 block"> Description </label>
            <textarea
                class="peer m-0 block w-full rounded bg-clip-padding px-3 py-4 placeholder-white"
                id="floatingInput"
                rows="4"
                placeholder="Description..."
                bind:value="{ticketDescription}"></textarea>
        </div>
    </div>
    <div class="flex w-full gap-7 p-4">
        <div class="relative mb-3 w-full">
            <button on:click="{() => createTicket(ticketTitle, ticketDescription, labels)}">
                Create Ticket
            </button>
        </div>
    </div>
    <div class="flex w-full gap-7 p-4">
        {result}
    </div>
</div>
