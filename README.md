# Development

## Initialize the Database Folder

```bash
# Creates the `data/` folder in which PostgreSQL stores all rows.
pnpm db:init

# Starts Postgres in the terminal's foreground. You may want
# to open a new terminal session elsewhere after this point.
pnpm db:start
```

```bash
# Initialize the template/blueprint database. This allows us to
# create and tear down multiple instantiations of the template.
pnpm db:template

# Instantiate a single instance of the template named `tix`.
# Of course, you may change this into any name you want.
pnpm db:create tix

# OPTIONAL: Tear down the `tix` instance whenever you want.
pnpm db:drop tix

# OPTIONAL: Open a dedicated PostgreSQL shell (usually for debugging purposes).
pnpm db:shell
```

You should now have a properly initialized PostgreSQL database running in the foreground in some terminal session. You may, of course, opt to run PostgreSQL as a background service, but that is beyond the scope of this `README`.

## Running the SvelteKit Application

```bash
# Install the dependencies.
pnpm install
```

### Run the Development Server

In another terminal session, we may run the development server (i.e., without optimizations) as follows:

```bash
# Start the development server with live reloading + hot module replacement.
pnpm dev
```

### Run the Production Preview Server

In another terminal session, we may run the production preview server (i.e., with optimizations) as follows:

```bash
# Compile the production build (i.e., with optimizations).
pnpm build

# Start the production preview server.
pnpm preview
```
