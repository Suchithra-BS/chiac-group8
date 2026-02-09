'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Habit } from '@/types/Habit'

export default function HabitDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [habit, setHabit] = useState<Habit | null>(null)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('habits') || '[]')
    setHabit(stored.find((h: Habit) => h.id === id))
  }, [id])

  if (!habit) return null

  return (
    <main className="min-h-screen p-6">
      <button
        onClick={() => router.push('/')}
        className="mb-6 text-sm text-muted-foreground hover:underline"
      >
        ← Back
      </button>

      <div className="max-w-md border rounded-xl p-6 space-y-2">
        <h2 className="text-2xl font-bold">{habit.name}</h2>
        <p>Frequency: {habit.frequency}</p>
        <p>Progress: {Math.round(habit.progress)}%</p>
        <p>🔥 Streak: {habit.streak}</p>
      </div>
    </main>
  )
}
