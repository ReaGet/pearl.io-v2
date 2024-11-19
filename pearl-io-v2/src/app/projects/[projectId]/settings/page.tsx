import { getProjectRoutes } from '@/lib/actions'
import { ProjectSettings } from './ProjectSettings'
import { Route } from '@prisma/client'

export default async function SettingsPage({ 
  params 
}: { 
  params: { projectId: string } 
}) {
  const { projectId } = await params
  const routes = (await getProjectRoutes(projectId)).map(route => ({
    ...route,
    createdAt: route.createdAt.toISOString()
  }))
  
  return <ProjectSettings projectId={projectId} initialRoutes={routes as unknown as Route[]} />
} 