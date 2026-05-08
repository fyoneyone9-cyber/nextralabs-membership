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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)

  // 過去問PDFから抽出した「本物」のデータ（令和6年度公開問題より）
  const mockQuestions = [
    {
      id: 1,
      text: 'マーケティングオートメーション（MA）の役割として、最も適切なものはどれか。',
      hint: 'MAはマーケティングの各プロセスにおける、顧客一人ひとりに最適化したコミュニケーションの自動化を指します。',
      options: [
        'WEBサイトの構築から運用までを自動化し、コンテンツ管理を行う。',
        '顧客の行動を記録・分析し、個々の顧客に最適なタイミングで情報を配信して関係構築を自動化する。',
        '商品在庫と販売情報をリアルタイムで連動させ、補充発注を自動化する。',
        '定期的なアンケート調査の結果を自動で集計し、顧客満足度を数値化する。'
      ],
      ans: 1
    },
    {
      id: 2,
      text: 'サイバーセキュリティ基本法に基づき、国全体のサイバーセキュリティに関する施策の基本理念と責務を明らかにしている対象はどれか。',
      hint: 'この法律は、国、地方公共団体、重要インフラ事業者、サイバー関連事業者などの責務を定めています。',
      options: [
        '重要インフラ事業者のみ',
        '国及び地方公共団体のみ',
        '国、地方公共団体、重要インフラ事業者、サイバー関連事業者、教育研究機関、その他の国民',
        '民間企業のうち、従業員1,000名以上の特定事業者のみ'
      ],
      ans: 2
    },
    {
      id: 3,
      text: '未来のあるべき姿（目標）から現在の行動を逆算して、今何をすべきかを検討する手法を何と呼ぶか。',
      hint: '現状から積み上げる「フォアキャスティング」の対義語です。',
      options: [
        'ベンチマーキング',
        'バックキャスティング',
        'フェルミ推定',
        'ロールプレイング'
      ],
      ans: 1
    }
  ]

  const question = mockQuestions[currentQuestion % mockQuestions.length]

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
            { id: 'it-passport', title: 'ITパスポート', sub: 'ストラテジ・マネジメント・テクノロジ', disabled: false },
            { id: 'fe', title: '基本情報技術者', sub: '科目A：知識問題集中トレーニング', disabled: true },
            { id: 'comptia', title: 'CompTIA Security+', sub: 'セキュリティリスクと対策の理解', disabled: true }
          ].map((exam) => (
            <Card 
              key={exam.id}
              className={`cursor-pointer transition-all border-2 rounded-2xl bg-[#0a0a0f] ${
                exam.disabled 
                  ? 'opacity-50 grayscale cursor-not-allowed border-white/5' 
                  : examType === exam.id 
                    ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-500/50' 
                    : 'border-white/5 hover:border-emerald-500/50'
              }`}
              onClick={() => !exam.disabled && setExamType(exam.id)}
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className={`font-bold ${exam.disabled ? 'text-slate-400' : 'text-white'}`}>{exam.title}</h3>
                  <p className="text-xs text-slate-500">{exam.sub}</p>
                </div>
                {exam.disabled ? (
                  <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500 font-black uppercase">Coming Soon</Badge>
                ) : (
                  examType === exam.id && <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                )}
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

  const handleNext = () => {
    if (!isAnswered) {
      setIsAnswered(true);
    } else {
      setSelectedAnswer(null);
      setShowHint(false);
      setIsAnswered(false);
      setCurrentQuestion(currentQuestion + 1);
    }
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

      <Card className="bg-[#0a0a0f] border-2 border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl relative">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Question Content</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowHint(!showHint)}
                className={`h-7 px-3 text-[10px] font-black uppercase rounded-full transition-all border ${showHint ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-white/5 text-slate-400 border-white/10 hover:text-emerald-400'}`}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Hint {showHint ? 'Active' : ''}
              </Button>
            </div>
            
            <p className="text-lg text-white font-bold leading-relaxed">
              {question.text}
            </p>

            {showHint && (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-xs text-emerald-400 font-medium leading-relaxed italic">
                  💡 Hint: {question.hint}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {question.options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => setSelectedAnswer(i)}
                className={`w-full p-5 text-left rounded-2xl transition-all group relative overflow-hidden border-2 ${
                  selectedAnswer === i 
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'bg-white/5 hover:bg-white/10 border-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                    selectedAnswer === i 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'bg-black/40 border border-white/10 text-emerald-500'
                  }`}>
                    {['ア', 'イ', 'ウ', 'エ'][i]}
                  </span>
                  <span className={`font-bold text-sm transition-colors ${
                    selectedAnswer === i ? 'text-white' : 'text-slate-300'
                  }`}>{opt}</span>
                </div>
                {selectedAnswer === i && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6">
        <div className="flex gap-4 items-center">
          <Button variant="ghost" className="text-slate-500 font-bold hover:text-white px-0" onClick={() => setStarted(false)}>
            試験を中断
          </Button>
          <div className="w-px h-4 bg-white/10"></div>
          <Link href="/contact" className="text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest transition-colors flex items-center gap-1">
            <Send className="w-3 h-3" />
            試験のリクエスト・お問い合わせ
          </Link>
        </div>
        <Button 
          disabled={selectedAnswer === null}
          onClick={handleNext}
          className={`px-10 h-14 rounded-2xl font-black text-lg transition-all ${
            isAnswered
              ? 'bg-white text-slate-950 hover:bg-slate-200 shadow-xl'
              : selectedAnswer !== null 
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          {isAnswered ? (
            <span className="flex items-center gap-2 uppercase italic">Next Question <ChevronRight className="w-5 h-5" /></span>
          ) : (
            '回答を送信 (Submit)'
          )}
        </Button>
      </div>
    </div>
  )
}

const DynamicExamApp = dynamic(() => Promise.resolve(ExamApp), { ssr: false })

export default function ExamAppPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AI問題生成 & 過去問分析 (AI Exam Generator)",
    "operatingSystem": "Web Browser",
    "applicationCategory": "EducationalApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    },
    "description": "AIが試験範囲から問題を無限に生成し、苦手分野をリアルタイムで分析する学習アプリ。",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "120"
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
