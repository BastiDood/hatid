<script lang="ts">
    import { AppBar, AppShell } from '@skeletonlabs/skeleton';
    import type { PageServerData } from './$types';
    import hatidLogo from '$lib/images/HATiD.png';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
</script>

<AppShell>
    <AppBar slot="header" background="bg-red-950">
        <svelte:fragment slot="lead"
            ><span class="h3 p-2" style="font-weight: 700;">
                <a href="/"><img src="{hatidLogo}" alt="HATiD" class="h-10" /></a>
            </span></svelte:fragment
        >
        <svelte:fragment slot="trail" />
    </AppBar>

    <slot />
    <div class="flex h-full items-center justify-center">
        <div class="bg-initial card overflow-hidden" style="width: 50vh; background-color:#5F2E2E;">
            {#if data.user === null}
                <header
                    class="bold h4 card-header flex items-center justify-center"
                    style="margin-top: 5%; margin-bottom: 2%; font-weight: 700;"
                >
                    LOGIN
                </header>
                <section class="p-4">
                    <!--Email input-->
                    <div class="relative mb-3">
                        <input
                            type="email"
                            class="focus:border-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block h-[58px] w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200 [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                            id="floatingInput"
                            placeholder="name@example.com"
                        />
                        <label
                            for="floatingInput"
                            class="peer-focus:text-primary dark:peer-focus:text-primary pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-200"
                        >
                            Email address
                        </label>
                    </div>

                    <!--Password input-->
                    <div class="relative mb-3">
                        <input
                            type="password"
                            class="focus:border-primary focus:shadow-te-primary peer-focus:text-primary dark:focus:border-primary dark:peer-focus:text-primary peer m-0 block h-[58px] w-full rounded bg-red-950 bg-clip-padding px-3 py-4 text-base font-normal leading-tight text-neutral-700 transition duration-200 ease-linear placeholder:text-transparent focus:pb-[0.625rem] focus:pt-[1.625rem] focus:text-neutral-700 focus:outline-none dark:border-neutral-600 dark:text-neutral-200 [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                            id="floatingPassword"
                            placeholder="Password"
                        />
                        <label
                            for="floatingPassword"
                            class="peer-focus:text-primary dark:peer-focus:text-primary pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4 text-neutral-500 transition-[opacity,_transform] duration-200 ease-linear peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:translate-x-[0.15rem] peer-[:not(:placeholder-shown)]:scale-[0.85] motion-reduce:transition-none dark:text-neutral-200"
                            >Password</label
                        >
                    </div>
                    <a
                        href="/"
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        class="btn variant-filled mb-2 flex rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                        style="background-color: white"
                    >
                        Login
                    </a>
                    <div class="mb-0 inline-flex w-full items-center justify-center">
                        <hr
                            class="my-8 h-1 w-3/6 bg-white dark:bg-white"
                            style="margin-left: 3%; margin-right: 1%;"
                        />
                        <span class=" px-3 font-medium text-gray-900 dark:text-white">or</span>
                        <hr
                            class="my-8 h-1 w-3/6 bg-white dark:bg-white"
                            style="margin-left: 1%; margin-right: 3%"
                        />
                    </div>
                </section>
                <footer class="card-footer flex items-center justify-center">
                    <a
                        href="/auth/login"
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        class="btn variant-filled mb-2 flex w-full rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                        style="background-color: white"
                    >
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
                                clip-rule="evenodd"></path>
                        </svg>
                        Sign in with Google
                    </a>
                </footer>
            {:else}
                <header
                    class="bold h4 card-header flex items-center justify-center"
                    style="margin-top: 5%; margin-bottom: 2%; font-weight: 700;"
                >
                    ALREADY LOGGED IN
                </header>
                <section class="p-4"></section>
                <footer class="card-footer flex items-center justify-center">
                    <a
                        href="/dashboard"
                        data-te-ripple-init
                        data-te-ripple-color="light"
                        class="btn variant-filled mb-2 flex w-full rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
                        style="background-color: white"
                    >
                        Go to Dashboard
                    </a>
                </footer>
            {/if}
        </div>
    </div>
    <!--
	<AppBar slot="footer">Footer</AppBar> -->
    <!-- (footer) -->
</AppShell>
