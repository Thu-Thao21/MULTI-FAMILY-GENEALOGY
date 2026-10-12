# Stage 1: Build the React + Vite app
FROM node:20-alpine as build-stage

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Absolute URL of the new BE (e.g. http://localhost:8001/api/v1).
# Vite inlines VITE_* variables at build time; .env is excluded by .dockerignore.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the Vite project (outputs to /app/dist by default)
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine as production-stage

# Copy the build output from the previous stage to Nginx's web root
COPY --from=build-stage /app/dist /usr/share/nginx/html

# (Optional) Copy custom Nginx configuration if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
