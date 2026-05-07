import HotelPage from '@/components/tools/StayseeFinderEngine'
import { AccessGate } from '@/components/tools/AccessGate'

export default function Page() {
  return (
    <AccessGate productId="staysee-ai-finder">
      <div className="min-h-screen bg-[#050507]">
        <HotelPage />
      </div>
    </AccessGate>
  )
}
