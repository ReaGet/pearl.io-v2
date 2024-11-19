'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import type { ProjectAnalytics } from '@/types/analytics'

export function ProjectAnalyticsView({ 
  initialData 
}: { 
  initialData: ProjectAnalytics 
}) {
  return (
    <div className="space-y-8">
      <div className="text-sm text-muted-foreground">
        Статистика за период: {new Date(initialData.periodStart).toLocaleDateString('ru-RU')} - {new Date(initialData.periodEnd).toLocaleDateString('ru-RU')}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Общее количество запросов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{initialData.totalRequests}</div>
        </CardContent>
      </Card>

      {/* ... rest of the component ... */}
    </div>
  )
} 