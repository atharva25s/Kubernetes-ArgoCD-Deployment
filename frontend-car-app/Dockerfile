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
COPY --from=build /app/dist /usr/share/nginx/html
# ADD THIS LINE:
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

