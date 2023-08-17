<script lang="ts">
    import { MessageSchema, TicketSchema } from '$lib/model/ticket';
    import Back from '@krowten/svelte-heroicons/icons/ArrowUturnLeftIcon.svelte';
    import Error from '@krowten/svelte-heroicons/icons/ExclamationCircleIcon.svelte';
    import type { PageServerData } from './$types';
    import SubmitButton from '../SubmitButton.svelte';
    import type { SubmitFunction } from '@sveltejs/kit';
    import assert from '$lib/assert';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { toastStore } from '@skeletonlabs/skeleton';
    import { z } from 'zod';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ labels } = data);

    const ResultSchema = z.object({
        tid: TicketSchema.shape.ticket_id,
        mid: MessageSchema.shape.message_id,
        due: TicketSchema.shape.due_date,
    });

    const submit = (() =>
        async ({ result, update }) => {
            assert(result.type === 'success');
            const { tid, mid, due } = ResultSchema.parse(result.data);
            await update();
            toastStore.trigger({
                autohide: false,
                message: `New ticket created due at ${due.toLocaleString()}.`,
                background: 'variant-filled-success',
                action: {
                    label: 'Go to Inbox',
                    response() {
                        return goto(`/dashboard/inbox/${tid}#${mid}`);
                    },
                },
            });
        }) satisfies SubmitFunction;
</script>

{#if labels.length === 0}
    <a href="/dashboard" class="btn variant-filled-primary m-auto">
        <Back class="h-4 w-4" />
        <span>Go Back to Dashboard</span>
    </a>
    <div class="alert variant-soft-warning">
        <Error class="h-8 w-8" />
        <span
            >The system is not yet ready to accept tickets because there are no labels available at
            the moment.</span
        >
    </div>
{:else}
    <form
        method="POST"
        enctype="application/x-www-form-urlencoded"
        use:enhance="{submit}"
        class="card space-y-4 p-4"
    >
        <label class="label">
            <span>Title</span>
            <input required type="text" class="input" name="title" placeholder="Title" />
        </label>
        <label class="label">
            <span>What is your ticket about?</span>
            <select required multiple name="label" class="select">
                {#each labels as { label_id, title, color } (label_id)}
                    {@const rgb = color >>> 8}
                    {@const hex = rgb.toString(16)}
                    <option value="{label_id}" style:color="#{hex}">{title}</option>
                {/each}
            </select>
        </label>
        <label class="label">
            <span>Body</span>
            <textarea
                required
                name="body"
                cols="40"
                rows="6"
                placeholder="Write about your experience."
                class="textarea"></textarea>
        </label>
        <SubmitButton />
    </form>
{/if}
