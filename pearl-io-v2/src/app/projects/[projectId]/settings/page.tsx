import { getProjectRoutes } from '@/lib/actions'
import { ProjectSettings } from './ProjectSettings'
import { Route } from '@prisma/client'

export default async function SettingsPage({ 
  params 
}: { 
  params: { projectId: string } 
}) {
  const routes = (await getProjectRoutes(params.projectId)).map(route => ({
    ...route,
    createdAt: route.createdAt.toISOString()
  }))
  
  return <ProjectSettings projectId={params.projectId} initialRoutes={routes as unknown as Route[]} />
} 