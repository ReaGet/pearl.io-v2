import { getProjectDetails } from '@/lib/actions'
import { ProjectOverview } from './ProjectOverview'
export default async function ProjectPage({ 
  params 
}: { 
  params: { projectId: string } 
}) {
  const data = await getProjectDetails(params.projectId)
  
  if (!data) {
    return <div>Проект не найден</div>
  }

  const transformedData = {
    ...data,
    project: {
      ...data.project,
      cachedImagesCount: data.project.cachedImages.length,
      favicon: data.project.favicon || undefined,
      createdAt: data.project.createdAt.toISOString()
    }
  }

  return <ProjectOverview initialData={transformedData} />
} 