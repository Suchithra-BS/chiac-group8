"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock } from "lucide-react"

interface CompletionStatusProps {
  completedToday: number
  pendingToday: number
}

export function CompletionStatus({
  completedToday,
  pendingToday,
}: CompletionStatusProps) {
  const total = completedToday + pendingToday
  const percentage = total > 0 ? Math.round((completedToday / total) * 100) : 0

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Today{"'"}s Completion</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Visual ring */}
        <div className="flex items-center justify-center py-2">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                className="stroke-muted"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                className="stroke-primary"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 327} 327`}
              />
            </svg>
            <span className="absolute text-xl font-bold text-foreground">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-primary/10 p-3">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-lg font-bold text-foreground">
                {completedToday}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg bg-accent/10 p-3">
            <Clock className="h-5 w-5 text-accent" />
            <div>
              <p className="text-lg font-bold text-foreground">
                {pendingToday}
              </p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
