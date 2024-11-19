'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { fetchProjectRoutes } from '@/lib/api'
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRoutes = async () => {
    if (!params.projectId) return

    try {
      setLoading(true)
      setError(null)
      const data = await fetchProjectRoutes(params.projectId as string)
      setRoutes(data)
    } catch (error) {
      console.error('Ошибка при загрузке маршрутов:', error)
      setError('Не удалось загрузить маршруты')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoutes()
  }, [params.projectId])

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
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
            reloadData: loadRoutes
          }}
        />
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