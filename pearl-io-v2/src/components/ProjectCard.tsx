import Link from "next/link"
import Image from "next/image"
import { Card, CardHeader } from "@/components/ui/card"
import { type Project } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteProject } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useState } from "react"

interface ProjectCardProps {
  project: Project
  onDeleted?: () => void
}

export function ProjectCard({ project, onDeleted }: ProjectCardProps) {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault() // Предотвращаем переход по ссылке
    const result = await deleteProject(project.id)
    if (result.success) {
      toast({
        title: "Проект удален",
        description: "Проект и все связанные данные успешно удалены",
      })
      setIsDeleteDialogOpen(false)
      onDeleted?.()
    } else {
      toast({
        title: "Ошибка",
        description: result.error || "Не удалось удалить проект",
        variant: "destructive",
      })
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Если клик был по кнопке удаления или её потомкам, предотвращаем переход
    if ((e.target as HTMLElement).closest('.delete-button')) {
      e.preventDefault()
    }
  }

  return (
    <Link href={`/projects/${project.id}`} onClick={handleCardClick}>
      <Card className="hover:bg-accent/50 transition-colors group">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="relative w-4 h-4">
            <Image
              src={project.favicon || '/favicon.ico'}
              alt={project.title}
              fill
              className="object-contain rounded-sm"
              sizes="32px"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.src = '/favicon.ico'
              }}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{new URL(project.url).host}</h3>
          </div>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/90 delete-button"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Подтвердите удаление</DialogTitle>
                <DialogDescription>
                  Вы уверены, что хотите удалить проект {new URL(project.url).host}? 
                  Это действие нельзя отменить. Будут удалены все маршруты, 
                  кэшированные изображения и статистика.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline">Отмена</Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                >
                  Удалить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>
    </Link>
  )
} 