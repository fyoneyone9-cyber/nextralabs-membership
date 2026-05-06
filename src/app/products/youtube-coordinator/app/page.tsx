import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import YoutubeCoordinatorSystem from '@/components/products/YoutubeCoordinatorSystem'
import { AccessGate } from '@/components/products/AccessGate'

export default async function Page() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <AccessGate productId="youtube-coordinator">
      <YoutubeCoordinatorSystem />
    </AccessGate>
  )
}
