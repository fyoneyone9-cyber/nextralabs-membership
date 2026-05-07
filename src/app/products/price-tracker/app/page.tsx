import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PriceTrackerSystem from '@/components/tools/PriceTrackerSystem'
import { AccessGate } from '@/components/tools/AccessGate'

export default async function Page() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <AccessGate productId="price-tracker">
      <PriceTrackerSystem />
    </AccessGate>
  )
}
