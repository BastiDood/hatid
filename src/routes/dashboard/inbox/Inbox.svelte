<script lang="ts">
    import type { OpenTicket } from '$lib/model/ticket';

    // eslint-disable-next-line init-declarations
    export let tickets: OpenTicket[];
</script>

<div class="table-container">
    <table class="table table-hover">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Due Date</th>
                <th>Priority</th>
            </tr>
        </thead>
        <tbody>
            {#each tickets as { ticket_id, title, due, priority } (ticket_id)}
                <tr>
                    <td>{ticket_id}</td>
                    <td><a href="/dashboard/ticket/{ticket_id}" class="anchor">{title}</a></td>
                    <td>{due.toLocaleString()}</td>
                    <td>
                        {#if priority !== null}
                            {@const { title, priority: value } = priority}
                            {title} [{value}]
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
