import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url().optional().default('http://localhost:3000/api'),
  VITE_APP_NAME: z.string().default('Landlord HQ Admin'),
})

export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
})
