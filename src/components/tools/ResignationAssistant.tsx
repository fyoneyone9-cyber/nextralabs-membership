'use client'

import { useState, useCallback } from 'react'

// Types
interface EmployeeInfo {
  companyName: string
  employeeType: '正社員' | '契約社員' | 'パート・アルバイト'
  startDate: string
  resignDate: string
  reason: '一身上の都合' | '会社都合' | '契約期間満了' | 'その他'
  customReason: string
  fullName: string
  department: string
  monthlySalary: number
  monthlyOvertimeHours: number
  unpaidMonths: number
  paidLeaveDays: number
}

interface CheckItem {
  id: string
  label: string
  category: string
  description: string
  done: boolean
  dueOffset: number // days before resign date
}

interface AgencyInfo {
  name: string
  type: '弁護士型' | '労働組合型' | '民間型'
  price: string
  features: string[]
  risks: string
  recommendation: string
}

const defaultInfo: EmployeeInfo = {
  companyName: '',
  employeeType: '正社員',
  startDate: '',
  resignDate: '',
  reason: '一身上の都合',
  customReason: '',
  fullName: '',
  department: '',
  monthlySalary: 0,
  monthlyOvertimeHours: 0,
  unpaidMonths: 0,
  paidLeaveDays: 0,
}

const defaultChecklist: CheckItem[] = [
  { id: 'c1', label: '退職届・退職願の作成', category: '書類準備', description: '本ツールで自動生成できます', done: false, dueOffset: 30 },
  { id: 'c2', label: '上司への退職意思の伝達', category: '報告', description: '退職届提出の2週間〜1ヶ月前に口頭で伝えるのがマナー', done: false, dueOffset: 45 },
  { id: 'c3', label: '退職届の提出', category: '書類準備', description: '法律上は2週間前までに提出すれば退職可能（民法627条）', done: false, dueOffset: 14 },
  { id: 'c4', label: '有給休暇の残日数確認', category: '権利確認', description: '退職日までに消化するか、買取交渉をする', done: false, dueOffset: 30 },
  { id: 'c5', label: '引継ぎ資料の作成', category: '引継ぎ', description: '担当業務の一覧、手順書、連絡先リスト等', done: false, dueOffset: 21 },
  { id: 'c6', label: '私物の整理・持ち帰り', category: '退職準備', description: '少しずつ持ち帰る。最終日にまとめると目立つ', done: false, dueOffset: 14 },
  { id: 'c7', label: '健康保険の切替手続き', category: '社会保険', description: '国民健康保険 or 任意継続（退職後20日以内に手続き）', done: false, dueOffset: 0 },
  { id: 'c8', label: '国民年金への切替', category: '社会保険', description: '退職後14日以内に市区町村役場で手続き', done: false, dueOffset: 0 },
  { id: 'c9', label: '離職票の受取', category: '退職後', description: '会社から届くのを確認（届かない場合はハローワークに相談）', done: false, dueOffset: -10 },
  { id: 'c10', label: '失業保険の申請', category: '退職後', description: '離職票を持ってハローワークへ（退職後早めに）', done: false, dueOffset: -14 },
  { id: 'c11', label: '源泉徴収票の受取', category: '退職後', description: '年末調整 or 確定申告に必要', done: false, dueOffset: -30 },
  { id: 'c12', label: '退職金の確認', category: '権利確認', description: '就業規則で退職金規定を確認。支給時期も要チェック', done: false, dueOffset: 14 },
  { id: 'c13', label: '競業避止義務の確認', category: '権利確認', description: '誓約書に署名した場合でも、不当に広い範囲は無効の可能性あり', done: false, dueOffset: 14 },
  { id: 'c14', label: '住民税の支払い方法確認', category: '税金', description: '退職月によって一括徴収 or 普通徴収に切替', done: false, dueOffset: 7 },
]

const agencies: AgencyInfo[] = [
  {
    name: '弁護士法人みやび etc.',
    type: '弁護士型',
    price: '¥50,000〜¥100,000',
    features: ['未払い残業代の交渉・請求が可能', '損害賠償請求にも対応', '法的トラブルに全面対応', '有給消化の交渉'],
    risks: '費用が高い',
    recommendation: '未払い残業代がある方、パワハラ等で揉めそうな方',
  },
  {
    name: '退職代行SARABA etc.',
    type: '労働組合型',
    price: '¥24,000〜¥30,000',
    features: ['団体交渉権あり（法的に保護）', '有給消化の交渉可能', '退職条件の交渉可能', '比較的安価'],
    risks: '訴訟対応はできない',
    recommendation: '有給消化・退職条件の交渉が必要な方',
  },
  {
    name: 'EXIT, モームリ etc.',
    type: '民間型',
    price: '¥10,000〜¥20,000',
    features: ['最安値クラス', '対応スピードが早い', '手続きがシンプル'],
    risks: '交渉権なし（伝達のみ）。会社が拒否した場合の対応力に限界',
    recommendation: '円満退職で、ただ伝えてほしいだけの方',
  },
]

// Utility
function formatDate(dateStr: string): string {
  if (!dateStr) return '____年__月__日'
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const reiwa = year - 2018
  return `令和${reiwa}年${d.getMonth() + 1}月${d.getDate()}日`
}

function calcOvertimePay(salary: number, overtimeHours: number, months: number): { total: number; hourly: number; details: string } {
  if (!salary || !overtimeHours || !months) return { total: 0, hourly: 0, details: '' }
  // 月給 ÷ 所定労働時間(160h) × 1.25 × 残業時間 × 月数
  const hourly = Math.round(salary / 160)
  const overtimeRate = Math.round(hourly * 1.25)
  const total = overtimeRate * overtimeHours * months
  const details = `時給相当: ¥${hourly.toLocaleString()} × 割増率1.25 = ¥${overtimeRate.toLocaleString()}/h × ${overtimeHours}h × ${months}ヶ月`
  return { total, hourly, details }
}

export default function ResignationAssistant() {
  const [activeTab, setActiveTab] = useState<'letter' | 'overtime' | 'checklist' | 'agencies' | 'rights'>('letter')
  const [info, setInfo] = useState<EmployeeInfo>(defaultInfo)
  const [checklist, setChecklist] = useState<CheckItem[]>(defaultChecklist)
  const [showPreview, setShowPreview] = useState(false)
  const [rightsQuery, setRightsQuery] = useState('')
  const [rightsAnswer, setRightsAnswer] = useState('')

  const tabs = [
    { id: 'letter' as const, label: '📝 退職届生成', icon: '📝' },
    { id: 'overtime' as const, label: '💰 残業代計算', icon: '💰' },
    { id: 'checklist' as const, label: '✅ チェックリスト', icon: '✅' },
    { id: 'agencies' as const, label: '⚖️ 退職代行比較', icon: '⚖️' },
    { id: 'rights' as const, label: '🛡️ 権利Q&A', icon: '🛡️' },
  ]

  const updateInfo = useCallback((key: keyof EmployeeInfo, value: string | number) => {
    setInfo(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleCheck = useCallback((id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item))
  }, [])

  const overtimeResult = calcOvertimePay(info.monthlySalary, info.monthlyOvertimeHours, info.unpaidMonths)
  const completedChecks = checklist.filter(c => c.done).length
  const totalChecks = checklist.length

  // Generate resignation letter text
  const generateLetter = () => {
    const type = info.reason === '一身上の都合' || info.reason === 'その他' ? '退職届' : '退職届'
    const reasonText = info.reason === 'その他' ? info.customReason : info.reason
    return {
      type,
      date: formatDate(info.resignDate),
      today: formatDate(new Date().toISOString().split('T')[0]),
      company: info.companyName || '○○○株式会社',
      name: info.fullName || '○○ ○○',
      department: info.department || '○○部',
      reason: reasonText || '一身上の都合',
    }
  }

  const letter = generateLetter()

  // Rights Q&A
  const rightsDatabase: Record<string, string> = {
    '有給': `【有給休暇について】\n退職時の有給消化は労働者の権利です（労働基準法39条）。会社は時季変更権を行使できますが、退職日以降に変更する日がないため、実質的に拒否できません。\n\n残日数の計算：入社6ヶ月後に10日付与、以後1年ごとに増加（最大20日/年）。\n\n⚠️ 有給買取は法的義務ではありません（任意）。`,
    '退職金': `【退職金について】\n退職金は法律上の義務ではなく、就業規則や退職金規程に基づきます。\n\n確認すべき点：\n・就業規則に退職金規定があるか\n・勤続年数の条件を満たしているか\n・自己都合退職の場合の減額率\n・支給時期（退職後1〜2ヶ月が一般的）\n\n⚠️ 規定があるのに支払われない場合は労基署に相談。`,
    '競業避止': `【競業避止義務について】\n退職後の競業避止義務（同業他社への転職制限）は、以下の条件を満たさないと無効とされる判例が多いです：\n\n・制限期間が合理的（1〜2年程度）\n・地域的制限が合理的\n・代償措置がある（退職金の上乗せ等）\n・制限される業務範囲が明確\n\n⚠️ 不当に広い範囲の誓約書は無効の可能性大。弁護士に相談を推奨。`,
    '残業代': `【未払い残業代について】\n時効は3年（2020年4月以降の分）。それ以前は2年。\n\n請求に必要なもの：\n・タイムカード/勤怠記録のコピー\n・給与明細\n・雇用契約書\n・就業規則\n\nまず本ツールの残業代シミュレーターで概算を確認し、正確な金額は弁護士に相談してください。`,
    '失業保険': `【失業保険について】\n・自己都合退職：待機期間7日 + 給付制限2ヶ月後から支給\n・会社都合退職：待機期間7日後から支給\n\n受給条件：退職前2年間に12ヶ月以上の被保険者期間\n\n手続き：離職票を持ってハローワークへ。\n⚠️ 退職後すぐに手続きしないと受給開始が遅れます。`,
    '2週間': `【2週間前の退職について】\n民法627条により、期間の定めのない雇用契約（正社員等）は、退職の意思表示から2週間で退職が成立します。\n\n就業規則で「1ヶ月前」等と定めていても、民法が優先されます。\n\n⚠️ ただし、円満退職のためには就業規則に従うのがベター。\n⚠️ 契約社員の場合はこの規定は適用されません。`,
  }

  const handleRightsQuery = () => {
    if (!rightsQuery.trim()) return
    const query = rightsQuery.toLowerCase()
    let answer = ''
    for (const [key, value] of Object.entries(rightsDatabase)) {
      if (query.includes(key.toLowerCase()) || query.includes(key)) {
        answer = value
        break
      }
    }
    if (!answer) {
      answer = `申し訳ありません。「${rightsQuery}」に関する情報は現在のデータベースにありません。\n\n以下のキーワードで検索できます：\n・有給\n・退職金\n・競業避止\n・残業代\n・失業保険\n・2週間\n\n具体的な法律相談は弁護士や社労士にご相談ください。`
    }
    setRightsAnswer(answer)
  }

  // Copy letter to clipboard
  const copyLetter = () => {
    const text = `${letter.today}\n\n${letter.company}\n代表取締役社長 殿\n\n${letter.type}\n\nこのたび、${letter.reason}により、${letter.date}をもって退職いたしたく、ここにお届けいたします。\n\n${letter.today}\n${letter.department}\n${letter.name}`
    navigator.clipboard.writeText(text)
    alert('退職届をクリップボードにコピーしました')
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-4xl mb-2">📝</div>
          <h1 className="text-2xl font-bold">退職あんしんAI</h1>
          <p className="text-gray-400 mt-1">退職届生成 × 残業代計算 × 完全チェックリスト</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-[#0f0f1a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Tab: Letter */}
        {activeTab === 'letter' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold">退職届テンプレート生成</h2>
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">氏名</label>
                  <input
                    type="text" placeholder="米山 文貴"
                    value={info.fullName} onChange={e => updateInfo('fullName', e.target.value)}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">会社名</label>
                  <input
                    type="text" placeholder="株式会社○○○"
                    value={info.companyName} onChange={e => updateInfo('companyName', e.target.value)}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">所属部署</label>
                  <input
                    type="text" placeholder="営業部"
                    value={info.department} onChange={e => updateInfo('department', e.target.value)}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">雇用形態</label>
                    <select
                      value={info.employeeType} onChange={e => updateInfo('employeeType', e.target.value)}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option>正社員</option>
                      <option>契約社員</option>
                      <option>パート・アルバイト</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">退職理由</label>
                    <select
                      value={info.reason} onChange={e => updateInfo('reason', e.target.value)}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option>一身上の都合</option>
                      <option>会社都合</option>
                      <option>契約期間満了</option>
                      <option>その他</option>
                    </select>
                  </div>
                </div>
                {info.reason === 'その他' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">退職理由（詳細）</label>
                    <input
                      type="text" placeholder="具体的な理由を入力"
                      value={info.customReason} onChange={e => updateInfo('customReason', e.target.value)}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">入社日</label>
                    <input
                      type="date" value={info.startDate} onChange={e => updateInfo('startDate', e.target.value)}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">退職希望日</label>
                    <input
                      type="date" value={info.resignDate} onChange={e => updateInfo('resignDate', e.target.value)}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">プレビュー</h2>
                <button
                  onClick={copyLetter}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  📋 コピー
                </button>
              </div>
              <div className="bg-white text-gray-900 rounded-xl p-8 shadow-xl font-serif leading-loose min-h-[500px]">
                <p className="text-right mb-8">{letter.today}</p>
                <p className="mb-1">{letter.company}</p>
                <p className="mb-8">代表取締役社長 殿</p>
                <h2 className="text-center text-2xl font-bold mb-8 tracking-[0.5em]">{letter.type}</h2>
                <p className="text-base leading-8 mb-8">
                  このたび、{letter.reason}により、{letter.date}をもって退職いたしたく、ここにお届けいたします。
                </p>
                <div className="text-right mt-12 space-y-1">
                  <p>{letter.today}</p>
                  <p>{letter.department}</p>
                  <p className="text-lg font-medium">{letter.name}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Overtime */}
        {activeTab === 'overtime' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-xl font-bold">💰 未払い残業代シミュレーター</h2>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
              ⚠️ この計算結果はあくまで概算です。正確な金額は社労士・弁護士にご確認ください。時効は3年（2020年4月以降）です。
            </div>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">月給（額面）</label>
                  <input
                    type="number" placeholder="250000"
                    value={info.monthlySalary || ''} onChange={e => updateInfo('monthlySalary', Number(e.target.value))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">月平均残業時間</label>
                  <input
                    type="number" placeholder="30"
                    value={info.monthlyOvertimeHours || ''} onChange={e => updateInfo('monthlyOvertimeHours', Number(e.target.value))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">未払い月数</label>
                  <input
                    type="number" placeholder="12"
                    value={info.unpaidMonths || ''} onChange={e => updateInfo('unpaidMonths', Number(e.target.value))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {overtimeResult.total > 0 && (
              <div className="bg-[#13131e] rounded-xl border border-green-500/30 p-6">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-400 mb-1">概算 未払い残業代</div>
                  <div className="text-5xl font-bold text-green-400">¥{overtimeResult.total.toLocaleString()}</div>
                </div>
                <div className="text-sm text-gray-400 bg-[#1a1a2e] rounded-lg p-4 font-mono">
                  <p>計算式:</p>
                  <p>{overtimeResult.details}</p>
                  <p className="mt-2 text-xs text-gray-500">※ 所定労働時間を160h/月として計算。深夜残業(50%)・休日残業(35%)は含まれていません。</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Checklist */}
        {activeTab === 'checklist' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">✅ 退職完全チェックリスト</h2>
              <span className="text-sm text-gray-400">
                {completedChecks}/{totalChecks} 完了
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedChecks / totalChecks) * 100}%` }}
              />
            </div>

            {['書類準備', '報告', '権利確認', '引継ぎ', '退職準備', '社会保険', '税金', '退職後'].map(category => {
              const items = checklist.filter(c => c.category === category)
              if (items.length === 0) return null
              return (
                <div key={category}>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{category}</h3>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          item.done
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-[#13131e] border-gray-800 hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          item.done ? 'bg-green-500 border-green-500' : 'border-gray-600'
                        }`}>
                          {item.done && <span className="text-xs text-white">✓</span>}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${item.done ? 'line-through text-gray-500' : ''}`}>
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Tab: Agencies */}
        {activeTab === 'agencies' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-xl font-bold">⚖️ 退職代行サービス比較</h2>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
              ⚠️ 以下は一般的な情報です。料金・サービス内容は変更される場合があります。最新情報は各サービスの公式サイトでご確認ください。
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agencies.map((agency, i) => (
                <div key={i} className={`bg-[#13131e] rounded-xl border p-6 ${
                  agency.type === '弁護士型' ? 'border-red-500/30' :
                  agency.type === '労働組合型' ? 'border-blue-500/30' :
                  'border-gray-700'
                }`}>
                  <div className={`text-xs font-bold px-2 py-1 rounded inline-block mb-3 ${
                    agency.type === '弁護士型' ? 'bg-red-500/20 text-red-400' :
                    agency.type === '労働組合型' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {agency.type}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{agency.name}</h3>
                  <p className="text-2xl font-bold text-green-400 mb-4">{agency.price}</p>
                  <ul className="space-y-2 mb-4">
                    {agency.features.map((f, j) => (
                      <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-green-400 flex-shrink-0">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs text-red-400 mb-3">⚠️ {agency.risks}</div>
                  <div className="text-xs text-gray-500 bg-[#1a1a2e] rounded-lg p-3">
                    💡 おすすめ: {agency.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Rights */}
        {activeTab === 'rights' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">🛡️ 退職時の権利Q&A</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <label className="block text-sm text-gray-400 mb-2">気になるキーワードを入力してください</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="有給、退職金、競業避止、残業代、失業保険、2週間..."
                  value={rightsQuery}
                  onChange={e => setRightsQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRightsQuery()}
                  className="flex-1 bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleRightsQuery}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  検索
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['有給', '退職金', '競業避止', '残業代', '失業保険', '2週間'].map(keyword => (
                  <button
                    key={keyword}
                    onClick={() => { setRightsQuery(keyword); setTimeout(() => { setRightsQuery(keyword); handleRightsQuery() }, 0) }}
                    className="px-3 py-1 bg-[#1a1a2e] border border-gray-700 rounded-full text-xs text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
            {rightsAnswer && (
              <div className="bg-[#13131e] rounded-xl border border-blue-500/30 p-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">{rightsAnswer}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
