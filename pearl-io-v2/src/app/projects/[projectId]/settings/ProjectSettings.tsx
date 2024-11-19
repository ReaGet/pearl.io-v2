'use client'

import { useState } from 'react'
import { DataTable } from '@/components/DataTable'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AddRouteModal } from './AddRouteModal'
import { getProjectRoutes } from '@/lib/actions'
import { Route } from '@prisma/client'
export function ProjectSettings({ 
  projectId,
  initialRoutes 
}: { 
  projectId: string
  initialRoutes: Route[]
}) {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const refreshRoutes = async () => {
    const updatedRoutes = await getProjectRoutes(projectId)
    setRoutes(updatedRoutes)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Настройки маршрутов</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить маршрут
        </Button>
      </div>

      <div className="rounded-md border">
        <DataTable 
          columns={columns} 
          data={routes}
          meta={{
            reloadData: refreshRoutes
          }}
        />
      </div>

      <AddRouteModal
        projectId={projectId}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRouteAdded={refreshRoutes}
      />
    </div>
  )
} 