'use client'

import CreateHabitForm from '@/components/CreateHabitForm'
import { useRouter } from 'next/navigation'

export default function NewHabitPage() {
  const router = useRouter()

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
