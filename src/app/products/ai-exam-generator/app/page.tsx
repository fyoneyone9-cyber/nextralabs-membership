'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, ArrowLeft, Send, Sparkles, Trophy, 
  AlertCircle, CheckCircle2, RefreshCcw, ChevronRight 
} from 'lucide-react'

// ブラウザ機能（localStorageなど）を使用するため、SSRを無効化
const ExamApp = () => {
  const [examType, setExamType] = useState('it-passport')
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // プレビュー用のダミー問題
  const mockQuestions = [
    {
      id: 1,
      text: 'BPM（Business Process Management）の説明として、最も適切なものはどれか？',
      options: [
        '業務プロセスを継続的に改善・最適化するサイクル',
        '企業の基幹業務を一元管理するシステム',
        '顧客情報を分析して満足度を高める手法',
        '社内の知識やノウハウを共有する仕組み'
      ],
      ans: 0
    }
  ]

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-10">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
            <Brain className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Exam Mode Select</h1>
          <p className="text-slate-400 font-bold italic text-sm">解きたい試験を選択してください</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'it-passport', title: 'ITパスポート', sub: 'ストラテジ・マネジメント・テクノロジ' },
            { id: 'fe', title: '基本情報技術者', sub: '科目A：知識問題集中トレーニング' },
            { id: 'comptia', title: 'CompTIA Security+', sub: 'セキュリティリスクと対策の理解' }
          ].map((exam) => (
            <Card 
              key={exam.id}
              className={`cursor-pointer transition-all border-2 rounded-2xl bg-[#0a0a0f] hover:border-emerald-500/50 ${examType === exam.id ? 'border-emerald-500' : 'border-white/5'}`}
              onClick={() => setExamType(exam.id)}
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">{exam.title}</h3>
                  <p className="text-xs text-slate-500">{exam.sub}</p>
                </div>
                {examType === exam.id && <CheckCircle2 className="text-emerald-500 w-5 h-5" />}
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xl rounded-2xl shadow-lg uppercase"
          onClick={() => setStarted(true)}
        >
          試験開始 (Start Exam)
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-10">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 font-black">
          Q{currentQuestion + 1} / 100
        </Badge>
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
          <RefreshCcw className="w-3 h-3" />
          Time: 00:42:15
        </div>
      </div>

      <Card className="bg-[#0a0a0f] border-2 border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Question Content</span>
            <p className="text-lg text-white font-bold leading-relaxed">
              {mockQuestions[0].text}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {mockQuestions[0].options.map((opt, i) => (
              <button 
                key={i}
                className="w-full p-5 text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group relative overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-xs font-black text-emerald-500">
                    {['ア', 'イ', 'ウ', 'エ'][i]}
                  </span>
                  <span className="text-slate-300 font-bold text-sm">{opt}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6">
        <Button variant="ghost" className="text-slate-500 font-bold" onClick={() => setStarted(false)}>
          試験を中断
        </Button>
        <Button className="bg-white text-slate-950 font-black px-8 h-12 rounded-xl">
          回答を送信 (Submit)
        </Button>
      </div>
    </div>
  )
}

const DynamicExamApp = dynamic(() => Promise.resolve(ExamApp), { ssr: false })

export default function ExamAppPage() {
  return (
    <div className="min-h-screen bg-[#050507] text-slate-200">
      <div className="container mx-auto px-4">
        <header className="py-6 flex items-center justify-between border-b border-white/5">
          <Link href="/products/ai-exam-generator" className="flex items-center text-xs font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Nextra Exam System v1.0</span>
          </div>
        </header>

        <DynamicExamApp />
      </div>
    </div>
  )
}
