'use client'

import { useState, useEffect } from 'react'
import { ProjectCard } from '@/components/ProjectCard'
import { AddProjectModal } from '@/components/AddProjectModal'
import { DashboardStats } from '@/components/DashboardStats'
import { ProjectSearch } from '@/components/ProjectSearch'
import { fetchProjects, fetchDashboardStats } from '@/lib/api'
import { Project } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalImages: 0,
    totalCached: 0
  })

  const loadProjects = async () => {
    try {
      const data = await fetchProjects()
      setProjects(data)
      setFilteredProjects(data)
    } catch (error) {
      console.error('Ошибка при загрузке проектов:', error)
    }
  }

  const loadStats = async () => {
    try {
      const stats = await fetchDashboardStats()
      setStats(stats)
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error)
    }
  }

  useEffect(() => {
    loadProjects()
    loadStats()
  }, [])

  const handleSearch = (query: string) => {
    const filtered = projects.filter(project => 
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.url.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredProjects(filtered)
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
          <ProjectCard key={project.id} project={project} />
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
          loadProjects()
          loadStats()
        }}
      />
    </div>
  )
}
