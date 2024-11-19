'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const params = useParams()
  
  const tabs = [
    { title: "Обзор", href: `/projects/${params.projectId}` },
    { title: "Аналитика", href: `/projects/${params.projectId}/analytics` },
    { title: "Настройки", href: `/projects/${params.projectId}/settings` },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={pathname} className="space-y-8">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.href}
              value={tab.href}
              asChild
            >
              <Link href={tab.href}>{tab.title}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
        {children}
      </Tabs>
    </div>
  )
} 