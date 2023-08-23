<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import type { User } from '$lib/model/user';
    import { createEventDispatcher } from 'svelte';

    // eslint-disable-next-line init-declarations
    export let heading: string;

    // eslint-disable-next-line init-declarations
    export let users: Pick<User, 'user_id' | 'name' | 'email' | 'picture'>[];

    // eslint-disable-next-line init-declarations
    export let uid: User['user_id'];

    type Color = 'success' | 'error';

    // eslint-disable-next-line init-declarations
    export let variant: `variant-ghost-${Color}`;

    const dispatch = createEventDispatcher<{ button: User['user_id'] }>();
    function click(evt: MouseEvent | KeyboardEvent) {
        if (evt.target === null) return;
        if (evt.target instanceof HTMLButtonElement) {
            const { user } = evt.target.dataset;
            if (typeof user === 'string') dispatch('button', user);
        }
    }
</script>

<section class="space-y-4">
    <h1 class="h1">{heading}</h1>
    {#if users.length === 0}
        <slot name="none" />
    {:else}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <ul class="card list" on:click="{click}" on:keydown="{click}">
            {#each users as { user_id, name, email, picture } (user_id)}
                <li class="p-4">
                    <Avatar src="{picture}" class="h-8 w-8" />
                    <div class="flex-1"><a href="mailto:{email}" class="anchor">{name}</a></div>
                    {#if user_id !== uid}
                        <button
                            type="button"
                            data-user="{user_id}"
                            class="btn-icon btn-icon-sm {variant}"
                        >
                            <slot name="icon" />
                        </button>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
</section>
