import { getProjectAnalytics } from '@/lib/actions'
import { ProjectAnalyticsView } from './ProjectAnalyticsView'

export default async function AnalyticsPage({ 
  params 
}: { 
  params: { projectId: string } 
}) {
  const { projectId } = await params
  const data = await getProjectAnalytics(projectId)
  
  return <ProjectAnalyticsView initialData={data} />
} 