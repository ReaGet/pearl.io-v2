'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from '@/components/DataTable'
import { columns } from './columns'
import { ProjectDetails } from '@/types/project'

export function ProjectOverview({ 
  initialData 
}: { 
  initialData: ProjectDetails 
}) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Сгенерированные изображения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initialData.project.generatedImages} / {initialData.project.imageLimit}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <DataTable columns={columns} data={initialData.images} />
      </div>
    </div>
  )
} 