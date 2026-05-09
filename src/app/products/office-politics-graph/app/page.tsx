'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Network, Zap, ShieldAlert, TrendingUp, ShoppingCart, 
  UserPlus, Info, Trash2, MousePointer2, Link, ArrowRight,
  User, Lock, Save, Download, HelpCircle, Upload, Eye, MousePointer,
  X, Plus, MoreHorizontal, BookOpen, Target, ShieldCheck
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Member {
  id: string; name: string; role: string; power: number; x: number; y: number;
}

interface Connection {
  fromId: string; toId: string; type: 'ally' | 'enemy' | 'neutral';
}

export default function NextraMasterLockedApp() {
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
    alert('【MASTERMODEL LOCKED】保存完了 🔒')
  }

  const addMember = () => {
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: '氏名を入力', role: '役割・派閥', power: 6, x: 50, y: 150,
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
      
      {/* 💎 MASTERMODEL VERIFIED HEADER 💎 */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-emerald-500 z-[1000] shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
      <div className="absolute top-[3px] right-10 bg-emerald-500 text-black px-5 py-1 font-black italic text-xs uppercase tracking-[0.2em] rounded-b-xl shadow-2xl z-[1000] flex items-center gap-2 border-x border-b border-emerald-400">
        <ShieldCheck size={12} /> MASTERMODEL VERIFIED 💎
      </div>

      <div 
        ref={canvasRef}
        className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:60px_60px] z-0" 
        onClick={() => { setSelectedMemberId(null); setIsLinking(false); }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, i) => {
            const coords = getLineCoords(conn); if (!coords) return null;
            const color = conn.type === 'ally' ? '#3b82f6' : conn.type === 'enemy' ? '#ef4444' : '#10b981';
            return <line key={i} x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} stroke={color} strokeWidth="8" strokeDasharray={conn.type === 'neutral' ? '12,12' : '0'} className="opacity-80" />
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
            className={`absolute w-40 p-6 rounded-[2.5rem] border-[4px] shadow-[0_30px_70px_rgba(0,0,0,0.8)] transition-all ${selectedMemberId === m.id ? 'border-emerald-500 bg-[#1a1c2e] scale-110 z-40 shadow-emerald-500/20' : 'border-white/10 bg-[#13141f] z-10'}`}
            style={{ x: m.x, y: m.y, left: 0, top: 0 }}
            onClick={(e) => { e.stopPropagation(); handleMemberClick(m.id); }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-full ${selectedMemberId === m.id ? 'bg-emerald-500 text-black shadow-lg' : 'bg-slate-800 text-slate-400'}`}><User size={28} /></div>
              <input className="bg-transparent text-center font-black text-white w-full outline-none text-lg placeholder:text-white/20" value={m.name} onChange={(e) => { const n = [...members]; n.find(i => i.id === m.id)!.name = e.target.value; setMembers(n); }} onClick={(e) => e.stopPropagation()} />
              <input className="bg-transparent text-center font-bold text-emerald-500 w-full outline-none text-[10px] uppercase italic" value={m.role} onChange={(e) => { const n = [...members]; n.find(i => i.id === m.id)!.role = e.target.value; setMembers(n); }} onClick={(e) => e.stopPropagation()} />
              <div className="flex gap-1">{[...Array(3)].map((_, i) => (<div key={i} className={`w-3 h-3 rounded-full ${i < Math.floor(m.power/3.4) ? 'bg-emerald-500 shadow-md' : 'bg-white/10'}`} />))}</div>
            </div>
            {selectedMemberId === m.id && (<button onClick={(e) => { e.stopPropagation(); removeMember(m.id); }} className="absolute -top-3 -right-3 bg-red-600 p-2 rounded-full shadow-2xl border-2 border-white/20"><X size={14}/></button>)}
          </motion.div>
        ))}
      </div>

      {/* ヘッダー */}
      <div className="absolute top-16 inset-x-8 p-4 flex justify-between items-center z-50">
        <div className="bg-black/90 backdrop-blur-2xl border-2 border-emerald-500/40 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl">
          <ShieldCheck size={24} className="text-emerald-500" />
          <h1 className="text-base md:text-xl font-black italic tracking-tighter uppercase text-white">社内政治戦略ボード</h1>
        </div>
        <Button onClick={() => setShowMenu(!showMenu)} className="bg-black/90 border-2 border-white/10 w-14 h-14 rounded-2xl shadow-xl active:scale-95 transition-all text-emerald-500"><MoreHorizontal size={28} /></Button>
      </div>

      {/* チュートリアル */}
      <AnimatePresence>
        {showTutorial && members.length === 0 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-8 top-44 z-[100] bg-black/95 backdrop-blur-2xl border-[4px] border-emerald-500 p-12 rounded-[4rem] space-y-8 shadow-[0_0_100px_rgba(16,185,129,0.3)] text-left">
            <div className="flex items-center justify-between text-emerald-500 font-black italic text-3xl">
              <div className="flex items-center gap-4"><BookOpen size={40}/> START GUIDE</div>
              <Button onClick={() => setShowTutorial(false)} variant="ghost" className="h-10 w-10 text-white/50"><X size={32}/></Button>
            </div>
            <div className="space-y-6 text-white font-bold italic text-xl leading-relaxed">
              <p>1. 右下の [ ＋ ] で登場人物を召喚</p>
              <p>2. 指で動かして「勢力図」を整理</p>
              <p>3. 人物を選んで [ 関係線を引く ] ➔ 相手をタップ</p>
            </div>
            <Button onClick={() => setShowTutorial(false)} className="w-full h-20 bg-emerald-500 text-black font-black text-2xl rounded-3xl border-b-[10px] border-emerald-800 shadow-2xl">作図を開始する</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* アクションボタン */}
      <div className="absolute bottom-44 right-10 z-50 flex flex-col items-end gap-4 pointer-events-none">
        <Badge className="bg-emerald-500 text-black font-black italic px-6 py-2 shadow-2xl animate-pulse pointer-events-auto rounded-xl">召喚 ➔</Badge>
        <Button onClick={addMember} className="w-24 h-24 bg-emerald-500 hover:bg-emerald-400 text-black rounded-[2.5rem] shadow-[0_20px_80px_rgba(16,185,129,0.6)] active:scale-90 transition-all border-b-[12px] border-emerald-800 pointer-events-auto">
          <Plus size={52} />
        </Button>
      </div>

      {/* ボトムパネル */}
      <div className="absolute bottom-10 inset-x-10 z-50">
        <div className="bg-black/95 backdrop-blur-3xl border-4 border-emerald-500/20 p-8 rounded-[4rem] shadow-[0_60px_120px_rgba(0,0,0,1)] flex flex-col gap-8">
          <div className="flex items-center gap-6">
            <Button 
              onClick={(e) => { e.stopPropagation(); setIsLinking(!isLinking); }}
              disabled={!selectedMemberId}
              className={`flex-[4] h-24 rounded-[2rem] font-black italic text-3xl transition-all border-b-[12px] ${isLinking ? 'bg-blue-600 border-blue-900 text-white animate-pulse' : 'bg-emerald-500 border-emerald-800 text-black shadow-lg shadow-emerald-500/20'}`}
            >
              <Link size={36} className="mr-4" /> {isLinking ? '相手を選ぶ' : '関係線を引く'}
            </Button>
            
            <a href="https://www.amazon.co.jp/s?k=職場の人間関係+心理学&tag=nextralabs-22" target="_blank" className="flex-1 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-900 flex items-center justify-center shadow-2xl border-b-[12px] border-emerald-950 hover:scale-105 transition-all">
              <ShoppingCart size={40} className="text-white" />
            </a>
          </div>
          
          <div className="flex justify-around bg-white/5 py-4 rounded-3xl border border-white/10">
            <div className="flex items-center gap-4 text-left"><div className="w-5 h-5 bg-blue-500 rounded-full shadow-lg" /><span className="text-xs font-black italic text-white/60 uppercase tracking-widest">ALLY</span></div>
            <div className="flex items-center gap-4 text-left"><div className="w-5 h-5 bg-red-600 rounded-full shadow-lg" /><span className="text-xs font-black italic text-white/60 uppercase tracking-widest">ENEMY</span></div>
            <div className="flex items-center gap-4 text-left"><div className="w-5 h-5 bg-emerald-500 rounded-full shadow-lg" /><span className="text-xs font-black italic text-white/60 uppercase tracking-widest">NEUTRAL</span></div>
          </div>
        </div>
      </div>

      {/* サイドメニュー */}
      <AnimatePresence>
        {showMenu && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-y-0 right-0 w-80 bg-black/98 backdrop-blur-3xl border-l-[4px] border-emerald-500 z-[100] p-12 flex flex-col gap-10 text-left">
            <div className="flex justify-between items-center border-b-2 border-emerald-500 pb-8">
              <div className="flex items-center gap-4 text-emerald-500 font-black italic text-2xl"><Target size={32}/> STRATEGY</div>
              <Button onClick={() => setShowMenu(false)} variant="ghost" className="p-0 h-10 w-10 text-white"><X size={40} /></Button>
            </div>
            <div className="flex flex-col gap-6">
              <Button onClick={() => { saveToLocal(); setShowMenu(false); }} className="justify-start font-black italic h-20 bg-white/5 border-2 border-emerald-500/40 rounded-2xl text-emerald-500 hover:bg-emerald-500/20 px-8 text-xl"><Save size={24} className="mr-6" /> ブラウザ保存</Button>
              <Button onClick={() => {
                const data = JSON.stringify({ members, connections });
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `politics_map.json`; a.click();
              }} className="justify-start font-black italic h-20 bg-white/5 border-2 border-emerald-500/40 rounded-2xl text-blue-500 hover:bg-blue-500/20 px-8 text-xl"><Download size={24} className="mr-6" /> ファイル書出</Button>
              <label className="flex items-center gap-6 px-8 font-black italic h-20 bg-white/5 border-2 border-emerald-500/40 rounded-2xl cursor-pointer text-amber-500 hover:bg-amber-500/20 text-xl">
                <Upload size={24} /> 読込・復元
                <input type="file" className="hidden" accept=".json" onChange={(e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  const r = new FileReader(); r.onload = (re) => {
                    try { const { members: m, connections: c } = JSON.parse(re.target?.result as string); setMembers(m); setConnections(c); setShowMenu(false); } catch (e) {}
                  }; r.readAsText(f);
                }} />
              </label>
            </div>
            <div className="mt-auto p-6 bg-emerald-500/10 rounded-[2.5rem] border-2 border-emerald-500/30">
              <p className="text-xs font-black text-emerald-500 uppercase italic mb-3">Locked Status</p>
              <p className="text-[10px] font-bold text-white/40 italic leading-relaxed">
                このツールはNextraLabs MASTERMODELとして完全にロックされています。全ての機能はローカルで完結し、最高級のプライバシーを提供します。
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
