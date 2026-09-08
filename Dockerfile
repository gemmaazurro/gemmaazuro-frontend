# Gemmaazuro storefront (Next.js, npm). Targets: dev (compose bind-mount), prod (standalone).
FROM node:22-alpine AS base
WORKDIR /app
# sharp's musl prebuild and Next's SWC binary both want glibc shims on Alpine.
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./

# ---- dev: hot reload, code bind-mounted ----
FROM base AS dev
RUN npm install
EXPOSE 3000
CMD ["npx", "next", "dev", "-H", "0.0.0.0"]

# ---- build ----
FROM base AS build
# Every NEXT_PUBLIC_ var is inlined into the client bundle at build time, so
# these have to be build args -- setting them as runtime env in Dokploy would
# leave the browser bundle pointing at the defaults below.
ARG NEXT_PUBLIC_BACKEND_API_URL=https://backend.gemmaazuro.com
ARG NEXT_PUBLIC_SITE_URL=https://gemmaazuro.com
ARG NEXT_PUBLIC_IMGPROXY_URL=
ARG NEXT_PUBLIC_WHATSAPP_PHONE=
ENV NEXT_PUBLIC_BACKEND_API_URL=$NEXT_PUBLIC_BACKEND_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_IMGPROXY_URL=$NEXT_PUBLIC_IMGPROXY_URL
ENV NEXT_PUBLIC_WHATSAPP_PHONE=$NEXT_PUBLIC_WHATSAPP_PHONE
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm ci
COPY . .
RUN npm run build

# ---- prod runtime (standalone) ----
FROM node:22-alpine AS prod
WORKDIR /app
RUN apk add --no-cache libc6-compat wget
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# server.js binds to HOSTNAME/PORT; 0.0.0.0 so Dokploy's proxy can reach it.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
