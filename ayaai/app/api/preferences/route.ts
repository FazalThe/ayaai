import { NextRequest } from 'next/server'
import { getPreferences, updatePreferences } from '@/lib/supabase/preferences'

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  
  if (!userId) {
    return new Response('User ID not found', { status: 401 })
  }

  const preferences = await getPreferences(userId)
  
  return new Response(JSON.stringify(preferences), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  const body = await request.json()
  
  if (!userId) {
    return new Response('User ID not found', { status: 401 })
  }

  const success = await updatePreferences(userId, body)
  
  return new Response(JSON.stringify({ success }), {
    status: success ? 200 : 500,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}