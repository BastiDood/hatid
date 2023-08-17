<script lang="ts">
    import SubmitButton from './SubmitButton.svelte';
    import type { SubmitFunction } from '@sveltejs/kit';
    import assert from '$lib/assert';
    import { enhance } from '$app/forms';
    import { modalStore, toastStore } from '@skeletonlabs/skeleton';
    import { z } from 'zod';
    import { PrioritySchema } from '$lib/model/priority';

    const ResultSchema = z.object({ id: PrioritySchema.shape.priority_id });

    const submit: SubmitFunction = ({ formData }) => {
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
    };
</script>

<!-- TODO: Migrate to SvelteKit form actions. -->
<form 
    method="POST" 
    enctype="application/x-www-form-urlencoded" 
    use:enhance = "{submit}"
    class="card space-y-4 p-4">
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
