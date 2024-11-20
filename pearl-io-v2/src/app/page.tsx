import { getProjects, getDashboardStats } from '@/lib/actions'
import { DashboardClient } from './DashboardClient'

export default async function Dashboard() {
  const [projects, stats] = await Promise.all([
    getProjects(),
    getDashboardStats()
  ])
  
  return <DashboardClient 
    initialProjects={projects} 
    initialStats={stats}
  />
}
