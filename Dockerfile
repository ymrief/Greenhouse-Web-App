# Step 1: Build React App
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve using Nginx
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built static assets to the base path matching Vite base configuration
COPY --from=build /app/dist /usr/share/nginx/html/greenhouse/website
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
