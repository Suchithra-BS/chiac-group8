"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Habit } from "@/types/Habit"

interface ProgressOverviewProps {
  habits: Habit[]
}

export function ProgressOverview({ habits }: ProgressOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Progress Overview</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {habits.map((habit) => (
          <div key={habit.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {habit.name}
              </span>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    habit.frequency === "daily" ? "default" : "secondary"
                  }
                >
                  {habit.frequency === "daily" ? "Daily" : "Weekly"}
                </Badge>

                <span className="text-sm font-semibold">
                  {habit.progress}%
                </span>
              </div>
            </div>

            <Progress value={habit.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
