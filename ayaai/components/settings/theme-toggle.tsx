'use client'

import * as Slider from '@radix-ui/react-slider'
import { updatePreferences } from '@/lib/supabase/preferences'

interface ThemeToggleProps {
  currentTheme: string
  userId: string
}

export function ThemeToggle({ currentTheme, userId }: ThemeToggleProps) {
  const handleThemeChange = async (value: number[]) => {
    const newTheme = value[0] > 50 ? 'dark' : 'light'
    if (newTheme !== currentTheme) {
      await updatePreferences(userId, { theme: newTheme })
    }
  }

  return (
    <Slider.Root 
      className="relative flex items-center select-none touch-none w-[200px] h-5"
      min={0}
      max={100}
      step={1}
      defaultValue={[currentTheme === 'dark' ? 75 : 25]}
      onValueChange={handleThemeChange}
    >
      <Slider.Track className="relative grow bg-black h-[3px] rounded-full">
        <Slider.Range className="absolute bg-white h-full rounded-full" />
      </Slider.Track>
      <Slider.Thumb className="block w-5 h-5 bg-white shadow-md border border-gray-300 rounded-full" />
    </Slider.Root>
  )
}