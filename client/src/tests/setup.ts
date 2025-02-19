// client/src/tests/setup.ts
import { vi } from 'vitest'

vi.mock('@shared/env', () => ({
  getEnv: () => ({
    VITE_SUPABASE_URL: 'https://toeqcwzbxvhoxewifusk.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZXFjd3pieHZob3hld2lmdXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MDAzMDIsImV4cCI6MjA1NTM3NjMwMn0.M0H6FSo553Ql-7F6UApL9Dk39Y5dU4YvVuqcBYVwhhk'
  })
}))