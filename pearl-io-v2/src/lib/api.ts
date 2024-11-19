import { Project } from '@/types/project'
import { ImageReturnType, Route } from '@/types/route';
import { ProjectDetails } from '@/types/project';
import { ProjectAnalytics } from '@/types/analytics';

export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects')
  if (!response.ok) {
    throw new Error('Ошибка при загрузке проектов')
  }
  return response.json()
}

export async function createProject(data: { url: string; cacheDuration: number }): Promise<Project> {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error('Ошибка при создании проекта')
  }
  
  return response.json()
}

export async function fetchDashboardStats() {
  const response = await fetch('/api/stats')
  if (!response.ok) {
    throw new Error('Ошибка при загрузке статистики')
  }
  return response.json()
}

export async function fetchProjectDetails(projectId: string): Promise<ProjectDetails> {
  const response = await fetch(`/api/projects/${projectId}`)
  if (!response.ok) {
    throw new Error('Ошибка при загрузке деталей проекта')
  }
  return response.json()
}

export async function fetchProjectAnalytics(projectId: string): Promise<ProjectAnalytics> {
  const response = await fetch(`/api/projects/${projectId}/analytics`)
  if (!response.ok) {
    throw new Error('Ошибка при загрузке аналитики')
  }
  return response.json()
}

export async function fetchProjectRoutes(projectId: string): Promise<Route[]> {
  const response = await fetch(`/api/projects/${projectId}/routes`, {
    cache: 'no-store'
  })
  
  if (!response.ok) {
    throw new Error('Ошибка при загрузке маршрутов')
  }
  
  return response.json()
}

export async function createRoute(projectId: string, data: {
  path: string
  returnType: ImageReturnType
  cacheDuration: number
}): Promise<Route> {
  const response = await fetch(`/api/projects/${projectId}/routes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('Маршрут с таким путем уже существует в этом проекте')
    }
    throw new Error('Ошибка при создании маршрута')
  }
  
  return response.json()
}

export async function updateRoute(
  projectId: string, 
  routeId: string, 
  data: {
    path: string
    returnType: ImageReturnType
    cacheDuration: number
  }
): Promise<Route> {
  const response = await fetch(`/api/projects/${projectId}/routes/${routeId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error('Ошибка при обновлении маршрута')
  }
  
  return response.json()
}

export async function deleteRoute(projectId: string, routeId: string) {
  const response = await fetch(`/api/projects/${projectId}/routes/${routeId}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    throw new Error('Ошибка при удалении маршрута')
  }
} 