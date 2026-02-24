'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Habit } from '@/types/Habit'

interface Props {
  habit: Habit
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  onUndoComplete: (id: string) => void
}

export default function HabitCard({
  habit,
  onToggleComplete,
  onDelete,
  onUndoComplete,
}: Props) {
  const [currentHabit, setCurrentHabit] = useState(habit);

  const today = new Date().toISOString().split('T')[0];
  const lastCompletedDate = currentHabit.lastCompleted ? currentHabit.lastCompleted.split('T')[0] : null;
  const completedToday = lastCompletedDate === today;

  // Update habit when prop changes
  useEffect(() => {
    setCurrentHabit(habit);
  }, [habit]);

  return (
    <div className="rounded-xl border p-4 space-y-4">
      <Link href={`/habits/${habit.id}`}>
        <h3 className="text-lg font-semibold hover:underline cursor-pointer">
          {habit.name}
        </h3>
      </Link>

      <p className="text-sm text-muted-foreground">
        Frequency: {habit.frequency}
      </p>

      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${habit.progress}%` }}
        />
      </div>

      <p className="text-sm">
        🔥 Streak: <span className="font-semibold">{habit.streak}</span>
      </p>

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => onToggleComplete(habit.id)}
          disabled={completedToday}
        >
          {completedToday ? 'Completed Today' : 'Complete'}
        </Button>

        {completedToday && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUndoComplete(habit.id)}
          >
            Undo
          </Button>
        )}

        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(habit.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
