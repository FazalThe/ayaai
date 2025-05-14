'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { updatePreferences } from '@/lib/supabase/preferences'

interface RecitationSettingsProps {
  currentStyle: string
  currentSpeed: number
  userId: string
}

export function RecitationSettings({ currentStyle, currentSpeed, userId }: RecitationSettingsProps) {
  const [style, setStyle] = useState(currentStyle)
  const [speed, setSpeed] = useState(currentSpeed)

  const handleStyleChange = async (value: string) => {
    setStyle(value)
    await updatePreferences(userId, { recitation_style: value })
  }

  const handleSpeedChange = async (value: number[]) => {
    const newSpeed = value[0]
    setSpeed(newSpeed)
    await updatePreferences(userId, { recitation_speed: newSpeed })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          Recitation Style
        </label>
        <Select value={style} onValueChange={handleStyleChange}>
          <SelectTrigger className="w-full border-emerald-300 dark:border-emerald-700">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male Voice</SelectItem>
            <SelectItem value="female">Female Voice</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
          Recitation Speed (x{speed.toFixed(1)})
        </label>
        <Slider
          min={0.5}
          max={2}
          step={0.1}
          value={[speed]}
          onValueChange={handleSpeedChange}
          className="w-full"
        />
      </div>
    </div>
  )
}