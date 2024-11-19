"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Route } from "@/types/route"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<Route>[] = [
  {
    accessorKey: "path",
    header: "Путь",
  },
  {
    accessorKey: "returnType",
    header: "Тип изображения",
    cell: ({ row }) => {
      const types = {
        screenshot: "Скриншот",
        static: "Статическое",
        generated: "Сгенерированное"
      }
      return types[row.original.returnType]
    }
  },
  {
    accessorKey: "createdAt",
    header: "Дата создания",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString('ru-RU')
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 