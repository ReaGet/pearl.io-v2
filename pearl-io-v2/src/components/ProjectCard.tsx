import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/types/project'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3">
          {project.favicon && (
            <Image 
              src={project.favicon}
              alt={project.title}
              width={32}
              height={32}
              className="rounded-sm"
            />
          )}
          <div>
            <h3 className="font-medium">{project.title}</h3>
            <p className="text-sm text-gray-500">
              {project.cachedImagesCount} кэшированных изображений
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
} 