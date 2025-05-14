import { createClient } from '@/lib/supabase/client'

export async function getPreferences(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching preferences:', error)
    return null
  }
  
  return data
}

export async function updatePreferences(userId: string, preferences: any) {
  const supabase = createClient()
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      ...preferences
    })
  
  if (error) {
    console.error('Error updating preferences:', error)
    return false
  }
  
  return true
}