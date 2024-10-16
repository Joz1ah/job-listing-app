# Stage 1: Build the app
FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build:static

# Verify build
RUN ls -la /app/dist

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP and HTTPS ports
EXPOSE 80
EXPOSE 443

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
