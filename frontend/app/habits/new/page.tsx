'use client'

import CreateHabitForm from '@/components/CreateHabitForm'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export default function NewHabitPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen p-6">
      <button
        onClick={() => router.push('/')}
        className="mb-6 text-sm text-muted-foreground hover:underline"
      >
        ← Back to Dashboard
      </button>

      <CreateHabitForm />
    </main>
  )
}
