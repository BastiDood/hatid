<script>
    import CreateDepartment from '$lib/components/CreateDepartment.svelte';
    import CreateLabel from '$lib/components/CreateLabel.svelte';
    import CreatePriority from '$lib/components/CreatePriority.svelte';
    import CreateTicket from '$lib/components/CreateTicket.svelte';
    import Departments from '$lib/components/Departments.svelte';
    import Labels from '$lib/components/Labels.svelte';
    import Priorities from '$lib/components/Priorities.svelte';
</script>

<div
    class="ml-10 mr-10 mt-10 flex h-full flex-col space-y-7 pb-2 pl-5 pr-5 pt-5 border-token rounded-container-token"
>
    <h2 class="text-left">CREATE LABEL</h2>
    <CreateLabel />

    <h2 class="text-left">LABELS</h2>
    <Labels />

    <h2 class="text-left">CREATE DEPARTMENT</h2>
    <CreateDepartment />

    <h2 class="text-left">DEPARTMENTS</h2>
    <Departments />

    <h2 class="text-left">CREATE PRIORITY</h2>
    <CreatePriority />

    <h2 class="text-left">PRIORITIES</h2>
    <Priorities />

    <h2 class="text-left">CREATE TICKET</h2>
    <CreateTicket />
</div>
