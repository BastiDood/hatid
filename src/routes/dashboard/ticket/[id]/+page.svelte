<script lang="ts">
    import {
        ArrowUturnLeftIcon as Back,
        PaperAirplaneIcon as Send,
    } from '@krowten/svelte-heroicons';
    import { Avatar } from '@skeletonlabs/skeleton';
    import Error from '$lib/components/alerts/Error.svelte';
    import type { PageServerData } from './$types';
    import Warning from '$lib/components/alerts/Warning.svelte';
    import autosize from '$lib/actions/autosize';
    import { enhance } from '$app/forms';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ messages, info, uid } = data);
</script>

{#if info === null || messages.length === 0}
    <a href="/dashboard/inbox" class="btn variant-filled-primary m-auto">
        <Back class="h-4 w-4" />
        <span>Go Back to Inbox</span>
    </a>
    <Error>
        <span>This ticket does not exist.</span>
    </Error>
{:else}
    {@const { title, open, due, priority } = info}
    <h1 class="h1">{title}</h1>
    <div class="grid grid-cols-[1fr_auto_auto] gap-4">
        <section class="flex flex-col space-y-4">
            {#each messages as { message_id, body, creation, author_id, name, email, picture } (message_id)}
                {@const id = message_id.toString()}
                {#if author_id === uid}
                    <article id="{id}" class="grid grid-cols-[1fr_auto] gap-2">
                        <div
                            class="card variant-ghost-tertiary space-y-2 rounded-xl rounded-tr-none p-4"
                        >
                            <header class="flex items-center justify-between">
                                <p class="font-bold">{name}</p>
                                <small class="opacity-50">{creation.toLocaleString()}</small>
                            </header>
                            <p>{body}</p>
                        </div>
                        <a href="mailto:{email}">
                            <Avatar src="{picture}" width="w-12" shadow="shadow-md" />
                        </a>
                    </article>
                {:else}
                    <article id="{id}" class="grid grid-cols-[auto_1fr] gap-2">
                        <a href="mailto:{email}">
                            <Avatar src="{picture}" width="w-12" shadow="shadow-md" />
                        </a>
                        <div
                            class="card variant-ghost-secondary space-y-2 rounded-xl rounded-tl-none p-4"
                        >
                            <header class="flex items-center justify-between">
                                <p class="font-bold">{name}</p>
                                <small class="opacity-50">{creation.toLocaleString()}</small>
                            </header>
                            <p>{body}</p>
                        </div>
                    </article>
                {/if}
            {/each}
            {#if open}
                <form
                    use:enhance
                    method="POST"
                    enctype="application/x-www-form-urlencoded"
                    class="input-group input-group-divider grid-cols-[1fr_auto] rounded-container-token"
                >
                    <textarea
                        use:autosize
                        required
                        name="body"
                        placeholder="Write a message..."
                        rows="1"
                        maxlength="1024"
                        class="resize-none border-0 bg-transparent ring-0"></textarea>
                    <button type="submit" class="variant-filled-primary">
                        <Send class="h-6 w-6" strokeWidth="2" />
                    </button>
                </form>
            {:else}
                <Warning>
                    <span>The ticket has been closed.</span>
                </Warning>
            {/if}
        </section>
        <span class="divider-vertical h-full"></span>
        <aside class="card variant-ghost-surface space-y-2 rounded-xl p-4">
            <div>
                <h4 class="h4">Labels</h4>
            </div>
            <hr />
            <div>
                <h4 class="h4">Priority</h4>
                {#if priority === null}
                    To be triaged.
                {:else}
                    {@const { title, priority: value } = priority}
                    <p>{title} [{value}]</p>
                {/if}
            </div>
            <hr />
            <div>
                <h4 class="h4">Due Date</h4>
                <p>{due.toLocaleString()}</p>
            </div>
            <hr />
            <div>
                <h4 class="h4">Assignees</h4>
            </div>
        </aside>
    </div>
{/if}
