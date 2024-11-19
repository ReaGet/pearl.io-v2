import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardStatsProps {
  totalProjects: number
  totalImages: number
  totalCached: number
}

export function DashboardStats({ totalProjects, totalImages, totalCached }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всего проектов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Сгенерированные изображения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalImages}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Кэшированные изображения</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCached}</div>
        </CardContent>
      </Card>
    </div>
  )
} 