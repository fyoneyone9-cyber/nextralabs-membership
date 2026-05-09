'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Network, Zap, ShieldAlert, TrendingUp, ShoppingCart, 
  UserPlus, Info, Trash2, MousePointer2, Link, ArrowRight,
  User, Lock, Save, Download, HelpCircle, Upload, Eye, MousePointer,
  X, Plus, MoreHorizontal
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// 型定義
interface Member {
  id: string;
  name: string;
  role: string;
  power: number;
  x: number;
  y: number;
}

interface Connection {
  fromId: string;
  toId: string;
  type: 'ally' | 'enemy' | 'neutral';
}

export default function MobileFirstPoliticsBoard() {
  const [members, setMembers] = useState<Member[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [isLinking, setIsLinking] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // 初期ロード
  useEffect(() => {
    const savedMembers = localStorage.getItem('nextra_politics_members')
    const savedConns = localStorage.getItem('nextra_politics_conns')
    if (savedMembers) setMembers(JSON.parse(savedMembers))
    if (savedConns) setConnections(JSON.parse(savedConns))
  }, [])

  // 保存
  const saveToLocal = () => {
    localStorage.setItem('nextra_politics_members', JSON.stringify(members))
    localStorage.setItem('nextra_politics_conns', JSON.stringify(connections))
    alert('保存完了 🔒')
  }

  // メンバー追加 (スマホの中央付近に追加)
  const addMember = () => {
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: '氏名',
      role: '役割',
      power: 6,
      x: 50,
      y: 150,
    }
    setMembers([...members, newMember])
  }

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id))
    setConnections(connections.filter(c => c.fromId !== id && c.toId !== id))
    if (selectedMemberId === id) setSelectedMemberId(null)
  }

  const handleMemberClick = (id: string) => {
    if (isLinking && selectedMemberId && selectedMemberId !== id) {
      const existingIdx = connections.findIndex(c => 
        (c.fromId === selectedMemberId && c.toId === id) || 
        (c.fromId === id && c.toId === selectedMemberId)
      )
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
      
      {/* スマホ最優先：全画面キャンバス */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] z-0"
        onClick={() => { setSelectedMemberId(null); setIsLinking(false); }}
      >
        {/* 背景のロゴ（うっすら） */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Network size={300} />
        </div>

        {/* 関係線 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, i) => {
            const coords = getLineCoords(conn); if (!coords) return null;
            const color = conn.type === 'ally' ? '#3b82f6' : conn.type === 'enemy' ? '#ef4444' : '#94a3b8';
            const dash = conn.type === 'neutral' ? '8,8' : '0';
            return <line key={i} x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} stroke={color} strokeWidth="6" strokeDasharray={dash} className="opacity-80" />
          })}
        </svg>

        {/* 人物カード（スマホ操作用サイズ） */}
        {members.map((m) => (
          <motion.div
            key={m.id}
            drag
            dragMomentum={false}
            onDrag={(e, info) => {
              const n = [...members]; const i = n.findIndex(it => it.id === m.id);
              n[i].x += info.delta.x; n[i].y += info.delta.y; setMembers(n);
            }}
            initial={{ x: m.x, y: m.y }}
            className={`absolute w-32 p-4 rounded-[2rem] border-[3px] shadow-2xl transition-all
              ${selectedMemberId === m.id ? 'border-emerald-500 bg-[#1a1c2e] scale-110 z-50' : 'border-white/10 bg-[#13141f] z-10'}
            `}
            style={{ x: m.x, y: m.y, left: 0, top: 0 }}
            onClick={(e) => { e.stopPropagation(); handleMemberClick(m.id); }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`p-2 rounded-full ${selectedMemberId === m.id ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                <User size={20} />
              </div>
              <input className="bg-transparent text-center font-black text-white w-full outline-none text-xs" value={m.name} onChange={(e) => {
                const n = [...members]; n.find(i => i.id === m.id)!.name = e.target.value; setMembers(n);
              }} onClick={(e) => e.stopPropagation()} />
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < Math.floor(m.power/3.4) ? 'bg-emerald-500' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
            {selectedMemberId === m.id && (
              <button onClick={(e) => { e.stopPropagation(); removeMember(m.id); }} className="absolute -top-2 -right-2 bg-red-500 p-1.5 rounded-full shadow-lg"><X size={12}/></button>
            )}
          </motion.div>
        ))}
      </div>

      {/* トップバー：ステータスのみ */}
      <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-50 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-2xl pointer-events-auto">
          <h1 className="text-sm font-black italic tracking-tighter flex items-center gap-2">
            <Network size={16} className="text-emerald-400" />
            不敗の社内政治ボード
          </h1>
        </div>
        <Button onClick={() => setShowMenu(!showMenu)} className="bg-black/60 border border-white/10 w-12 h-12 rounded-2xl pointer-events-auto">
          <MoreHorizontal size={20} />
        </Button>
      </div>

      {/* 右下：フローティング・アクション・ボタン (FAB) */}
      <div className="absolute bottom-32 right-6 z-50 flex flex-col gap-4">
        <Button onClick={addMember} className="w-16 h-16 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full shadow-[0_10px_40px_rgba(16,185,129,0.5)] active:scale-90 transition-all">
          <Plus size={32} />
        </Button>
      </div>

      {/* ボトム・コントロール：親指で届く範囲 */}
      <div className="absolute bottom-6 inset-x-6 z-50">
        <div className="bg-black/80 backdrop-blur-2xl border-2 border-emerald-500/20 p-4 rounded-[2.5rem] flex items-center gap-4 shadow-2xl">
          <Button 
            onClick={(e) => { e.stopPropagation(); setIsLinking(!isLinking); }}
            disabled={!selectedMemberId}
            className={`flex-1 h-16 rounded-2xl font-black italic text-lg transition-all ${isLinking ? 'bg-blue-500 text-white animate-pulse' : 'bg-white/5 text-slate-400 border border-white/10'}`}
          >
            <Link size={20} className="mr-2" /> {isLinking ? '相手を選ぶ' : '線を引く'}
          </Button>
          
          <a href="https://www.amazon.co.jp/s?k=職場の人間関係+心理学&tag=nextralabs-22" target="_blank" className="bg-gradient-to-r from-emerald-600 to-teal-800 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
            <ShoppingCart size={24} className="text-white" />
          </a>
        </div>
      </div>

      {/* サイドメニュー：設定・保存・ガイド */}
      <AnimatePresence>
        {showMenu && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute inset-y-0 right-0 w-64 bg-black/90 backdrop-blur-xl border-l border-white/10 z-[100] p-8 flex flex-col gap-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="font-black italic text-emerald-400">MENU</h2>
              <Button onClick={() => setShowMenu(false)} variant="ghost" className="p-0 h-8 w-8"><X /></Button>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button onClick={() => { saveToLocal(); setShowMenu(false); }} className="justify-start font-bold italic h-14 bg-white/5 border border-white/10 rounded-xl"><Save size={18} className="mr-3 text-emerald-500" /> ブラウザ保存</Button>
              <Button onClick={() => {
                const data = JSON.stringify({ members, connections });
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `politics_map.json`; a.click();
              }} className="justify-start font-bold italic h-14 bg-white/5 border border-white/10 rounded-xl"><Download size={18} className="mr-3 text-blue-500" /> ファイル書出</Button>
              <label className="flex items-center gap-3 px-4 font-bold italic h-14 bg-white/5 border border-white/10 rounded-xl cursor-pointer">
                <Upload size={18} className="text-amber-500" /> 読み込み
                <input type="file" className="hidden" accept=".json" onChange={(e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  const r = new FileReader(); r.onload = (re) => {
                    try { const { members: m, connections: c } = JSON.parse(re.target?.result as string); setMembers(m); setConnections(c); setShowMenu(false); } catch (e) {}
                  }; r.readAsText(f);
                }} />
              </label>
            </div>

            <div className="mt-auto bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20">
              <p className="text-[10px] font-black text-emerald-500 italic uppercase mb-2">Guide</p>
              <p className="text-[10px] font-bold text-white/40 leading-relaxed italic">
                1. 右下の[＋]で人物追加<br/>
                2. 人物をドラッグして配置<br/>
                3. 人物を選んで[線を引く]<br/>
                4. 線をタップして関係変更
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ヘルプヒント（PCで見ている時のみ） */}
      <div className="hidden xl:block absolute left-12 bottom-32 max-w-xs pointer-events-none opacity-20">
        <p className="text-[80px] font-black italic uppercase leading-none text-white">Politics<br/>Mapping</p>
      </div>

    </div>
  )
}
