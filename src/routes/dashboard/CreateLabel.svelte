<script lang="ts">
    import SubmitButton from './SubmitButton.svelte';
    import type { SubmitFunction } from '@sveltejs/kit';
    import assert from '$lib/assert';
    import { enhance } from '$app/forms';
    import { modalStore, toastStore } from '@skeletonlabs/skeleton';
    import { z } from 'zod';
    import { LabelSchema } from '$lib/model/label';

    const ResultSchema = z.object({ id: LabelSchema.shape.label_id });

    const submit: SubmitFunction = ({ formData }) => {
        const name = formData.get('color');
        console.log(name);
        assert(typeof name === 'string');
        return async ({ result, update }) => {
            assert(result.type === 'success');
            const { id } = ResultSchema.parse(result.data);
            await update();
            modalStore.close();
            toastStore.trigger({
                background: 'variant-ghost-success',
                message: `Created new label "${name}" with ID ${id}.`,
            });
        };
    };
</script>

<!-- TODO: Migrate to SvelteKit form actions. -->
<form 
    method="POST" 
    enctype="application/x-www-form-urlencoded"
    use:enhance="{submit}" 
    class="card space-y-4 p-4">
    <label class="label">
        <span>Title</span>
        <input required type="text" name="title" class="input" placeholder="Title" />
    </label>
    <label class="label">
        <span>Color</span>
        <input required type="color" name="color" class="input" />
    </label>
    <label class="label">
        <span>Deadline</span>
        <input type="number" name="deadline" min="1" max="365" class="input" placeholder="Days" />
    </label>
    <SubmitButton />
</form>
