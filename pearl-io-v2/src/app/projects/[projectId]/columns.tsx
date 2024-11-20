"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteCachedImage } from "@/lib/actions"
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

export type Image = {
  id: string
  url: string
  createdAt: string
  imageUrl: string
}

export const columns: ColumnDef<Image>[] = [
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate">
        <a 
          href={row.original.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {row.original.url}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Дата создания",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return (
        <div>
          <div className="text-sm">
            {date.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
          <div className="text-xs text-muted-foreground">
            {date.toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </div>
        </div>
      )
    },
  },
  {
    id: "preview",
    header: "Предпросмотр",
    cell: ({ row }) => {
      return (
        <div className="relative w-[100px] h-[60px] cursor-pointer">
          <a 
            href={row.original.imageUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Image
              src={'/'+row.original.imageUrl}
              alt="Preview"
              fill
              className="object-cover rounded-md hover:opacity-80 transition-opacity"
              sizes="100px"
            />
          </a>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Действия",
    cell: ({ row }) => {
      const { toast } = useToast()

      const handleDelete = async () => {
        const result = await deleteCachedImage(row.original.id)
        if (result.success) {
          toast({
            title: "Кэш удален",
            description: "Кэшированное изображение успешно удалено",
          })
          window.location.reload()
        } else {
          toast({
            title: "Ошибка",
            description: result.error || "Не удалось удалить кэш",
            variant: "destructive",
          })
        }
      }

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Подтвердите удаление</DialogTitle>
              <DialogDescription>
                Вы уверены, что хотите удалить это кэшированное изображение? 
                Это действие нельзя отменить.
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
      )
    },
  },
] 