# HATiD

**HATiD** is a **H**elpdesk **A**nd **Ti**cketing **D**ashboard written in [TypeScript] and [Svelte]. It is a full-stack web application on top of the [SvelteKit] framework. In the back end, it uses PostgreSQL as the database.

[TypeScript]: https://www.typescriptlang.org/
[Svelte]: https://svelte.dev/
[SvelteKit]: https://kit.svelte.dev/
[PostgreSQL]: https://www.postgresql.org/

> "Hatid" [hɐˈtid] is a Filipino word which means "to deliver".

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
pnpm db:schema

# Also create the functions for the template database. This can be
# rerun # as many times as needed without reinitializing the `data`
# folder. Note that existing databases must be reinstantiated (i.e.,
# drop then create again).
pnpm db:func

# Instantiate a single instance of the template named `hatid`.
# Of course, we may change this into any name we want.
pnpm db:create hatid

# OPTIONAL: Tear down the `hatid` instance whenever we want.
pnpm db:drop hatid

# OPTIONAL: Open a dedicated PostgreSQL shell into the `hatid` instance (usually for debugging purposes).
pnpm db:shell hatid
```

We should now have a properly initialized PostgreSQL database running in the foreground in some terminal session. We may, of course, opt to run PostgreSQL as a background service, but that is beyond the scope of this `README`.

## Running the SvelteKit Application

```bash
# Install the dependencies.
pnpm install
```

### Environment Variables

The following environment variables are typically added to a `.env` file. Although SvelteKit allows us to embed environment variables at compile-time, we instead opt to always dynamically load the variables at runtime. This is mainly for security reasons so that credentials cannot be leaked should a Docker image be pushed to a public registry.

| **Name**         | **Description**                                             | **Required** |                      **Default** |
| ---------------- | ----------------------------------------------------------- | :----------: | -------------------------------: |
| `HOST`           | Hostname on which the server will be hosted.                |   &#x274c;   |                        `0.0.0.0` |
| `PORT`           | Port on which the server will be hosted.                    |   &#x274c;   |                           `3000` |
| `GOOGLE_ID`      | Client ID obtained from the [Google Cloud Console].         |   &#x2714;   |                                  |
| `GOOGLE_SECRET`  | Client secret obtained from the [Google Cloud Console].     |   &#x2714;   |                                  |
| `OAUTH_REDIRECT` | OAuth 2.0 redirect URI set from the [Google Cloud Console]. |   &#x274c;   | `http://127.0.0.1/auth/callback` |
| `PGHOST`         | IP host name of the [PostgreSQL] instance.                  |   &#x274c;   |                      `127.0.0.1` |
| `PGPORT`         | Port number of the [PostgreSQL] instance.                   |   &#x274c;   |                           `5432` |
| `PGUSER`         | Provided username when logging into [PostgreSQL].           |   &#x274c;   |                       `postgres` |
| `PGPASSWORD`     | Provided password when logging into [PostgreSQL].           |   &#x2714;   |                                  |
| `PGDATABASE`     | Default database in the [PostgreSQL] instance.              |   &#x274c;   |                          `hatid` |

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

# Production Deployment with Docker Compose

The [`postgres`][docker-postgres] image inspects the following environment variables for first-time builds. Observe that some variables in the documentation have been omitted for brevity. Also note that this project's [`docker-compose.yml`] configures these variables via a `.env.postgres` file.

[docker-postgres]: https://github.com/docker-library/docs/blob/9f75f251347c82b06483d47b14bcca79ad077fcd/postgres/README.md#environment-variables
[`docker-compose.yml`]: ./docker-compose.yml

| **Name**            | **Description**                                                                   | **Required** | **Default** |
| ------------------- | --------------------------------------------------------------------------------- | :----------: | ----------: |
| `POSTGRES_USER`     | Sets the superuser name.                                                          |   &#x274c;   |  `postgres` |
| `POSTGRES_PASSWORD` | Sets the superuser password.                                                      |   &#x2714;   |             |
| `POSTGRES_DB`       | Sets the name for the default database. Defaults to the value of `POSTGRES_USER`. |   &#x274c;   |  `postgres` |

Once the `.env` and `.env.postgres` files are ready, we may now run Docker Compose.

```bash
# Run the PostgreSQL and Node.js server in the background.
docker compose up -d

# OPTIONAL: Tear down the containers.
docker compose down
```
