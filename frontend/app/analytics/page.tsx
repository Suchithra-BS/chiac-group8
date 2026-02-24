'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient, Habit as ApiHabit } from '@/lib/api'

import { SummaryCards } from '@/components//summary-cards'
import { ProgressOverview } from '@/components/progress-overview'
import { StreakInsights } from '@/components/streak-insights'
import { CompletionStatus } from '@/components/completion-status'

interface Habit {
  id: string
  name: string
  frequency: 'daily' | 'weekly'
  progress: number
  streak: number
  completed: boolean
  lastCompleted?: string
}

export default function Page() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const { isAuthenticated } = useAuth()

  /* ---------------- LOAD FROM API ---------------- */

  const loadHabits = async () => {
    if (!isAuthenticated) return
    
    try {
      const apiHabits: ApiHabit[] = await apiClient.getHabits()
      const transformedHabits: Habit[] = apiHabits.map(habit => ({
        id: habit._id,
        name: habit.name,
        frequency: habit.frequency,
        progress: habit.progress,
        streak: habit.streak,
        completed: habit.completed,
        lastCompleted: habit.lastCompleted
      }))
      setHabits(transformedHabits)
    } catch (error) {
      console.error('Error loading habits for analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        window.location.href = '/auth/login'
      } else {
        loadHabits()
      }
    }
  }, [mounted, isAuthenticated])

  if (!mounted || !isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex justify-center items-center py-12">
          <div className="text-muted-foreground">Loading analytics...</div>
        </div>
      </main>
    )
  }

  /* ---------------- DERIVED DATA ---------------- */

  const dailyHabits = habits.filter((h) => h.frequency === 'daily')
  const weeklyHabits = habits.filter((h) => h.frequency === 'weekly')
  const longestStreak = habits.length
    ? Math.max(...habits.map((h) => h.streak))
    : 0

  const today = new Date().toDateString()
  const completedToday = habits.filter(
    (h) =>
      h.lastCompleted &&
      new Date(h.lastCompleted).toDateString() === today
  ).length

  const pendingToday = habits.length - completedToday

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Habit Analytics</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Insights into your habit consistency and progress
            </p>
          </div>

          {/* 🔙 BACK TO DASHBOARD */}
          <Button asChild variant="outline">
            <Link href="/">← Back to Dashboard</Link>
          </Button>
        </div>

        {/* Summary Cards */}
        <section className="mb-8">
          <SummaryCards
            totalHabits={habits.length}
            dailyCount={dailyHabits.length}
            weeklyCount={weeklyHabits.length}
            longestStreak={longestStreak}
          />
        </section>

        {/* Progress Overview */}
        <section className="mb-8">
          <ProgressOverview habits={habits} />
        </section>

        {/* Streak + Completion */}
        <section className="grid gap-6 md:grid-cols-2">
          <StreakInsights habits={habits} />
          <CompletionStatus
            completedToday={completedToday}
            pendingToday={pendingToday}
          />
        </section>
      </div>
    </main>
  )
}
