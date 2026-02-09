'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card py-16">
      <p className="text-lg text-muted-foreground">
        No habits yet. Create one to get started!
      </p>

      <Button asChild className="mt-4 gap-2">
        <Link href="/habits/new">
          <Plus className="h-5 w-5" />
          Add Your First Habit
        </Link>
      </Button>
    </div>
  )
}
