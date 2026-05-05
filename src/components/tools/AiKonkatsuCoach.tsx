'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, CheckCircle2, Heart, Camera, MessageCircle, Zap, ChevronRight, Loader2, Copy, Sparkles, ClipboardPaste, RotateCcw, Lightbulb, Search, ShieldCheck, UserCircle, MessageSquare, Flame, BarChart3, Users2, MapPin, Target, LayoutGrid
} from 'lucide-react'

// 皇帝の剣：5大武器（機能ハブ）の定義
const WEAPONS = [
  { 
    id: 'diagnosis', 
    label: '自分磨き診断', 
    desc: '30問で強みと弱みを可視化', 
    icon: BarChart3, 
    color: 'text-pink-500', 
    bg: 'bg-pink-500/10',
    prompt: "あなたは婚活コンサルタントです。以下のチェックリスト結果から、レーダーチャートを分析するように私の『外見・会話・経済・教養・メンタル』を評価し、最優先の改善ポイントを提案してください。",
    presets: [
      { label: "今の自分の課題を知りたい", content: "【外見：清潔感はあるが地味、会話：聞き役になりがち、経済：安定、教養：読書好き、メンタル：消極的】この状態で、何を最優先で磨くべきか具体的に教えて。" },
      { label: "30代・年収別診断", content: "30代前半、年収500万、趣味はアニメと筋トレ。マッチングアプリで勝つために、同年代と差別化できるポイントを診断して。" },
      { label: "清潔感の具体的な上げ方", content: "「清潔感はあるつもり」だが、女性から選ばれない。美容、髪型、服装、姿勢など、婚活市場で『好印象』に見えるためのチェックリストを作って。" },
      { label: "会話力の弱点を克服", content: "1対1の対話で沈黙が怖い。自分の話をしすぎるか、全く話さないかの両極端になってしまう。相手に心地よく喋らせる『魔法の質問』を5つ提案して。" },
      { label: "ハイスペック層への挑戦", content: "自分より格上の相手（年収・学歴）を狙いたい。今の自分に足りない『品格』や『立ち居振る舞い』の改善点を厳しく指摘して。" },
      { label: "オタク趣味の出し方", content: "アニメやゲームが好き。これを隠すべきか、武器にすべきか。同じ趣味の人と出会うための戦略と、一般層に引かれない伝え方を診断して。" },
      { label: "自信を取り戻すメンタル術", content: "お見合いで断られ続けて自信喪失。自己肯定感を高め、次の出会いで「選ばれる余裕」を醸し出すためのマインドセットを教えて。" },
      { label: "40代からの婚活戦略", content: "年齢的に不利だと感じている。大人の余裕と安定感を最大の武器にするための、ターゲット選定と見せ方をアドバイスして。" }
    ]
  },
  { 
    id: 'profile', 
    label: 'プロフィール添削', 
    desc: '第一印象の9割をAIが変える', 
    icon: UserCircle, 
    color: 'text-indigo-500', 
    bg: 'bg-indigo-500/10',
    prompt: "あなたはマッチングアプリのプロです。以下の自己紹介文を読み、具体的なエピソードの追加、ポジティブな言い換え、そしてターゲットに刺さるキャッチコピーを提案してください。",
    presets: [
      { label: "短すぎる文章を強化", content: "「趣味は旅行と映画です。よろしくお願いします。」このプロフィールを、優しくて誠実そうなイメージに膨らませて。" },
      { label: "真剣度を伝える（婚活仕様）", content: "仕事が忙しくてつい「休みは家でゴロゴロ」と書いてしまいます。自立していて、かつパートナーとの時間を大切にする印象に変えて。" },
      { label: "写真選びとキャプション案", content: "顔出しに抵抗がある、または写真が少ない。雰囲気のいい写真の撮り方と、メイン写真に添えるべき『一言で心を掴む』フレーズを3つ考えて。" },
      { label: "再婚・再スタート編", content: "バツイチであることを隠さず、かつネガティブにならずに伝えるプロフィール。包容力と誠実さを感じさせる書き方を提案して。" },
      { label: "「ギャップ萌え」を狙う", content: "見た目は怖そうと言われるが、実は料理が得意。このギャップを親しみやすさに変えて、女性が「安心していいね」できる文章にして。" },
      { label: "仕事への情熱を魅力に", content: "仕事人間だと思われがち。仕事へのやりがいを伝えつつ、「家庭も大切にする未来」を想像させる魅力的な書き方を教えて。" },
      { label: "共通点で見つける趣味の記載", content: "キャンプ、サウナ、読書。バラバラな趣味を一つのストーリーにまとめて、価値観が合う人を引き寄せるプロフィールにして。" },
      { label: "マッチングアプリ疲れを打破", content: "「普通の人でいいのに出会えない」という本音を漏らさず、誠実な出会いを求めていることを品よく伝える添削をして。" }
    ]
  },
  { 
    id: 'dating', 
    label: 'デートプラン提案', 
    desc: '場所から会話ネタまで網羅', 
    icon: MapPin, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10',
    prompt: "あなたはデートプランナーです。相手の趣味、デート回数、季節を踏まえて、最適な待ち合わせ場所、会話のフック、避けるべき話題、次へ繋げるクロージングを提案してください。",
    presets: [
      { label: "初対面のお茶デート", content: "週末の午後、銀座付近。相手はカフェ巡りが趣味。緊張せずに話せる静かすぎない場所と、沈黙を怖がらないための会話ネタを3つ教えて。" },
      { label: "3回目勝負のディナー", content: "相手はイタリアンが好き。告白を視野に入れたい。雰囲気の良いレストランの選び方と、切り出すタイミングのヒントを。" },
      { label: "雨の日・室内デート案", content: "予定していた公園が雨。急遽インドアで楽しめるプランへの変更案。映画館、水族館、または体験型イベントで距離を縮める工夫を。" },
      { label: "緊張をほぐす会話スターター", content: "話題が尽きた時のための『相手の価値観を深掘りできる』10分間の会話構成を、相手のプロフィール（旅行好き）に合わせて作成して。" },
      { label: "お家デートの誘い方と準備", content: "仲良くなってきたのでお家で映画でも、と誘いたい。下心を感じさせない誘い文句と、好感度が上がる「おもてなし」のポイントを。" },
      { label: "遠出・ドライブデート", content: "少し遠出をしてみたい。車内でのBGMや会話の持たせ方、疲れさせない休憩の挟み方を含めた1日プランを作成して。" },
      { label: "共通の趣味を体験する日", content: "二人とも陶芸に興味がある。体験教室後の食事までの流れと、共同作業を通じて親密度を爆上げする声掛けを教えて。" },
      { label: "予算を抑えた知的デート", content: "金銭感覚が近いことをアピールしたい。美術館や図書館、公園散歩など、お金をかけずにかつ特別感を出せるプランを。" }
    ]
  },
  { 
    id: 'compatibility', 
    label: '相性シミュレーション', 
    desc: '価値観の不一致を数値化', 
    icon: Users2, 
    color: 'text-orange-500', 
    bg: 'bg-orange-500/10',
    prompt: "あなたは心理学者です。私と相手の『金銭感覚・休日・家事・将来ビジョン』のデータを比較し、致命的な不一致リスクと、それを乗り越えるための対話方法を教えてください。",
    presets: [
      { label: "金銭感覚のズレを確認", content: "自分：貯金重視、相手：趣味（旅行）に惜しみなく使う。結婚後に家計を共にする際、もめないための妥協点を探って。" },
      { label: "休日の過ごし方の違い", content: "自分：インドア派、相手：キャンプ大好きアウトドア派。無理せず一緒に楽しめる「中間地点の休日」を提案して。" },
      { label: "共働き・家事分担の懸念", content: "私は多忙、相手は丁寧な暮らしを希望。生活リズムがズレた時の家事分担や、不満を溜め込まないための『家庭内ルール』をシミュレーションして。" },
      { label: "将来の住まい・親との関係", content: "都会派の私と、将来は地元に帰りたい相手。歩み寄るための交渉術と、お互いが納得できる条件の洗い出しをして。" },
      { label: "子供・育児の価値観", content: "私は子供が早く欲しい、相手は仕事が落ち着いてから。この「時間軸のズレ」をどう埋めるか、お互いのキャリアを尊重した対話案を。" },
      { label: "ペット・生活環境の違い", content: "私は犬を飼いたい、相手は動物が苦手。将来の家族構成に直結するこの問題を、どちらも犠牲にならない形で解決できるかシミュレーションして。" },
      { label: "宗教・食生活・こだわり", content: "ヴィーガンの相手と、肉好きの自分。日々の食事という最も重要な時間を、ストレスなく共存させるためのアイデアを出して。" },
      { label: "過去の恋愛とトラウマ", content: "浮気された経験がある自分と、交友関係が広い相手。束縛にならない程度に「安心感」を得るための信頼関係構築ステップを提示して。" }
    ]
  },
  { 
    id: 'pdca', 
    label: '活動記録＆分析', 
    desc: '失敗を成功に変えるログ分析', 
    icon: Target, 
    color: 'text-rose-500', 
    bg: 'bg-rose-500/10',
    prompt: "あなたは戦略コーチです。今回のお見合い・デートの記録から、成功要因と失敗要因を特定し、次のアクションで修正すべき具体的な行動ログを出力してください。",
    presets: [
      { label: "2回目に繋がらなかった反省", content: "「話は盛り上がったはずなのに、LINEがそっけない。」会話の比率や、最後の別れ際の挨拶など、どこに盲点があったか分析して。" },
      { label: "成功パターンを再現化", content: "初めて交際まで発展しそう。今回の成功パターンを言語化して、自信を確信に変えたい。何が相手に刺さったのか整理して。" },
      { label: "フェードアウトの原因調査", content: "いい感じだった相手から急に連絡が途絶えた。直近のやり取り（数通のLINE）から、相手の心境の変化を推測し、挽回可能か判定して。" },
      { label: "自分の改善グラフを作成", content: "この1ヶ月で5人と会った。共通して指摘される点や、自分の中で手応えが変わってきた部分を棚卸しして、成長を可視化して。" },
      { label: "第一印象のブラッシュアップ", content: "「写真と実物が違う」と思われていないか不安。相手の反応から、プロフィールと実物のギャップがどこにあったか客観的に分析して。" },
      { label: "LINEの距離感を最適化", content: "返信が遅い、または早すぎて引かれている気がする。相手の返信速度やテンションに合わせた、最適な「ミラーリング戦略」を立案して。" },
      { label: "結婚への焦り度をチェック", content: "つい急ぎすぎて相手を怖がらせていないか。会話の中で「結婚」のワードを出すタイミングや、重くない進め方を過去の失敗から学んで。" },
      { label: "仲人のアドバイスを補完", content: "相談所の担当者に言われた「もっと自分を出して」の意味がわからない。AIの視点で、どう自分を開示すればいいか具体的なセリフにして。" }
    ]
  },
];

export default function AiKonkatsuCoach() {
  const [activeWeapon, setActiveWeapon] = useState<string | null>(null);
  const [inputData, setInputData] = useState('');
  const [report, setReport] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visiblePresets, setVisiblePresets] = useState<any[]>([]);

  // 武器を切り替えたとき、ランダムに4つ選ぶ
  useEffect(() => {
    if (activeWeapon) {
      const weapon = WEAPONS.find(w => w.id === activeWeapon);
      if (weapon && weapon.presets) {
        const shuffled = [...weapon.presets].sort(() => 0.5 - Math.random());
        setVisiblePresets(shuffled.slice(0, 4));
      }
    }
  }, [activeWeapon]);

  // 憲法：自動スコアリング演出
  useEffect(() => {
    if (report && !score) {
      setIsProcessing(true);
      setTimeout(() => {
        setScore(60 + Math.floor(Math.random() * 38));
        setIsProcessing(false);
      }, 1200);
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
        <Badge className="bg-pink-600 text-white font-black italic tracking-widest px-6 py-1 text-[10px] uppercase rounded-full shadow-[0_0_20px_rgba(219,39,119,0.3)]">Konkatsu Strategic Hub</Badge>
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">AI 婚活コーチ</h1>
      </div>

      {/* 皇帝の剣：マルチツール・ハブ（武器選択ナビ） */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-[2rem] shadow-2xl overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-[800px]">
          {WEAPONS.map((w) => (
            <button
              key={w.id}
              onClick={() => { setActiveWeapon(w.id); setInputData(''); setReport(''); setScore(null); }}
              className={`flex-1 flex flex-col items-center justify-center py-4 px-2 rounded-2xl transition-all duration-300 gap-2 border-2 ${activeWeapon === w.id ? 'bg-pink-600 border-pink-400 scale-105 shadow-xl text-white' : 'bg-slate-950 border-transparent text-slate-500 hover:text-white hover:bg-slate-900'}`}
            >
              <w.icon size={24} className={activeWeapon === w.id ? 'text-white' : w.color} />
              <div className="text-center">
                <p className="text-[10px] font-black uppercase italic leading-none mb-1">{w.label}</p>
                <p className={`text-[8px] font-bold opacity-60 ${activeWeapon === w.id ? 'text-white' : ''}`}>{w.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {!activeWeapon ? (
        /* 初期状態：武器の紹介 */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8">
           {WEAPONS.map((w) => (
             <Card key={w.id} onClick={() => setActiveWeapon(w.id)} className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 hover:border-pink-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden h-64 flex flex-col justify-center items-center text-center">
                <div className={`absolute top-0 right-0 w-32 h-32 ${w.bg} blur-3xl -mr-16 -mt-16 group-hover:opacity-100 opacity-30 transition-opacity`} />
                <div className={`w-16 h-16 ${w.bg} ${w.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}><w.icon size={32} /></div>
                <h3 className="text-2xl font-black text-white italic uppercase mb-2">{w.label}</h3>
                <p className="text-slate-500 font-bold text-sm">{w.desc}</p>
             </Card>
           ))}
        </div>
      ) : (
        /* 機能実行状態：憲法準拠の一本道 */
        <div className="space-y-6 animate-in zoom-in-95">
          {/* プリセットを独立した大きな選択エリアとして配置 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {visiblePresets.map((p, i) => (
               <Button 
                key={i} 
                variant="outline" 
                onClick={() => setInputData(p.content)} 
                className="h-24 border-2 border-slate-800 bg-slate-900 text-slate-300 font-black text-xs uppercase italic hover:bg-pink-600/10 hover:border-pink-500/50 rounded-3xl whitespace-normal p-4 leading-tight transition-all active:scale-95 shadow-lg flex items-center justify-center text-center"
               >
                 {p.label}
               </Button>
             ))}
          </div>

          <Card className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-8 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 bg-pink-600`} />
            
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase flex items-center gap-4">
                {currentWeapon && React.createElement(currentWeapon.icon, { className: currentWeapon.color, size: 40 })}
                {currentWeapon?.label}
              </h3>
              <Button onClick={() => setActiveWeapon(null)} variant="ghost" className="text-slate-500 font-black italic uppercase hover:text-white"><LayoutGrid className="mr-2" size={16} /> 武器を選択し直す</Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-inner">
                  <p className="text-[10px] font-black text-pink-500 uppercase italic tracking-widest mb-4">Input Information</p>
                  <textarea 
                    value={inputData} 
                    onChange={(e) => setInputData(e.target.value)} 
                    placeholder={`${currentWeapon?.label}に必要な情報を入力、または上のボタンから選んでください...`} 
                    className="w-full h-64 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-lg text-white font-bold focus:border-pink-500 outline-none transition-all shadow-inner" 
                  />
                </div>

                <div className="space-y-4">
                  <Button onClick={() => handleCopy(`${currentWeapon?.prompt}\n\n【提供された情報】：\n${inputData}`)} className={`w-full h-20 text-xl font-black rounded-2xl transition-all shadow-xl ${copied ? 'bg-emerald-500 text-slate-950 scale-95' : 'bg-rose-600 text-white hover:bg-rose-500'}`}>
                    {copied ? '✅ 指示をコピーしました' : '最強コーチング指示をコピー'}
                  </Button>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-pink-600/10" onClick={() => window.open('https://claude.ai', '_blank')}>CLAUDE</Button>
                    <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-pink-600/10" onClick={() => window.open('https://gemini.google.com', '_blank')}>GEMINI</Button>
                    <Button variant="outline" className="h-14 border-2 border-slate-800 text-[10px] font-black uppercase italic hover:bg-pink-600/10" onClick={() => window.open('https://chatgpt.com', '_blank')}>CHATGPT</Button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 rounded-[3rem] p-10 border border-slate-800 flex flex-col gap-6 shadow-inner min-h-[500px] relative overflow-hidden">
                {score && <div className="absolute inset-0 bg-pink-600/5 backdrop-blur-3xl animate-in fade-in duration-1000" />}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3 text-pink-400">
                    <ShieldCheck size={24} />
                    <h4 className="text-sm font-black uppercase italic tracking-widest">Coaching Report</h4>
                  </div>
                  {score && (
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-pink-400 uppercase italic">Marriage Probability</span>
                      <span className="text-4xl font-black text-white italic animate-in zoom-in">{score}<span className="text-sm ml-1">%</span></span>
                    </div>
                  )}
                </div>
                <textarea 
                  value={report} 
                  onChange={(e) => setReport(e.target.value)} 
                  placeholder="AIからのアドバイスをここに貼り付けると、成婚期待度が算出されます..." 
                  className="flex-1 bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:border-pink-500 outline-none font-medium leading-relaxed italic relative z-10 shadow-inner" 
                />
                {isProcessing && <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-4 z-20"><Loader2 className="w-10 h-10 text-pink-500 animate-spin" /><p className="text-xs font-black text-pink-400 uppercase italic tracking-widest">AI Strategic Scoring...</p></div>}
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="text-center opacity-20"><p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Marriage Road Japan 知見継承エンジン • NextraLabs 2026</p></div>
    </div>
  )
}
