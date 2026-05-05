'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DebugPanel } from './DebugPanel'
import { Flame, MessageCircle, Share2, Sparkles, Copy, RefreshCw } from 'lucide-react'

const templates = [
  { id: 'empathy', name: '共感型', icon: '🤝', desc: '「わかる！」「それな！」を誘発' },
  { id: 'controversy', name: '議論型', icon: '🔥', desc: '賛否両論でインプレッションを最大化' },
  { id: 'tips', name: '有益型', icon: '💡', desc: '保存される豆知識・ノウハウ' },
]

export default function BuzzWriter() {
  const [activeTab, setActiveTab] = useState('empathy')

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans">
      <div className="text-center space-y-4 mb-12">
        <div className="w-20 h-20 rounded-[2rem] bg-orange-600 flex items-center justify-center mx-auto shadow-2xl"><Flame className="h-10 w-10 text-white" /></div>
        <h1 className="text-4xl font-black text-white uppercase italic">AI Buzz Writer</h1>
        <p className="text-slate-500 text-lg font-bold">バズる文章をAIがプロデュース。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {templates.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={"p-8 rounded-[2rem] border-2 transition-all text-left " + (activeTab === t.id ? 'bg-orange-600/10 border-orange-500 scale-105 shadow-xl' : 'bg-slate-900/50 border-white/5 opacity-50')}>
            <span className="text-4xl mb-4 block">{t.icon}</span>
            <h3 className="text-xl font-black text-white">{t.name}</h3>
            <p className="text-sm text-slate-400 mt-2 font-medium">{t.desc}</p>
          </button>
        ))}
      </div>

      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl">
        <div className="text-center py-20 space-y-6">
          <Sparkles className="h-16 w-16 text-orange-500 mx-auto animate-pulse" />
          <h2 className="text-3xl font-black text-white uppercase">{templates.find(t => t.id === activeTab)?.name}モード起動中</h2>
          <p className="text-slate-500 max-w-md mx-auto text-lg">トピックを入力して「バズ文生成」ボタンを押してください。</p>
        </div>
      </Card>

      <DebugPanel data={null} toolId="buzz-writer" />
    </div>
  )
}