import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SettingsCardProps {
  title: string
  children: React.ReactNode
}

export function SettingsCard({ title, children }: SettingsCardProps) {
  return (
    <Card className="border-emerald-200 dark:border-emerald-800 bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-emerald-800 dark:text-emerald-400">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}