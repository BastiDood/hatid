<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import { ArrowUturnLeftIcon as Back } from '@krowten/svelte-heroicons';
    import type { PageServerData } from './$types';
    import Warning from '$lib/components/alerts/Warning.svelte';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    $: ({ users } = data);
</script>

<a href="/dashboard/dept" class="variant-filled-primary btn m-auto">
    <Back class="h-4 w-4" />
    <span>Go Back</span>
</a>
{#if users.length === 0}
    <Warning>
        <span>There are no agents in this department.</span>
    </Warning>
{:else}
    <div class="table-container">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {#each users as { picture, name, email, user_id } (user_id)}
                    <tr>
                        <td class="flex flex-row items-center gap-2">
                            <Avatar src="{picture}" class="h-8 w-8" />
                            <span>{name}</span>
                        </td>
                        <td><a href="{email}" class="anchor">{email}</a></td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}
