<script>
    import SubmitButton from './SubmitButton.svelte';
</script>

<!-- TODO: Migrate to SvelteKit form actions. -->
<form method="POST" enctype="application/x-www-form-urlencoded" class="card space-y-4 p-4">
    <label class="label">
        <span>Title</span>
        <input required type="text" name="title" class="input" placeholder="Title" />
    </label>
    <label class="label">
        <span>Priority</span>
        <input
            required
            type="number"
            value="0"
            min="-2147483648"
            max="2147483647"
            name="priority"
            class="input"
            placeholder="Priority"
        />
    </label>
    <SubmitButton />
</form>
