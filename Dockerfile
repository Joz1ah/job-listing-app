# Stage 1: Build the app
FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

RUN ls -la /app/dist

# Stage 2: Serve the built app with NGINX
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy the build artifacts from the previous stage to the NGINX HTML directory
COPY --from=build /app/dist .

COPY scripts/wait-for-env.sh /wait-for-env.sh

RUN chmod +x /wait-for-env.sh

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["/wait-for-env.sh"]

CMD ["nginx", "-g", "daemon off;"]
