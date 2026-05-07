'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X, User, LogOut, Shield, Twitter as TwitterIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import type { Profile } from '@/types'

export function Header() {
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
        setProfile(data)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            NextraLabs
          </span>
          <a href="https://x.com/0022_sougo" target="_blank" rel="noopener noreferrer" className="relative z-50 text-slate-500 hover:text-blue-400 transition-all ml-2 p-1" style={{ pointerEvents: "auto" }}>
            <TwitterIcon className="h-4 w-4 fill-current" />
          </a>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
            繝・・繝ｫ荳隕ｧ
          </Link>
          <Link href="/tool-guide" className="text-sm font-medium hover:text-primary transition-colors">
            繝・・繝ｫ隱ｬ譏・
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            譁咎≡繝励Λ繝ｳ
          </Link>
          <Link href="/guide" className="text-sm font-medium hover:text-primary transition-colors">
            当 繧ｬ繧､繝・
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            陶 縺雁撫縺・粋繧上○
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                繝繝・す繝･繝懊・繝・
              </Link>
              {profile?.role === 'admin' && (
                <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  邂｡逅・判髱｢
                </Link>
              )}
              <Link href="/profile" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                <User className="h-3 w-3" />
                {profile?.display_name || '繝励Ο繝輔ぅ繝ｼ繝ｫ'}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                繝ｭ繧ｰ繧｢繧ｦ繝・
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">繝ｭ繧ｰ繧､繝ｳ</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">辟｡譁吶〒蟋九ａ繧・/Button>
              </Link>
            </>
          )}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          <Link href="/products" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
            繝・・繝ｫ荳隕ｧ
          </Link>
          <Link href="/tool-guide" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
            繝・・繝ｫ隱ｬ譏・
          </Link>
          <Link href="/pricing" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
            譁咎≡繝励Λ繝ｳ
          </Link>
          <Link href="/guide" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
            当 繧ｬ繧､繝・
          </Link>
          <Link href="/contact" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
            陶 縺雁撫縺・粋繧上○
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                繝繝・す繝･繝懊・繝・
              </Link>
              <Link href="/profile" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                繝励Ο繝輔ぅ繝ｼ繝ｫ
              </Link>
              {profile?.role === 'admin' && (
                <Link href="/admin" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>
                  邂｡逅・判髱｢
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">
                繝ｭ繧ｰ繧｢繧ｦ繝・
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full">繝ｭ繧ｰ繧､繝ｳ</Button>
              </Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)}>
                <Button className="w-full">辟｡譁吶〒蟋九ａ繧・/Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

