<script>
    import CustomButton from '$lib/components/CustomButton.svelte';
    import CustomInput from '$lib/components/CustomInput.svelte';
</script>

<div class="ml-10 mr-10 mt-10 flex h-full flex-col space-y-7 bg-white pb-2 pl-5 pr-5 pt-5">
    <h2 class="text-left text-3xl tracking-widest" style="color:black; font-family: Bebas Neue;">
        CREATE LABEL
    </h2>
    <div class="bg-initial card flex w-full overflow-hidden" style="background-color:#5F2E2E;">
        <section class="flex grid w-full grid-cols-4 place-items-end gap-7 p-4">
            <CustomInput label="Title" defaultvalue="Title..." type="text" inputmode="text" />
            <CustomInput
                label="Deadline"
                defaultvalue="mm/dd/yyyy..."
                type="date"
                inputmode="text"
            />
            <CustomInput label="Color" inputmode="color" />
            <CustomButton title="Create Label" link="/dashboard" />
        </section>
    </div>
</div>
