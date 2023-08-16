<script lang="ts">
    import type { Priority } from '$lib/model/priority';
    export let priorities: Priority[];
</script>

<div class="table-container">
    <table class="table table-hover">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Level</th>
            </tr>
        </thead>
        <tbody>
            {#each priorities as { priority_id, priority, title } (priority_id)}
                <tr>
                    <td>{priority_id}</td>
                    <td>{title}</td>
                    <td>{priority}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
