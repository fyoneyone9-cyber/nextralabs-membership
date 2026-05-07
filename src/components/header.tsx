'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X, User, LogOut, Shield, Twitter as TwitterIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

export function Header() {
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const getUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
      if (currentUser) {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', currentUser.id).maybeSingle()
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

  if (!mounted) return <header className="h-16 border-b bg-background/95" />

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">NextraLabs</span>
          </Link>
          <a href="https://x.com/0022_sougo" target="_blank" rel="noopener noreferrer" className="relative z-[100] inline-block p-2 text-slate-500 hover:text-blue-400 transition-all ml-4" style={{ pointerEvents: "auto" }}>
            <TwitterIcon className="h-5 w-5 fill-current" />
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">ツール一覧</Link>
          <Link href="/tool-guide" className="text-sm font-medium hover:text-primary transition-colors">ツール説明</Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">料金プラン</Link>
          <Link href="/guide" className="text-sm font-medium hover:text-primary transition-colors">📖 ガイド</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">📩 お問い合わせ</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">ダッシュボード</Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4 mr-1" />ログアウト</Button>
            </>
          ) : (
            <Link href="/login"><Button variant="ghost" size="sm">ログイン</Button></Link>
          )}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <Link href="/products" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>ツール一覧</Link>
          <Link href="/contact" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>📩 お問い合わせ</Link>
          {user ? (
            <Link href="/dashboard" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>ダッシュボード</Link>
          ) : (
            <Link href="/login" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>ログイン</Link>
          )}
        </div>
      )}
    </header>
  )
}