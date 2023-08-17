<script lang="ts">
    import { DeptSchema } from '$lib/model/dept';
    import SubmitButton from './SubmitButton.svelte';
    import type { SubmitFunction } from '@sveltejs/kit';
    import assert from '$lib/assert';
    import { enhance } from '$app/forms';
    import { modalStore, toastStore } from '@skeletonlabs/skeleton';
    import { z } from 'zod';

    const ResultSchema = z.object({ id: DeptSchema.shape.dept_id });

    const submit: SubmitFunction = ({ formData }) => {
        const name = formData.get('name');
        assert(typeof name === 'string');
        return async ({ result, update }) => {
            assert(result.type === 'success');
            const { id } = ResultSchema.parse(result.data);
            await update();
            modalStore.close();
            toastStore.trigger({
                background: 'variant-filled-success',
                message: `Created new department "${name}" with ID ${id}.`,
            });
        };
    };
</script>

<form
    method="POST"
    enctype="application/x-www-form-urlencoded"
    use:enhance="{submit}"
    class="card space-y-4 p-4"
>
    <label class="label">
        <span>Name</span>
        <input required type="text" name="name" class="input" placeholder="Name" />
    </label>
    <SubmitButton />
</form>
