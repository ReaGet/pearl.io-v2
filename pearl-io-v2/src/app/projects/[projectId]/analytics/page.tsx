import { getProjectAnalytics } from '@/lib/actions'
import { ProjectAnalyticsView } from './ProjectAnalyticsView'

export default async function AnalyticsPage({ 
  params 
}: { 
  params: { projectId: string } 
}) {
  const data = await getProjectAnalytics(params.projectId)
  
  return <ProjectAnalyticsView initialData={data} />
} 