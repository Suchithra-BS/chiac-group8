'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import HabitCard from '@/components/HabitCard'
import EmptyState from '@/components/EmptyState'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient, Habit as ApiHabit } from '@/lib/api'

/* ---------------- TYPES ---------------- */

interface Habit {
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
  const [isLoading, setIsLoading] = useState(true)
  
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

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
      console.error('Error loading habits:', error)
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
        router.push('/auth/login')
      } else {
        loadHabits()
      }
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted || !isAuthenticated) {
    return null
  }

  /* ---------------- ACTIONS ---------------- */

  const handleToggleComplete = async (id: string) => {
    try {
      await apiClient.toggleHabit(id)
      // Add a small delay to ensure backend processes the request
      setTimeout(() => loadHabits(), 100)
    } catch (error: any) {
      console.error('Error toggling habit:', error)
      // You could show a toast notification here
    }
  }

  const handleUndoComplete = async (id: string) => {
    try {
      await apiClient.undoHabitCompletion(id)
      // Add a small delay to ensure backend processes the request
      setTimeout(() => loadHabits(), 100)
    } catch (error: any) {
      console.error('Error undoing habit completion:', error)
      // You could show a toast notification here
    }
  }

  const handleDeleteHabit = async (id: string) => {
    try {
      await apiClient.deleteHabit(id)
      loadHabits()
    } catch (error: any) {
      console.error('Error deleting habit:', error)
      // You could show a toast notification here
    }
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
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, {user?.username}!
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* 🔗 Analytics Button */}
            <Button asChild variant="outline">
              <Link href="/analytics">
                View Analytics
              </Link>
            </Button>

            {/* Logout Button */}
            <Button variant="outline" onClick={logout}>
              Logout
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
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">Loading habits...</div>
          </div>
        ) : habits.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleComplete={handleToggleComplete}
                onUndoComplete={handleUndoComplete}
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
