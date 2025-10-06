FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

COPY package.json ./

COPY yarn.lock* ./

RUN if [ -f yarn.lock ]; then \
      yarn --version && \
      ( yarn install --frozen-lockfile || yarn install --immutable ); \
    else \
      echo "No yarn.lock found; doing unlocked install" && yarn install; \
    fi

COPY . .
RUN yarn build

FROM caddy:2.8-alpine
WORKDIR /srv

COPY --from=build /app/dist ./

COPY <<'CADDY' /etc/caddy/Caddyfile
:3000
encode zstd gzip
handle_path /* {
  root * /srv
  file_server
  try_files {path} /index.html
}
CADDY

EXPOSE 3000
