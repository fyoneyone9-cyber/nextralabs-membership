import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TrendStockSystem from '@/components/tools/TrendStockSystem'
import { AccessGate } from '@/components/tools/AccessGate'

export default async function Page() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <AccessGate productId="trend-stock">
      <TrendStockSystem />
    </AccessGate>
  )
}
