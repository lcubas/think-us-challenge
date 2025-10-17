FROM node:22-alpine

# workdir
WORKDIR /app

# install system deps if needed
RUN apk add --no-cache bash

# copy package files and install deps (cached)
COPY package*.json ./
RUN npm ci

# copy app (dev mounts will override)
COPY . .

# set permissions for non-root user
RUN chown -R node:node /app
USER node

EXPOSE 3000

# prefer dev script; fallback to start
CMD ["sh", "-c", "npm run dev --silent || npm start"]
