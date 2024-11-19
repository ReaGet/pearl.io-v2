'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { fetchProjectDetails } from '@/lib/api'
import { DataTable } from '@/components/DataTable'
import { columns } from './columns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectDetails } from '@/types/project'

export default function ProjectOverview() {
  const params = useParams()
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProjectDetails(params.projectId as string)
        setProjectDetails(data)
      } catch (error) {
        console.error('Error loading project details:', error)
        setError('Не удалось загрузить детали проекта')
      } finally {
        setLoading(false)
      }
    }
    
    if (params.projectId) {
      loadProject()
    }
  }, [params.projectId])

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!projectDetails) return null

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Сгенерированные изображения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectDetails.project.generatedImages} / {projectDetails.project.imageLimit}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <DataTable columns={columns} data={projectDetails.images} />
      </div>
    </div>
  )
} 