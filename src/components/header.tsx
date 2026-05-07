'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu, X, User, LogOut, Shield, Twitter as TwitterIcon, Search } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Badge } from '@/components/ui/badge'

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
    <header className="sticky top-0 z-[9999] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* ロゴとXアイコン */}
        <div className="flex items-center">
          <Link href="/" className="mr-6">
            <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">NextraLabs</span>
          </Link>
          <a 
            href="https://x.com/0022_sougo" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-3 bg-white/5 hover:bg-blue-500/20 rounded-xl transition-all border border-white/5 hover:border-blue-500/50 relative z-[10000]"
            style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <TwitterIcon className="h-5 w-5 text-slate-400 hover:text-blue-400" />
          </a>
        </div>

        {/* 🔍 検索バー */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="AIツールを検索..." 
            className="w-full h-10 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"
          />
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">ツール一覧</Link>
          <Link href="/tool-guide" className="text-sm font-medium hover:text-primary transition-colors">ツール説明</Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">料金プラン</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">📩 お問い合わせ</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">ダッシュボード</Link>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                <User className="h-3 w-3 text-emerald-500" />
                <span className="text-[11px] font-black text-slate-200 truncate max-w-[100px]">{profile?.display_name || user.email?.split("@")[0]}</span>
                {profile?.role === 'admin' ? (
                  <Badge className="bg-blue-600 text-white text-[8px] h-4 px-1 ml-1 border-0 font-black">ADMIN</Badge>
                ) : (
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-[8px] h-4 px-1 ml-1 border border-emerald-500/30 uppercase font-black">
                    PLAN
                  </Badge>
                )}
              </div>
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
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-4 animate-in slide-in-from-top-2">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="AIツールを検索..." className="w-full h-12 bg-black border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white focus:border-emerald-500 outline-none transition-all" />
          </div>
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