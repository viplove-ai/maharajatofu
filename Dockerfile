# Next.js standalone build. Two stages rather than three: unlike nirman's
# frontend there is no separate dev image — `npm run dev` runs on the host, and
# a dev stage nobody builds is a stage nobody keeps working.

FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Baked into the client bundle at build time, so they are build args rather than
# runtime env. Nothing secret goes here — everything below is public on the page.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_WHATSAPP
ARG NEXT_PUBLIC_FSSAI
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_WHATSAPP=$NEXT_PUBLIC_WHATSAPP \
    NEXT_PUBLIC_FSSAI=$NEXT_PUBLIC_FSSAI \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN addgroup -S app && adduser -S app -G app

# `output: standalone` traces exactly the files the server needs. static/ and
# public/ are not traced and have to be copied alongside it.
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public

USER app
EXPOSE 3000
CMD ["node", "server.js"]
