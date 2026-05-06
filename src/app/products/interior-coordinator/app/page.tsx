import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InteriorCoordinatorSystem from '@/components/products/InteriorCoordinatorSystem'
import { AccessGate } from '@/components/products/AccessGate'

export default async function Page() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <AccessGate productId="interior-coordinator">
      <InteriorCoordinatorSystem />
    </AccessGate>
  )
}
