'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function CreateHabitForm() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a habit name')
      return
    }

    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await apiClient.createHabit(name, frequency)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to create habit')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md border rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold">Create Habit</h2>

      <Input
        placeholder="Habit name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />

      <div className="flex gap-2">
        <Button
          variant={frequency === 'daily' ? 'default' : 'outline'}
          onClick={() => setFrequency('daily')}
          disabled={isLoading}
        >
          Daily
        </Button>
        <Button
          variant={frequency === 'weekly' ? 'default' : 'outline'}
          onClick={() => setFrequency('weekly')}
          disabled={isLoading}
        >
          Weekly
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Save'}
        </Button>
        <Button variant="outline" onClick={() => router.push('/')} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
