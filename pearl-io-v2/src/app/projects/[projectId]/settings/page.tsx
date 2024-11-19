'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { fetchProjectRoutes, createRoute, updateRoute, deleteRoute } from '@/lib/api'
import { DataTable } from '@/components/DataTable'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AddRouteModal } from './AddRouteModal'
import { Route } from '@/types/route'

export default function ProjectSettings() {
  const params = useParams()
  const [routes, setRoutes] = useState<Route[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const loadRoutes = async () => {
    try {
      const data = await fetchProjectRoutes(params.projectId as string)
      setRoutes(data)
    } catch (error) {
      console.error('Ошибка при загрузке маршрутов:', error)
    }
  }

  useEffect(() => {
    loadRoutes()
  }, [params.projectId])

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
        <DataTable columns={columns} data={routes} />
      </div>

      <AddRouteModal
        projectId={params.projectId as string}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRouteAdded={loadRoutes}
      />
    </div>
  )
} 