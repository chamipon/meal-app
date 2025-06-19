ARG NODE_VERSION=21.7.1

FROM node:${NODE_VERSION}-alpine AS build

    # Stage 1: Build the React app

    WORKDIR /app
    COPY package.json package-lock.json ./
    RUN npm install
    COPY . .
    RUN npm run build

    # Stage 2: Serve the app with Nginx
    FROM nginx:stable-alpine
    COPY --from=build /app/dist /usr/share/nginx/html
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    EXPOSE 5173
    CMD ["nginx", "-g", "daemon off;"]