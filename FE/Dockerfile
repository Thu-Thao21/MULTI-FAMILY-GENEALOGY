# Stage 1: Build the React + Vite app
FROM node:20-alpine as build-stage

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

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
