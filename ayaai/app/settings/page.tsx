import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { SettingsCard } from '@/components/ui/settings-card'
import { LanguageSelector } from '@/components/settings/language-selector'
import { RecitationSettings } from '@/components/settings/recitation-settings'
import { ThemeToggle } from '@/components/settings/theme-toggle'

export default async function SettingsPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-emerald-800 dark:text-emerald-400">Settings</h1>
      
      <div className="space-y-6">
        <SettingsCard title="Language Preferences">
          <LanguageSelector 
            currentLanguage={preferences?.language || 'en'} 
            userId={user.id} 
          />
        </SettingsCard>

        <SettingsCard title="Recitation Settings">
          <RecitationSettings 
            currentStyle={preferences?.recitation_style || 'male'} 
            currentSpeed={preferences?.recitation_speed || 1} 
            userId={user.id} 
          />
        </SettingsCard>

        <SettingsCard title="Appearance">
          <ThemeToggle currentTheme={preferences?.theme || 'light'} userId={user.id} />
        </SettingsCard>
      </div>
    </div>
  )
}