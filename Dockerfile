# ---- Build the React site ----
FROM node:20.18.1-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# prebuild regenerates public/sitemap.xml + robots.txt
RUN npm run build

# ---- Runtime: Node serves dist/ + the leads API ----
FROM node:20.18.1-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY server ./server
COPY --from=build /app/dist ./dist
ENV PORT=8080
EXPOSE 8080
USER node
CMD ["node", "server/index.js"]
