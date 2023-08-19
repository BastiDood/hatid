<script lang="ts">
    import { ArrowUturnLeftIcon as Back } from '@krowten/svelte-heroicons';
    import type { PageServerData } from './$types';
    import SubmitButton from '../SubmitButton.svelte';
    import Warning from '$lib/components/alerts/Warning.svelte';
    import { enhance } from '$app/forms';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ labels } = data);
</script>

{#if labels.length === 0}
    <a href="/dashboard" class="btn variant-filled-primary m-auto">
        <Back class="h-4 w-4" />
        <span>Go Back to Dashboard</span>
    </a>
    <Warning>
        <span>
            The system is not yet ready to accept tickets because there are no labels available at
            the moment.
        </span>
    </Warning>
{:else}
    <form
        use:enhance
        method="POST"
        enctype="application/x-www-form-urlencoded"
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
                    {@const hex = rgb.toString(16).padStart(6, '0')}
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
