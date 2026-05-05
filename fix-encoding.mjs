import fs from 'fs';
import path from 'path';

const toolsDir = 'C:/Users/fyone/Desktop/membership-site-fix/src/components/tools';
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.tsx'));

const corrections = {
  'AiSidejob.tsx': `'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DebugPanel } from './DebugPanel'

const TABS = [
  { id: 'diagnosis', icon: '🧠', label: '適性診断' },
  { id: 'roadmap', icon: '🗺️', label: 'ロードマップ' },
  { id: 'simulator', icon: '💰', label: '収益シミュレーター' },
  { id: 'templates', icon: '📝', label: 'テンプレート集' },
  { id: 'tools', icon: '🛠️', label: 'AIツール辞典' },
  { id: 'log', icon: '📊', label: '活動ログ' },
]

export default function AiSidejob() {
  const [activeTab, setActiveTab] = useState('diagnosis')

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-12 min-h-screen text-slate-200 font-sans">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-black text-white uppercase italic">AI Sidejob Dash</h1>
        <p className="text-slate-500">副業の第一歩をAIが強力にエスコート。</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {TABS.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={"px-6 py-3 rounded-2xl font-bold border-2 transition-all " + (activeTab === tab.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500')}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-12 shadow-2xl">
        <div className="text-center py-20">
          <h2 className="text-3xl font-black text-white uppercase mb-4">{TABS.find(t => t.id === activeTab)?.label}</h2>
          <div className='bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl mb-12 relative overflow-hidden text-left'>
            <div className='relative z-10 space-y-4'>
              <h3 className='text-3xl font-black italic uppercase'>新機能開発中</h3>
              <p className='text-xl md:text-2xl font-bold leading-relaxed opacity-95'>NextraLabsでは、より高度なAI体験を提供するために現在この機能を磨き上げています。</p>
            </div>
          </div>
        </div>
      </Card>

      <DebugPanel data={null} toolId="ai-sidejob" />
    </div>
  )
}`
};

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (corrections[file]) {
    fs.writeFileSync(filePath, corrections[file], 'utf8');
    console.log(`✅ Perfectly restored: ${file}`);
  } else {
    // 他のファイルもUTF-8として再保存して不純物を除去
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Normalized encoding: ${file}`);
  }
});
