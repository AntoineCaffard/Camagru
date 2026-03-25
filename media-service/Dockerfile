FROM node:20-alpine
RUN apk add --no-cache vips-dev build-base python3
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p uploads
EXPOSE 3002
CMD ["node", "src/index.js"]
