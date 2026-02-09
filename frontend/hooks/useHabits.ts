'use client'

import { useEffect, useState } from 'react'
import { Habit } from '@/types/Habit'

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('habits')
    setHabits(stored ? JSON.parse(stored) : [])
  }, [])

  return habits
}
