<script>
    import CustomButton from '$lib/components/CustomButton.svelte';
    import CustomInput from '$lib/components/CustomInput.svelte';
</script>

<div class="h-full flex flex-col pt-5 pb-2 pl-5 pr-5 space-y-7 bg-white mt-10 ml-10 mr-10">
    <h2 class="text-3xl text-left tracking-widest" style="color:black; font-family: Bebas Neue;"> 
        CREATE LABEL 
    </h2>
        <div class="card bg-initial overflow-hidden w-full flex" style="background-color:#5F2E2E;">
            <section class="p-4 w-full flex grid grid-cols-4 gap-7 place-items-end">
                <CustomInput label='Title' defaultvalue='Title...' type='text' inputmode='text'/>
                <CustomInput label='Deadline' defaultvalue='mm/dd/yyyy...' type='date' inputmode='text'/>
                <CustomInput label='Color' inputmode='color'/>
                <CustomButton title='Create Label' link='/dashboard'/>
            </section>
        </div>
</div>
