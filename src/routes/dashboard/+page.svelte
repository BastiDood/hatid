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
    <h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
        CREATE LABEL
    </h2>
    <CreateLabel />

    <h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
        LABELS
    </h2>
    <Labels />

    <h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
        CREATE DEPARTMENT
    </h2>
    <CreateDepartment />

    <h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
        DEPARTMENTS
    </h2>
    <Departments />

    <h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
        CREATE PRIORITY
    </h2>
    <CreatePriority />

    <h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
        PRIORITIES
    </h2>
    <Priorities />

    <h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
        CREATE TICKET
    </h2>
    <CreateTicket />
</div>
