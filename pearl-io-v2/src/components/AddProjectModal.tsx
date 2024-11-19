import { useState } from 'react'
import { createProject } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectAdded: () => void
}

export function AddProjectModal({ isOpen, onClose, onProjectAdded }: AddProjectModalProps) {
  const [url, setUrl] = useState('')
  const [cacheDuration, setCacheDuration] = useState('3600')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createProject({ url, cacheDuration: parseInt(cacheDuration) })
      onProjectAdded()
      onClose()
      setUrl('')
      setCacheDuration('3600')
    } catch (error) {
      console.error('Ошибка при создании проекта:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить новый проект</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">URL сайта</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
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