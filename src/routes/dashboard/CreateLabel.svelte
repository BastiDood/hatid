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
        <span>Color</span>
        <input required type="color" name="color" class="input" />
    </label>
    <label class="label">
        <span>Deadline</span>
        <input type="number" name="deadline" min="1" max="365" class="input" placeholder="Days" />
    </label>
    <SubmitButton />
</form>
