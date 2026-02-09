'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Habit } from '@/types/Habit'

export default function CreateHabitForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')

  const handleSave = () => {
    if (!name.trim()) return

    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      frequency,
      progress: 0,
      streak: 0,
      completed: false,
    }

    const existing = JSON.parse(localStorage.getItem('habits') || '[]')
    localStorage.setItem('habits', JSON.stringify([...existing, newHabit]))
    router.push('/')
  }

  return (
    <div className="max-w-md border rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold">Create Habit</h2>

      <Input
        placeholder="Habit name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex gap-2">
        <Button
          variant={frequency === 'daily' ? 'default' : 'outline'}
          onClick={() => setFrequency('daily')}
        >
          Daily
        </Button>
        <Button
          variant={frequency === 'weekly' ? 'default' : 'outline'}
          onClick={() => setFrequency('weekly')}
        >
          Weekly
        </Button>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave}>Save</Button>
        <Button variant="outline" onClick={() => router.push('/')}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
