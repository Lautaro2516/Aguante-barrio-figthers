FROM node:24-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@11.25.0 --activate && pnpm install --frozen-lockfile --prod
COPY dist ./dist
COPY server ./server
ENV NODE_ENV=production
ENV PORT=8787
EXPOSE 8787
USER node
CMD ["node", "server/index.cjs"]
