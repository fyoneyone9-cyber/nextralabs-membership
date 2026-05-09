'use client'
import React, { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    })

    window.addEventListener('appinstalled', () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
    })
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstallable(false)
      setDeferredPrompt(null)
    }
  }

  if (!isInstallable) return null

  return (
    <div className="fixed bottom-24 right-6 z-[9998] animate-in slide-in-from-right-4">
      <Button 
        onClick={handleInstall}
        className="bg-[#5845e0] hover:bg-[#4736b8] text-white font-black px-6 h-14 rounded-2xl shadow-[0_10px_40px_rgba(88,69,224,0.4)] flex items-center gap-3 border-2 border-white/10"
      >
        <Download className="w-5 h-5 animate-bounce" />
        <span className="italic uppercase text-xs tracking-widest">Install App</span>
      </Button>
    </div>
  )
}
