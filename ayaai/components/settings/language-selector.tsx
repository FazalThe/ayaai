'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updatePreferences } from '@/lib/supabase/preferences'

interface LanguageSelectorProps {
  currentLanguage: string
  userId: string
}

export function LanguageSelector({ currentLanguage, userId }: LanguageSelectorProps) {
  const [language, setLanguage] = useState(currentLanguage)

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'ur', name: 'اردو' }
  ]

  const handleChange = async (value: string) => {
    setLanguage(value)
    await updatePreferences(userId, { language: value })
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
        Display Language
      </label>
      <Select value={language} onValueChange={handleChange}>
        <SelectTrigger className="w-full border-emerald-300 dark:border-emerald-700">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}