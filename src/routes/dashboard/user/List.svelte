<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import type { User } from '$lib/model/user';

    // eslint-disable-next-line init-declarations
    export let heading: string;

    // eslint-disable-next-line init-declarations
    export let users: Pick<User, 'user_id' | 'name' | 'email' | 'picture'>[];

    // eslint-disable-next-line init-declarations
    export let uid: User['user_id'];
</script>

<section class="space-y-4">
    <h1 class="h1">{heading}</h1>
    {#if users.length === 0}
        <slot name="none" />
    {:else}
        <ul class="card list">
            {#each users as { user_id, name, email, picture } (user_id)}
                <li class="p-4">
                    <Avatar src="{picture}" class="h-8 w-8" />
                    <a href="mailto:{email}" class="anchor flex-1">{name}</a>
                    {#if user_id !== uid}
                        <button type="button" class="btn-icon btn-icon-sm variant-ghost-error">
                            <slot name="icon" />
                        </button>
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
</section>
