'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DebugPanel } from './DebugPanel'

const TABS = [
  { id: 'diagnosis', icon: 'ｧ', label: '驕ｩ諤ｧ險ｺ譁ｭ' },
  { id: 'roadmap', icon: '亮・・, label: '繝ｭ繝ｼ繝峨・繝・・' },
  { id: 'simulator', icon: '腸', label: '蜿守寢繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ' },
  { id: 'templates', icon: '統', label: '繝・Φ繝励Ξ繝ｼ繝磯寔' },
  { id: 'tools', icon: '屏・・, label: 'AI繝・・繝ｫ霎槫・' },
  { id: 'log', icon: '投', label: '豢ｻ蜍輔Ο繧ｰ' },
]

export default function AiSidejob() {
  const [activeTab, setActiveTab] = useState('diagnosis')

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-white uppercase italic">AI Sidejob Dash</h1>
        <p className="text-slate-500">蜑ｯ讌ｭ縺ｮ隨ｬ荳豁ｩ繧但I縺悟ｼｷ蜉帙↓繧ｨ繧ｹ繧ｳ繝ｼ繝医・/p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {TABS.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-2xl font-bold border-2 transition-all ${activeTab === tab.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl">
        <div className="text-center py-20">
          <h2 className="text-3xl font-black text-white uppercase mb-4">{TABS.find(t => t.id === activeTab)?.label}</h2>
          <p className="text-slate-500">繧ｳ繝ｳ繝・Φ繝・ｒ貅門ｙ荳ｭ縺ｧ縺・..</p>
        </div>
      </Card>

      <DebugPanel data={null} toolId="ai-sidejob" />
    </div>
  )
}

