'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Habit } from '@/types/Habit'
import { apiClient, Habit as ApiHabit } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function HabitDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [habit, setHabit] = useState<Habit | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    const loadHabit = async () => {
      try {
        const apiHabit: ApiHabit = await apiClient.getHabit(id as string)
        const transformedHabit: Habit = {
          id: apiHabit._id,
          name: apiHabit.name,
          frequency: apiHabit.frequency,
          progress: apiHabit.progress,
          streak: apiHabit.streak,
          completed: apiHabit.completed,
          lastCompleted: apiHabit.lastCompleted
        }
        setHabit(transformedHabit)
      } catch (error) {
        console.error('Error loading habit:', error)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    loadHabit()
  }, [id, isAuthenticated, router])

  if (isLoading) {
    return (
      <main className="min-h-screen p-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-muted-foreground">Loading habit details...</div>
        </div>
      </main>
    )
  }

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
        {habit.lastCompleted && (
          <p>Last completed: {new Date(habit.lastCompleted).toLocaleDateString()}</p>
        )}
      </div>
    </main>
  )
}
