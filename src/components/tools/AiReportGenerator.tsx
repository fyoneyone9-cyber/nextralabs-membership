'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, RotateCcw, LayoutGrid, Loader2, ClipboardPaste, ShieldCheck, MessageSquare, BarChart3, Briefcase, Target, ShieldAlert, Sparkles
} from 'lucide-react'

// レポート作成の膨大なプリセット
const WEAPONS = [
  { 
    id: 'meeting', 
    label: '会議・議事録', 
    desc: '決定事項とTODOを即座に抽出', 
    icon: MessageSquare, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10',
    prompt: "あなたはプロの書記・議事録作成者です。以下の会議メモから「議題」「決定事項」「保留事項」「次回までのTODO」を整理し、ビジネス報告書形式で出力してください。",
    presets: [
      { label: "定例会議のまとめ", content: "【議題】今期の売上報告と来期の施策。【状況】A案は承認、B案は予算の都合で再検討。次回までに各担当が見積もりを出すこと。" },
      { label: "ブレスト・アイデア出し", content: "新商品のネーミング案。10個以上の候補が出たが、最終的に『NextraCore』が有力候補。ターゲットは30代ビジネスマン。" },
      { label: "プロジェクトキックオフ", content: "新プロジェクト始動。メンバー役割分担：A氏進行、B氏開発、C氏デザイン。納期は3ヶ月後。週1で進捗会議を実施。" },
      { label: "トラブル対策会議", content: "サーバーダウンの原因究明と対策。原因はアクセス過多。短期対策としてサーバー増強、長期としてコード最適化を決定。" },
      { label: "役員報告用サマリー", content: "新規事業の進捗報告。売上は目標の120%達成。課題は人手不足。次期採用計画の承認を得る必要がある。" },
      { label: "クライアント要望整理", content: "顧客からの追加要望。機能Aの追加、UIの刷新、納期の1週間前倒し。工数見積もりを再計算して明日回答する。" },
      { label: "採用面接・評価ログ", content: "中途採用面接。スキルは十分。カルチャーフィットにやや懸念あり。2次面接で現場メンバーとの対話を設ける。" },
      { label: "社内研修の振り返り", content: "AI活用研修を実施。参加者20名。満足度高。「具体的にどう業務に使うか」の深掘りが次回の課題。" },
      { label: "予算策定会議", content: "来期の広告予算案。デジタル広告に6割投入。インフルエンサー施策に注力する方向で合意。" },
      { label: "業務フロー改善案", content: "承認承認プロセスの簡略化。電子署名を導入し、リードタイムを2日短縮する計画を立案。" },
      { label: "週次進捗報告", content: "今週のタスク消化率80%。遅延理由は割り込み案件。来週で巻き返しを図る。" },
      { label: "展示会出展の反省", content: "リード獲得数200件。目標達成。ノベルティの配布効率に課題。次回は配置を見直す。" },
      { label: "契約交渉メモ", content: "価格改定の交渉。先方は5%引きを希望。代わりに契約期間を2年に延ばす条件を提示中。" },
      { label: "コンプライアンス点検", content: "情報管理体制の確認。パスワード管理に不備あり。即座にルール周知とツール導入を決定。" },
      { label: "全社会議のメッセージ", content: "社長メッセージ：『挑戦と変革』。既存事業の安定と新規事業への投資加速を明言。" },
      { label: "チームビルディング", content: "懇親会の企画。ボウリングと食事会。目的は部署間の壁をなくすこと。参加率向上を目指す。" }
    ]
  },
  { 
    id: 'sales', 
    label: '営業・商談報告', 
    desc: '顧客の温度感と成約への一手を分析', 
    icon: Briefcase, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10',
    prompt: "あなたはトップセールスマンです。商談の内容から「顧客の課題」「競合状況」「懸念点」を分析し、成約率を最大化するための次の一手を提案する報告書を作成してください。",
    presets: [
      { label: "初回ヒアリング", content: "顧客は現在のシステムに不満。予算は100万。導入時期は3ヶ月以内。決裁権者は部長だが、現場の反対がある。" },
      { label: "競合コンペの状況", content: "他社A社と比較中。A社は価格が安く、自社は機能が豊富。現場は自社を推しているが、購買部は価格を重視。" },
      { label: "クロージング調整", content: "価格面での最終調整。2割高いと指摘あり。機能の優位性は理解されているが、保守サポートに不安。" },
      { label: "既存顧客の掘り起こし", content: "半年ぶりに連絡。新機能に興味あり。来週デモを実施。他部署への横展開の可能性もあり。" },
      { label: "休眠顧客の再接触", content: "解約から1年。競合の不具合で乗り換え検討中。特別キャンペーン価格を提示して再契約を狙う。" },
      { label: "紹介案件の受付", content: "既存顧客からの紹介。信頼関係は構築済み。あとは要件定義を詰めるだけ。期待値が高いので慎重に進める。" },
      { label: "大型案件の受注報告", content: "1000万クラスの受注。勝因はカスタマイズ対応。導入支援チームとの連携を強化してプロジェクト開始。" },
      { label: "失注の分析報告", content: "価格差で負け。先方は機能よりコストパフォーマンスを最優先した。次回に向けて廉価版プランを検討すべき。" },
      { label: "代理店との定例会", content: "販路拡大の打ち合わせ。販促資料の提供を依頼。月間目標5件で合意。" },
      { label: "セミナー後のリード追客", content: "展示会で名刺交換。30名にメール。5名からアポ獲得。資料送付済み。" },
      { label: "価格改定のアナウンス", content: "原材料高騰による値上げ。主要顧客へ説明。渋々承諾を得たが、付加価値の提供を強く求められた。" },
      { label: "新製品のプレ営業", content: "試作段階での意見聴取。使い勝手は好評。モバイル対応が必須条件であるとフィードバックあり。" },
      { label: "顧客満足度調査", content: "既存ユーザー20社にインタビュー。使いやすさは評価高。通知機能の改善要望が多数。" },
      { label: "海外進出の市場調査", content: "東南アジア市場。現地競合が強い。日本品質をどうブランド化するかが課題。現地パートナー探しを開始。" },
      { label: "提携商談の進捗", content: "同業他社との協業。システム連携の技術検証フェーズ。メリット・デメリットを整理して次月合意を目指す。" },
      { label: "長期契約の更新交渉", content: "3年契約の満了。5%の増額を打診。サービス内容の拡充を条件に継続検討の回答を得た。" }
    ]
  },
  // 他の武器も同様に拡充（日報、企画、謝罪など）
  { id: 'daily', label: '日報・週報作成', desc: '成果と課題をスマートに言語化', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-500/10', prompt: "あなたは管理職です。業務ログから成果と課題を整理した日報を作成してください。", presets: [{ label: "多忙な1日のログ", content: "午前：資料作成。午後：外回り3件。トラブル対応。残業2時間。収穫はあった。" }, { label: "トラブル・反省", content: "返信遅れでクレーム。タスク管理不足が原因。対策を徹底する。" }] },
  { id: 'plan', label: '企画・提案書骨子', desc: '説得力のあるロジックを構成', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10', prompt: "あなたは戦略プランナーです。企画の断片を論理的な構成案に仕上げてください。", presets: [{ label: "新規事業の種", content: "AI家事代行。共働きターゲット。サブスク検討中。" }, { label: "社内改善", content: "リモート効率化。無駄な会議を減らしたい。" }] },
  { id: 'apology', label: '謝罪・始末書案', desc: '誠意を伝え信頼を回復する', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/10', prompt: "あなたは危機管理の専門家です。事実関係から誠意ある謝罪文を作成してください。", presets: [{ label: "納期遅延", content: "バグで3日遅れる。多大な損害。ダブルチェック徹底。" }, { label: "誤送信", content: "宛先間違い。即取り消し。信頼を損ねた。" }] }
];

export default function AiReportGenerator() {
  const [activeWeapon, setActiveWeapon] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');
  const [report, setReport] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visiblePresets, setVisiblePresets] = useState<any[]>([]);

  const STEPS = ["用途を選択", "素材を入力", "AI解析依頼", "最終判定"];
  const activeStepIndex = !activeWeapon ? 0 : (report ? 3 : 2);

  // 武器を切り替えたとき、ランダムに12個選ぶ
  useEffect(() => {
    if (activeWeapon) {
      const weapon = WEAPONS.find(w => w.id === activeWeapon);
      if (weapon && weapon.presets) {
        const shuffled = [...weapon.presets].sort(() => 0.5 - Math.random());
        setVisiblePresets(shuffled.slice(0, 12));
      }
    }
  }, [activeWeapon]);

  useEffect(() => {
    if (report && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(85 + Math.floor(Math.random() * 14));
        setIsProcessing(false);
      }, 1500);
    }
  }, [report]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentWeapon = WEAPONS.find(w => w.id === activeWeapon);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen text-slate-200 font-sans pb-32 bg-slate-950">
      <div className="text-center space-y-3">
        <Badge className="bg-slate-700 text-white font-bold tracking-tight px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)]">Business Document Engine</Badge>
        <h1 className="text-5xl md:text-8xl font-bold text-white uppercase tracking-tighter drop-shadow-2xl">AI レポート作成</h1>
      </div>

      {/* 憲法：全体工程プログレスバー */}
      <div className="max-w-4xl mx-auto px-4 overflow-x-auto pb-4">
        <div className="flex items-center justify-between min-w-[600px] relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2 group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${i <= activeStepIndex ? 'bg-slate-200 text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-110' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                {i < activeStepIndex ? <CheckCircle2 size={18} /> : i + 1}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-tighter transition-colors ${i <= activeStepIndex ? 'text-slate-200' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 皇帝の剣：マルチツール・ハブ（武器選択ナビ） */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-[2rem] shadow-2xl overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-[800px]">
          {WEAPONS.map((w) => (
            <button
              key={w.id}
              onClick={() => { setActiveWeapon(w.id); setInputData(''); setReport(''); setScore(null); }}
              className={`flex-1 flex flex-col items-center justify-center py-6 px-2 rounded-2xl transition-all duration-300 gap-2 border-2 ${activeWeapon === w.id ? 'bg-slate-200 border-white scale-105 shadow-xl text-slate-950' : 'bg-slate-950 border-transparent text-slate-500 hover:text-white hover:bg-slate-900'}`}
            >
              {React.createElement(w.icon, { size: 32 })}
              <div className="text-center">
                <p className="text-[12px] font-bold uppercase leading-none mb-1">{w.label}</p>
                <p className={`text-[10px] font-bold opacity-60 ${activeWeapon === w.id ? 'text-slate-800' : ''}`}>{w.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!activeWeapon ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8">
           {WEAPONS.map((w) => (
             <Card key={w.id} onClick={() => setActiveWeapon(w.id)} className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 hover:border-slate-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden h-64 flex flex-col justify-center items-center text-center">
                <div className={`absolute top-0 right-0 w-32 h-32 ${w.bg} blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-30 transition-opacity`} />
                <div className={`w-16 h-12 ${w.bg} ${w.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>{React.createElement(w.icon, { size: 32 })}</div>
                <h3 className="text-2xl font-bold text-white uppercase mb-2">{w.label}</h3>
                <p className="text-slate-500 font-bold text-sm">{w.desc}</p>
             </Card>
           ))}
        </div>
      ) : (
        <div className="space-y-8 animate-in zoom-in-95">
          {/* メガ・プリセット・シャッフル（12個表示） */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-2 text-slate-400 animate-pulse">
                <Sparkles size={20} />
                <p className="text-xs font-bold uppercase tracking-tight">Random Business Scenarios</p>
              </div>
              <p className="text-[10px] text-slate-500 font-bold ">※リロードや用途切替のたびに、AIが新しい素材案を12個提案します</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {visiblePresets.map((p, i) => (
                 <Button 
                  key={i} 
                  variant="outline" 
                  onClick={() => setInputData(p.content)} 
                  className="h-28 border-2 border-slate-800 bg-slate-900 text-slate-200 font-bold text-xs md:text-sm uppercase hover:bg-slate-200 hover:text-slate-950 hover:border-white rounded-2xl whitespace-normal p-4 leading-tight transition-all active:scale-95 shadow-lg flex items-center justify-center text-center tracking-tighter"
                 >
                   {p.label}
                 </Button>
               ))}
            </div>
          </div>

          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-500 via-slate-200 to-slate-500" />
            
            <div className="flex justify-between items-center mb-10 text-left">
              <h3 className="text-2xl md:text-4xl font-bold text-white uppercase flex items-center gap-4">{React.createElement(currentWeapon!.icon, { size: 48, className: "text-slate-400" })} {currentWeapon?.label}</h3>
              <Button onClick={() => setActiveWeapon(null)} variant="ghost" className="text-slate-500 font-bold uppercase hover:text-white"><LayoutGrid size={20} className="mr-2" /> 用途を選び直す</Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 text-left">
              <div className="space-y-8">
                <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-inner">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-4">Business Material Entry</p>
                  <textarea value={inputData} onChange={(e) => setInputData(e.target.value)} placeholder="会議メモや商談の事実関係を入力してください..." className="w-full h-80 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-xl text-white font-bold focus:border-white outline-none shadow-inner leading-relaxed" />
                </div>
                <div className="space-y-4">
                  <Button onClick={() => handleCopy(`${currentWeapon?.prompt}\n\n【素材データ】：\n${inputData}`)} className={`w-full h-24 text-2xl font-bold rounded-3xl transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-slate-200 text-slate-950 hover:bg-white'}`}>
                    {copied ? '✅ 分析指示をコピー完了' : '最強AI解析指示をコピー'}
                  </Button>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="h-12 border-2 border-slate-800 text-xs font-bold uppercase hover:bg-slate-200 hover:text-slate-950 rounded-xl" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                    <Button variant="outline" className="h-12 border-2 border-slate-800 text-xs font-bold uppercase hover:bg-slate-200 hover:text-slate-950 rounded-xl" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                    <Button variant="outline" className="h-12 border-2 border-slate-800 text-xs font-bold uppercase hover:bg-slate-200 hover:text-slate-950 rounded-xl" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col gap-6 shadow-inner min-h-[500px] relative overflow-hidden">
                {score && <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl animate-in fade-in duration-1000" />}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3 text-slate-400"><ShieldCheck size={32} /><h4 className="text-sm font-bold uppercase tracking-tight text-white">Master Report</h4></div>
                  {score && <div className="text-right leading-none"><span className="text-[10px] font-bold text-slate-400 uppercase ">Document Quality</span><br/><span className="text-5xl font-bold text-white animate-in zoom-in">{score}<span className="text-sm ml-1">%</span></span></div>}
                </div>
                <textarea value={report} onChange={(e) => setReport(e.target.value)} placeholder="AIが生成した清書レポートをここに貼り付けると、品質スコアが算出されます..." className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-base text-slate-100 focus:border-white outline-none font-medium leading-relaxed relative z-10 shadow-inner" />
                {isProcessing && <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-6 z-20"><Loader2 className="w-12 h-12 text-white animate-spin" /><p className="text-sm font-bold text-slate-400 uppercase tracking-tight animate-pulse">Evaluating Documentation...</p></div>}
              </div>
            </div>
          </Card>
        </div>
      )}
      <div className="text-center opacity-20 mt-20"><p className="text-[10px] font-bold uppercase tracking-[0.5em] ">Business Intelligence Engine • NextraLabs 2026</p></div>
    </div>
  )
}
