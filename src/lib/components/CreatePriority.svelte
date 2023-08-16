<form method="POST" enctype="application/x-www-form-urlencoded" class="card space-y-4 p-4">
    <label class="label">
        <span>Title</span>
        <input required type="text" class="input" placeholder="Title" />
    </label>
    <label class="label">
        <span>Priority</span>
        <input
            required
            type="number"
            value="0"
            min="-2147483648"
            max="2147483647"
            class="input"
            placeholder="Priority"
        />
    </label>
    <div class="flex justify-center">
        <button type="submit" class="m-0-auto btn variant-filled-primary"> Submit </button>
    </div>
</form>
