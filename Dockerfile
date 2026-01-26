# ----------------------
# مرحلة البناء
# ----------------------
FROM node:20-alpine AS builder

WORKDIR /app

# نسخ ملفات package.json و package-lock.json فقط أولًا
COPY package*.json ./

# تثبيت الحزم (تجاهل dev dependencies)
RUN npm install --omit=dev

# نسخ باقي المشروع
COPY . .

# توليد Prisma Client
RUN npx prisma generate

# بناء TypeScript
RUN npx tsc

# ----------------------
# مرحلة التشغيل
# ----------------------
FROM node:20-alpine AS runner

WORKDIR /app

# نسخ الملفات المبنية من مرحلة البناء
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# أمر تشغيل التطبيق
CMD ["node", "dist/index.js"]
