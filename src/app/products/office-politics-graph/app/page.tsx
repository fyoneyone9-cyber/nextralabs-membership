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

export default function MobileFirstPoliticsBoard() {
  const [members, setMembers] = useState<Member[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [isLinking, setIsLinking] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)

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
      name: '氏名を入力', role: '役割・派閥', power: 6, x: 100, y: 200,
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
    return { x1: from.x + 96, y1: from.y + 112, x2: to.x + 96, y2: to.y + 112 }
  }

  return (
    <div className="fixed inset-0 bg-[#050507] text-white font-sans overflow-hidden touch-none selection:bg-emerald-500/30">
      
      {/* 全画面キャンバス */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_2px,transparent_2px)] [background-size:80px_80px] z-0" onClick={() => { setSelectedMemberId(null); setIsLinking(false); }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, i) => {
            const coords = getLineCoords(conn); if (!coords) return null;
            const color = conn.type === 'ally' ? '#3b82f6' : conn.type === 'enemy' ? '#ef4444' : '#94a3b8';
            const dash = conn.type === 'neutral' ? '12,12' : '0';
            return <line key={i} x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} stroke={color} strokeWidth="8" strokeDasharray={dash} className="opacity-90" />
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
            className={`absolute w-48 p-8 rounded-[3rem] border-[4px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all ${selectedMemberId === m.id ? 'border-emerald-500 bg-[#1a1c2e] scale-110 z-50 ring-8 ring-emerald-500/20' : 'border-white/10 bg-[#13141f] z-10'}`}
            style={{ x: m.x, y: m.y, left: 0, top: 0 }}
            onClick={(e) => { e.stopPropagation(); handleMemberClick(m.id); }}
          >
            <div className="flex flex-col items-center gap-6">
              <div className={`p-5 rounded-full ${selectedMemberId === m.id ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}><User size={40} /></div>
              <input className="bg-transparent text-center font-black text-white w-full outline-none text-2xl placeholder:text-white/20" value={m.name} onChange={(e) => { const n = [...members]; n.find(i => i.id === m.id)!.name = e.target.value; setMembers(n); }} onClick={(e) => e.stopPropagation()} />
              <input className="bg-transparent text-center font-bold text-emerald-500/70 w-full outline-none text-base uppercase italic" value={m.role} onChange={(e) => { const n = [...members]; n.find(i => i.id === m.id)!.role = e.target.value; setMembers(n); }} onClick={(e) => e.stopPropagation()} />
              <div className="flex gap-2">{[...Array(3)].map((_, i) => (<div key={i} className={`w-4 h-4 rounded-full ${i < Math.floor(m.power/3.4) ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`} />))}</div>
            </div>
            {selectedMemberId === m.id && (<button onClick={(e) => { e.stopPropagation(); removeMember(m.id); }} className="absolute -top-4 -right-4 bg-red-500 p-3 rounded-full shadow-2xl hover:scale-125 transition-all"><X size={20}/></button>)}
          </motion.div>
        ))}
      </div>

      {/* ヘッダー：h-auto で中身に合わせる */}
      <div className="absolute top-0 inset-x-0 p-4 md:p-8 flex justify-between items-start z-50 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-2xl border-4 border-emerald-500/40 px-6 md:px-8 py-3 md:py-4 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 shadow-[0_0_50px_rgba(16,185,129,0.3)] pointer-events-auto max-w-[80%]">
          <Network size={28} className="text-emerald-400 shrink-0" />
          <h1 className="text-lg md:text-2xl font-black italic tracking-tighter uppercase text-white leading-tight">不敗の社内政治ボード</h1>
        </div>
        <Button onClick={() => setShowMenu(!showMenu)} className="bg-black/80 border-4 border-white/10 w-14 h-14 md:w-20 md:h-20 rounded-[1.2rem] md:rounded-[2rem] shadow-2xl active:scale-90 transition-all pointer-events-auto shrink-0 flex items-center justify-center">
          <MoreHorizontal size={36} />
        </Button>
      </div>

      {/* チュートリアル：最前面 */}
      <AnimatePresence>
        {showTutorial && members.length === 0 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-6 top-32 z-[100] bg-black/90 backdrop-blur-2xl border-4 border-emerald-500/50 p-10 rounded-[3.5rem] space-y-8 shadow-[0_0_150px_rgba(16,185,129,0.4)]">
            <div className="flex items-center justify-between text-emerald-400 font-black italic text-3xl">
              <div className="flex items-center gap-4"><BookOpen size={40}/> START GUIDE</div>
              <Button onClick={() => setShowTutorial(false)} variant="ghost" className="h-12 w-12 p-0 rounded-full text-white/50"><X size={32}/></Button>
            </div>
            <div className="space-y-6 text-white font-black italic text-2xl leading-relaxed">
              <div className="flex gap-6 items-start"><Badge className="bg-emerald-500 text-black text-xl px-4 py-1">1</Badge> <p>右下の [ ＋ ] で登場人物を召喚</p></div>
              <div className="flex gap-6 items-start"><Badge className="bg-emerald-500 text-black text-xl px-4 py-1">2</Badge> <p>指で自由に動かして「勢力」を可視化</p></div>
              <div className="flex gap-6 items-start"><Badge className="bg-emerald-500 text-black text-xl px-4 py-1">3</Badge> <p>人物を選択 ➔ [ 関係線を引く ] で繋ぐ</p></div>
            </div>
            <Button onClick={() => setShowTutorial(false)} className="w-full h-20 bg-emerald-500 text-black font-black text-2xl rounded-2xl border-b-8 border-emerald-700 shadow-xl">作図を開始する</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 巨大追加ボタン：位置をボトムパネルの上に浮かせ、重なりを回避 */}
      <div className="absolute bottom-48 right-10 z-[60] flex flex-col items-end gap-4 pointer-events-none">
        <div className="bg-emerald-500 text-black px-6 py-2 rounded-full font-black italic text-sm shadow-xl animate-bounce pointer-events-auto">人物を召喚 ➔</div>
        <Button onClick={addMember} className="w-28 h-28 bg-emerald-500 hover:bg-emerald-400 text-black rounded-[2.5rem] shadow-[0_20px_60px_rgba(16,185,129,0.6)] active:scale-90 transition-all border-b-[12px] border-emerald-700 pointer-events-auto">
          <Plus size={60} />
        </Button>
      </div>

      {/* ボトム操作：レイアウトを flex で整理し、ボタンが重ならないように修正 */}
      <div className="absolute bottom-10 inset-x-10 z-50 flex flex-col gap-6">
        <div className="bg-black/90 backdrop-blur-3xl border-4 border-emerald-500/30 p-6 rounded-[3.5rem] flex items-center gap-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
          <Button 
            onClick={(e) => { e.stopPropagation(); setIsLinking(!isLinking); }}
            disabled={!selectedMemberId}
            className={`flex-[3] h-28 rounded-[2.5rem] font-black italic text-4xl transition-all border-b-[12px] ${isLinking ? 'bg-blue-600 border-blue-800 text-white animate-pulse' : 'bg-white/5 text-white/30 border-white/10'}`}
          >
            <Link size={44} className="mr-5" /> {isLinking ? '相手を選択' : '関係線を引く'}
          </Button>
          
          <a href="https://www.amazon.co.jp/s?k=職場の人間関係+心理学&tag=nextralabs-22" target="_blank" className="flex-1 h-28 rounded-[2.5rem] bg-gradient-to-r from-emerald-600 to-teal-800 flex items-center justify-center shadow-2xl border-b-[12px] border-teal-950 hover:scale-105 transition-all">
            <ShoppingCart size={48} className="text-white" />
          </a>
        </div>
        
        {/* 凡例 */}
        <div className="flex justify-center gap-12 bg-black/60 backdrop-blur-md py-4 rounded-[2rem] border-2 border-white/10 mx-10">
          <div className="flex items-center gap-4"><div className="w-6 h-6 bg-blue-500 rounded-full" /><span className="text-xl font-black italic text-white/80">味方</span></div>
          <div className="flex items-center gap-4"><div className="w-6 h-6 bg-red-500 rounded-full" /><span className="text-xl font-black italic text-white/80">対立</span></div>
          <div className="flex items-center gap-4"><div className="w-6 h-6 bg-slate-400 border-2 border-dashed border-white rounded-full" /><span className="text-xl font-black italic text-white/80">中立</span></div>
        </div>
      </div>

      {/* メニュー */}
      <AnimatePresence>
        {showMenu && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-y-0 right-0 w-[400px] bg-black/95 backdrop-blur-3xl border-l-4 border-emerald-500/30 z-[100] p-12 flex flex-col gap-10">
            <div className="flex justify-between items-center border-b-2 border-white/10 pb-8">
              <div className="flex items-center gap-4 text-emerald-400 font-black italic text-3xl"><Target size={36}/> STRATEGY</div>
              <Button onClick={() => setShowMenu(false)} variant="ghost" className="p-0 h-14 w-14 text-white"><X size={48} /></Button>
            </div>
            
            <div className="flex flex-col gap-6">
              <Button onClick={() => { saveToLocal(); setShowMenu(false); }} className="justify-start font-black italic h-20 bg-white/5 border-4 border-white/10 rounded-3xl text-2xl px-8 transition-all hover:bg-emerald-500/10"><Save size={32} className="mr-6 text-emerald-500" /> ブラウザ保存</Button>
              <Button onClick={() => {
                const data = JSON.stringify({ members, connections });
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `politics_map.json`; a.click();
              }} className="justify-start font-black italic h-20 bg-white/5 border-4 border-white/10 rounded-3xl text-2xl px-8 transition-all hover:bg-blue-500/10"><Download size={32} className="mr-6 text-blue-500" /> ファイル書出</Button>
              <label className="flex items-center gap-6 px-8 font-black italic h-20 bg-white/5 border-4 border-white/10 rounded-3xl cursor-pointer text-2xl transition-all hover:bg-amber-500/10">
                <Upload size={32} className="text-amber-500" /> 読込・復元
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
