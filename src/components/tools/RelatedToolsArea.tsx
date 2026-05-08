'use client'
import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'

// ツールごとの関連マップ（独立化を想定した戦略的リンク）
const RELATION_MAP: Record<string, string[]> = {
  'money-guard': ['shopping-stopper', 'buy-smart-nav', 'price-tracker'],
  'ai-recipe': ['smart-gardening', 'shopping-stopper'],
  'ai-exam-generator': ['exam-scheduler', 'ai-report-generator'],
  'kdp-guide': ['kindle-factory', 'prompt-master', 'buzz-writer'],
  'ai-sidejob': ['buzz-writer', 'prompt-master', 'inbox-organizer'],
  'staysee-ai-finder': ['comp-price-monitor', 'location-finder'],
  // デフォルトはランダムまたは人気ツール
  'default': ['money-guard', 'ai-exam-generator', 'ai-konkatsu']
}

// 簡易的なツール名引き辞書（実際は共通定数から引くのが理想）
const TOOL_NAMES: Record<string, string> = {
  'money-guard': 'AI家計防衛シミュレーター',
  'shopping-stopper': 'AI買い物依存ストッパー',
  'buy-smart-nav': '中古・新品AI比較ナビ',
  'price-tracker': '底値監視AI予測',
  'ai-recipe': 'AIレシピ献立コーチ',
  'smart-gardening': 'AIスマートガーデニング',
  'ai-exam-generator': 'AI問題生成 & 苦手分析',
  'exam-scheduler': '資格試験 AIスケジューラー',
  'ai-report-generator': 'AIレポートジェネレーター',
  'kdp-guide': 'Kindle出版AI完全ナビ',
  'kindle-factory': 'Kindle AI ファクトリー',
  'prompt-master': 'AI画像プロンプトマスター',
  'buzz-writer': 'AIバズ文章コーチ',
  'ai-sidejob': 'AI副業スタートダッシュ',
  'inbox-organizer': 'Gmail AI Accelerator',
  'staysee-ai-finder': 'Staysee AI Finder',
  'comp-price-monitor': '競合AI価格監視',
  'location-finder': 'AIロケーションファインダー',
  'ai-konkatsu': 'AI婚活コーチ'
}

export const RelatedToolsArea = ({ currentId }: { currentId: string }) => {
  const relatedIds = RELATION_MAP[currentId] || RELATION_MAP['default']
  
  return (
    <div className="space-y-8 mt-20 mb-20 border-t border-white/5 pt-16">
      <div className="flex flex-col items-center gap-2">
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1 font-black text-[10px] uppercase tracking-[0.3em]">
          Ecosystem Synergy
        </Badge>
        <h4 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter text-center">
          こちらのAIツールも<span className="text-emerald-500">おすすめ</span>です
        </h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {relatedIds.filter(id => id !== currentId).slice(0, 3).map((id) => (
          <Link href={`/products/${id}`} key={id} className="group">
            <Card className="bg-[#0a0a0f] border-2 border-white/5 group-hover:border-emerald-500/50 transition-all rounded-[2rem] p-8 h-full flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <Zap className="text-emerald-500 w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-white font-black text-lg leading-tight group-hover:text-emerald-400 transition-colors">
                    {TOOL_NAMES[id] || id}
                  </h5>
                  <p className="text-slate-500 text-xs mt-2 font-bold italic line-clamp-2">
                    独立したプロフェッショナルAIとして、あなたの課題をピンポイントで解決。
                  </p>
                </div>
              </div>
              <div className="pt-6 flex justify-end relative z-10">
                <ArrowRight className="text-slate-700 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
              </div>
              {/* 背景の装飾 */}
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles size={120} className="text-emerald-500" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
