FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# COPY --from=builder /app/next.config.js ./ # Optional but recommended
COPY --from=builder /app/package.json ./

# If using TypeScript, also copy tsconfig.json if needed
COPY --from=builder /app/tsconfig.json ./


EXPOSE 3000

CMD ["npm", "run", "start"]