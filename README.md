# Development

## Initialize the Database Folder

```bash
# Creates the `data/` folder in which PostgreSQL stores all rows.
pnpm db:init

# Starts Postgres in the terminal's foreground. We may want
# to open a new terminal session elsewhere after this point.
pnpm db:start
```

```bash
# Initialize the template/blueprint database. This allows us to
# create and tear down multiple instantiations of the template.
pnpm db:template

# Instantiate a single instance of the template named `tix`.
# Of course, we may change this into any name we want.
pnpm db:create tix

# OPTIONAL: Tear down the `tix` instance whenever we want.
pnpm db:drop tix

# OPTIONAL: Open a dedicated PostgreSQL shell into the `tix` instance (usually for debugging purposes).
pnpm db:shell tix
```

We should now have a properly initialized PostgreSQL database running in the foreground in some terminal session. We may, of course, opt to run PostgreSQL as a background service, but that is beyond the scope of this `README`.

## Running the SvelteKit Application

```bash
# Install the dependencies.
pnpm install
```

### Environment Variables

| **Name**         | **Description**                                             | **Required** | **Default** |
| ---------------- | ----------------------------------------------------------- | :----------: | ----------: |
| `HOST`           | Hostname on which the server will be hosted.                |   &#x274c;   |   `0.0.0.0` |
| `PORT`           | Port on which the server will be hosted.                    |   &#x274c;   |      `3000` |
| `GOOGLE_ID`      | Client ID obtained from the [Google Cloud Console].         |   &#x2714;   |             |
| `GOOGLE_SECRET`  | Client secret obtained from the [Google Cloud Console].     |   &#x2714;   |             |
| `OAUTH_REDIRECT` | OAuth 2.0 redirect URI set from the [Google Cloud Console]. |   &#x2714;   |             |
| `PGHOST`         | IP host name of the [PostgreSQL] instance.                  |   &#x274c;   | `127.0.0.1` |
| `PGPORT`         | Port number of the [PostgreSQL] instance.                   |   &#x274c;   |      `5432` |
| `PGUSER`         | Provided username when logging into [PostgreSQL].           |   &#x274c;   |  `postgres` |
| `PGPASSWORD`     | Provided password when logging into [PostgreSQL].           |   &#x2714;   |             |
| `PGDATABASE`     | Default database in the [PostgreSQL] instance.              |   &#x274c;   |     `hatid` |

Note that [`@sveltejs/adapter-node`] also respects additional environment variables.

[PostgreSQL]: https://www.postgresql.org/
[Google Cloud Console]: https://console.cloud.google.com/
[`@sveltejs/adapter-node`]: https://kit.svelte.dev/docs/adapter-node

### Development Server

In another terminal session, we may run the development server (i.e., without optimizations) as follows:

```bash
# Start the development server with live reloading + hot module replacement.
pnpm dev
```

### Production Preview Server

In another terminal session, we may run the production preview server (i.e., with optimizations) as follows:

```bash
# Compile the production build (i.e., with optimizations).
pnpm build

# Start the production preview server.
pnpm preview
```
