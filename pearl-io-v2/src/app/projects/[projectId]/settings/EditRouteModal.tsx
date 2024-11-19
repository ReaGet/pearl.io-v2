import { useState } from 'react'
import { updateRoute } from '@/lib/api'
import { ImageReturnType, Route } from '@/types/route'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EditRouteModalProps {
  route: Route
  isOpen: boolean
  onClose: () => void
  onRouteUpdated: () => void
}

export function EditRouteModal({ route, isOpen, onClose, onRouteUpdated }: EditRouteModalProps) {
  const [path, setPath] = useState(route.path)
  const [returnType, setReturnType] = useState<ImageReturnType>(route.returnType)
  const [cacheDuration, setCacheDuration] = useState(route.cacheDuration.toString())
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      
      await updateRoute(route.projectId, route.id, {
        path,
        returnType,
        cacheDuration: parseInt(cacheDuration)
      })

      onRouteUpdated()
      onClose()
    } catch (error) {
      console.error('Ошибка при обновлении маршрута:', error)
      setError('Не удалось обновить маршрут')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать маршрут</DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="path">Путь маршрута</Label>
            <Input
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/blog/:slug"
              required
              disabled={loading}
            />
            <p className="text-sm text-gray-500">
              Пример: /blog/:slug или /products/:id
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnType">Тип изображения</Label>
            <Select
              value={returnType}
              onValueChange={(value: ImageReturnType) => setReturnType(value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="screenshot">Скриншот</SelectItem>
                <SelectItem value="static">Статическое изображение</SelectItem>
                <SelectItem value="generated">Сгенерированное</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cache">Длительность кэширования</Label>
            <Select
              value={cacheDuration}
              onValueChange={(value) => setCacheDuration(value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите длительность" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3600">1 час</SelectItem>
                <SelectItem value="86400">24 часа</SelectItem>
                <SelectItem value="604800">1 неделя</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 