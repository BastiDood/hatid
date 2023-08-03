<script>
    let colorValue = '';
</script>

<div class="h-full flex flex-col pt-5 pb-2 pl-5 pr-5 space-y-7 bg-white mt-10 ml-10 mr-10">
    <h2 class="text-3xl text-left tracking-widest" style="color:black; font-family: Bebas Neue;"> 
        CREATE LABEL 
    </h2>
        <div class="card bg-initial overflow-hidden w-full flex" style="background-color:#5F2E2E;">
            <section class="p-4 w-full flex grid grid-cols-2 gap-7 place-items-end">
                <!--Label-->
                <div class="relative mb-3 w-full">
                    <label
                    for="floatingInput"
                    class="block mb-2 text-md tracking-widest font-medium text-gray-900 dark:text-white"
                    style="font-family: Bebas Neue">
                        Title
                    </label>
                    <input
                    type="email"
                    class="peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-600 dark:text-neutral-200 dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                    id="floatingInput"
                    placeholder="name@example.com" />
                </div>
                <!--Deadline-->
                <div class="relative mb-3 w-full">
                    <label
                    for="floatingDate"
                    class="block mb-2 text-md tracking-widest font-medium text-gray-900 dark:text-white"
                    style="font-family: Bebas Neue">
                        Deadline
                    </label>
                    <input
                    type="text"
                    class="peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-600 dark:text-neutral-200 dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                    id="floatingDate"
                    placeholder="mm/dd/yyyy" />
                </div>
                <!--Colo-->
                <div class="relative mb-3 w-full">
                    <label
                    for="floatingColor"
                    class="block mb-2 text-md tracking-widest font-medium text-gray-900 dark:text-white"
                    style="font-family: Bebas Neue">
                        Color
                    </label>
                    <div class="grid grid-cols-[auto_1fr] gap-2 w-full">
                        <input class="input" type="color" bind:value={colorValue} />
                        <input class="peer m-0 block w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none peer-focus:text-primary dark:border-neutral-600 dark:text-neutral-200 dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]" id="floatingColor" type="text" bind:value={colorValue} readonly tabindex="-1" />
                    </div>
                </div>
                <div class="relative mb-3 w-full">
                    <a href="/#"                        
                    data-te-ripple-init
                    data-te-ripple-color="light"
                    class="block btn variant-filled mb-2 flex rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                    style="background-color: white">
                        Submit
                    </a>
                </div>
            </section>
        </div>
</div>
