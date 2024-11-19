import { useState } from 'react'
import { createRoute } from '@/lib/api'
import { ImageReturnType } from '@/types/route'
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

interface AddRouteModalProps {
  projectId: string
  isOpen: boolean
  onClose: () => void
  onRouteAdded: () => void
}

export function AddRouteModal({ projectId, isOpen, onClose, onRouteAdded }: AddRouteModalProps) {
  const [path, setPath] = useState('')
  const [returnType, setReturnType] = useState<ImageReturnType>('screenshot')
  const [cacheDuration, setCacheDuration] = useState('3600')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createRoute(projectId, {
        path,
        returnType,
        cacheDuration: parseInt(cacheDuration)
      })
      onRouteAdded()
      onClose()
      setPath('')
      setReturnType('screenshot')
      setCacheDuration('3600')
    } catch (error) {
      console.error('Ошибка при создании маршрута:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить новый маршрут</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="path">Путь маршрута</Label>
            <Input
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/blog/:slug"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnType">Тип изображения</Label>
            <Select
              value={returnType}
              onValueChange={(value: ImageReturnType) => setReturnType(value)}
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
            >
              Отмена
            </Button>
            <Button type="submit">
              Создать
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 