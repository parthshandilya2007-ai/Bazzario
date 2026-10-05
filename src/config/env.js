import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  USE_REDIS: z.enum(['true', 'false']).default('false').transform((val) => val === 'true'),
  CLOUDINARY_CLOUD_NAME: z.string().default('mock_cloud'),
  CLOUDINARY_API_KEY: z.string().default('mock_key'),
  CLOUDINARY_API_SECRET: z.string().default('mock_secret'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  PAYMENT_GATEWAY_KEY: z.string().default('mock_key'),
  PAYMENT_GATEWAY_SECRET: z.string().default('mock_secret'),
  PAYMENT_WEBHOOK_SECRET: z.string().default('mock_webhook_secret'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const errors = parsedEnv.error.format();
  process.stderr.write('❌ FATAL: Invalid or missing environment configuration at boot:\n');
  process.stderr.write(`${JSON.stringify(errors, null, 2)}\n`);
  process.exit(1);
}

export const env = parsedEnv.data;
