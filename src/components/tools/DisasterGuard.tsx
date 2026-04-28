'use client'

import { useState, useEffect, useCallback } from 'react'

// ==================== TYPES ====================
type Tab = 'map' | 'family' | 'checklist' | 'weather' | 'emergency' | 'quiz'

interface Shelter {
  name: string
  address: string
  types: string[]
  lat: number
  lng: number
  distance?: number
}

interface FamilyMember {
  id: string
  name: string
  location: string
  locationLat?: number
  locationLng?: number
  nearestShelter?: string
  notes: string
}

interface CheckItem {
  id: string
  category: string
  text: string
  checked: boolean
}

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface WeatherAlert {
  title: string
  area: string
  severity: string
  status: string
  description: string
}

// ==================== CONSTANTS ====================
const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'map', icon: '🗺️', label: '避難マップ' },
  { id: 'family', icon: '👨‍👩‍👧', label: '家族プラン' },
  { id: 'checklist', icon: '📋', label: 'チェックリスト' },
  { id: 'weather', icon: '⚠️', label: '気象警報' },
  { id: 'emergency', icon: '🆘', label: '緊急連絡' },
  { id: 'quiz', icon: '📖', label: '防災クイズ' },
]

const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
  '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
  '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
  '熊本県','大分県','宮崎県','鹿児島県','沖縄県'
]

// Sample shelters (Kanagawa / Ebina area + major ones)
const SAMPLE_SHELTERS: Shelter[] = [
  { name: '海老名市立海老名小学校', address: '神奈川県海老名市国分南1-1-1', types: ['地震','洪水'], lat: 35.4455, lng: 139.3906 },
  { name: '海老名市立有馬中学校', address: '神奈川県海老名市中新田1-1-1', types: ['地震','洪水','土砂'], lat: 35.4522, lng: 139.3811 },
  { name: '海老名市文化会館', address: '神奈川県海老名市めぐみ町6-1', types: ['地震'], lat: 35.4513, lng: 139.3925 },
  { name: '海老名運動公園', address: '神奈川県海老名市社家4032-1', types: ['地震','広域避難'], lat: 35.4395, lng: 139.3730 },
  { name: '海老名市立柏ケ谷小学校', address: '神奈川県海老名市柏ケ谷573', types: ['地震','洪水'], lat: 35.4578, lng: 139.4001 },
  { name: '海老名市総合福祉会館', address: '神奈川県海老名市さつき町41-1', types: ['地震','福祉避難所'], lat: 35.4468, lng: 139.3888 },
  { name: '海老名市立大谷小学校', address: '神奈川県海老名市大谷南2-1-1', types: ['地震','洪水'], lat: 35.4345, lng: 139.3850 },
  { name: '海老名中央公園', address: '神奈川県海老名市中央1-1', types: ['広域避難','地震'], lat: 35.4480, lng: 139.3920 },
  { name: 'ViNA GARDENS（ビナガーデンズ）', address: '神奈川県海老名市めぐみ町3-1', types: ['一時避難'], lat: 35.4500, lng: 139.3930 },
  { name: '海老名市立海老名中学校', address: '神奈川県海老名市国分南3-1-1', types: ['地震','洪水'], lat: 35.4430, lng: 139.3880 },
]

const DEFAULT_CHECKLIST: Omit<CheckItem, 'checked'>[] = [
  { id: 'w1', category: '水・食料', text: '飲料水（1人1日3L × 3日分）' },
  { id: 'w2', category: '水・食料', text: '非常食（缶詰、レトルト、乾パン等）3日分' },
  { id: 'w3', category: '水・食料', text: '給水用ポリタンク' },
  { id: 'm1', category: '医療・衛生', text: '常備薬・処方薬（1週間分）' },
  { id: 'm2', category: '医療・衛生', text: '救急セット（絆創膏、消毒液、包帯）' },
  { id: 'm3', category: '医療・衛生', text: '簡易トイレ（1人1日5回 × 3日分）' },
  { id: 'm4', category: '医療・衛生', text: 'マスク・ウェットティッシュ' },
  { id: 't1', category: '情報・連絡', text: 'モバイルバッテリー（満充電）' },
  { id: 't2', category: '情報・連絡', text: '携帯ラジオ（電池式 or 手回し）' },
  { id: 't3', category: '情報・連絡', text: '家族の連絡先メモ（紙）' },
  { id: 't4', category: '情報・連絡', text: '災害伝言ダイヤル(171)の使い方確認' },
  { id: 'g1', category: '生活用品', text: '懐中電灯・ランタン' },
  { id: 'g2', category: '生活用品', text: '毛布・寝袋・アルミブランケット' },
  { id: 'g3', category: '生活用品', text: '雨具（レインコート）' },
  { id: 'g4', category: '生活用品', text: '軍手・スリッパ' },
  { id: 'g5', category: '生活用品', text: '現金（小銭含む）' },
  { id: 'd1', category: '書類', text: '身分証明書のコピー' },
  { id: 'd2', category: '書類', text: '保険証のコピー' },
  { id: 'd3', category: '書類', text: '通帳・カード番号のメモ' },
  { id: 'p1', category: 'ペット', text: 'ペットフード（3日分）' },
  { id: 'p2', category: 'ペット', text: 'ペット用キャリーケース' },
]

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: '地震発生時、まず最初にすべきことは？',
    options: ['火を消す', '机の下に隠れる', '外に逃げる', '非常食を取りに行く'],
    correct: 1,
    explanation: 'まずは身の安全を確保。揺れが収まるまで机の下など丈夫なものの近くに避難しましょう。火の始末は揺れが収まってから。',
  },
  {
    question: '津波警報が出た時、どこに避難すべき？',
    options: ['海岸近くの頑丈なビル', 'できるだけ高い場所・高台', '地下室', '自宅の2階'],
    correct: 1,
    explanation: '津波からの避難は「より高く、より遠く」が原則。海岸から離れた高台を目指しましょう。近くに高台がない場合は、鉄筋コンクリートの3階以上に。',
  },
  {
    question: '洪水で車が水没。水深何cmで車のドアが開かなくなる？',
    options: ['10cm', '30cm', '50cm', '100cm'],
    correct: 1,
    explanation: '水深30cm程度でドアが開きにくくなります。水深50cmを超えるとエンジンが停止し、車内に閉じ込められる危険があります。早めの避難を。',
  },
  {
    question: '災害伝言ダイヤルの番号は？',
    options: ['110', '119', '171', '188'],
    correct: 2,
    explanation: '171（いない）で覚えましょう。伝言の録音は「171 → 1 → 自宅の電話番号」、再生は「171 → 2 → 相手の電話番号」です。',
  },
  {
    question: '火災時、煙の中を移動する正しい姿勢は？',
    options: ['立って走る', '中腰で歩く', '姿勢を低くして這う', '後ろ向きに進む'],
    correct: 2,
    explanation: '煙は上に溜まるため、できるだけ姿勢を低くして床近くの空気を吸いながら移動します。濡れタオルで口鼻を覆うとさらに効果的。',
  },
  {
    question: '非常用持ち出し袋の重さの目安は？',
    options: ['体重の5%以下', '体重の10%以下', '体重の15%以下', '体重の20%以下'],
    correct: 2,
    explanation: '体重の15%以下が目安です。重すぎると避難の妨げになります。男性で10-15kg、女性で5-10kg程度を目安に。',
  },
  {
    question: '地震の時、エレベーターに乗っていたらどうすべき？',
    options: ['非常ボタンを押す', '全階のボタンを押す', '扉をこじ開ける', 'じっと待つ'],
    correct: 1,
    explanation: '全階のボタンを押し、最初に停止した階で降りましょう。閉じ込められた場合は非常ボタンやインターホンで連絡を。自力でこじ開けるのは危険です。',
  },
  {
    question: '台風接近時、窓ガラスの飛散防止に最も効果的なのは？',
    options: ['カーテンを閉める', '養生テープを貼る', '雨戸やシャッターを閉める', '窓を少し開ける'],
    correct: 2,
    explanation: '雨戸やシャッターが最も効果的です。ない場合は飛散防止フィルムやダンボールで内側から補強。養生テープだけでは飛散防止効果は限定的です。',
  },
  {
    question: '避難所に持っていくべきものとして不適切なのは？',
    options: ['スリッパ', '現金（小銭）', '大量の着替え（スーツケース）', 'モバイルバッテリー'],
    correct: 2,
    explanation: '避難所のスペースは限られています。最低限の着替え（1-2組）にとどめ、大きな荷物は避けましょう。',
  },
  {
    question: '「特別警報」が発表された時の行動は？',
    options: ['通常通り行動する', '情報収集して備える', '直ちに命を守る行動を取る', '会社に相談する'],
    correct: 2,
    explanation: '特別警報は「数十年に一度の重大な危険」を示します。ためらわず直ちに命を守る行動を取ってください。',
  },
]

// ==================== HELPERS ====================
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ==================== COMPONENT ====================
export function DisasterGuard() {
  const [tab, setTab] = useState<Tab>('map')
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState('')
  const [shelters, setShelters] = useState<Shelter[]>(SAMPLE_SHELTERS)
  const [filterType, setFilterType] = useState('すべて')
  const [family, setFamily] = useState<FamilyMember[]>([])
  const [showFamilyForm, setShowFamilyForm] = useState(false)
  const [familyForm, setFamilyForm] = useState({ name: '', location: '', notes: '' })
  const [checklist, setChecklist] = useState<CheckItem[]>([])
  const [prefecture, setPrefecture] = useState('神奈川県')
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([])
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null)
  const [quizDone, setQuizDone] = useState(false)
  const [meetingPoint, setMeetingPoint] = useState('')

  // Load from localStorage
  useEffect(() => {
    try {
      const savedFamily = localStorage.getItem('disaster-guard-family')
      if (savedFamily) setFamily(JSON.parse(savedFamily))
      const savedChecklist = localStorage.getItem('disaster-guard-checklist')
      if (savedChecklist) {
        setChecklist(JSON.parse(savedChecklist))
      } else {
        setChecklist(DEFAULT_CHECKLIST.map(c => ({ ...c, checked: false })))
      }
      const savedMeeting = localStorage.getItem('disaster-guard-meeting')
      if (savedMeeting) setMeetingPoint(savedMeeting)
      const savedPref = localStorage.getItem('disaster-guard-prefecture')
      if (savedPref) setPrefecture(savedPref)
    } catch { /* ignore */ }
  }, [])

  const saveFamily = useCallback((f: FamilyMember[]) => {
    setFamily(f)
    localStorage.setItem('disaster-guard-family', JSON.stringify(f))
  }, [])

  const saveChecklist = useCallback((c: CheckItem[]) => {
    setChecklist(c)
    localStorage.setItem('disaster-guard-checklist', JSON.stringify(c))
  }, [])

  const saveMeetingPoint = useCallback((m: string) => {
    setMeetingPoint(m)
    localStorage.setItem('disaster-guard-meeting', m)
  }, [])

  // GPS
  const getLocation = () => {
    setGpsLoading(true)
    setGpsError('')
    if (!navigator.geolocation) {
      setGpsError('お使いのブラウザはGPSに対応していません')
      setGpsLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude)
        setUserLng(pos.coords.longitude)
        setGpsLoading(false)
        // Sort shelters by distance
        const sorted = SAMPLE_SHELTERS.map(s => ({
          ...s,
          distance: calcDistance(pos.coords.latitude, pos.coords.longitude, s.lat, s.lng)
        })).sort((a, b) => (a.distance || 0) - (b.distance || 0))
        setShelters(sorted)
      },
      (err) => {
        setGpsError(err.code === 1 ? '位置情報の許可が必要です' : '位置情報を取得できませんでした')
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Weather alerts (気象庁API)
  const fetchWeatherAlerts = async () => {
    setWeatherLoading(true)
    try {
      const res = await fetch('/api/weather-alerts?prefecture=' + encodeURIComponent(prefecture))
      if (res.ok) {
        const data = await res.json()
        setWeatherAlerts(data.alerts || [])
      } else {
        // Fallback: show no alerts
        setWeatherAlerts([])
      }
    } catch {
      setWeatherAlerts([])
    }
    setWeatherLoading(false)
    localStorage.setItem('disaster-guard-prefecture', prefecture)
  }

  // Checklist helpers
  const checklistCategories = Array.from(new Set(checklist.map(c => c.category)))
  const checkedCount = checklist.filter(c => c.checked).length
  const checkProgress = checklist.length > 0 ? Math.round((checkedCount / checklist.length) * 100) : 0

  // Quiz
  const handleQuizAnswer = (idx: number) => {
    if (quizAnswered !== null) return
    setQuizAnswered(idx)
    if (idx === QUIZ_QUESTIONS[quizIndex].correct) {
      setQuizScore(s => s + 1)
    }
  }

  const nextQuestion = () => {
    if (quizIndex + 1 >= QUIZ_QUESTIONS.length) {
      setQuizDone(true)
    } else {
      setQuizIndex(i => i + 1)
      setQuizAnswered(null)
    }
  }

  const resetQuiz = () => {
    setQuizIndex(0)
    setQuizScore(0)
    setQuizAnswered(null)
    setQuizDone(false)
  }

  // Filtered shelters
  const filteredShelters = filterType === 'すべて' ? shelters : shelters.filter(s => s.types.includes(filterType))
  const shelterTypes = ['すべて'].concat(Array.from(new Set(SAMPLE_SHELTERS.flatMap(s => s.types))))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-gray-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <h1 className="text-lg font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                AI防災パーソナルガイド
              </h1>
            </div>
            <div className="text-xs text-white/40">防衛シリーズ</div>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ==================== MAP TAB ==================== */}
        {tab === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">🗺️ マイ避難マップ</h2>
                <p className="text-sm text-white/50">GPSで最寄りの避難所を検索</p>
              </div>
              <button onClick={getLocation} disabled={gpsLoading} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                {gpsLoading ? '取得中...' : '📍 現在地を取得'}
              </button>
            </div>

            {gpsError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">{gpsError}</div>
            )}

            {userLat && userLng && (
              <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3 text-sm">
                <span className="text-sky-400">📍 現在地:</span> {userLat.toFixed(4)}, {userLng.toFixed(4)}
              </div>
            )}

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              {shelterTypes.map(type => (
                <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === type ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {type}
                </button>
              ))}
            </div>

            {/* Shelter list */}
            <div className="space-y-2">
              {filteredShelters.map((s, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        <span className="text-sky-400">🏛️</span>
                        {s.name}
                      </div>
                      <div className="text-xs text-white/40 mt-1">{s.address}</div>
                      <div className="flex gap-1.5 mt-2">
                        {s.types.map(t => (
                          <span key={t} className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                    {s.distance !== undefined && (
                      <div className="text-right shrink-0">
                        <div className={`text-lg font-bold ${s.distance < 1 ? 'text-green-400' : s.distance < 2 ? 'text-yellow-400' : 'text-white/60'}`}>
                          {s.distance < 1 ? `${Math.round(s.distance * 1000)}m` : `${s.distance.toFixed(1)}km`}
                        </div>
                        <div className="text-xs text-white/40">
                          徒歩{Math.round(s.distance * 1000 / 80)}分
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-400">
              ⚠️ 避難所データはサンプルです。最新情報は海老名市公式サイトでご確認ください。
            </div>
          </div>
        )}

        {/* ==================== FAMILY TAB ==================== */}
        {tab === 'family' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">👨‍👩‍👧 家族防災プラン</h2>
                <p className="text-sm text-white/50">家族それぞれの避難計画を作成</p>
              </div>
              <button onClick={() => setShowFamilyForm(true)} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg text-sm font-medium hover:opacity-90">+ 追加</button>
            </div>

            {/* Meeting point */}
            <div className="bg-white/5 rounded-xl p-4">
              <label className="text-xs text-white/50 mb-1 block">🏠 集合場所</label>
              <input value={meetingPoint} onChange={e => saveMeetingPoint(e.target.value)} placeholder="例: 海老名中央公園の時計塔前" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50" />
            </div>

            {showFamilyForm && (
              <div className="bg-white/5 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-sm">👤 家族メンバー追加</h3>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">名前 *</label>
                  <input value={familyForm.name} onChange={e => setFamilyForm(f => ({ ...f, name: e.target.value }))} placeholder="お父さん" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">普段いる場所</label>
                  <input value={familyForm.location} onChange={e => setFamilyForm(f => ({ ...f, location: e.target.value }))} placeholder="例: 海老名駅前の会社" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">メモ（持病・配慮事項など）</label>
                  <input value={familyForm.notes} onChange={e => setFamilyForm(f => ({ ...f, notes: e.target.value }))} placeholder="例: 足が不自由" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50" />
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setShowFamilyForm(false); setFamilyForm({ name: '', location: '', notes: '' }) }} className="px-4 py-2 bg-white/5 rounded-lg text-sm">キャンセル</button>
                  <button onClick={() => {
                    if (!familyForm.name.trim()) return
                    saveFamily([...family, { id: generateId(), ...familyForm }])
                    setFamilyForm({ name: '', location: '', notes: '' })
                    setShowFamilyForm(false)
                  }} disabled={!familyForm.name.trim()} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg text-sm font-medium disabled:opacity-30">保存</button>
                </div>
              </div>
            )}

            {family.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-12 text-center text-white/40">
                <p className="text-4xl mb-3">👨‍👩‍👧</p>
                <p className="text-sm">家族メンバーを登録してください</p>
                <p className="text-xs mt-1">災害時の避難プランを事前に作っておきましょう</p>
              </div>
            ) : (
              <div className="space-y-2">
                {family.map(m => (
                  <div key={m.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">👤 {m.name}</div>
                        {m.location && <div className="text-xs text-white/40 mt-1">📍 {m.location}</div>}
                        {m.notes && <div className="text-xs text-amber-400 mt-1">⚠️ {m.notes}</div>}
                      </div>
                      <button onClick={() => {
                        if (confirm(`${m.name}を削除しますか？`)) saveFamily(family.filter(f => f.id !== m.id))
                      }} className="text-xs text-red-400 hover:text-red-300 px-2 py-1">🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Disaster-specific plans */}
            {family.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-3">🏃 災害別行動プラン</h3>
                <div className="space-y-3">
                  {['地震', '洪水・台風', '火災'].map(disaster => (
                    <div key={disaster} className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm font-medium text-sky-400 mb-2">{disaster === '地震' ? '🏚️' : disaster === '洪水・台風' ? '🌊' : '🔥'} {disaster}の場合</div>
                      {family.map(m => (
                        <div key={m.id} className="text-xs text-white/60 ml-4 mb-1">
                          • <strong>{m.name}</strong>: {m.location || '自宅'}から → {meetingPoint || '(集合場所を設定してください)'} に避難
                          {m.notes && <span className="text-amber-400"> [{m.notes}]</span>}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== CHECKLIST TAB ==================== */}
        {tab === 'checklist' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📋 防災チェックリスト</h2>
              <p className="text-sm text-white/50">備蓄品・持ち出し袋の確認（{checkedCount}/{checklist.length}）</p>
            </div>

            {/* Progress */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>準備進捗</span>
                <span className={checkProgress >= 80 ? 'text-green-400' : checkProgress >= 50 ? 'text-yellow-400' : 'text-red-400'}>{checkProgress}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${checkProgress >= 80 ? 'bg-green-500' : checkProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${checkProgress}%` }} />
              </div>
              <div className="text-xs text-white/40 mt-2">
                {checkProgress >= 80 ? '✅ 十分な準備ができています！' : checkProgress >= 50 ? '⚠️ もう少し備えましょう' : '🚨 まだ準備が不十分です'}
              </div>
            </div>

            {/* Checklist by category */}
            {checklistCategories.map(cat => (
              <div key={cat} className="bg-white/5 rounded-xl p-4">
                <h3 className="font-bold text-sm text-sky-400 mb-3">
                  {cat === '水・食料' ? '🍙' : cat === '医療・衛生' ? '💊' : cat === '情報・連絡' ? '📱' : cat === '生活用品' ? '🔦' : cat === '書類' ? '📄' : '🐾'} {cat}
                </h3>
                <div className="space-y-2">
                  {checklist.filter(c => c.category === cat).map(item => (
                    <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={item.checked} onChange={() => {
                        saveChecklist(checklist.map(c => c.id === item.id ? { ...c, checked: !c.checked } : c))
                      }} className="w-5 h-5 rounded border-white/20 accent-sky-500" />
                      <span className={`text-sm ${item.checked ? 'text-white/30 line-through' : 'text-white/70 group-hover:text-white'}`}>{item.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==================== WEATHER TAB ==================== */}
        {tab === 'weather' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">⚠️ 気象警報モニター</h2>
              <p className="text-sm text-white/50">気象庁の最新警報・注意報を確認</p>
            </div>

            <div className="flex gap-2">
              <select value={prefecture} onChange={e => setPrefecture(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                {PREFECTURES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button onClick={fetchWeatherAlerts} disabled={weatherLoading} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 shrink-0">
                {weatherLoading ? '取得中...' : '🔍 確認'}
              </button>
            </div>

            {weatherAlerts.length === 0 && !weatherLoading && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-sm text-green-400">現在、{prefecture}に発表中の警報・注意報はありません</p>
                <p className="text-xs text-white/40 mt-2">「確認」ボタンで最新情報を取得できます</p>
              </div>
            )}

            {weatherAlerts.length > 0 && (
              <div className="space-y-2">
                {weatherAlerts.map((a, i) => (
                  <div key={i} className={`rounded-xl p-4 ${a.severity === '特別警報' ? 'bg-red-500/20 border border-red-500/40' : a.severity === '警報' ? 'bg-amber-500/15 border border-amber-500/30' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.severity === '特別警報' ? 'bg-red-500 text-white' : a.severity === '警報' ? 'bg-amber-500 text-white' : 'bg-yellow-500 text-gray-900'}`}>{a.severity}</span>
                      <span className="font-medium text-sm">{a.title}</span>
                    </div>
                    <div className="text-xs text-white/50">{a.area}</div>
                    {a.description && <div className="text-xs text-white/40 mt-1">{a.description}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Quick links */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3">🔗 公式情報リンク</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.jma.go.jp/bosai/warning/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-400 hover:text-sky-300">
                  🌐 気象庁 防災情報 →
                </a>
                <a href="https://www.river.go.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-400 hover:text-sky-300">
                  🌊 川の防災情報 →
                </a>
                <a href="https://disaportal.gsi.go.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-400 hover:text-sky-300">
                  🗺️ ハザードマップポータル →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ==================== EMERGENCY TAB ==================== */}
        {tab === 'emergency' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🆘 緊急連絡ガイド</h2>
              <p className="text-sm text-white/50">災害時の連絡先と手順</p>
            </div>

            {/* Emergency numbers */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { num: '110', label: '警察', color: 'bg-blue-500/20 border-blue-500/30 text-blue-400' },
                { num: '119', label: '消防・救急', color: 'bg-red-500/20 border-red-500/30 text-red-400' },
                { num: '171', label: '災害伝言ダイヤル', color: 'bg-amber-500/20 border-amber-500/30 text-amber-400' },
                { num: '188', label: '消費者ホットライン', color: 'bg-green-500/20 border-green-500/30 text-green-400' },
              ].map(e => (
                <div key={e.num} className={`rounded-xl p-4 border ${e.color} text-center`}>
                  <div className="text-3xl font-bold">{e.num}</div>
                  <div className="text-xs mt-1">{e.label}</div>
                </div>
              ))}
            </div>

            {/* 171 Usage */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">📞 災害伝言ダイヤル(171)の使い方</h3>
              <div className="space-y-3">
                <div className="bg-sky-500/10 rounded-lg p-3">
                  <div className="text-xs text-sky-400 font-bold mb-1">🔴 伝言を録音する</div>
                  <div className="text-sm text-white/70">171 → 1 → 自宅の電話番号 → 伝言を録音（30秒）</div>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3">
                  <div className="text-xs text-green-400 font-bold mb-1">🟢 伝言を再生する</div>
                  <div className="text-sm text-white/70">171 → 2 → 相手の電話番号 → 伝言を再生</div>
                </div>
              </div>
            </div>

            {/* Safety confirmation services */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">🔍 安否確認サービス</h3>
              <div className="space-y-2 text-sm">
                <a href="https://www.web171.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10">
                  <div>
                    <div className="font-medium">web171</div>
                    <div className="text-xs text-white/40">NTT災害用伝言板（Web版）</div>
                  </div>
                  <span className="text-sky-400">→</span>
                </a>
                <a href="https://anpi.jp/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10">
                  <div>
                    <div className="font-medium">J-anpi</div>
                    <div className="text-xs text-white/40">安否情報まとめて検索</div>
                  </div>
                  <span className="text-sky-400">→</span>
                </a>
              </div>
            </div>

            {/* Earthquake action steps */}
            <div className="bg-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">🏚️ 地震発生時のステップ</h3>
              <div className="space-y-2">
                {[
                  { step: '1', text: '身の安全を確保（机の下に避難）', time: '揺れている間' },
                  { step: '2', text: '火の始末・ガスの元栓を閉める', time: '揺れが収まったら' },
                  { step: '3', text: '出口を確保（ドアを開ける）', time: '直後' },
                  { step: '4', text: '家族の安否確認（171等）', time: '5分以内' },
                  { step: '5', text: '正確な情報を収集（ラジオ等）', time: '10分以内' },
                  { step: '6', text: '必要に応じて避難所へ移動', time: '状況判断' },
                ].map(s => (
                  <div key={s.step} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center shrink-0">{s.step}</div>
                    <div className="flex-1 text-sm text-white/70">{s.text}</div>
                    <div className="text-xs text-white/30 shrink-0">{s.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== QUIZ TAB ==================== */}
        {tab === 'quiz' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📖 防災知識クイズ</h2>
              <p className="text-sm text-white/50">全{QUIZ_QUESTIONS.length}問 — 正しい行動を学ぼう</p>
            </div>

            {quizDone ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center">
                <div className="text-5xl mb-4">{quizScore >= 8 ? '🏆' : quizScore >= 5 ? '👍' : '📚'}</div>
                <h3 className="text-2xl font-bold mb-2">{quizScore} / {QUIZ_QUESTIONS.length} 問正解</h3>
                <p className="text-sm text-white/50 mb-6">
                  {quizScore >= 8 ? '素晴らしい！防災知識は十分です。' : quizScore >= 5 ? 'まずまずです。間違えた問題を復習しましょう。' : '防災知識を見直しましょう。このクイズを繰り返すことが大事です。'}
                </p>
                <button onClick={resetQuiz} className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg text-sm font-medium">もう一度チャレンジ</button>
              </div>
            ) : (
              <>
                {/* Progress */}
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
                  </div>
                  <span className="text-xs text-white/40">{quizIndex + 1}/{QUIZ_QUESTIONS.length}</span>
                </div>

                {/* Question */}
                <div className="bg-white/5 rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4">Q{quizIndex + 1}. {QUIZ_QUESTIONS[quizIndex].question}</h3>
                  <div className="space-y-2">
                    {QUIZ_QUESTIONS[quizIndex].options.map((opt, i) => {
                      let style = 'bg-white/5 border border-white/10 hover:border-sky-500/50'
                      if (quizAnswered !== null) {
                        if (i === QUIZ_QUESTIONS[quizIndex].correct) style = 'bg-green-500/20 border border-green-500/50'
                        else if (i === quizAnswered) style = 'bg-red-500/20 border border-red-500/50'
                        else style = 'bg-white/5 border border-white/5 opacity-50'
                      }
                      return (
                        <button key={i} onClick={() => handleQuizAnswer(i)} disabled={quizAnswered !== null} className={`w-full text-left p-3 rounded-xl text-sm transition-all ${style}`}>
                          <span className="font-bold mr-2">{['A', 'B', 'C', 'D'][i]}.</span>
                          {opt}
                          {quizAnswered !== null && i === QUIZ_QUESTIONS[quizIndex].correct && <span className="float-right">✅</span>}
                          {quizAnswered === i && i !== QUIZ_QUESTIONS[quizIndex].correct && <span className="float-right">❌</span>}
                        </button>
                      )
                    })}
                  </div>

                  {quizAnswered !== null && (
                    <div className="mt-4 bg-sky-500/10 border border-sky-500/30 rounded-xl p-3">
                      <div className="text-xs text-sky-400 font-bold mb-1">💡 解説</div>
                      <div className="text-sm text-white/70">{QUIZ_QUESTIONS[quizIndex].explanation}</div>
                    </div>
                  )}

                  {quizAnswered !== null && (
                    <button onClick={nextQuestion} className="mt-4 w-full py-2 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg text-sm font-medium">
                      {quizIndex + 1 >= QUIZ_QUESTIONS.length ? '結果を見る' : '次の問題へ →'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto px-4 py-6 border-t border-white/10 mt-8">
        <p className="text-xs text-white/30 text-center">
          ※ 本ツールは防災の事前準備・学習支援を目的としています。災害発生時は自治体・気象庁の公式情報に従ってください。
        </p>
      </div>
    </div>
  )
}
