########
# BASE #
########
FROM node:16-alpine AS base

WORKDIR /opt/service

RUN apk update && apk upgrade && \
    apk add --no-cache openssl ca-certificates && \
    update-ca-certificates

RUN npm install -g npm

###########
# BUILDER #
###########
FROM base AS builder

COPY . ./

RUN npm install \
    && npm run build \
    && npm prune --production

###########
# RELEASE #
###########
FROM base AS release

ENV NODE_ENV=production

COPY --from=builder /opt/service/node_modules node_modules
COPY --from=builder /opt/service/dist dist

RUN chown -R node /opt/service
USER node

CMD ["node", "dist/main"]
