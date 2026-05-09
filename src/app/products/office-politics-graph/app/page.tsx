'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Network, Zap, ShieldAlert, TrendingUp, ShoppingCart, 
  UserPlus, Info, Trash2, MousePointer2, Link, ArrowRight,
  User, Lock, Save, Download, HelpCircle, Upload, Eye, MousePointer,
  X, Plus, MoreHorizontal, BookOpen, Target
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Member {
  id: string; name: string; role: string; power: number; x: number; y: number;
}

interface Connection {
  fromId: string; toId: string; type: 'ally' | 'enemy' | 'neutral';
}

export default function UltimatePoliticsBoard() {
  const [members, setMembers] = useState<Member[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [isLinking, setIsLinking] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedMembers = localStorage.getItem('nextra_politics_members')
    const savedConns = localStorage.getItem('nextra_politics_conns')
    if (savedMembers) setMembers(JSON.parse(savedMembers))
    if (savedConns) setConnections(JSON.parse(savedConns))
  }, [])

  const saveToLocal = () => {
    localStorage.setItem('nextra_politics_members', JSON.stringify(members))
    localStorage.setItem('nextra_politics_conns', JSON.stringify(connections))
    alert('保存完了 🔒')
  }

  const addMember = () => {
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: '氏名を入力', role: '役割・派閥', power: 6, x: 100, y: 150,
    }
    setMembers([...members, newMember])
    setShowTutorial(false)
  }

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id))
    setConnections(connections.filter(c => c.fromId !== id && c.toId !== id))
    if (selectedMemberId === id) setSelectedMemberId(null)
  }

  const handleMemberClick = (id: string) => {
    if (isLinking && selectedMemberId && selectedMemberId !== id) {
      const existingIdx = connections.findIndex(c => (c.fromId === selectedMemberId && c.toId === id) || (c.fromId === id && c.toId === selectedMemberId))
      if (existingIdx >= 0) {
        const newConns = [...connections]
        const types: Connection['type'][] = ['ally', 'enemy', 'neutral']
        const currentTypeIdx = types.indexOf(newConns[existingIdx].type)
        newConns[existingIdx].type = types[(currentTypeIdx + 1) % 3]
        setConnections(newConns)
      } else {
        setConnections([...connections, { fromId: selectedMemberId, toId: id, type: 'neutral' }])
      }
      setIsLinking(false)
    } else {
      setSelectedMemberId(id)
    }
  }

  const getLineCoords = (conn: Connection) => {
    const from = members.find(m => m.id === conn.fromId)
    const to = members.find(m => m.id === conn.toId)
    if (!from || !to) return null
    return { x1: from.x + 80, y1: from.y + 100, x2: to.x + 80, y2: to.y + 100 }
  }

  return (
    <div className="fixed inset-0 bg-[#050507] text-white font-sans overflow-hidden touch-none selection:bg-emerald-500/30">
      
      {/* 1. 背景キャンバス（グリッドをプロ仕様に） */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:60px_60px] z-0" 
        onClick={() => { setSelectedMemberId(null); setIsLinking(false); }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, i) => {
            const coords = getLineCoords(conn); if (!coords) return null;
            const color = conn.type === 'ally' ? '#3b82f6' : conn.type === 'enemy' ? '#ef4444' : '#94a3b8';
            return <line key={i} x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} stroke={color} strokeWidth="6" strokeDasharray={conn.type === 'neutral' ? '10,10' : '0'} className="opacity-80" />
          })}
        </svg>

        {members.map((m) => (
          <motion.div
            key={m.id} drag dragMomentum={false}
            onDrag={(e, info) => {
              const n = [...members]; const i = n.findIndex(it => it.id === m.id);
              n[i].x += info.delta.x; n[i].y += info.delta.y; setMembers(n);
            }}
            initial={{ x: m.x, y: m.y }}
            className={`absolute w-40 p-6 rounded-[2.5rem] border-[3px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all ${selectedMemberId === m.id ? 'border-emerald-500 bg-[#1a1c2e] scale-110 z-40 ring-4 ring-emerald-500/20' : 'border-white/10 bg-[#13141f] z-10'}`}
            style={{ x: m.x, y: m.y, left: 0, top: 0 }}
            onClick={(e) => { e.stopPropagation(); handleMemberClick(m.id); }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-full ${selectedMemberId === m.id ? 'bg-emerald-500 text-black shadow-lg' : 'bg-slate-800 text-slate-400'}`}><User size={28} /></div>
              <input className="bg-transparent text-center font-black text-white w-full outline-none text-lg placeholder:text-white/20" value={m.name} onChange={(e) => { const n = [...members]; n.find(i => i.id === m.id)!.name = e.target.value; setMembers(n); }} onClick={(e) => e.stopPropagation()} />
              <input className="bg-transparent text-center font-bold text-emerald-500/70 w-full outline-none text-[10px] uppercase italic" value={m.role} onChange={(e) => { const n = [...members]; n.find(i => i.id === m.id)!.role = e.target.value; setMembers(n); }} onClick={(e) => e.stopPropagation()} />
              <div className="flex gap-1">{[...Array(3)].map((_, i) => (<div key={i} className={`w-3 h-3 rounded-full ${i < Math.floor(m.power/3.4) ? 'bg-emerald-500 shadow-md' : 'bg-white/10'}`} />))}</div>
            </div>
            {selectedMemberId === m.id && (<button onClick={(e) => { e.stopPropagation(); removeMember(m.id); }} className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-full shadow-xl"><X size={14}/></button>)}
          </motion.div>
        ))}
      </div>

      {/* 2. ヘッダー（上部にはみ出さないように配置） */}
      <div className="absolute top-16 inset-x-6 p-4 flex justify-between items-center z-50">
        <div className="bg-black/80 backdrop-blur-xl border-2 border-emerald-500/30 px-6 py-2 rounded-2xl flex items-center gap-3 shadow-2xl">
          <Network size={20} className="text-emerald-400" />
          <h1 className="text-sm font-black italic tracking-tighter uppercase text-white">不敗の社内政治ボード</h1>
        </div>
        <Button onClick={() => setShowMenu(!showMenu)} className="bg-black/80 border-2 border-white/10 w-12 h-12 rounded-2xl shadow-xl active:scale-95 transition-all"><MoreHorizontal size={20} /></Button>
      </div>

      {/* 3. チュートリアル */}
      <AnimatePresence>
        {showTutorial && members.length === 0 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-8 top-40 z-[100] bg-black/90 backdrop-blur-2xl border-4 border-emerald-500/50 p-10 rounded-[3rem] space-y-6 shadow-2xl">
            <div className="flex items-center justify-between text-emerald-400 font-black italic text-2xl">
              <div className="flex items-center gap-4"><BookOpen size={32}/> START GUIDE</div>
              <Button onClick={() => setShowTutorial(false)} variant="ghost" className="h-10 w-10 text-white/50"><X size={24}/></Button>
            </div>
            <div className="space-y-4 text-white font-bold italic text-lg leading-relaxed">
              <p>1. 右下の [ ＋ ] で登場人物を召喚</p>
              <p>2. 指で動かして「勢力」を整理</p>
              <p>3. 人物を選んで [ 関係線を引く ] ➔ 相手をタップ</p>
            </div>
            <Button onClick={() => setShowTutorial(false)} className="w-full h-16 bg-emerald-500 text-black font-black text-xl rounded-2xl border-b-8 border-emerald-700">作図を開始する</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. アクションボタン（配置を整理） */}
      <div className="absolute bottom-36 right-8 z-50 flex flex-col items-end gap-3 pointer-events-none">
        <Badge className="bg-emerald-500 text-black font-black italic px-4 py-1 animate-bounce pointer-events-auto">召喚 ➔</Badge>
        <Button onClick={addMember} className="w-20 h-20 bg-emerald-500 hover:bg-emerald-400 text-black rounded-3xl shadow-[0_20px_60px_rgba(16,185,129,0.5)] active:scale-90 transition-all border-b-8 border-emerald-700 pointer-events-auto">
          <Plus size={40} />
        </Button>
      </div>

      {/* 5. ボトムダッシュボード（重厚感と独立性を両立） */}
      <div className="absolute bottom-8 inset-x-8 z-50">
        <div className="bg-black/95 backdrop-blur-3xl border-2 border-emerald-500/20 p-6 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button 
              onClick={(e) => { e.stopPropagation(); setIsLinking(!isLinking); }}
              disabled={!selectedMemberId}
              className={`flex-[4] h-20 rounded-[1.8rem] font-black italic text-2xl transition-all border-b-8 ${isLinking ? 'bg-blue-600 border-blue-800 text-white animate-pulse' : 'bg-white/5 text-slate-400 border-white/10'}`}
            >
              <Link size={28} className="mr-3" /> {isLinking ? '相手を選択' : '関係線を引く'}
            </Button>
            
            <a href="https://www.amazon.co.jp/s?k=職場の人間関係+心理学&tag=nextralabs-22" target="_blank" className="flex-1 h-20 rounded-[1.8rem] bg-gradient-to-r from-emerald-600 to-teal-800 flex items-center justify-center shadow-lg border-b-8 border-teal-950 hover:scale-105 transition-all">
              <ShoppingCart size={32} className="text-white" />
            </a>
          </div>
          
          <div className="flex justify-around bg-white/5 py-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3"><div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg" /><span className="text-xs font-black italic text-white/60">味方</span></div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 bg-red-500 rounded-full shadow-lg" /><span className="text-xs font-black italic text-white/60">対立</span></div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 bg-slate-400 border border-dashed border-white rounded-full" /><span className="text-xs font-black italic text-white/60">中立</span></div>
          </div>
        </div>
      </div>

      {/* サイドメニュー */}
      <AnimatePresence>
        {showMenu && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-y-0 right-0 w-80 bg-black/95 backdrop-blur-3xl border-l-2 border-emerald-500/30 z-[100] p-10 flex flex-col gap-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
              <div className="flex items-center gap-3 text-emerald-400 font-black italic text-xl"><Target size={24}/> STRATEGY</div>
              <Button onClick={() => setShowMenu(false)} variant="ghost" className="p-0 h-10 w-10 text-white"><X size={32} /></Button>
            </div>
            <div className="flex flex-col gap-4">
              <Button onClick={() => { saveToLocal(); setShowMenu(false); }} className="justify-start font-black italic h-16 bg-white/5 border border-white/10 rounded-2xl"><Save size={20} className="mr-4 text-emerald-500" /> ブラウザ保存</Button>
              <Button onClick={() => {
                const data = JSON.stringify({ members, connections });
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `politics_map.json`; a.click();
              }} className="justify-start font-black italic h-16 bg-white/5 border border-white/10 rounded-2xl"><Download size={20} className="mr-4 text-blue-500" /> ファイル書出</Button>
              <label className="flex items-center gap-4 px-5 font-black italic h-16 bg-white/5 border border-white/10 rounded-2xl cursor-pointer">
                <Upload size={20} className="text-amber-500" /> 読込・復元
                <input type="file" className="hidden" accept=".json" onChange={(e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  const r = new FileReader(); r.onload = (re) => {
                    try { const { members: m, connections: c } = JSON.parse(re.target?.result as string); setMembers(m); setConnections(c); setShowMenu(false); } catch (e) {}
                  }; r.readAsText(f);
                }} />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
