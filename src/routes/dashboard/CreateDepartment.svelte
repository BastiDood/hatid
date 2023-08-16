<script>
    import SubmitButton from './SubmitButton.svelte';
</script>

<!-- TODO: Migrate to SvelteKit form actions. -->
<form method="POST" enctype="application/x-www-form-urlencoded" class="card space-y-4 p-4">
    <label class="label">
        <span>Name</span>
        <input required type="text" name="name" class="input" placeholder="Name" />
    </label>
    <SubmitButton />
</form>
