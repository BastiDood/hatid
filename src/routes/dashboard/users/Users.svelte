<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import type { User } from '$lib/model/user';

    // eslint-disable-next-line init-declarations
    export let users: User[];
</script>

<div class="table-container">
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Picture</th>
                <th>Name</th>
                <th>E-mail</th>
            </tr>
        </thead>
        <tbody>
            {#each users as { picture, name, email, user_id } (user_id)}
                <tr>
                    <td class="flex w-20 justify-center"
                        ><Avatar src="{picture}" class="h-8 w-8" /></td
                    >
                    <td>{name}</td>
                    <td>{email}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
