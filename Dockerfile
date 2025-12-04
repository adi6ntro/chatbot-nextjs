# Build step
FROM node:20-alpine as builder
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile || npm install
COPY . .
RUN yarn build || npm run build

# Production step
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
CMD ["yarn", "start"]
EXPOSE 3000