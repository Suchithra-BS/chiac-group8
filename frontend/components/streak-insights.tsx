"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Habit } from "@/types/Habit"

interface StreakInsightsProps {
  habits: Habit[]
}

export function StreakInsights({ habits }: StreakInsightsProps) {
  const ranked = [...habits]
    .filter((h) => h.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Streak Insights</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {ranked.map((habit, index) => (
          <div
            key={habit.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                {index + 1}
              </span>
              <span className="font-medium">{habit.name}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              🔥 <span className="font-semibold">{habit.streak} days</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
