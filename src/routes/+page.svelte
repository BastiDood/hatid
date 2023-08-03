<script lang="ts">
    import { AppBar, AppShell } from '@skeletonlabs/skeleton';
    import type { PageServerData } from './$types';
    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
    const src = '/HATiD.png';
</script>

<AppShell>
    <AppBar slot="header" background="bg-red-950">
        <svelte:fragment slot="lead"><span class="p-2 h3" style="font-weight: 700;">
            <a href="/"><img {src} alt="HATiD" class="h-10" /></a>
        </span></svelte:fragment>
        <svelte:fragment slot="trail">        
        </svelte:fragment>
    </AppBar>

	<slot />
    <div class="h-full flex items-center justify-center">
        <div class="card bg-initial overflow-hidden" style="width: 50vh; background-color:#5F2E2E;" >

                {#if data.user === null}
                    <header class="card-header flex justify-center items-center h4 bold" style="margin-top: 5%; margin-bottom: 2%; font-weight: 700;">LOGIN</header>
                    <section class="p-4">
                        <!--Email input-->
                        <div class="relative mb-3">
                            <input
                            type="email"
                            class="peer m-0 block h-[58px] w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none peer-focus:text-primary dark:border-neutral-600 dark:text-neutral-200 dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                            id="floatingInput"
                            placeholder="name@example.com" />
                            <label
                            for="floatingInput"
                            class="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
                                Email address
                            </label>
                        </div>
                        
                        <!--Password input-->
                        <div class="relative mb-3">
                            <input
                            type="password"
                            class="peer m-0 block h-[58px] w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:border-primary focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:shadow-te-primary focus:outline-none peer-focus:text-primary dark:border-neutral-600 dark:text-neutral-200 dark:focus:border-primary dark:peer-focus:text-primary [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                            id="floatingPassword"
                            placeholder="Password" />
                            <label
                            for="floatingPassword"
                            class="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                            >Password</label
                            >
                        </div>
                        <a href="/"                        
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        class="btn variant-filled mb-2 flex rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                        style="background-color: white">
                            Login
                        </a>
                        <div class="inline-flex items-center justify-center w-full mb-0">
                            <hr class="w-3/6 h-1 my-8 bg-white dark:bg-white" style="margin-left: 3%; margin-right: 1%;">
                            <span class=" px-3 font-medium text-gray-900 dark:text-white">or</span>
                            <hr class="w-3/6 h-1 my-8 bg-white dark:bg-white" style="margin-left: 1%; margin-right: 3%" >
                        </div>
                    </section>
                    <footer class="card-footer flex justify-center items-center">
                        <a href="/auth/login"
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        class="w-full btn variant-filled mb-2 flex rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                        style="background-color: white">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        style="margin-right: 4px;"
                        >
                        <path
                            d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"
                            fill-rule="evenodd"
                            clip-rule="evenodd" />
                        </svg>
                         Sign in with Google
                    </a>
                    </footer>
                {:else}
                    <header class="card-header flex justify-center items-center h4 bold" style="margin-top: 5%; margin-bottom: 2%; font-weight: 700;">ALREADY LOGGED IN</header>
                    <section class="p-4">

                    </section>
                    <footer class="card-footer flex justify-center items-center">
                        <a href="/dashboard"
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            class="w-full btn variant-filled mb-2 flex rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                            style="background-color: white">
                            Go to Dashboard
                        </a>
                    </footer>
                {/if}
        </div>  
    </div>
<!-- 
	<AppBar slot="footer">Footer</AppBar> -->
	<!-- (footer) -->

    <footer
        class="bg-neutral-200 text-center dark:bg-neutral-700 lg:text-left">
        <div class="p-4 text-center text-neutral-700 dark:text-neutral-200">
            © 2023 Copyright:
            <a
            class="text-neutral-800 dark:text-neutral-400"
            href="https://tailwind-elements.com/"
            >Tailwind Elements</a
            >
        </div>
    </footer>
</AppShell>

