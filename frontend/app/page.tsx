'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import HabitCard from '@/components/HabitCard'
import EmptyState from '@/components/EmptyState'

/* ---------------- TYPES ---------------- */

export interface Habit {
  id: string
  name: string
  frequency: 'daily' | 'weekly'
  progress: number
  streak: number
  completed: boolean
  lastCompleted?: string
}

/* ---------------- PAGE ---------------- */

export default function Page() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [mounted, setMounted] = useState(false)

  /* ---------------- LOAD FROM STORAGE ---------------- */

  const loadHabits = () => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('habits')
    setHabits(stored ? JSON.parse(stored) : [])
  }

  useEffect(() => {
    setMounted(true)
    loadHabits()

    // Re-sync when coming back from another page
    window.addEventListener('focus', loadHabits)
    return () => window.removeEventListener('focus', loadHabits)
  }, [])

  if (!mounted) return null

  /* ---------------- ACTIONS ---------------- */

  const handleToggleComplete = (id: string) => {
    const today = new Date().toISOString().split('T')[0]

    const updated = habits.map((habit) => {
      if (habit.id !== id) return habit
      if (habit.lastCompleted === today) return habit

      const increment = habit.frequency === 'daily' ? 100 / 7 : 100 / 4

      return {
        ...habit,
        completed: true,
        streak: habit.streak + 1,
        progress: Math.min(100, habit.progress + increment),
        lastCompleted: today,
      }
    })

    setHabits(updated)
    localStorage.setItem('habits', JSON.stringify(updated))
  }

  const handleDeleteHabit = (id: string) => {
    const updated = habits.filter((h) => h.id !== id)
    setHabits(updated)
    localStorage.setItem('habits', JSON.stringify(updated))
  }

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
  <div>
    <h1 className="text-4xl font-bold">Habit Builder</h1>
    <p className="text-muted-foreground">
      Track your daily and weekly habits
    </p>
  </div>

  <div className="flex items-center gap-3">
    {/* 🔗 Analytics Button */}
    <Button asChild variant="outline">
      <Link href="/analytics">
        View Analytics
      </Link>
    </Button>

    {/* ➕ Add Habit Button */}
    <Button asChild className="gap-2">
      <Link href="/habits/new">
        <Plus className="h-5 w-5" />
        Add New Habit
      </Link>
    </Button>
  </div>
</div>

     
        {/* Content */}
                {habits.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteHabit}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  )
}
