# Frontend Dockerfile - build with Node and serve with nginx
FROM node:18-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
COPY tsconfig.json vite.config.ts ./
COPY public ./public
COPY src ./src

RUN npm ci && npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# default nginx config listens on 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
