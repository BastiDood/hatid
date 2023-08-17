<script lang="ts">
    import type { Dept } from '$lib/model/dept';

    // eslint-disable-next-line init-declarations
    export let depts: Dept[];
</script>

<div class="table-container">
    <table class="table table-hover">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
            </tr>
        </thead>
        <tbody>
            {#each depts as { dept_id, name } (dept_id)}
                <tr>
                    <td>{dept_id}</td>
                    <td><a class="anchor" href="/dashboard/dept/{dept_id}">{name}</a></td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
