# Backend Dockerfile
# ./backend/Dockerfile
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --production

COPY . .

EXPOSE 3000

CMD ["bun", "start"]