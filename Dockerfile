# Stage 1: Build the app
FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG SIT_BASE_URL
ARG SIT_AUTH_API_URL
ARG SIT_SIGNUP_API_URL

RUN echo "BASE_URL=$SIT_BASE_URL" > .env
RUN echo "SIGNUP_API_URL=$SIT_AUTH_API_URL" >> .env
RUN echo "AUTH_API_URL=$SIT_SIGNUP_API_URL" >> .env

RUN npm run build

#RUN npm run build:static

# Verify build

RUN ls -la /app/dist

#FROM nginx:alpine

#COPY --from=build /app/dist /usr/share/nginx/html
#COPY default.conf /etc/nginx/conf.d/default.conf

# Expose HTTP and HTTPS ports
EXPOSE 8080
#EXPOSE 80
#EXPOSE 443


# Start NGINX
#CMD ["nginx", "-g", "daemon off;"]
CMD ["npm", "run", "start:server"]
