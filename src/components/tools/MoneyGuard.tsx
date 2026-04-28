'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────
interface BetRecord {
  id: string
  date: string
  type: string
  betAmount: number
  returnAmount: number
  note: string
}

interface BiasQuiz {
  id: string
  name: string
  scenario: string
  options: { text: string; isBias: boolean; explanation: string }[]
}

// ─── Data ────────────────────────────────────────────────
const gamblingTypes = [
  { name: '競馬', returnRate: 0.75, icon: '🏇' },
  { name: '競艇', returnRate: 0.75, icon: '🚤' },
  { name: '競輪', returnRate: 0.75, icon: '🚴' },
  { name: 'オートレース', returnRate: 0.70, icon: '🏎️' },
  { name: 'パチンコ', returnRate: 0.85, icon: '🎰' },
  { name: 'パチスロ', returnRate: 0.85, icon: '🎰' },
  { name: '宝くじ', returnRate: 0.46, icon: '🎫' },
  { name: 'toto/BIG', returnRate: 0.50, icon: '⚽' },
  { name: 'カジノ(BJ)', returnRate: 0.985, icon: '🃏' },
  { name: 'カジノ(ルーレット)', returnRate: 0.947, icon: '🎡' },
  { name: 'カジノ(スロット)', returnRate: 0.90, icon: '🎰' },
  { name: 'オンラインカジノ', returnRate: 0.95, icon: '💻' },
]

const sogsQuestions = [
  { id: 's1', text: 'ギャンブルで負けたとき、負けた分を取り戻そうとして再度ギャンブルをしましたか？', weight: 1 },
  { id: 's2', text: 'ギャンブルで勝ったとき、もっと勝ちたいと思って続けましたか？', weight: 1 },
  { id: 's3', text: 'ギャンブルに使うお金を増やしていった経験がありますか？', weight: 1 },
  { id: 's4', text: 'ギャンブルのことを考えると落ち着かない、イライラすることがありますか？', weight: 1 },
  { id: 's5', text: 'ストレスや嫌なことから逃げるためにギャンブルをしたことがありますか？', weight: 1 },
  { id: 's6', text: 'ギャンブルのために嘘をついたことがありますか？', weight: 2 },
  { id: 's7', text: 'ギャンブルのためにお金を借りたことがありますか？', weight: 2 },
  { id: 's8', text: 'ギャンブルのために大切な人間関係を失ったり、危うくなったことがありますか？', weight: 2 },
  { id: 's9', text: 'ギャンブルのために仕事や学業に支障が出たことがありますか？', weight: 2 },
  { id: 's10', text: 'ギャンブルをやめようと思っても、やめられなかったことがありますか？', weight: 2 },
  { id: 's11', text: '生活費や借金の返済に使うべきお金をギャンブルに使ったことがありますか？', weight: 2 },
  { id: 's12', text: 'ギャンブルのことで家族や友人に心配をかけたことがありますか？', weight: 1 },
  { id: 's13', text: 'ギャンブルをしていないとき、次にいつギャンブルができるか考えていますか？', weight: 1 },
  { id: 's14', text: '1回のギャンブルに使う金額が、自分の月収の10%を超えることがありますか？', weight: 2 },
  { id: 's15', text: 'ギャンブル資金のためにクレジットカードのキャッシングを使ったことがありますか？', weight: 2 },
]

const biasQuizzes: BiasQuiz[] = [
  {
    id: 'b1', name: 'ギャンブラーの誤謬',
    scenario: 'ルーレットで5回連続「赤」が出ました。次に賭けるなら？',
    options: [
      { text: '「黒」に賭ける。5回も赤が続いたから、次は黒が出るはず', isBias: true, explanation: '「ギャンブラーの誤謬」です。ルーレットの各回は独立した事象。過去の結果は次の結果に影響しません。赤が出る確率は常に約47.4%です。' },
      { text: '赤でも黒でも確率は同じ。どちらでもいい', isBias: false, explanation: '正解です！各回は独立事象なので、過去の結果に関係なく確率は一定です。' },
    ],
  },
  {
    id: 'b2', name: 'ニアミス効果',
    scenario: 'パチスロで「777」を狙い、「776」で止まりました。どう感じる？',
    options: [
      { text: '惜しい！もう少しで当たりだった。次こそ当たるかも', isBias: true, explanation: '「ニアミス効果」です。「惜しかった」と感じますが、776と700は数学的に同じ「ハズレ」です。スロットは毎回リセットされるので、「次こそ」の根拠はありません。' },
      { text: 'ハズレはハズレ。777以外は全て同じ結果', isBias: false, explanation: '正解！ニアミスに特別な意味はありません。結果は「当たり」か「ハズレ」の2つだけです。' },
    ],
  },
  {
    id: 'b3', name: 'サンクコスト錯誤',
    scenario: '今日パチンコで3万円負けています。あと1万円あれば取り戻せそうな気がする…',
    options: [
      { text: 'ここで止めたら3万円がムダになる。もう1万円だけ…', isBias: true, explanation: '「サンクコスト錯誤」です。すでに失った3万円は戻りません。追加の1万円を賭けるかどうかは、その1万円だけで判断すべきです。「取り戻す」ために追加投入するのが最も危険なパターンです。' },
      { text: '失った3万円は戻らない。これ以上の損失を防ぐために止める', isBias: false, explanation: '正解！「損切り」は投資でもギャンブルでも最も重要なスキルです。' },
    ],
  },
  {
    id: 'b4', name: '確証バイアス',
    scenario: '友人が「あの馬は雨の日に強い」と言っています。実際に雨の日のレースで勝ちました。',
    options: [
      { text: 'やっぱり雨に強い馬だ！次の雨のレースでも賭けよう', isBias: true, explanation: '「確証バイアス」です。雨の日に勝った記憶は残りやすいですが、雨の日に負けたレースは忘れがち。全レースの統計を見ないと判断できません。' },
      { text: '1回だけでは判断できない。全レースのデータを見る必要がある', isBias: false, explanation: '正解！少ないサンプルから法則を見出すのは危険です。' },
    ],
  },
  {
    id: 'b5', name: 'コントロール錯覚',
    scenario: '競馬で自分なりの「必勝法」を見つけた気がします。過去5レース中4回当たりました。',
    options: [
      { text: '自分の分析力で勝てる。この方法を続ければ安定して稼げる', isBias: true, explanation: '「コントロール錯覚」です。5回中4回の的中は統計的に偶然の範囲内。競馬の控除率25%は長期的に必ず効いてきます。プロの予想師でも年間収支がプラスの人はごくわずかです。' },
      { text: '5回は少なすぎるサンプル。控除率25%がある以上、長期的には負ける', isBias: false, explanation: '正解！短期の勝ちに惑わされず、数学的な期待値で判断することが大切です。' },
    ],
  },
  {
    id: 'b6', name: '損失回避バイアス',
    scenario: 'A: 確実に5,000円もらえる。B: 50%の確率で15,000円もらえるが、50%の確率で0円。',
    options: [
      { text: 'Aを選ぶ（確実な5,000円）', isBias: false, explanation: 'Aの期待値は5,000円、Bの期待値は7,500円。数学的にはBが有利ですが、Aを選ぶのは「損失回避」として合理的な判断でもあります。ギャンブルではこの心理が「負けを取り戻すために大きく賭ける」方向に悪用されます。' },
      { text: 'Bを選ぶ（期待値はBが高い）', isBias: false, explanation: '数学的には正しい判断です。ただし、ギャンブルでは「期待値が高い＝確実に勝てる」ではないことに注意。' },
    ],
  },
]

const consultationGuide = [
  { name: 'ギャンブル依存症の全国相談ダイヤル', phone: '0120-977-556', desc: '無料・秘密厳守。本人だけでなく家族からの相談もOK', hours: '月〜金 10:00〜17:00', icon: '📞' },
  { name: '精神保健福祉センター', phone: '各都道府県の番号', desc: '都道府県ごとの相談窓口。対面相談も可能', hours: '平日 9:00〜17:00', icon: '🏥' },
  { name: 'GA（ギャンブラーズ・アノニマス）', phone: 'https://www.gajapan.jp/', desc: '当事者同士のミーティング。全国各地で開催。匿名参加OK', hours: '各地域による', icon: '🤝' },
  { name: 'ギャマノン（家族の会）', phone: 'https://www.gam-anon.jp/', desc: 'ギャンブル依存症者の家族のための自助グループ', hours: '各地域による', icon: '👨‍👩‍👦' },
  { name: '日本司法支援センター（法テラス）', phone: '0570-078374', desc: '借金問題の法的相談。自己破産・債務整理のアドバイス', hours: '平日 9:00〜21:00 / 土 9:00〜17:00', icon: '⚖️' },
  { name: 'よりそいホットライン', phone: '0120-279-338', desc: '生活全般の困りごと相談。24時間対応', hours: '24時間', icon: '💬' },
]

// ─── Component ───────────────────────────────────────────
export default function MoneyGuard() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'expected' | 'sogs' | 'ifsaved' | 'bias' | 'help'>('tracker')

  // Tracker state
  const [records, setRecords] = useState<BetRecord[]>([])
  const [newRecord, setNewRecord] = useState({ type: '競馬', betAmount: '', returnAmount: '', note: '' })

  // SOGS state
  const [sogsAnswers, setSogsAnswers] = useState<Record<string, boolean>>({})
  const [sogsResult, setSogsResult] = useState<{ score: number; level: string; description: string; advice: string[] } | null>(null)

  // If-saved state
  const [savedInput, setSavedInput] = useState({ monthly: '', years: '' })

  // Bias state
  const [biasIndex, setBiasIndex] = useState(0)
  const [biasAnswered, setBiasAnswered] = useState(false)
  const [biasScore, setBiasScore] = useState(0)
  const [biasComplete, setBiasComplete] = useState(false)

  const tabs = [
    { id: 'tracker' as const, label: '📊 収支トラッカー' },
    { id: 'expected' as const, label: '🧮 期待値計算機' },
    { id: 'sogs' as const, label: '🧠 依存度チェック' },
    { id: 'ifsaved' as const, label: '💰 もし貯金してたら' },
    { id: 'bias' as const, label: '🎯 認知バイアス診断' },
    { id: 'help' as const, label: '🏥 相談窓口' },
  ]

  // Load records from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('moneyguard-records')
      if (saved) setRecords(JSON.parse(saved))
    } catch {}
  }, [])

  // Save records
  useEffect(() => {
    if (records.length > 0) localStorage.setItem('moneyguard-records', JSON.stringify(records))
  }, [records])

  // Tracker logic
  const addRecord = useCallback(() => {
    const bet = Number(newRecord.betAmount)
    const ret = Number(newRecord.returnAmount)
    if (!bet) return
    const record: BetRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: newRecord.type,
      betAmount: bet,
      returnAmount: ret || 0,
      note: newRecord.note,
    }
    setRecords(prev => [record, ...prev])
    setNewRecord({ type: newRecord.type, betAmount: '', returnAmount: '', note: '' })
  }, [newRecord])

  const totalBet = records.reduce((s, r) => s + r.betAmount, 0)
  const totalReturn = records.reduce((s, r) => s + r.returnAmount, 0)
  const totalProfit = totalReturn - totalBet
  const winRate = records.length > 0 ? Math.round(records.filter(r => r.returnAmount > r.betAmount).length / records.length * 100) : 0

  // SOGS logic
  const calcSogs = useCallback(() => {
    let score = 0
    sogsQuestions.forEach(q => {
      if (sogsAnswers[q.id]) score += q.weight
    })
    let level = '', description = '', advice: string[] = []
    if (score <= 2) {
      level = '🟢 問題なし'; description = '現時点でギャンブルに関する問題は見られません。'
      advice = ['今の状態を維持しましょう', '予算を決めて楽しむ程度に']
    } else if (score <= 5) {
      level = '🟡 要注意'; description = 'ギャンブルとの付き合い方に少し注意が必要です。'
      advice = ['ギャンブルに使う予算の上限を決める', '負けを取り戻そうとしない', '1ヶ月の収支を記録してみる']
    } else if (score <= 10) {
      level = '🟠 危険域'; description = 'ギャンブル依存の傾向が見られます。専門家への相談をおすすめします。'
      advice = ['精神保健福祉センターに相談する', '信頼できる人に現状を話す', 'ギャンブル資金へのアクセスを制限する', 'GAのミーティングに参加してみる']
    } else {
      level = '🔴 深刻'; description = 'ギャンブル依存症の可能性が高いです。できるだけ早く専門家に相談してください。'
      advice = ['今すぐ相談ダイヤル（0120-977-556）に電話する', '精神科・心療内科を受診する', 'クレジットカードやキャッシュカードを家族に預ける', '借金がある場合は法テラス（0570-078374）に相談']
    }
    setSogsResult({ score, level, description, advice })
  }, [sogsAnswers])

  // If-saved calculation
  const monthlySaved = Number(savedInput.monthly) || 0
  const yearsSaved = Number(savedInput.years) || 0
  const totalSaved = monthlySaved * yearsSaved * 12
  const investReturn3 = Math.round(monthlySaved * 12 * yearsSaved * 1.05) // 年利5%の簡易計算
  const investReturn5 = Math.round(monthlySaved * 12 * yearsSaved * 1.07) // 年利7%

  // More accurate compound interest
  const compoundCalc = (monthly: number, years: number, rate: number) => {
    let total = 0
    const monthlyRate = rate / 12
    const months = years * 12
    for (let i = 0; i < months; i++) {
      total = (total + monthly) * (1 + monthlyRate)
    }
    return Math.round(total)
  }
  const compound5 = compoundCalc(monthlySaved, yearsSaved, 0.05)
  const compound7 = compoundCalc(monthlySaved, yearsSaved, 0.07)

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-4xl mb-2">💰</div>
          <h1 className="text-2xl font-bold">AI家計防衛シミュレーター</h1>
          <p className="text-gray-400 mt-1">収支トラッカー × 期待値計算 × 依存度チェック</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-[#0f0f1a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ─── Tracker Tab ─── */}
        {activeTab === 'tracker' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">📊 ギャンブル収支トラッカー</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">累計投入</div>
                <div className="text-xl font-bold text-amber-400">¥{totalBet.toLocaleString()}</div>
              </div>
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">累計回収</div>
                <div className="text-xl font-bold text-blue-400">¥{totalReturn.toLocaleString()}</div>
              </div>
              <div className={`bg-[#13131e] rounded-xl border p-4 text-center ${totalProfit >= 0 ? 'border-green-500/30' : 'border-red-500/30'}`}>
                <div className="text-xs text-gray-500 mb-1">累計損益</div>
                <div className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalProfit >= 0 ? '+' : ''}¥{totalProfit.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">勝率</div>
                <div className="text-xl font-bold text-gray-300">{winRate}%</div>
              </div>
            </div>

            {/* Add Record */}
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <h3 className="font-bold mb-4">📝 記録を追加</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">種類</label>
                  <select value={newRecord.type} onChange={e => setNewRecord(r => ({ ...r, type: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
                    {gamblingTypes.map(g => <option key={g.name}>{g.icon} {g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">賭けた額</label>
                  <input type="number" placeholder="10000" value={newRecord.betAmount} onChange={e => setNewRecord(r => ({ ...r, betAmount: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">戻ってきた額</label>
                  <input type="number" placeholder="0" value={newRecord.returnAmount} onChange={e => setNewRecord(r => ({ ...r, returnAmount: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div className="flex items-end">
                  <button onClick={addRecord} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors">追加</button>
                </div>
              </div>
            </div>

            {/* Records */}
            {records.length > 0 && (
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                <h3 className="font-bold mb-4">📋 記録一覧（直近20件）</h3>
                <div className="space-y-2">
                  {records.slice(0, 20).map(r => (
                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{r.date}</span>
                        <span>{r.type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-amber-400">-¥{r.betAmount.toLocaleString()}</span>
                        <span className="text-blue-400">+¥{r.returnAmount.toLocaleString()}</span>
                        <span className={`font-bold ${r.returnAmount - r.betAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {r.returnAmount - r.betAmount >= 0 ? '+' : ''}¥{(r.returnAmount - r.betAmount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Expected Value Tab ─── */}
        {activeTab === 'expected' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">🧮 期待値計算機</h2>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
              ⚠️ 期待値とは「大量に繰り返したとき、平均的にいくら戻ってくるか」の数学的な値です。<br />
              還元率が100%未満 = 長期的には必ず負けることを意味します。
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gamblingTypes.map(g => {
                const loss = Math.round((1 - g.returnRate) * 10000)
                return (
                  <div key={g.name} className={`bg-[#13131e] rounded-xl border p-5 ${g.returnRate < 0.6 ? 'border-red-500/30' : g.returnRate < 0.8 ? 'border-amber-500/30' : 'border-gray-700'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{g.icon}</span>
                      <h3 className="font-bold">{g.name}</h3>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>還元率</span>
                        <span>{(g.returnRate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-3">
                        <div className={`h-3 rounded-full ${g.returnRate >= 0.9 ? 'bg-green-500' : g.returnRate >= 0.75 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${g.returnRate * 100}%` }} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      10,000円賭けると → 平均 <span className="text-white font-bold">¥{Math.round(g.returnRate * 10000).toLocaleString()}</span> 戻る
                    </p>
                    <p className="text-xs text-red-400 mt-1">
                      → 毎回 <span className="font-bold">¥{loss.toLocaleString()}</span> ずつ失う計算
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ─── SOGS Tab ─── */}
        {activeTab === 'sogs' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">🧠 ギャンブル依存度セルフチェック</h2>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">
              ℹ️ SOGS（South Oaks Gambling Screen）を参考にしたスクリーニングテストです。医学的な診断ではありません。結果に不安がある場合は専門機関にご相談ください。
            </div>

            {!sogsResult ? (
              <>
                <div className="space-y-3">
                  {sogsQuestions.map(q => (
                    <div key={q.id}
                      onClick={() => setSogsAnswers(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        sogsAnswers[q.id] ? 'bg-red-500/10 border-red-500/30' : 'bg-[#13131e] border-gray-800 hover:border-gray-600'
                      }`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${sogsAnswers[q.id] ? 'bg-red-500 border-red-500' : 'border-gray-600'}`}>
                        {sogsAnswers[q.id] && <span className="text-xs text-white">✓</span>}
                      </div>
                      <span className="text-sm">{q.text}</span>
                    </div>
                  ))}
                </div>
                <button onClick={calcSogs} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors">
                  診断結果を見る（{Object.values(sogsAnswers).filter(Boolean).length}問に「はい」）
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className={`bg-[#13131e] rounded-xl border p-8 text-center ${
                  sogsResult.score <= 2 ? 'border-green-500/30' : sogsResult.score <= 5 ? 'border-yellow-500/30' : sogsResult.score <= 10 ? 'border-orange-500/30' : 'border-red-500/30'
                }`}>
                  <div className="text-4xl font-bold mb-2">{sogsResult.level}</div>
                  <div className="text-lg text-gray-400 mb-2">スコア: {sogsResult.score}点</div>
                  <p className="text-sm text-gray-400">{sogsResult.description}</p>
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-3">💡 アドバイス</h3>
                  <ul className="space-y-2">
                    {sogsResult.advice.map((a, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-emerald-400 flex-shrink-0">→</span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => { setSogsResult(null); setSogsAnswers({}) }} className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors">もう一度チェック</button>
              </div>
            )}
          </div>
        )}

        {/* ─── If Saved Tab ─── */}
        {activeTab === 'ifsaved' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">💰 「もし貯金してたら」シミュレーター</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">月々のギャンブル支出額</label>
                  <input type="number" placeholder="50000" value={savedInput.monthly} onChange={e => setSavedInput(s => ({ ...s, monthly: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">期間（年）</label>
                  <input type="number" placeholder="5" value={savedInput.years} onChange={e => setSavedInput(s => ({ ...s, years: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
                </div>
              </div>
            </div>

            {monthlySaved > 0 && yearsSaved > 0 && (
              <div className="space-y-4">
                <div className="bg-red-500/10 rounded-xl border border-red-500/30 p-6 text-center">
                  <div className="text-sm text-gray-400 mb-1">ギャンブルに使った総額（推定）</div>
                  <div className="text-5xl font-bold text-red-400">¥{totalSaved.toLocaleString()}</div>
                  <div className="text-sm text-gray-500 mt-2">月{monthlySaved.toLocaleString()}円 × {yearsSaved}年 = {yearsSaved * 12}ヶ月分</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#13131e] rounded-xl border border-green-500/30 p-5 text-center">
                    <div className="text-sm text-gray-400 mb-1">🏦 普通に貯金してたら</div>
                    <div className="text-3xl font-bold text-green-400">¥{totalSaved.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">金利0%でも確実にこの金額</div>
                  </div>
                  <div className="bg-[#13131e] rounded-xl border border-emerald-500/30 p-5 text-center">
                    <div className="text-sm text-gray-400 mb-1">📈 年利5%で運用してたら</div>
                    <div className="text-3xl font-bold text-emerald-400">¥{compound5.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">+¥{(compound5 - totalSaved).toLocaleString()} の運用益</div>
                  </div>
                  <div className="bg-[#13131e] rounded-xl border border-cyan-500/30 p-5 text-center">
                    <div className="text-sm text-gray-400 mb-1">🚀 年利7%で運用してたら</div>
                    <div className="text-3xl font-bold text-cyan-400">¥{compound7.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">+¥{(compound7 - totalSaved).toLocaleString()} の運用益</div>
                  </div>
                </div>

                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-3">💡 このお金があれば…</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                    {totalSaved >= 300000 && <div>🍽️ 高級レストラン {Math.floor(totalSaved / 30000)}回分</div>}
                    {totalSaved >= 500000 && <div>✈️ 海外旅行 {Math.floor(totalSaved / 200000)}回分</div>}
                    {totalSaved >= 1000000 && <div>🚗 新車の頭金になる額</div>}
                    {totalSaved >= 2000000 && <div>🏠 マンション頭金の一部</div>}
                    {totalSaved >= 3000000 && <div>💍 結婚資金に十分な額</div>}
                    {totalSaved >= 5000000 && <div>🎓 子供の大学費用をカバー</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Bias Tab ─── */}
        {activeTab === 'bias' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">🎯 認知バイアス診断</h2>
            {!biasComplete ? (
              <>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>問題 {biasIndex + 1} / {biasQuizzes.length}</span>
                  <span>正解: {biasScore}/{biasIndex + (biasAnswered ? 1 : 0)}</span>
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <div className="text-xs text-amber-400 font-bold mb-2">📌 {biasQuizzes[biasIndex].name}</div>
                  <p className="text-lg mb-6">{biasQuizzes[biasIndex].scenario}</p>
                  {!biasAnswered ? (
                    <div className="space-y-3">
                      {biasQuizzes[biasIndex].options.map((opt, i) => (
                        <button key={i} onClick={() => {
                          setBiasAnswered(true)
                          if (!opt.isBias) setBiasScore(s => s + 1)
                        }} className="w-full text-left p-4 bg-[#1a1a2e] hover:bg-[#252540] border border-gray-700 rounded-xl text-sm transition-colors">
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {biasQuizzes[biasIndex].options.map((opt, i) => (
                        <div key={i} className={`p-4 rounded-xl text-sm border ${opt.isBias ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                          <p className="font-bold">{opt.isBias ? '❌ バイアスあり' : '✅ 合理的な判断'}</p>
                          <p className="text-gray-400 mt-1">{opt.explanation}</p>
                        </div>
                      ))}
                      <button onClick={() => {
                        if (biasIndex + 1 >= biasQuizzes.length) { setBiasComplete(true) }
                        else { setBiasIndex(i => i + 1); setBiasAnswered(false) }
                      }} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors">
                        {biasIndex + 1 >= biasQuizzes.length ? '結果を見る' : '次の問題 →'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-[#13131e] rounded-xl border border-emerald-500/30 p-8 text-center">
                <div className="text-6xl mb-4">{biasScore >= 5 ? '🏆' : biasScore >= 3 ? '👍' : '📚'}</div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">{biasScore} / {biasQuizzes.length}</div>
                <p className="text-gray-400 mb-6">
                  {biasScore >= 5 ? '素晴らしい！認知バイアスを理解しています。' :
                   biasScore >= 3 ? 'まずまず。引っかかったバイアスを復習しましょう。' :
                   '認知バイアスに要注意！ギャンブルで「直感」を信じるのは危険です。'}
                </p>
                <button onClick={() => { setBiasIndex(0); setBiasScore(0); setBiasAnswered(false); setBiasComplete(false) }}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold transition-colors">もう一度挑戦</button>
              </div>
            )}
          </div>
        )}

        {/* ─── Help Tab ─── */}
        {activeTab === 'help' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">🏥 相談窓口ガイド</h2>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-sm text-emerald-300">
              💡 相談は無料・秘密厳守です。「相談するほどではない」と思っても、話を聞いてもらうだけで気持ちが楽になることがあります。
            </div>
            <div className="space-y-4">
              {consultationGuide.map((c, i) => (
                <div key={i} className="bg-[#13131e] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{c.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{c.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{c.desc}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        {c.phone.startsWith('http') ? (
                          <a href={c.phone} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300">🔗 {c.phone}</a>
                        ) : (
                          <span className="text-lg font-bold text-emerald-400">📞 {c.phone}</span>
                        )}
                        <span className="text-sm text-gray-500">🕐 {c.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
