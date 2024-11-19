'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { fetchProjectAnalytics } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import type { ProjectAnalytics } from '@/types/analytics'

export default function ProjectAnalytics() {
  const params = useParams()
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProjectAnalytics(params.projectId as string)
        setAnalytics(data)
      } catch (error) {
        console.error('Error loading analytics:', error)
        setError('Не удалось загрузить аналитику')
      } finally {
        setLoading(false)
      }
    }

    if (params.projectId) {
      loadAnalytics()
    }
  }, [params.projectId])

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!analytics) return null

  return (
    <div className="space-y-8">
      <div className="text-sm text-muted-foreground">
        Статистика за период: {analytics && new Date(analytics.periodStart).toLocaleDateString('ru-RU')} - {analytics && new Date(analytics.periodEnd).toLocaleDateString('ru-RU')}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Общее количество запросов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics?.totalRequests}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Самый популярный URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-medium">{analytics?.mostSharedUrl}</div>
          <div className="text-sm text-muted-foreground">
            {analytics?.mostSharedCount} запросов
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Статистика по маршрутам</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <BarChart width={800} height={300} data={analytics?.routeStats}>
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