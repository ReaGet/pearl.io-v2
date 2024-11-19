'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { fetchProjectAnalytics } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export default function ProjectAnalytics() {
  const params = useParams()
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      const data = await fetchProjectAnalytics(params.projectId as string)
      setAnalytics(data)
    }
    loadAnalytics()
  }, [params.projectId])

  if (!analytics) return null

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Самый популярный URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-medium">{analytics.mostSharedUrl}</div>
          <div className="text-sm text-muted-foreground">
            {analytics.mostSharedCount} генераций
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Статистика по маршрутам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <BarChart width={800} height={300} data={analytics.routeStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="route" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 