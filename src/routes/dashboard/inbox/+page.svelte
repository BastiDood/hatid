<script>
    import { InboxIcon as Inbox, InboxStackIcon as InboxStack } from '@krowten/svelte-heroicons';
    import OpenTicket from './OpenTicket.svelte';
</script>

<OpenTicket />
<div class="logo-cloud flex flex-row gap-1">
    <a href="/dashboard/inbox/user" class="logo-item">
        <Inbox class="h-8 w-8" />
        <span>Your Tickets</span>
    </a>
    <a href="/dashboard/inbox/agent" class="logo-item">
        <InboxStack class="h-8 w-8" />
        <span>Assigned to You</span>
    </a>
</div>
