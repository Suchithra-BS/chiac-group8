export interface Habit {
  id: string
  name: string
  frequency: 'daily' | 'weekly'
  progress: number
  streak: number
  completed: boolean
  lastCompleted?: string   // ✅ OPTIONAL
}
