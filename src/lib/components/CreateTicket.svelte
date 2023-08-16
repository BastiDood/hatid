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

<div
    class="bg-primary-backdrop-token w-full flex-col items-center justify-center overflow-hidden border-token rounded-container-token"
>
    <div class="flex grid w-full grid-cols-2 gap-7 p-4">
        <div class="relative mb-3 w-full">
            <label for="floatingInput" class="label"> Ticket Title </label>
            <input
                type="text"
                class="input"
                id="floatingInput"
                bind:value="{ticketTitle}"
                placeholder="Ticket Title..."
            />
        </div>

        <div class="relative mb-3 w-full">
            <label for="floatingSelect" class="label"> Labels </label>
            <select class="select" bind:value="{ticketLabel}">
                {#each labels as label (label)}
                    <option value="{label}">{label}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="flex w-full pl-4 pr-4">
        <div class="relative mb-3 w-full">
            <label for="floatingInput" class="label"> Description </label>
            <textarea
                class="textarea"
                id="floatingInput"
                rows="4"
                placeholder="Description..."
                bind:value="{ticketDescription}"></textarea>
        </div>
    </div>
    <div class="flex w-full gap-7 p-4">
        <div class="relative mb-3 w-full">
            <button
                type="button"
                class="btn variant-filled"
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
