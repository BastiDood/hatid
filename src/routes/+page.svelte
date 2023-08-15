<script lang="ts">
    import { AppBar, AppShell } from '@skeletonlabs/skeleton';
    import type { PageServerData } from './$types';
    import hatidLogo from '$lib/images/HATiD.png';

    // eslint-disable-next-line init-declarations
    export let data: PageServerData;
</script>

<AppShell>
    <AppBar slot="header">
        <svelte:fragment slot="lead"
            ><span class="h3 p-2">
                <a href="/"><img src="{hatidLogo}" alt="HATiD" class="h-10" /></a>
            </span></svelte:fragment
        >
        <svelte:fragment slot="trail" />
    </AppBar>

    <slot />
    <div class="flex h-full items-center justify-center">
        <div class="bg-initial card overflow-hidden">
            {#if data.user === null}
                <header class="bold h4 card-header flex items-center justify-center">LOGIN</header>
                <section class="p-4">
                    <!--Email input-->
                    <div class="relative mb-3">
                        <input
                            type="email"
                            class="peer m-0 block h-[58px] w-full rounded bg-clip-padding px-3 py-4 placeholder:text-transparent [&:not(:placeholder-shown)]:pb-[0.625rem] [&:not(:placeholder-shown)]:pt-[1.625rem]"
                            id="floatingInput"
                            placeholder="name@example.com"
                        />
                        <label
                            for="floatingInput"
                            class="pointer-events-none absolute left-0 top-0 origin-[0_0] border border-solid border-transparent px-3 py-4"
                        >
                            Email address
                        </label>
                    </div>

                    <!--Password input-->
                    <div class="relative mb-3">
                        <input
                            type="password"
                            class="peer m-0 block h-[58px] w-full rounded bg-clip-padding px-3 py-4"
                            id="floatingPassword"
                            placeholder="Password"
                        />
                        <label
                            for="floatingPassword"
                            class="pointer-events-none absolute left-0 top-0 origin-[0_0] px-3 py-4"
                            >Password</label
                        >
                    </div>
                    <a href="/" class="btn variant-filled mb-2 flex rounded px-6 py-2.5 uppercase">
                        Login
                    </a>
                    <div class="mb-0 inline-flex w-full items-center justify-center">
                        <hr class="my-8 h-1 w-3/6" />
                        <span class="px-3">or</span>
                        <hr class="my-8 h-1 w-3/6" />
                    </div>
                </section>
                <footer class="card-footer flex items-center justify-center">
                    <a
                        href="/auth/login"
                        class="btn variant-filled mb-2 flex w-full rounded px-6 py-2.5 text-xs uppercase"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
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
                <header class="bold h4 card-header flex items-center justify-center">
                    ALREADY LOGGED IN
                </header>
                <section class="p-4"></section>
                <footer class="card-footer flex items-center justify-center">
                    <a
                        href="/dashboard"
                        class="btn variant-filled mb-2 flex w-full rounded px-6 py-2.5 text-xs"
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
