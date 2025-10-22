# ===============================
# 1️⃣ Build Stage
# ===============================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package.json + lock file ก่อน (เพื่อ cache layer install)
COPY package*.json ./

# ติดตั้ง dependencies สำหรับ build
RUN npm ci

# Copy source code ทั้งหมด
COPY . .

# Build โปรเจกต์ Nuxt
RUN npm run build

# ===============================
# 2️⃣ Production Stage
# ===============================
FROM node:22-alpine AS production

WORKDIR /app

# Copy ผลลัพธ์ที่ build แล้ว
COPY --from=builder /app/.output ./.output
COPY package*.json ./

# ติดตั้งเฉพาะ production dependencies
RUN npm ci --omit=dev

# เพิ่มบรรทัดนี้เพื่อลดช่องโหว่ใน layer OS (security patch)
RUN apk update && apk upgrade

# เปิด port ที่ Nuxt ใช้
EXPOSE 7000

# คำสั่งรัน Nuxt App
CMD ["node", ".output/server/index.mjs"]
