# ---- Build the static site ----
FROM node:20.18.1-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# prebuild regenerates public/sitemap.xml + robots.txt
RUN npm run build

# ---- Serve with nginx ----
FROM nginx:1.27.3-alpine
# Railway injects $PORT; nginx's entrypoint substitutes it into the template below
ENV PORT=8080
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
