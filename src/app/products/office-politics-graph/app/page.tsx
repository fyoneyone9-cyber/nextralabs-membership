'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Network, Zap, ShieldAlert, TrendingUp, ShoppingCart, 
  UserPlus, Info, Trash2, MousePointer2, Link, ArrowRight,
  User, Lock, Save, Download, HelpCircle, Upload, Eye, MousePointer
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
    alert('【保存完了】ブラウザに記憶しました 🔒')
  }

  // メンバー追加
  const addMember = () => {
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: '氏名を入力',
      role: '役割・派閥',
      power: 5,
      x: 50 + Math.random() * 100,
      y: 150 + Math.random() * 100,
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
    return { x1: from.x + 100, y1: from.y + 60, x2: to.x + 100, y2: to.y + 60 }
  }

  return (
    <div className="min-h-screen bg-[#050507] text-slate-100 p-4 md:p-8 font-sans selection:bg-emerald-500/30 text-left overflow-hidden">
      
      {/* メインボード */}
      <div className="max-w-full mx-auto h-[92vh] border-[6px] border-emerald-500 shadow-[0_0_120px_rgba(16,185,129,0.15)] rounded-[4rem] flex flex-col relative bg-[#0a0a0c]">
        
        {/* ヘッダー：デカ文字 & デカボタン */}
        <div className="p-8 border-b-2 border-emerald-500/20 flex flex-wrap items-center justify-between gap-6 bg-black/60 backdrop-blur-xl rounded-t-[3.5rem] z-50">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-emerald-500/10 rounded-3xl border-2 border-emerald-500/30">
              <Network className="h-12 w-12 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">不敗の社内政治ボード</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-emerald-500 text-slate-950 font-black px-4 py-1 text-sm rounded-lg">完全ローカル・機密保持モード</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button onClick={addMember} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black italic rounded-2xl px-8 h-16 text-xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all active:scale-95">
              <UserPlus size={24} className="mr-3" /> 人物を追加
            </Button>
            
            <div className="flex items-center bg-white/5 rounded-2xl border-2 border-white/10 p-2 gap-2">
              <Button onClick={saveToLocal} variant="ghost" className="text-emerald-400 hover:bg-emerald-500/10 font-black h-12 italic rounded-xl px-5 text-sm">
                <Save size={18} className="mr-2" /> ブラウザ保存
              </Button>
              <div className="w-[2px] h-8 bg-white/10" />
              <Button onClick={() => {
                const data = JSON.stringify({ members, connections });
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `politics_map_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }} variant="ghost" className="text-blue-400 hover:bg-blue-500/10 font-black h-12 italic rounded-xl px-5 text-sm">
                <Download size={18} className="mr-2" /> ファイル保存
              </Button>
              <div className="w-[2px] h-8 bg-white/10" />
              <label className="cursor-pointer text-amber-400 hover:bg-amber-500/10 font-black h-12 italic rounded-xl px-5 text-sm flex items-center transition-colors">
                <Upload size={18} className="mr-2" /> 読み込み
                <input type="file" className="hidden" accept=".json" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (re) => {
                    try {
                      const { members: m, connections: c } = JSON.parse(re.target?.result as string);
                      setMembers(m); setConnections(c);
                      alert('データを復元しました');
                    } catch (err) { alert('形式エラー'); }
                  };
                  reader.readAsText(file);
                }} />
              </label>
            </div>
          </div>
        </div>

        {/* キャンバスエリア */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-[radial-gradient(#1e293b_2px,transparent_2px)] [background-size:60px_60px] cursor-crosshair"
          onClick={() => { setSelectedMemberId(null); setIsLinking(false); }}
        >
          {/* コネクション（太い線） */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn, i) => {
              const coords = getLineCoords(conn);
              if (!coords) return null;
              const color = conn.type === 'ally' ? '#3b82f6' : conn.type === 'enemy' ? '#ef4444' : '#94a3b8';
              const dash = conn.type === 'neutral' ? '10,10' : '0';
              return (
                <line 
                  key={i} 
                  x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} 
                  stroke={color} strokeWidth="5" strokeDasharray={dash}
                  className="transition-all duration-300 opacity-80"
                />
              )
            })}
          </svg>

          {/* メンバー（デカカード） */}
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
              className={`absolute w-52 p-6 rounded-[2.5rem] cursor-grab active:cursor-grabbing shadow-2xl border-4 transition-all group
                ${selectedMemberId === m.id ? 'border-emerald-500 scale-110 z-40 bg-[#1a1c2e]' : 'border-white/10 bg-[#13141f]'}
              `}
              style={{ x: m.x, y: m.y, left: 0, top: 0 }}
              onClick={(e) => { e.stopPropagation(); handleMemberClick(m.id); }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${selectedMemberId === m.id ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                  <User size={36} className={selectedMemberId === m.id ? 'text-slate-950' : 'text-slate-400'} />
                </div>
                <input 
                  className="bg-transparent text-center font-black text-white w-full outline-none text-xl placeholder:text-white/20"
                  value={m.name}
                  placeholder="氏名を入力"
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers.find(item => item.id === m.id)!.name = e.target.value;
                    setMembers(newMembers);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <input 
                  className="bg-transparent text-center font-bold text-emerald-500/70 w-full outline-none text-sm uppercase italic"
                  value={m.role}
                  placeholder="役割・派閥"
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers.find(item => item.id === m.id)!.role = e.target.value;
                    setMembers(newMembers);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex flex-col items-center gap-2 mt-2 w-full">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">POWER LEVEL</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-3 h-3 rounded-full cursor-pointer transition-all ${i < Math.floor(m.power/2) ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const newMembers = [...members];
                          newMembers.find(item => item.id === m.id)!.power = (i + 1) * 2;
                          setMembers(newMembers);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeMember(m.id); }} className="absolute -top-3 -right-3 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:scale-125"><Trash2 size={16} className="text-white" /></button>
            </motion.div>
          ))}

          {/* 巨大な初期ガイド */}
          {members.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
              <div className="max-w-2xl text-center space-y-8 bg-black/40 p-12 rounded-[4rem] backdrop-blur-sm border-2 border-white/5">
                <MousePointer className="h-32 w-32 mx-auto text-emerald-500/20 animate-bounce" />
                <h2 className="text-6xl font-black italic text-white/20 uppercase tracking-tighter">作図を開始</h2>
                <p className="text-2xl text-white/40 font-bold italic">右上の「人物を追加」ボタンで、<br/>職場のキーマンを配置してください。</p>
              </div>
            </div>
          )}
        </div>

        {/* ボトムパネル：デカい凡例 */}
        <div className="p-8 bg-black/80 border-t-2 border-emerald-500/20 backdrop-blur-xl rounded-b-[3.5rem] z-50 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" /> <span className="text-xl font-black italic text-white">味方</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" /> <span className="text-xl font-black italic text-white">対立</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-slate-400 border-2 border-dashed border-white rounded-full" /> <span className="text-xl font-black italic text-white">中立</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Button 
              onClick={(e) => { e.stopPropagation(); setIsLinking(!isLinking); }}
              disabled={!selectedMemberId}
              className={`h-20 px-12 rounded-[2rem] font-black italic text-2xl transition-all shadow-2xl ${isLinking ? 'bg-blue-500 text-white animate-pulse scale-105' : 'bg-white/5 text-slate-400 border-2 border-white/10 hover:border-emerald-500'}`}
            >
              <Link size={28} className="mr-3" /> {isLinking ? '相手を選んでください' : '関係線を引く'}
            </Button>
            
            <a href="https://www.amazon.co.jp/s?k=職場の人間関係+心理学&tag=nextralabs-22" target="_blank" className="bg-gradient-to-r from-emerald-600 to-teal-800 h-20 px-10 rounded-[2rem] flex items-center gap-4 hover:scale-105 transition-all shadow-[0_10px_40px_rgba(16,185,129,0.3)]">
              <span className="text-lg font-black italic text-white uppercase tracking-tighter">心理戦術を学ぶ ➔</span>
              <ShoppingCart size={28} className="text-white" />
            </a>
          </div>
        </div>

        {/* 【デカ文字】常駐クイックマニュアル */}
        <div className="absolute top-48 right-12 bg-emerald-500/5 border-2 border-emerald-500/20 p-10 rounded-[3rem] max-w-sm pointer-events-none hidden xl:block shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 text-emerald-400 mb-6 font-black italic text-2xl"><Info size={24}/> 使い方ガイド</div>
          <div className="space-y-6">
            {[
              { t: '配置', d: '「人物を追加」してドラッグで移動。' },
              { t: '接続', d: '人物を選んで「関係線を引く」を押し、別の人物をクリック。' },
              { t: '変更', d: '線を何度かクリックすると「味方・対立」が切り替わります。' },
              { t: '保存', d: 'ブラウザかファイルに保存して秘密を守る。' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-emerald-500 font-black italic text-lg uppercase tracking-widest">STEP {idx + 1}: {item.t}</p>
                <p className="text-white/60 font-bold italic text-base leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
