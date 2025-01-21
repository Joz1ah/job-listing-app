# Stage 1 Build the app
FROM node:18-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Add build arguments for environment variables
ARG SIT_BASE_URL
ARG SIT_AUTH_API_URL
ARG SIT_SIGNUP_API_URL

RUN echo "BASE_URL=$SIT_BASE_URL" > .env && \
    echo "SIGNUP_API_URL=$SIT_SIGNUP_API_URL" >> .env && \
    echo "AUTH_API_URL=$SIT_AUTH_API_URL" >> .env

RUN npm run build

RUN ls -la /app/dist

# Stage 2 Runtime environment
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app .

#COPY scripts/wait-for-env.sh /wait-for-env.sh

# Make the wait script executable
#RUN chmod +x /wait-for-env.sh

EXPOSE 8080

#ENTRYPOINT ["/wait-for-env.sh"]

# Start the server
CMD ["npm", "run", "start:server"]
