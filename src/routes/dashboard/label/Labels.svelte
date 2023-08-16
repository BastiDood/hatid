<script lang="ts">
    import type { Label } from '$lib/model/label';

    // eslint-disable-next-line init-declarations
    export let labels: Label[];
</script>

<div class="table-container">
    <table class="table table-hover">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Color</th>
                <th>Deadline</th>
            </tr>
        </thead>
        <tbody>
            {#each labels as { label_id, title, color, deadline } (label_id)}
                <!--
                    We need to truncate the alpha channel because the `<input>` element only
                    supports  RGB, not RGBA. Hence, we have the unsigned arithmetic right-shift.
                -->
                {@const rgb = color >>> 8}
                {@const hex = rgb.toString(16)}
                <tr>
                    <td>{label_id}</td>
                    <td>{title}</td>
                    <td><input type="color" class="input" value="#{hex}" /></td>
                    <td>
                        {#if deadline !== null}
                            {deadline} Days
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
