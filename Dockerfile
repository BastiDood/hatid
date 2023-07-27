FROM node:20.5.0-alpine3.18 as builder

# Cache the dependencies into the virtual store first.
WORKDIR /hatid
COPY package.json pnpm-lock.yaml .
RUN corepack enable && pnpm install -r --dev

# Build the application.
COPY . .
RUN pnpm sync && pnpm build

FROM alpine:3.18.2

# Installs Node.js without `npm` to keep things lightweight.
RUN apk add --update nodejs-current=20.5.0-r0

WORKDIR /app
COPY --link --from=builder /hatid/package.json /hatid/build/ /hatid/db/ .

CMD ["node", "."]
