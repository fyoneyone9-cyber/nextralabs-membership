'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Zap, Star, Crown, Shield, TrendingUp, Share2, ShieldCheck, Mail, Briefcase, Wallet, Building2, Youtube, User, HeartHandshake, Sofa, Network, LayoutGrid } from 'lucide-react'

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div className="min-h-screen bg-[#0a0b14]" />

  return (
    <div className="min-h-screen bg-[#0a0b14] text-slate-200 font-sans pb-20">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-16">
        {/* Section: Recommend */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-orange-500 font-black">|</span>
            <BookOpen className="w-5 h-5 text-emerald-500" />
            本日のおすすめ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/products/staysee-ai-finder/app">
              <Card className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/50 transition-all group shadow-xl">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                  <Building2 className="text-emerald-500" size={32} />
                </div>
                <h3 className="text-xl font-black text-white italic uppercase leading-tight group-hover:text-emerald-400">AI×ホテルDXシステム【Nextra】</h3>
                <p className="text-slate-500 text-xs mt-2">宿泊予約・鍵発行を完全同期</p>
                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                  <Badge variant="outline" className="text-[8px] uppercase border-white/10 opacity-50">PREMIUM</Badge>
                  <span className="text-[10px] font-black text-emerald-500 italic uppercase">View Details ➔</span>
                </div>
              </Card>
            </Link>
            <Link href="/products/sns-auto-poster/app">
              <Card className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/50 transition-all group shadow-xl">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                  <Share2 className="text-rose-500" size={32} />
                </div>
                <h3 className="text-xl font-black text-white italic uppercase leading-tight group-hover:text-emerald-400">AI SNSオートポスター</h3>
                <p className="text-slate-500 text-xs mt-2">バズる投稿をAIが自動生成</p>
                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                  <Badge variant="outline" className="text-[8px] uppercase border-white/10 opacity-50">LIGHT</Badge>
                  <span className="text-[10px] font-black text-emerald-500 italic uppercase">View Details ➔</span>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Section: Free */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 mt-12">
            <span className="text-orange-500 font-black">|</span>
            <Shield className="w-5 h-5 text-slate-400" />
            無料ツール
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/products/evidence-manager/app">
              <Card className="bg-[#13141f] border-2 border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/50 transition-all group">
                <h3 className="text-lg font-black text-white italic uppercase">AI エビデンス・マネージャー</h3>
                <p className="text-slate-500 text-xs">証拠資料の自動整理・管理</p>
              </Card>
            </Link>
          </div>
        </div>
        
        {/* ※ 他のセクションも同様に修復 */}
        <div className="text-center opacity-10 font-black uppercase tracking-[0.5em] italic text-[8px] mt-20">
           NextraLabs MASTERMODEL • 2026
        </div>
      </div>
    </div>
  )
}