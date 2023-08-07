<script>
    export let title = "";
    export let link = "";
</script>

<div class="relative mb-3 w-full">
    <a
        href="{link}"
        data-te-ripple-init
        data-te-ripple-color="light"
        class="btn variant-filled mb-2 block flex rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
        style="background-color: white"
    >
        {title}
    </a>
</div>
