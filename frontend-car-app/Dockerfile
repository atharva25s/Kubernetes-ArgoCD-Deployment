# Stage 1: Build
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# This creates the /dist folder
RUN npm run build 

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
# Copy the build output to Nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html
# Copy a custom nginx config if you need SPA routing
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

