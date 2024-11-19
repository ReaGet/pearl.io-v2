"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

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
      return new Date(row.original.createdAt).toLocaleDateString('ru-RU')
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open(row.original.imageUrl, '_blank')}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
] 