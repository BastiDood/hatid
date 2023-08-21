<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import type { User } from '$lib/model/user';

    // eslint-disable-next-line init-declarations
    export let users: Pick<User, 'user_id' | 'name' | 'picture' | 'email'>[];
</script>

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
