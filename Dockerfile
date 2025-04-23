FROM node:lts-alpine AS dependencies
WORKDIR /app
COPY package.json ./
RUN yarn install

FROM node:lts-alpine AS builder
ARG ENVIRONMENT=dev
WORKDIR /app
COPY ./ .
RUN echo "Build environment is $ENVIRONMENT"
RUN rm -rf .env.*
COPY ./.env.${ENVIRONMENT} .env
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn run build

FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
ENV HOSTNAME="0.0.0.0"
EXPOSE 3004

CMD ["yarn", "start", "-p" , "3004"]
