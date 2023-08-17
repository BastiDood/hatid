<script lang="ts">
    import { modalStore, toastStore } from '@skeletonlabs/skeleton';
    import { LabelSchema } from '$lib/model/label';
    import SubmitButton from './SubmitButton.svelte';
    import type { SubmitFunction } from '@sveltejs/kit';
    import assert from '$lib/assert';
    import { enhance } from '$app/forms';
    import { z } from 'zod';

    const ResultSchema = z.object({ id: LabelSchema.shape.label_id });

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
                message: `Created new label "${name}" with ID ${id}.`,
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
        <span>Color</span>
        <input required type="color" name="color" value="#000000" class="input" />
    </label>
    <label class="label">
        <span>Deadline</span>
        <input type="number" name="deadline" min="1" max="365" class="input" placeholder="Days" />
    </label>
    <SubmitButton />
</form>
