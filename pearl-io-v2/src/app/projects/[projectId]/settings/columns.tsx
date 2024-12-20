"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Route, ImageReturnType } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { deleteRoute } from "@/lib/api"
import { EditRouteModal } from "./EditRouteModal"

interface RouteWithMeta extends Route {
  returnType: ImageReturnType;
}

interface TableOptions {
  meta?: {
    reloadData: () => Promise<void>;
  };
}

export const columns: ColumnDef<RouteWithMeta>[] = [
  {
    accessorKey: "path",
    header: "Путь",
  },
  {
    accessorKey: "returnType",
    header: "Тип изображения",
    cell: ({ row }) => {
      const types: Record<ImageReturnType, string> = {
        screenshot: "Скриншот",
        static: "Статическое",
        generated: "Сгенерированное"
      }
      return types[row.original.returnType]
    }
  },
  {
    accessorKey: "cacheDuration",
    header: "Кэширование",
    cell: ({ row }) => {
      const hours = Math.floor(row.original.cacheDuration / 3600)
      if (hours === 1) return "1 час"
      if (hours === 24) return "1 день"
      if (hours === 168) return "1 неделя"
      return `${hours} часов`
    }
  },
  {
    accessorKey: "createdAt",
    header: "Создан",
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
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const route = row.original
      const [isEditModalOpen, setIsEditModalOpen] = useState(false)
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
      
      const handleDelete = async () => {
        try {
          await deleteRoute(route.projectId, route.id)
          setIsDeleteDialogOpen(false)
          const options = table.options as TableOptions
          if (options.meta?.reloadData) {
            await options.meta.reloadData()
          }
        } catch (error) {
          console.error('Ошибка при удалении маршрута:', error)
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)} 
                className="text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Подтвердите удаление</DialogTitle>
                <DialogDescription>
                  Вы уверены, что хотите удалить этот маршрут? 
                  Это действие нельзя отменить, и все связанные кэшированные изображения будут удалены.
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

          <EditRouteModal
            route={{
              ...route,
              createdAt: route.createdAt.toISOString()
            }}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onRouteUpdated={async () => {
              const options = table.options as TableOptions
              if (options.meta?.reloadData) {
                await options.meta.reloadData()
              }
            }}
          />
        </>
      )
    },
  },
] 