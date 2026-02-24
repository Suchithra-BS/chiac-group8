"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  ListChecks,
  CalendarDays,
  CalendarRange,
  Flame,
} from "lucide-react"

interface SummaryCardsProps {
  totalHabits: number
  dailyCount: number
  weeklyCount: number
  longestStreak: number
}

const cards = [
  {
    key: "total",
    label: "Total Habits",
    icon: ListChecks,
    valueKey: "totalHabits" as const,
  },
  {
    key: "daily",
    label: "Daily Habits",
    icon: CalendarDays,
    valueKey: "dailyCount" as const,
  },
  {
    key: "weekly",
    label: "Weekly Habits",
    icon: CalendarRange,
    valueKey: "weeklyCount" as const,
  },
  {
    key: "streak",
    label: "Longest Streak",
    icon: Flame,
    valueKey: "longestStreak" as const,
    suffix: " days",
  },
]

export function SummaryCards(props: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        const value = props[card.valueKey]
        return (
          <Card key={card.key}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {value}
                  {"suffix" in card ? card.suffix : ""}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
