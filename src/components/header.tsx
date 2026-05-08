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
  const [userPlan, setUserPlan] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    // カタログページへ検索クエリを持って移動
    router.push("/products?q=" + encodeURIComponent(searchQuery.trim()))
    setMenuOpen(false)
  }

  useEffect(() => {
    setMounted(true)
    const getUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
      if (currentUser) {
        const { data } = await supabase.from('profiles').select('*').eq('user_id', currentUser.id).maybeSingle()
        setProfile(data)
        const { data: sub } = await supabase.from('subscriptions').select('plan').eq('user_id', currentUser.id).eq('status', 'active').maybeSingle()
        setUserPlan(sub?.plan ?? 'free')
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
            className="hover:text-blue-400 transition-all relative z-[10000] ml-4"
            style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <TwitterIcon className="h-5 w-5 text-slate-400 hover:text-blue-400" />
          </a>
        </div>

        {/* 🔍 検索バー */}
                <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="AIツールを検索..." 
            className="w-full h-10 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner"
          />
          <button type="submit" className="hidden">検索</button>
        </form>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">ツール一覧</Link>
          <Link href="/tool-guide" className="text-sm font-medium hover:text-primary transition-colors">ツール説明</Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">料金プラン</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">📩 お問い合わせ</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">ダッシュボード</Link>
              <Link href="/dashboard/profile">
                <div className="flex items-center gap-2 p-1 pr-3 bg-black/40 backdrop-blur-md rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] group hover:border-emerald-500/60 transition-all cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <User className="h-4 w-4 text-slate-950" />
                  </div>
                  <div className="flex flex-col leading-none mr-1">
                    <span className="text-[10px] font-black text-white italic tracking-tighter uppercase mb-0.5">{profile?.display_name || user.email?.split("@")[0]}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[8px] font-bold text-emerald-500/70 tracking-widest uppercase">Identity Verified</span>
                    </div>
                  </div>
                  {profile?.role === 'admin' ? (
                    <Badge className="bg-blue-600 text-white text-[9px] font-black italic px-2 py-0.5 rounded-lg border-b-2 border-blue-800 shadow-lg">ADMIN</Badge>
                  ) : userPlan === 'premium' ? (
                    <Badge className="bg-amber-500 text-slate-950 text-[9px] font-black italic px-2 py-0.5 rounded-lg border-b-2 border-amber-700 shadow-lg uppercase">PREMIUM</Badge>
                  ) : userPlan === 'standard' ? (
                    <Badge className="bg-emerald-500 text-slate-950 text-[9px] font-black italic px-2 py-0.5 rounded-lg border-b-2 border-emerald-700 shadow-lg uppercase">STANDARD</Badge>
                  ) : userPlan === 'light' ? (
                    <Badge className="bg-sky-500 text-slate-950 text-[9px] font-black italic px-2 py-0.5 rounded-lg border-b-2 border-sky-700 shadow-lg uppercase">LIGHT</Badge>
                  ) : (
                    <Badge className="bg-slate-600 text-white text-[9px] font-black italic px-2 py-0.5 rounded-lg border-b-2 border-slate-800 shadow-lg uppercase">FREE</Badge>
                  )}
                </div>
              </Link>
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
                  <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="AIツールを検索..." 
              className="w-full h-12 bg-black border border-white/10 rounded-xl pl-12 pr-4 text-sm text-white focus:border-emerald-500 outline-none transition-all"
            />
          </form>
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