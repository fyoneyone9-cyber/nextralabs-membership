import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import HotelPage from '@/components/tools/StayseeFinderEngine'
import { AccessGate } from '@/components/tools/AccessGate'

export default async function Page() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#050507]">
      <AccessGate productId="staysee-ai-finder">
        <HotelPage />
      </AccessGate>
    </div>
  )
}