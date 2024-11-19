'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { fetchProjectDetails } from '@/lib/api'
import { DataTable } from '@/components/DataTable'
import { columns } from './columns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProjectOverview() {
  const params = useParams()
  const [project, setProject] = useState<any>(null)
  const [images, setImages] = useState([])

  useEffect(() => {
    const loadProject = async () => {
      const data = await fetchProjectDetails(params.projectId as string)
      setProject(data.project)
      setImages(data.images)
    }
    loadProject()
  }, [params.projectId])

  if (!project) return null

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Сгенерированные изображения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {project.generatedImages} / {project.imageLimit}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <DataTable columns={columns} data={images} />
      </div>
    </div>
  )
} 