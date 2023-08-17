<script lang="ts">
    import { modalStore, toastStore } from '@skeletonlabs/skeleton';
    import { PrioritySchema } from '$lib/model/priority';
    import SubmitButton from './SubmitButton.svelte';
    import type { SubmitFunction } from '@sveltejs/kit';
    import assert from '$lib/assert';
    import { enhance } from '$app/forms';
    import { z } from 'zod';

    const ResultSchema = z.object({ id: PrioritySchema.shape.priority_id });

    const submit = (({ formData }) => {
        const name = formData.get('title');
        assert(typeof name === 'string');
        return async ({ result, update }) => {
            assert(result.type === 'success');
            const { id } = ResultSchema.parse(result.data);
            await update();
            modalStore.close();
            toastStore.trigger({
                background: 'variant-filled-success',
                message: `Created new priority "${name}" with ID ${id}.`,
            });
        };
    }) satisfies SubmitFunction;
</script>

<form
    method="POST"
    enctype="application/x-www-form-urlencoded"
    use:enhance="{submit}"
    class="card space-y-4 p-4"
>
    <label class="label">
        <span>Title</span>
        <input required type="text" name="title" class="input" placeholder="Title" />
    </label>
    <label class="label">
        <span>Priority</span>
        <input
            required
            type="number"
            value="0"
            min="-2147483648"
            max="2147483647"
            name="priority"
            class="input"
            placeholder="Priority"
        />
    </label>
    <SubmitButton />
</form>
