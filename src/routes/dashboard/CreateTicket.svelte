<script lang="ts">
    import { ProgressBar, ProgressRadial } from '@skeletonlabs/skeleton';
    import { getAll, getLabels } from '$lib/api/dept';
    import Error from '@krowten/svelte-heroicons/icons/ExclamationCircleIcon.svelte';
    import type { Label } from '$lib/model/label';
    import SubmitButton from './SubmitButton.svelte';

    let promise: Promise<Pick<Label, 'label_id' | 'title' | 'color'>[]> | null = null;

    function onChange(this: HTMLSelectElement) {
        const { value } = this;
        promise = value.length === 0 ? null : getLabels(parseInt(value, 10));
    }
</script>

<!-- TODO: Migrate to SvelteKit form actions. -->
<form method="POST" enctype="application/x-www-form-urlencoded" class="card space-y-4 p-4">
    <label class="label">
        <span>Title</span>
        <input required type="text" class="input" name="title" placeholder="Title" />
    </label>
    {#await getAll()}
        <ProgressRadial width="w-12" class="m-auto" />
    {:then depts}
        <label class="label">
            <span>Assigned Department</span>
            <select required class="select" on:change="{onChange}">
                <!-- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required -->
                <option selected value="">--- Select a Department ---</option>
                {#each depts as { dept_id, name } (dept_id)}
                    <option value="{dept_id}">{name}</option>
                {/each}
            </select>
        </label>
        {#if promise !== null}
            {#await promise}
                <ProgressBar meter="bg-primary-400-500-token" />
            {:then labels}
                {#if labels.length === 0}
                    <div class="alert variant-soft-error">
                        <Error class="h-8 w-8" />
                        <p class="alert-message">
                            This department does not accept tickets at the moment.
                        </p>
                    </div>
                {:else}
                    <label class="label">
                        <span>Select Labels</span>
                        <select required multiple class="select" name="label">
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
                            class="textarea"
                            name="body"
                            cols="40"
                            rows="6"
                            placeholder="Write about your experience."></textarea>
                    </label>
                    <SubmitButton />
                {/if}
            {/await}
        {/if}
    {/await}
</form>
