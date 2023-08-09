<script>
    import CreateDepartment from '$lib/components/CreateDepartment.svelte';
    import CreateLabel from '$lib/components/CreateLabel.svelte';
    import CreatePriority from '$lib/components/CreatePriority.svelte';
    import CreateTicket from '$lib/components/CreateTicket.svelte';
    import Departments from '$lib/components/Departments.svelte';
    import Labels from '$lib/components/Labels.svelte';
    import Priorities from '$lib/components/Priorities.svelte';
</script>

<div class="ml-10 mr-10 mt-10 flex h-full flex-col space-y-7 pb-2 pl-5 pr-5 pt-5">
    <CreateLabel />
    <Labels />
    <CreateDepartment />
    <Departments />
    <CreatePriority />
    <Priorities />
    <CreateTicket />
</div>
