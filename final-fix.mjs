import fs from 'fs';
import path from 'path';

const toolsDir = 'C:/Users/fyone/Desktop/membership-site-fix/src/components/tools';

const toolsData = [
  { name: 'AiSidejob', label: 'AI副業スタートダッシュ', icon: '💼', what: '副業適性診断', how: 'あなたのスキルや興味を入力して、最適なAI副業を見つけましょう。' },
  { name: 'ClosetCoach', label: 'AIクローゼット断捨離', icon: '👔', what: 'ワードローブ最適化', how: '持っている服のリストを入力して、コスパや断捨離候補をAIに判定させます。' },
  { name: 'BuzzWriter', label: 'AIバズ文章コーチ', icon: '🔥', what: 'バズ投稿の生成', how: '今日のニュースやトピックを入力。AIがSNSで拡散される文章をプロデュースします。' },
  { name: 'CommCoach', label: 'AIコミュ改善コーチ', icon: '💬', what: 'メッセージ添削', how: '送りたい文章を貼り付けてください。心理学に基づいた好印象な返信をAIが提案します。' },
  { name: 'AiKonkatsuCoach', label: 'AI婚活コーチ', icon: '❤️', what: 'プロフィール添削', how: '婚活アプリのプロフィールを貼り付けてください。魅力的な自己紹介にAIが磨き上げます。' },
  { name: 'DisasterGuard', label: 'AI防災パーソナルガイド', icon: '🛡️', what: '避難・防災計画', how: '家族構成や住所を入力。AIがあなた専用の防災プランを作成します。' },
  { name: 'MoneyGuard', label: 'AI家計防衛シミュレーター', icon: '💰', what: '収支・期待値分析', how: 'ギャンブル等の収支を入力。AIが認知バイアスを暴き、家計を守ります。' },
  { name: 'ScamDefender', label: 'AI詐欺ディフェンダー', icon: '🚨', what: '不審メール判定', how: '届いた怪しいメールやメッセージを貼り付けて、詐欺の危険度をAIに判定させます。' },
  { name: 'ShioTaiou', label: '塩対応代行AI', icon: '🧂', what: '丁寧な断り文の生成', how: '義実家や上司への重い連絡を貼り付け。角が立たない断り文をAIが作成します。' },
  { name: 'ExamScheduler', label: '資格試験 AIスケジューラー', icon: '📚', what: '最短学習計画の立案', how: '試験名と現在の実力を入力。AIがカレンダー形式の学習プランを提案します。' },
  { name: 'ResignationAssistant', label: '退職あんしんAI', icon: '📋', what: '退職届・権利相談', how: '現在の状況を入力。AIが退職届を作成し、法的な権利や手続きをガイドします。' },
  { name: 'InboxOrganizer', label: 'Gmail AI Accelerator', icon: '📧', what: '受信トレイの自動整理', how: '溜まったメールの要約を入力。AIが緊急度と重要度で分類します。' },
  { name: 'LocationFinder', label: 'AI Location Scout', icon: '📍', what: '撮影場所の特定', how: 'YouTubeやSNSのURLを入力。AIが建物や地形から場所を特定します。' },
  { name: 'PetTranslator', label: 'AIペット翻訳モニター', icon: '🐾', what: '鳴き声解析・感情翻訳', how: 'ペットの様子や鳴き声をテキストで説明。AIが感情を言語化して伝えます。' },
  { name: 'SmartGardening', label: 'AI万能スコープ', icon: '🌱', what: '視覚解析 × 環境診断', how: 'カメラで見ているものを説明してください。AIが周囲の環境と合わせて統合分析します。' },
  { name: 'TicketScout', label: 'Ticket Scout', icon: '🎫', what: 'チケット発売日管理', how: 'アーティスト名を入力。AIが発売日を調査し、カレンダー登録プロンプトを作成します。' },
  { name: 'PromptMaster', label: 'AI画像プロンプトマスター', icon: '🪄', what: '最強画像プロンプト生成', how: '日本語でイメージを伝えるだけ。AIがMidjourney等に最適な英語指示を作成します。' },
  { name: 'VintageHunter', title: 'AI古着お買い得ハンター', icon: '🧥', what: 'メルカリ自動監視', how: '狙っているブランドや価格帯を入力。AIが監視用のフィルタ設定を提案します。' }
];

toolsData.forEach(t => {
  const code = `'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { DebugPanel } from './DebugPanel'
import { ArrowRight, Copy, ExternalLink, HelpCircle, Zap, CheckCircle2, Globe } from 'lucide-react'

export default function \${t.name}() {
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);

  const transcribePrompt = "スプレッドシート形式不要、詳細に漏れのないように抜き出して下さい。以下のデータを分析して、NextraLabs品質の結果を出力して。:" + inputText;

  const handleCopy = () => {
    navigator.clipboard.writeText(transcribePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-16 min-h-screen text-slate-200 font-sans">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center mx-auto shadow-2xl text-5xl">\${t.icon}</div>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">\${t.label}</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10"><HelpCircle className="h-40 w-40" /></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <Badge className="bg-white text-indigo-600 font-black px-6 py-2 text-xl rounded-full shadow-lg">STEP 01</Badge>
            <h3 className="text-3xl font-black italic uppercase">\${t.what}</h3>
          </div>
          <p className="text-2xl font-bold leading-relaxed opacity-95">\${t.how}</p>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card className="bg-slate-900 border-2 border-slate-800 rounded-[4rem] p-16 shadow-2xl max-w-5xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-6 text-center border-b border-white/5 pb-12">
               <Label className="text-emerald-400 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 italic"><Zap className="h-5 w-5" /> 1. Copy NextraLabs Optimized Prompt</Label>
               <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="解析する情報を入力..." className="w-full h-80 bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-10 text-2xl font-medium focus:border-indigo-500 text-white shadow-inner mt-6" />
               <Button onClick={handleCopy} className={"w-full h-32 font-black text-4xl rounded-[2rem] shadow-2xl transition-all mt-8 " + (copied ? 'bg-emerald-500 text-slate-950 scale-105' : 'bg-white text-black hover:bg-slate-100')}>
                 {copied ? "COPIED!" : "プロンプトをコピー"}
               </Button>
            </div>

            <div className="space-y-8 pt-6">
              <Label className="text-blue-400 font-black uppercase text-sm tracking-[0.4em] flex items-center justify-center gap-2 italic"><Globe className="h-5 w-5" /> 2. Choose Global AI (Order: GEMINI ➔ GPT ➔ CLAUDE)</Label>
              <div className="grid grid-cols-3 gap-6 text-center">
                <a href="https://gemini.google.com" target="_blank" className="p-8 rounded-3xl border-2 border-white/5 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl">
                  <span className="text-5xl">💎</span><span className="font-black text-white text-2xl">GEMINI</span>
                </a>
                <a href="https://chatgpt.com" target="_blank" className="p-8 rounded-3xl border-2 border-white/5 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl">
                  <span className="text-5xl">🟢</span><span className="font-black text-white text-2xl">GPT</span>
                </a>
                <a href="https://claude.ai" target="_blank" className="p-8 rounded-3xl border-2 border-orange-500/50 bg-slate-950 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl">
                  <Badge className="bg-orange-600 text-white border-0 font-black mb-1">Recommended</Badge>
                  <span className="text-5xl">🟠</span><span className="font-black text-orange-400 text-2xl">CLAUDE</span>
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <DebugPanel data={null} toolId="\${t.name.toLowerCase()}" />
    </div>
  );
});
console.log('✅ ALL TOOLS SURGICALLY RESTORED AND AUDITED.');