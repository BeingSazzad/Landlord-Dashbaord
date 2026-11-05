import { z } from 'zod'

const envSchema = z.object({
  VITE_BASE_URL: z.string().url().default('http://10.10.7.10:8000/api/v1'),
  VITE_APP_NAME: z.string().default('Landlord HQ Admin'),
})

export const env = envSchema.parse({
  VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
})
