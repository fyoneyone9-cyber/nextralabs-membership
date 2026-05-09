'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Zap, ExternalLink, ShoppingCart } from 'lucide-react'

export const AffiliateArea = () => {
  return (
    <div className="space-y-6 mt-12 mb-10">
      <div className="flex items-center justify-center gap-3">
        <div className="h-px w-10 bg-emerald-500/30"></div>
        <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 font-bold uppercase text-[10px] tracking-tight px-4 py-1">NextraLabs Select</Badge>
        <div className="h-px w-10 bg-emerald-500/30"></div>
      </div>
      <h4 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tighter text-center">このツールに関連するおすすめアイテム</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <a href="https://amzn.to/3WxXh9C" target="_blank" rel="noopener noreferrer" className="group block">
          <Card className="bg-[#13141f] border-2 border-white/5 hover:border-emerald-500/50 transition-all rounded-[1.5rem] p-5 text-left flex items-center gap-4 shadow-xl relative overflow-hidden">
            <div className="w-16 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-emerald-500/10 transition-colors">
              <ShoppingBag className="text-slate-500 group-hover:text-emerald-500" size={24} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight ">Must Have</p>
              <p className="text-white font-bold text-xs leading-tight line-clamp-2 text-slate-200">高性能ワークライト - 精密な作業をサポートする究極の明かり</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">View on Amazon</span>
                <ExternalLink size={8} className="text-slate-500" />
              </div>
            </div>
            <div className="absolute right-0 bottom-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity"><ShoppingCart size={40} /></div>
          </Card>
        </a>
        
        <a href="https://amzn.to/3WxXh9C" target="_blank" rel="noopener noreferrer" className="group block">
          <Card className="bg-[#13141f] border-2 border-white/5 hover:border-emerald-500/50 transition-all rounded-[1.5rem] p-5 text-left flex items-center gap-4 shadow-xl relative overflow-hidden">
            <div className="w-16 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-emerald-500/10 transition-colors">
              <Zap className="text-slate-500 group-hover:text-emerald-500" size={24} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight ">AI Essential</p>
              <p className="text-white font-bold text-xs leading-tight line-clamp-2 text-slate-200">スマートプラグ - 全ての家電をAIでコントロール</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">View on Amazon</span>
                <ExternalLink size={8} className="text-slate-500" />
              </div>
            </div>
            <div className="absolute right-0 bottom-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity"><ShoppingCart size={40} /></div>
          </Card>
        </a>
      </div>
    </div>
  )
}
