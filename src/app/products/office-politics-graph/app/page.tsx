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
      name: '氏名', role: '役割・派閥', power: 6, x: 50, y: 150,
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
    return { x1: from.x + 70, y1: from.y + 50, x2: to.x + 70, y2: to.y + 50 }
  }

  return (
    <div className="fixed inset-0 bg-[#050507] text-white font-sans overflow-hidden touch-none selection:bg-emerald-500/30">
      
      {/* 全画面キャンバス */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] z-0" onClick={() => { setSelectedMemberId(null); setIsLinking(false); }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, i) => {
            const coords = getLineCoords(conn); if (!coords) return null;
            const color = conn.type === 'ally' ? '#3b82f6' : conn.type === 'enemy' ? '#ef4444' : '#94a3b8';
            const dash = conn.type === 'neutral' ? '8,8' : '0';
            return <line key={i} x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} stroke={color} strokeWidth="6" strokeDasharray={dash} className="opacity-80" />
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
            className={`absolute w-32 p-4 rounded-[2rem] border-[3px] shadow-2xl transition-all ${selectedMemberId === m.id ? 'border-emerald-500 bg-[#1a1c2e] scale-110 z-50' : 'border-white/10 bg-[#13141f] z-10'}`}
            style={{ x: m.x, y: m.y, left: 0, top: 0 }}
            onClick={(e) => { e.stopPropagation(); handleMemberClick(m.id); }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`p-2 rounded-full ${selectedMemberId === m.id ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'}`}><User size={20} /></div>
              <input className="bg-transparent text-center font-black text-white w-full outline-none text-xs" value={m.name} onChange={(e) => { const n = [...members]; n.find(i => i.id === m.id)!.name = e.target.value; setMembers(n); }} onClick={(e) => e.stopPropagation()} />
              <div className="flex gap-1">{[...Array(3)].map((_, i) => (<div key={i} className={`w-2 h-2 rounded-full ${i < Math.floor(m.power/3.4) ? 'bg-emerald-500' : 'bg-white/10'}`} />))}</div>
            </div>
            {selectedMemberId === m.id && (<button onClick={(e) => { e.stopPropagation(); removeMember(m.id); }} className="absolute -top-2 -right-2 bg-red-500 p-1.5 rounded-full shadow-lg"><X size={12}/></button>)}
          </motion.div>
        ))}
      </div>

      {/* ヘッダー */}
      <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-50">
        <div className="bg-black/80 backdrop-blur-xl border-2 border-emerald-500/30 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <Network size={20} className="text-emerald-400" />
          <h1 className="text-lg font-black italic tracking-tighter uppercase">不敗の社内政治ボード</h1>
        </div>
        <Button onClick={() => setShowMenu(!showMenu)} className="bg-black/80 border-2 border-white/10 w-14 h-14 rounded-2xl shadow-xl"><MoreHorizontal size={24} /></Button>
      </div>

      {/* 巨大チュートリアル（初期表示） */}
      <AnimatePresence>
        {showTutorial && members.length === 0 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute inset-x-6 top-32 z-40 bg-emerald-500/10 backdrop-blur-md border-2 border-emerald-500/30 p-8 rounded-[3rem] space-y-6">
            <div className="flex items-center gap-3 text-emerald-400 font-black italic text-xl"><BookOpen size={24}/> 使い方マニュアル</div>
            <div className="space-y-4 text-white/80 font-bold italic leading-relaxed">
              <div className="flex gap-4 items-start"><Badge className="bg-emerald-500 text-black">1</Badge> <p>右下の [＋] ボタンで登場人物を配置</p></div>
              <div className="flex gap-4 items-start"><Badge className="bg-emerald-500 text-black">2</Badge> <p>人物を指で自由に動かして勢力を整理</p></div>
              <div className="flex gap-4 items-start"><Badge className="bg-emerald-500 text-black">3</Badge> <p>人物を選んで [線を引く] ➔ 相手をタップ</p></div>
              <div className="flex gap-4 items-start"><Badge className="bg-emerald-500 text-black">4</Badge> <p>線をタップして [味方 / 敵対] を切り替え</p></div>
            </div>
            <p className="text-[10px] text-emerald-500/50 font-black uppercase text-center pt-4">※データは自分のブラウザにのみ保存されます</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* フローティング追加ボタン */}
      <div className="absolute bottom-32 right-6 z-50 flex flex-col items-end gap-3">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black italic text-emerald-400 mb-1">人物を追加 ➔</div>
        <Button onClick={addMember} className="w-20 h-20 bg-emerald-500 hover:bg-emerald-400 text-black rounded-3xl shadow-[0_15px_50px_rgba(16,185,129,0.6)] active:scale-90 transition-all border-b-8 border-emerald-700">
          <Plus size={40} />
        </Button>
      </div>

      {/* ボトム・メイン操作 */}
      <div className="absolute bottom-6 inset-x-6 z-50 flex flex-col gap-4">
        <div className="bg-black/90 backdrop-blur-2xl border-2 border-emerald-500/20 p-5 rounded-[2.5rem] flex items-center gap-4 shadow-2xl">
          <Button 
            onClick={(e) => { e.stopPropagation(); setIsLinking(!isLinking); }}
            disabled={!selectedMemberId}
            className={`flex-1 h-20 rounded-[1.5rem] font-black italic text-2xl transition-all border-b-8 ${isLinking ? 'bg-blue-500 border-blue-700 text-white animate-pulse' : 'bg-white/5 text-slate-400 border-white/10'}`}
          >
            <Link size={28} className="mr-3" /> {isLinking ? '相手を選ぶ' : '関係線を引く'}
          </Button>
          
          <a href="https://www.amazon.co.jp/s?k=職場の人間関係+心理学&tag=nextralabs-22" target="_blank" className="bg-gradient-to-r from-emerald-600 to-teal-800 w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-lg border-b-8 border-teal-900">
            <ShoppingCart size={32} className="text-white" />
          </a>
        </div>
        
        {/* 凡例（常に表示） */}
        <div className="flex justify-center gap-8 bg-black/40 backdrop-blur-sm py-2 rounded-full border border-white/5 mx-4">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full" /><span className="text-[10px] font-bold text-white/60">味方</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full" /><span className="text-[10px] font-bold text-white/60">対立</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-400 border border-dashed border-white rounded-full" /><span className="text-[10px] font-bold text-white/60">中立</span></div>
        </div>
      </div>

      {/* メニュー */}
      <AnimatePresence>
        {showMenu && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-y-0 right-0 w-80 bg-black/95 backdrop-blur-3xl border-l-2 border-emerald-500/20 z-[100] p-10 flex flex-col gap-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
              <div className="flex items-center gap-2 text-emerald-400 font-black italic text-xl"><Target size={24}/> ツール設定</div>
              <Button onClick={() => setShowMenu(false)} variant="ghost" className="p-0 h-10 w-10 text-white"><X size={32} /></Button>
            </div>
            
            <div className="flex flex-col gap-5">
              <Button onClick={() => { saveToLocal(); setShowMenu(false); }} className="justify-start font-black italic h-16 bg-white/5 border-2 border-white/10 rounded-2xl text-lg"><Save size={24} className="mr-4 text-emerald-500" /> ブラウザ保存</Button>
              <Button onClick={() => {
                const data = JSON.stringify({ members, connections });
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `politics_map.json`; a.click();
              }} className="justify-start font-black italic h-16 bg-white/5 border-2 border-white/10 rounded-2xl text-lg"><Download size={24} className="mr-4 text-blue-500" /> ファイル書出</Button>
              <label className="flex items-center gap-4 px-5 font-black italic h-16 bg-white/5 border-2 border-white/10 rounded-2xl cursor-pointer text-lg">
                <Upload size={24} className="text-amber-500" /> 読込・復元
                <input type="file" className="hidden" accept=".json" onChange={(e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  const r = new FileReader(); r.onload = (re) => {
                    try { const { members: m, connections: c } = JSON.parse(re.target?.result as string); setMembers(m); setConnections(c); setShowMenu(false); } catch (e) {}
                  }; r.readAsText(f);
                }} />
              </label>
              <Button onClick={() => { setShowTutorial(true); setShowMenu(false); }} className="justify-start font-black italic h-16 bg-white/5 border-2 border-white/10 rounded-2xl text-lg"><HelpCircle size={24} className="mr-4 text-white/40" /> 使い方を再表示</Button>
            </div>

            <div className="mt-auto bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 space-y-4">
              <p className="font-black text-emerald-500 italic text-sm">Strategic Tips</p>
              <p className="text-xs font-bold text-white/50 leading-relaxed italic">
                「味方の味方は味方」「敵の敵は味方」という原理で線を引いていくと、あなたの本当の味方（キーマン）が視覚的に浮き彫りになります。
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
