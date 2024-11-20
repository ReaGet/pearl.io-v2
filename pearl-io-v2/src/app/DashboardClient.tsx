'use client'

import { useState } from 'react'
import { ProjectCard } from '@/components/ProjectCard'
import { AddProjectModal } from '@/components/AddProjectModal'
import { DashboardStats } from '@/components/DashboardStats'
import { ProjectSearch } from '@/components/ProjectSearch'
import { Project } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DashboardStats as DashboardStatsType } from '@/types/stats'

interface DashboardClientProps {
  initialProjects: Project[]
  initialStats: DashboardStatsType
}

export function DashboardClient({ initialProjects, initialStats }: DashboardClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [stats] = useState(initialStats)

  const handleSearch = (query: string) => {
    const filtered = projects.filter(project => 
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.url.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredProjects(filtered)
  }

  const handleProjectDeleted = () => {
    window.location.reload()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить проект
        </Button>
      </div>

      <DashboardStats {...stats} />

      <div className="my-8">
        <ProjectSearch onSearch={handleSearch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onDeleted={handleProjectDeleted}
          />
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            Проекты не найдены
          </div>
        )}
      </div>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProjectAdded={() => {
          window.location.reload()
        }}
      />
    </div>
  )
} 