# STAGE 1: Build (The "Kitchen")
FROM node:24-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
#RUN npm run build --prod
RUN npx ng build --configuration production

# STAGE 2: Serve (The "Waiter")
FROM nginx:alpine
#RUN apk add --no-cache gettext
# Copy the compiled files from the build stage to Nginx
COPY --from=build /usr/src/app/dist/frontend-angular/browser /usr/share/nginx/html
EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 19 | Change the source to public/ and destination to the root
#COPY public/config.json /usr/share/nginx/html/config.template.json

# 21 | Update the CMD to look for the file in the root
#CMD ["sh", "-c", "envsubst < /usr/share/nginx/html/config.template.json > /usr/share/nginx/html/config.json && nginx -g 'daemon off;'"]