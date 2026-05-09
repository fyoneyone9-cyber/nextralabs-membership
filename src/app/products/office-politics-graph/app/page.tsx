'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Network, Zap, ShieldAlert, TrendingUp, ShoppingCart, 
  UserPlus, Info, Trash2, MousePointer2, Link, ArrowRight,
  User, Lock, Save, Download, HelpCircle
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
  color: string;
}

interface Connection {
  fromId: string;
  toId: string;
  type: 'ally' | 'enemy' | 'neutral';
}

export default function OfficePoliticsBoard() {
  const [members, setMembers] = useState<Member[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [isLinking, setIsLinking] = useState(false)
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
    alert('機密情報をローカルに保存しました 🔒')
  }

  // メンバー追加
  const addMember = () => {
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: '新メンバー',
      role: '役割を入力',
      power: 5,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      color: '#10b981' // emerald-500
    }
    setMembers([...members, newMember])
  }

  // 削除
  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id))
    setConnections(connections.filter(c => c.fromId !== id && c.toId !== id))
    if (selectedMemberId === id) setSelectedMemberId(null)
  }

  // 接続作成
  const handleMemberClick = (id: string) => {
    if (isLinking && selectedMemberId && selectedMemberId !== id) {
      // 既存の接続があれば更新、なければ追加
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

  // 線の座標計算
  const getLineCoords = (conn: Connection) => {
    const from = members.find(m => m.id === conn.fromId)
    const to = members.find(m => m.id === conn.toId)
    if (!from || !to) return null
    return { x1: from.x + 80, y1: from.y + 40, x2: to.x + 80, y2: to.y + 40 }
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-8 font-sans selection:bg-emerald-500/30 text-left overflow-hidden">
      
      {/* メインボード */}
      <div className="max-w-7xl mx-auto h-[90vh] border-4 border-emerald-500 shadow-[0_0_80px_rgba(16,185,129,0.1)] rounded-[3rem] flex flex-col relative bg-[#0a0a0c]">
        
        {/* ヘッダーパネル */}
        <div className="p-6 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-4 bg-black/40 backdrop-blur-md rounded-t-[2.7rem] z-50">
          <div className="flex items-center gap-3">
            <Network className="h-8 w-8 text-emerald-400" />
            <div>
              <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white">不敗の社内政治ボード</h1>
              <div className="flex items-center gap-2">
                <Lock size={10} className="text-emerald-500/50" />
                <p className="text-emerald-500/50 font-bold uppercase tracking-[0.2em] text-[8px] italic">No API / Local Only Security</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={addMember} className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black italic rounded-xl px-4 h-10 shadow-lg transition-all active:scale-95">
              <UserPlus size={16} className="mr-2" /> 登場人物を追加
            </Button>
            <Button onClick={saveToLocal} variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-black h-10 italic rounded-xl px-4">
              <Save size={16} className="mr-2" /> 保存
            </Button>
          </div>
        </div>

        {/* キャンバスエリア */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] cursor-crosshair"
          onClick={() => { setSelectedMemberId(null); setIsLinking(false); }}
        >
          {/* コネクション（線） */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn, i) => {
              const coords = getLineCoords(conn);
              if (!coords) return null;
              const color = conn.type === 'ally' ? '#3b82f6' : conn.type === 'enemy' ? '#ef4444' : '#94a3b8';
              const dash = conn.type === 'neutral' ? '5,5' : '0';
              return (
                <line 
                  key={i} 
                  x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} 
                  stroke={color} strokeWidth="3" strokeDasharray={dash}
                  className="transition-all duration-300 opacity-60"
                />
              )
            })}
          </svg>

          {/* メンバー（動くカード） */}
          {members.map((m) => (
            <motion.div
              key={m.id}
              drag
              dragMomentum={false}
              onDrag={(e, info) => {
                const newMembers = [...members];
                const idx = newMembers.findIndex(item => item.id === m.id);
                newMembers[idx].x += info.delta.x;
                newMembers[idx].y += info.delta.y;
                setMembers(newMembers);
              }}
              initial={{ x: m.x, y: m.y }}
              className={`absolute w-40 p-4 rounded-2xl cursor-grab active:cursor-grabbing shadow-2xl border-2 transition-shadow group
                ${selectedMemberId === m.id ? 'border-emerald-500 shadow-emerald-500/20' : 'border-white/10 bg-[#13141f]'}
              `}
              style={{ x: m.x, y: m.y, left: 0, top: 0 }}
              onClick={(e) => { e.stopPropagation(); handleMemberClick(m.id); }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`p-2 rounded-full ${selectedMemberId === m.id ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                  <User size={24} className={selectedMemberId === m.id ? 'text-slate-950' : 'text-slate-400'} />
                </div>
                <input 
                  className="bg-transparent text-center font-black text-white w-full outline-none text-sm"
                  value={m.name}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers.find(item => item.id === m.id)!.name = e.target.value;
                    setMembers(newMembers);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <input 
                  className="bg-transparent text-center font-bold text-slate-500 w-full outline-none text-[10px] uppercase italic"
                  value={m.role}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers.find(item => item.id === m.id)!.role = e.target.value;
                    setMembers(newMembers);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex items-center gap-1 mt-1">
                  <p className="text-[8px] font-black text-emerald-500/50 uppercase">Power</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < Math.floor(m.power/2) ? 'bg-emerald-500' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* ホバー時に出る削除ボタン */}
              <button 
                onClick={(e) => { e.stopPropagation(); removeMember(m.id); }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} className="text-white" />
              </button>
            </motion.div>
          ))}

          {/* ガイドオーバーレイ */}
          {members.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center space-y-4 opacity-20">
                <MousePointer2 className="h-16 w-16 mx-auto text-emerald-500" />
                <p className="font-black italic uppercase text-2xl">「登場人物を追加」して作図を開始</p>
              </div>
            </div>
          )}
        </div>

        {/* ボトムコントロールパネル */}
        <div className="p-4 bg-black/60 border-t border-emerald-500/20 backdrop-blur-md rounded-b-[2.7rem] z-50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" /> <span className="text-[10px] font-bold text-slate-400">味方（クリックで切替）</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" /> <span className="text-[10px] font-bold text-slate-400">対立</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-400 border border-dashed border-white rounded-full" /> <span className="text-[10px] font-bold text-slate-400">中立</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              onClick={(e) => { e.stopPropagation(); setIsLinking(!isLinking); }}
              disabled={!selectedMemberId}
              className={`h-10 px-6 rounded-xl font-black italic transition-all ${isLinking ? 'bg-blue-500 text-white animate-pulse' : 'bg-white/5 text-slate-400 border border-white/10 hover:border-emerald-500'}`}
            >
              <Link size={16} className="mr-2" /> {isLinking ? '相手を選択してください...' : '関係線を引く'}
            </Button>
            
            <a href="https://www.amazon.co.jp/s?k=職場の人間関係+心理学&tag=nextralabs-22" target="_blank" className="bg-gradient-to-r from-emerald-600 to-teal-800 h-10 px-6 rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
              <span className="text-[10px] font-black italic text-white uppercase">心理戦術を学ぶ ➔</span>
              <ShoppingCart size={14} className="text-white" />
            </a>
          </div>
        </div>

        {/* ヘルプヒント */}
        <div className="absolute top-24 right-8 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl max-w-[200px] pointer-events-none hidden md:block">
          <div className="flex items-center gap-2 text-emerald-400 mb-2 font-black italic text-[10px]"><HelpCircle size={14}/> ヒント</div>
          <ul className="text-[9px] text-slate-400 font-bold italic space-y-2 leading-relaxed">
            <li>・人物をドラッグして移動</li>
            <li>・人物を選択して「関係線を引く」をクリック</li>
            <li>・別の人物をクリックで線を繋ぐ</li>
            <li>・線をクリックするたびに関係が変化</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
