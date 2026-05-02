'use client'

import { useState, useCallback, useEffect } from 'react'

// ─── Types ───────────────────────────────────────────────
interface AreaScore {
  total: number
  categories: { name: string; score: number; icon: string; desc: string }[]
  level: string
  advice: string[]
}

interface NoiseResult {
  score: number
  level: string
  factors: { name: string; impact: string; detail: string }[]
  tips: string[]
}

// ─── Data ────────────────────────────────────────────────
const checklistCategories = [
  {
    name: '🏢 建物の外観', items: [
      { id: 'c1', text: '外壁にひび割れや塗装の剥がれがないか', priority: '必須' },
      { id: 'c2', text: 'エントランスのオートロック・防犯カメラの有無', priority: '必須' },
      { id: 'c3', text: '共用廊下・階段の照明が切れていないか', priority: '推奨' },
      { id: 'c4', text: 'ゴミ捨て場が整理されているか（住民のモラルが分かる）', priority: '必須' },
      { id: 'c5', text: '駐輪場・駐車場が整頓されているか', priority: '推奨' },
    ],
  },
  {
    name: '📋 掲示板・管理', items: [
      { id: 'c6', text: '掲示板に「騒音注意」「ゴミ出しルール」の張り紙が多すぎないか', priority: '必須' },
      { id: 'c7', text: '管理会社・管理人の連絡先が掲示されているか', priority: '推奨' },
      { id: 'c8', text: '管理人常駐か、巡回か、無人か', priority: '推奨' },
      { id: 'c9', text: '宅配ボックスの有無と数', priority: '任意' },
    ],
  },
  {
    name: '🔊 騒音環境', items: [
      { id: 'c10', text: '幹線道路・線路・高速道路が近くにないか', priority: '必須' },
      { id: 'c11', text: '飲食店・カラオケ・パチンコ店が近くにないか', priority: '必須' },
      { id: 'c12', text: '工場・工事現場が近くにないか', priority: '推奨' },
      { id: 'c13', text: '学校・幼稚園・公園が近くにあるか（子供の声）', priority: '任意' },
      { id: 'c14', text: '曜日・時間帯を変えて複数回内見したか', priority: '必須' },
    ],
  },
  {
    name: '🏠 室内チェック', items: [
      { id: 'c15', text: '壁を叩いて隣室との遮音性を確認したか', priority: '必須' },
      { id: 'c16', text: '上階の足音が聞こえるか確認したか', priority: '必須' },
      { id: 'c17', text: '水回り（キッチン・風呂・トイレ）の水圧を確認したか', priority: '推奨' },
      { id: 'c18', text: '窓の結露跡・カビがないか', priority: '推奨' },
      { id: 'c19', text: '携帯電話の電波が入るか', priority: '推奨' },
      { id: 'c20', text: 'コンセントの数・位置を確認したか', priority: '任意' },
    ],
  },
  {
    name: '📍 周辺環境', items: [
      { id: 'c21', text: 'スーパー・コンビニの距離と営業時間', priority: '推奨' },
      { id: 'c22', text: '最寄り駅までの実際の徒歩時間（不動産表記は信号無視）', priority: '必須' },
      { id: 'c23', text: '夜道の明るさ・人通り（夜に現地を歩いたか）', priority: '必須' },
      { id: 'c24', text: '病院・クリニックへのアクセス', priority: '推奨' },
      { id: 'c25', text: 'ハザードマップで洪水・土砂災害リスクを確認したか', priority: '必須' },
    ],
  },
  {
    name: '📄 契約・管理会社', items: [
      { id: 'c26', text: '退去時の原状回復費用の条件を確認したか', priority: '必須' },
      { id: 'c27', text: '更新料・更新事務手数料の金額', priority: '推奨' },
      { id: 'c28', text: '管理会社の口コミ・評判を調べたか', priority: '推奨' },
      { id: 'c29', text: 'トラブル時の対応フロー（電話？メール？24時間？）', priority: '推奨' },
      { id: 'c30', text: '特約事項（楽器不可・ペット不可等）を確認したか', priority: '必須' },
    ],
  },
]

const troubleTemplates = [
  {
    id: 'noise',
    icon: '🔊',
    title: '騒音トラブル',
    desc: '隣人の音楽・足音・生活音',
    steps: [
      { step: '①記録', action: '日時・音の種類・継続時間をスマホのメモやボイスレコーダーで記録。最低2週間分', detail: '「○月○日 23:15〜0:30 上階から重低音の音楽」のように具体的に' },
      { step: '②管理会社に連絡', action: '記録をもとに管理会社へ書面（メール）で連絡', detail: '電話だと記録が残らない。必ずメールかFAXで。テンプレート↓' },
      { step: '③内容証明郵便', action: '改善されない場合、相手方に内容証明を送付', detail: '法テラス(0570-078374)で文面の相談可。費用は約1,500円' },
      { step: '④民事調停', action: '簡易裁判所に調停を申し立て', detail: '費用は数千円。弁護士不要。調停委員が間に入ってくれる' },
    ],
    template: '【騒音に関するご連絡】\n\n管理会社 ○○不動産 ご担当者様\n\n○○マンション ○○○号室の○○です。\n\n○月○日頃より、[上階/隣室]から[音楽/足音/生活音]が\n深夜帯（○時〜○時頃）に継続的に発生しております。\n\n記録：\n・○月○日 ○時〜○時 [具体的な音の種類]\n・○月○日 ○時〜○時 [具体的な音の種類]\n\n日常生活に支障をきたしておりますので、\n該当住戸への注意喚起をお願いできますでしょうか。\n\nお忙しいところ恐れ入りますが、\nご対応のほどよろしくお願いいたします。\n\n○○○号室 ○○',
  },
  {
    id: 'garbage',
    icon: '🗑️',
    title: 'ゴミ出しトラブル',
    desc: '分別違反・収集日無視',
    steps: [
      { step: '①記録', action: '違反ゴミの写真を日時付きで撮影', detail: '自分が犯人扱いされないよう、写真は複数日分撮っておく' },
      { step: '②管理会社に連絡', action: '写真を添えて管理会社に報告', detail: '全戸向けの注意喚起を依頼' },
      { step: '③自治体に相談', action: '改善しない場合、市区町村のごみ担当課に相談', detail: '悪質な場合は行政指導の対象になることも' },
      { step: '④防犯カメラ設置要望', action: '管理組合や管理会社に防犯カメラ設置を提案', detail: '費用は管理費からの支出を提案' },
    ],
    template: '【ゴミ出しルール違反について】\n\n管理会社 ○○不動産 ご担当者様\n\n○○マンション ○○○号室の○○です。\n\nゴミ捨て場にて、分別がされていないゴミや\n収集日以外に出されたゴミが散見されます。\n\n確認日：\n・○月○日 [具体的な状況]\n・○月○日 [具体的な状況]\n\n衛生面が心配ですので、全戸への\nゴミ出しルールの再周知をお願いできますでしょうか。\n\nよろしくお願いいたします。\n\n○○○号室 ○○',
  },
  {
    id: 'parking',
    icon: '🚗',
    title: '駐車場・駐輪場トラブル',
    desc: '無断駐車・場所取り',
    steps: [
      { step: '①記録', action: 'ナンバープレート・日時・場所を記録', detail: '写真も忘れずに。連日続く場合は記録が重要' },
      { step: '②管理会社に連絡', action: '記録をもとに管理会社に報告', detail: '注意書きの掲示や該当車両への警告を依頼' },
      { step: '③警察に相談', action: '私有地の場合でも、#9110（警察相談）に相談可', detail: '公道の場合は駐車違反として通報可能(110番)' },
      { step: '④法的手段', action: '長期間改善しない場合は弁護士に相談', detail: '損害賠償請求や仮処分の検討' },
    ],
    template: '【無断駐車について】\n\n管理会社 ○○不動産 ご担当者様\n\n○○マンション ○○○号室の○○です。\n\n私の契約区画（No.○○）に無断駐車が\n繰り返し発生しております。\n\n記録：\n・○月○日 車種: ○○ ナンバー: ○○○○\n・○月○日 車種: ○○ ナンバー: ○○○○\n\n該当車両への警告書貼付や、\n掲示板での注意喚起をお願いいたします。\n\nよろしくお願いいたします。\n\n○○○号室 ○○',
  },
  {
    id: 'smell',
    icon: '🚬',
    title: 'タバコ・悪臭トラブル',
    desc: 'ベランダ喫煙・料理臭',
    steps: [
      { step: '①記録', action: '日時・臭いの種類・自分の被害（咳、洗濯物への付着等）を記録', detail: '医師の診断書があると効果的' },
      { step: '②管理会社に連絡', action: '受動喫煙防止の観点から管理会社に改善を依頼', detail: '管理規約にベランダ喫煙禁止の条項があるか確認' },
      { step: '③行政機関に相談', action: '受動喫煙防止条例のある自治体なら相談窓口あり', detail: '健康増進法(2020改正)でも受動喫煙対策が強化されている' },
      { step: '④民事調停', action: '健康被害がある場合は民事調停も視野に', detail: '裁判例: ベランダ喫煙に対する損害賠償を認めた判例あり(横浜地裁2012年)' },
    ],
    template: '【ベランダ喫煙による受動喫煙被害について】\n\n管理会社 ○○不動産 ご担当者様\n\n○○マンション ○○○号室の○○です。\n\n[上階/隣室]のベランダからのタバコの煙が\n室内に流入し、健康被害を受けております。\n\n状況：\n・○月○日 ○時頃 [具体的な被害]\n・洗濯物へのタバコ臭の付着\n・[咳/頭痛]等の体調不良\n\n管理規約の確認および該当住戸への\n注意喚起をお願いできますでしょうか。\n\nよろしくお願いいたします。\n\n○○○号室 ○○',
  },
  {
    id: 'pet',
    icon: '🐕',
    title: 'ペットトラブル',
    desc: '鳴き声・臭い・共用部での排泄',
    steps: [
      { step: '①記録', action: '鳴き声の時間帯・頻度・共用部の汚れを記録・撮影', detail: '動画で記録すると騒音レベルが分かりやすい' },
      { step: '②管理会社に連絡', action: 'ペット飼育規約の確認と管理会社への報告', detail: 'ペット不可物件での飼育なら契約違反を指摘' },
      { step: '③行政機関に相談', action: '動物愛護センターや保健所に相談', detail: '多頭飼育崩壊や虐待が疑われる場合は通報義務あり' },
      { step: '④法的手段', action: '改善されない場合は弁護士に相談', detail: '飼育禁止の仮処分申請も可能' },
    ],
    template: '【ペットの鳴き声・マナーについて】\n\n管理会社 ○○不動産 ご担当者様\n\n○○マンション ○○○号室の○○です。\n\n[上階/隣室]のペット（犬/猫）の鳴き声が\n深夜早朝も含め頻繁に発生しております。\n\n記録：\n・○月○日 ○時〜○時 [鳴き声の状況]\n・共用廊下での排泄跡を確認（写真あり）\n\n管理規約に基づく適切な対応を\nお願いできますでしょうか。\n\nよろしくお願いいたします。\n\n○○○号室 ○○',
  },
]

const movingCosts = [
  { category: '初期費用', items: [
    { name: '敷金', typical: '家賃1〜2ヶ月', note: '退去時に一部返金' },
    { name: '礼金', typical: '家賃0〜2ヶ月', note: '返金なし。最近は礼金ゼロ物件も増加' },
    { name: '仲介手数料', typical: '家賃0.5〜1ヶ月+税', note: '法律上の上限は家賃1ヶ月分+税' },
    { name: '前家賃', typical: '家賃1ヶ月', note: '入居月の家賃を先払い' },
    { name: '火災保険', typical: '1.5〜2万円/2年', note: '賃貸契約時に加入必須' },
    { name: '鍵交換費用', typical: '1〜2万円', note: '入居者負担が一般的' },
    { name: '保証会社利用料', typical: '家賃0.5〜1ヶ月', note: '連帯保証人不要の場合に必要' },
  ]},
  { category: '引越し費用', items: [
    { name: '引越し業者（単身・近距離）', typical: '3〜6万円', note: '繁忙期(3-4月)は1.5〜2倍' },
    { name: '引越し業者（単身・遠距離）', typical: '6〜15万円', note: '距離と荷物量で変動大' },
    { name: '引越し業者（家族・近距離）', typical: '8〜15万円', note: '3-4月は早めに予約必須' },
    { name: '引越し業者（家族・遠距離）', typical: '15〜30万円', note: '混載便で節約可能' },
  ]},
  { category: '見落としがちな費用', items: [
    { name: 'エアコン移設', typical: '1〜3万円/台', note: '取外し+取付け+配管' },
    { name: 'インターネット開通', typical: '0〜2万円', note: '工事費。キャンペーンで無料になることも' },
    { name: '住所変更手続き（郵便転送等）', typical: '無料', note: '忘れると届かない郵便物が発生' },
    { name: 'カーテン・照明', typical: '1〜5万円', note: '窓サイズが合わないことが多い' },
    { name: '粗大ゴミ処分', typical: '200〜2,000円/点', note: '事前予約が必要な自治体が多い' },
  ]},
]

const consultGuide = [
  { name: '法テラス（日本司法支援センター）', phone: '0570-078374', desc: '無料法律相談。近隣トラブル全般の相談可', hours: '平日 9:00〜21:00 / 土 9:00〜17:00', icon: '⚖️' },
  { name: '警察相談ダイヤル', phone: '#9110', desc: '犯罪に至らないトラブルの相談。騒音・つきまとい等', hours: '平日 8:30〜17:15', icon: '👮' },
  { name: '国民生活センター', phone: '188', desc: '消費者トラブル全般。賃貸契約の問題も相談可', hours: '平日 10:00〜16:00', icon: '📞' },
  { name: '自治体の無料法律相談', phone: '各市区町村の番号', desc: '弁護士による無料相談（要予約）。月1〜2回開催が多い', hours: '自治体による', icon: '🏛️' },
  { name: '不動産適正取引推進機構', phone: '0570-021-030', desc: '不動産取引に関する紛争解決。仲介手数料や契約トラブル', hours: '平日 10:00〜16:00', icon: '🏠' },
  { name: '警察 緊急通報', phone: '110', desc: '暴力・脅迫等の犯罪行為がある場合は迷わず110番', hours: '24時間', icon: '🚨' },
]

// ─── Area scoring logic ──────────────────────────────────
const areaTypes: Record<string, { label: string; scores: Record<string, number> }> = {
  residential: { label: '🏘️ 閑静な住宅街', scores: { theft: 85, violent: 90, fraud: 80, traffic: 85 } },
  suburban: { label: '🏡 郊外・ニュータウン', scores: { theft: 90, violent: 95, fraud: 85, traffic: 80 } },
  station: { label: '🚉 駅前・繁華街', scores: { theft: 55, violent: 60, fraud: 50, traffic: 65 } },
  urban: { label: '🏙️ 都心部（オフィス街）', scores: { theft: 65, violent: 75, fraud: 55, traffic: 70 } },
  industrial: { label: '🏭 工業地帯', scores: { theft: 70, violent: 80, fraud: 75, traffic: 60 } },
  rural: { label: '🌾 田舎・農村部', scores: { theft: 95, violent: 95, fraud: 70, traffic: 90 } },
}

// ─── Component ───────────────────────────────────────────
export default function MovingChecker() {
  const [activeTab, setActiveTab] = useState<'area' | 'noise' | 'checklist' | 'trouble' | 'cost' | 'help'>('area')

  // Area state
  const [selectedArea, setSelectedArea] = useState('')
  const [areaResult, setAreaResult] = useState<AreaScore | null>(null)

  // Noise state
  const [noiseInput, setNoiseInput] = useState({ structure: 'rc', floor: '5', age: '10', road: 'far', shops: 'none' })
  const [noiseResult, setNoiseResult] = useState<NoiseResult | null>(null)

  // Checklist state
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  // Trouble state
  const [selectedTrouble, setSelectedTrouble] = useState<string | null>(null)

  // Cost state
  const [costInput, setCostInput] = useState({ rent: '', deposit: '1', key: '1', agent: '1' })

  const tabs = [
    { id: 'area' as const, label: '📍 エリア安全度' },
    { id: 'noise' as const, label: '🔊 騒音リスク' },
    { id: 'checklist' as const, label: '✅ 30項目チェック' },
    { id: 'trouble' as const, label: '⚖️ トラブル対処' },
    { id: 'cost' as const, label: '💰 コスト計算' },
    { id: 'help' as const, label: '📞 相談窓口' },
  ]

  // Load checklist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('movingchecker-checklist')
      if (saved) setChecked(JSON.parse(saved))
    } catch {}
  }, [])
  useEffect(() => {
    if (Object.keys(checked).length > 0) localStorage.setItem('movingchecker-checklist', JSON.stringify(checked))
  }, [checked])

  // Area scoring
  const calcArea = useCallback(() => {
    if (!selectedArea) return
    const area = areaTypes[selectedArea]
    const cats = [
      { name: '窃盗犯罪', score: area.scores.theft, icon: '🔓', desc: '空き巣・自転車盗・万引き等' },
      { name: '粗暴犯罪', score: area.scores.violent, icon: '👊', desc: '暴行・傷害・恐喝等' },
      { name: '詐欺・知能犯', score: area.scores.fraud, icon: '🎭', desc: '振り込め詐欺・サイバー犯罪等' },
      { name: '交通安全', score: area.scores.traffic, icon: '🚗', desc: '交通事故・危険運転等' },
    ]
    const total = Math.round(cats.reduce((s, c) => s + c.score, 0) / cats.length)
    let level = '', advice: string[] = []
    if (total >= 85) { level = '★★★★★ 非常に安全'; advice = ['安心して住めるエリアです', '基本的な戸締まりの習慣を維持しましょう'] }
    else if (total >= 70) { level = '★★★★☆ 安全'; advice = ['概ね安全ですが、夜間の一人歩きは注意', '自転車の二重ロックをおすすめ'] }
    else if (total >= 55) { level = '★★★☆☆ 普通'; advice = ['防犯意識を高めましょう', '在宅時でも施錠を', '夜道は明るい道を選ぶ'] }
    else { level = '★★☆☆☆ 注意が必要'; advice = ['防犯カメラ付き物件を選ぶ', '1階は避ける', '帰宅時間帯の人通りを確認', '貴重品の管理を徹底'] }
    setAreaResult({ total, categories: cats, level, advice })
  }, [selectedArea])

  // Noise scoring
  const calcNoise = useCallback(() => {
    let score = 0
    const factors: { name: string; impact: string; detail: string }[] = []
    // Structure
    if (noiseInput.structure === 'rc') { score += 10; factors.push({ name: 'RC造（鉄筋コンクリート）', impact: '✅ 低リスク', detail: '遮音性が最も高い構造' }) }
    else if (noiseInput.structure === 'src') { score += 15; factors.push({ name: 'SRC造（鉄骨鉄筋）', impact: '✅ 低リスク', detail: 'RCと同等以上の遮音性' }) }
    else if (noiseInput.structure === 'steel') { score += 40; factors.push({ name: '鉄骨造（S造）', impact: '⚠️ 中リスク', detail: '軽量鉄骨は特に音が伝わりやすい' }) }
    else { score += 60; factors.push({ name: '木造', impact: '🔴 高リスク', detail: '遮音性が最も低い。生活音が筒抜けの可能性' }) }
    // Floor
    const floor = Number(noiseInput.floor)
    if (floor >= 5) { factors.push({ name: `${floor}階`, impact: '✅ 低リスク', detail: '外部騒音が届きにくい高さ' }) }
    else if (floor >= 3) { score += 10; factors.push({ name: `${floor}階`, impact: '🔶 やや注意', detail: '道路騒音はやや聞こえる可能性' }) }
    else { score += 25; factors.push({ name: `${floor}階（低層）`, impact: '⚠️ 中リスク', detail: '道路騒音・通行人の声が聞こえやすい' }) }
    // Age
    const age = Number(noiseInput.age)
    if (age <= 10) { factors.push({ name: `築${age}年`, impact: '✅ 良好', detail: '2015年以降の建築基準。遮音等級が高い' }) }
    else if (age <= 25) { score += 10; factors.push({ name: `築${age}年`, impact: '🔶 普通', detail: '遮音性能は中程度' }) }
    else { score += 20; factors.push({ name: `築${age}年`, impact: '⚠️ 注意', detail: '古い建築基準。遮音性能が低い可能性' }) }
    // Road
    if (noiseInput.road === 'far') { factors.push({ name: '幹線道路から遠い', impact: '✅ 良好', detail: '交通騒音の心配なし' }) }
    else if (noiseInput.road === 'mid') { score += 15; factors.push({ name: '幹線道路がやや近い', impact: '🔶 注意', detail: '窓を開けると騒音が入る可能性' }) }
    else { score += 30; factors.push({ name: '幹線道路沿い', impact: '🔴 高リスク', detail: '二重サッシでも深夜のトラック音が気になる場合あり' }) }
    // Shops
    if (noiseInput.shops === 'none') { factors.push({ name: '飲食店なし', impact: '✅ 良好', detail: '夜間の騒音リスクなし' }) }
    else if (noiseInput.shops === 'some') { score += 10; factors.push({ name: '飲食店がやや近い', impact: '🔶 注意', detail: '週末の深夜に騒がしい可能性' }) }
    else { score += 25; factors.push({ name: '飲食店・飲み屋街が近い', impact: '🔴 高リスク', detail: '深夜の酔客の声・カラオケ音が問題になりやすい' }) }

    const normalizedScore = Math.min(100, score)
    let level = ''
    const tips: string[] = []
    if (normalizedScore <= 20) { level = '🟢 低リスク — 騒音の心配はほぼなし'; tips.push('快適な住環境が期待できます') }
    else if (normalizedScore <= 40) { level = '🟡 やや注意 — 条件付きで快適'; tips.push('内見時に窓を開けて騒音を確認', '時間帯を変えて複数回内見することを推奨') }
    else if (normalizedScore <= 60) { level = '🟠 注意 — 騒音対策が必要'; tips.push('防音カーテン・二重サッシの有無を確認', '耳栓・ホワイトノイズマシンの準備を', '角部屋・最上階を優先的に検討') }
    else { level = '🔴 高リスク — 騒音問題が起きやすい'; tips.push('他の物件も検討することを強くおすすめ', 'どうしてもこの物件なら防音工事の可否を確認', '1ヶ月だけ住んでみるマンスリー契約も選択肢') }

    setNoiseResult({ score: normalizedScore, level, factors, tips })
  }, [noiseInput])

  // Checklist stats
  const totalItems = checklistCategories.reduce((s, c) => s + c.items.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length

  // Cost calc
  const rent = Number(costInput.rent) || 0
  const deposit = Number(costInput.deposit) || 0
  const keyMoney = Number(costInput.key) || 0
  const agentFee = Number(costInput.agent) || 0
  const initialCost = rent * deposit + rent * keyMoney + rent * agentFee + rent + 20000 + 15000 + rent * 0.5

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-4xl mb-2">🏠</div>
          <h1 className="text-2xl font-bold">AI引っ越し安心チェッカー</h1>
          <p className="text-gray-400 mt-1">エリア安全度 × 騒音リスク × トラブル予防</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-[#0f0f1a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ─── Area Tab ─── */}
        {activeTab === 'area' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">📍 エリア安全度スコア</h2>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">
              ℹ️ 警察庁の公開犯罪統計の傾向を参考にしたスコアです。実際の安全度は個別のエリアにより異なります。
            </div>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <h3 className="font-bold mb-4">エリアの種類を選択</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(areaTypes).map(([key, val]) => (
                  <button key={key} onClick={() => setSelectedArea(key)}
                    className={`p-4 rounded-xl border text-left transition-all ${selectedArea === key ? 'bg-blue-500/10 border-blue-500/50' : 'bg-[#1a1a2e] border-gray-700 hover:border-gray-500'}`}>
                    <div className="text-lg">{val.label}</div>
                  </button>
                ))}
              </div>
              <button onClick={calcArea} disabled={!selectedArea}
                className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors">
                安全度を診断
              </button>
            </div>

            {areaResult && (
              <div className="space-y-4">
                <div className={`bg-[#13131e] rounded-xl border p-6 text-center ${areaResult.total >= 80 ? 'border-green-500/30' : areaResult.total >= 60 ? 'border-blue-500/30' : 'border-amber-500/30'}`}>
                  <div className="text-sm text-gray-400 mb-2">総合安全度</div>
                  <div className={`text-5xl font-bold ${areaResult.total >= 80 ? 'text-green-400' : areaResult.total >= 60 ? 'text-blue-400' : 'text-amber-400'}`}>{areaResult.total}点</div>
                  <div className="text-lg mt-2">{areaResult.level}</div>
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-4">カテゴリ別スコア</h3>
                  <div className="space-y-4">
                    {areaResult.categories.map((cat, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{cat.icon} {cat.name}</span>
                          <span className="text-gray-400">{cat.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${cat.score >= 80 ? 'bg-green-500' : cat.score >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${cat.score}%` }} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{cat.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-3">💡 アドバイス</h3>
                  <ul className="space-y-2">{areaResult.advice.map((a, i) => <li key={i} className="text-sm text-gray-400 flex items-start gap-2"><span className="text-blue-400">→</span>{a}</li>)}</ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Noise Tab ─── */}
        {activeTab === 'noise' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">🔊 騒音リスクチェッカー</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">建物構造</label>
                  <select value={noiseInput.structure} onChange={e => setNoiseInput(n => ({ ...n, structure: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="src">SRC造（鉄骨鉄筋）</option>
                    <option value="rc">RC造（鉄筋コンクリート）</option>
                    <option value="steel">鉄骨造（S造）</option>
                    <option value="wood">木造</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">階数</label>
                  <input type="number" value={noiseInput.floor} onChange={e => setNoiseInput(n => ({ ...n, floor: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">築年数</label>
                  <input type="number" value={noiseInput.age} onChange={e => setNoiseInput(n => ({ ...n, age: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">幹線道路</label>
                  <select value={noiseInput.road} onChange={e => setNoiseInput(n => ({ ...n, road: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="far">遠い（徒歩5分以上）</option>
                    <option value="mid">やや近い（徒歩1〜5分）</option>
                    <option value="near">沿い（目の前）</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">飲食店・娯楽施設</label>
                <select value={noiseInput.shops} onChange={e => setNoiseInput(n => ({ ...n, shops: e.target.value }))}
                  className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="none">周辺になし</option>
                  <option value="some">少しある</option>
                  <option value="many">飲み屋街が近い</option>
                </select>
              </div>
              <button onClick={calcNoise} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">騒音リスクを診断</button>
            </div>

            {noiseResult && (
              <div className="space-y-4">
                <div className={`bg-[#13131e] rounded-xl border p-6 text-center ${noiseResult.score <= 20 ? 'border-green-500/30' : noiseResult.score <= 40 ? 'border-yellow-500/30' : noiseResult.score <= 60 ? 'border-amber-500/30' : 'border-red-500/30'}`}>
                  <div className="text-sm text-gray-400 mb-2">騒音リスクスコア</div>
                  <div className={`text-5xl font-bold ${noiseResult.score <= 20 ? 'text-green-400' : noiseResult.score <= 40 ? 'text-yellow-400' : noiseResult.score <= 60 ? 'text-amber-400' : 'text-red-400'}`}>{noiseResult.score}%</div>
                  <div className="text-sm mt-2">{noiseResult.level}</div>
                </div>
                <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-3">📋 判定要因</h3>
                  <div className="space-y-3">
                    {noiseResult.factors.map((f, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-800 last:border-0">
                        <span className="text-sm font-bold whitespace-nowrap">{f.impact}</span>
                        <div><div className="text-sm">{f.name}</div><div className="text-xs text-gray-500">{f.detail}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
                {noiseResult.tips.length > 0 && (
                  <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                    <h3 className="font-bold mb-3">💡 アドバイス</h3>
                    <ul className="space-y-2">{noiseResult.tips.map((t, i) => <li key={i} className="text-sm text-gray-400 flex items-start gap-2"><span className="text-blue-400">→</span>{t}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── Checklist Tab ─── */}
        {activeTab === 'checklist' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">✅ 物件トラブル予防チェック（30項目）</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">チェック済み: {checkedCount}/{totalItems}</span>
                <span className="text-sm font-bold text-blue-400">{totalItems > 0 ? Math.round(checkedCount / totalItems * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${totalItems > 0 ? checkedCount / totalItems * 100 : 0}%` }} />
              </div>
            </div>

            {checklistCategories.map((cat, ci) => (
              <div key={ci} className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                <h3 className="font-bold mb-4">{cat.name}</h3>
                <div className="space-y-2">
                  {cat.items.map(item => (
                    <div key={item.id} onClick={() => setChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${checked[item.id] ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-[#1a1a2e]'}`}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${checked[item.id] ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                        {checked[item.id] && <span className="text-xs text-white">✓</span>}
                      </div>
                      <span className={`text-sm flex-1 ${checked[item.id] ? 'line-through text-gray-500' : ''}`}>{item.text}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${item.priority === '必須' ? 'bg-red-500/20 text-red-400' : item.priority === '推奨' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'}`}>{item.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Trouble Tab ─── */}
        {activeTab === 'trouble' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">⚖️ トラブル対処テンプレート</h2>
            {!selectedTrouble ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {troubleTemplates.map(t => (
                  <button key={t.id} onClick={() => setSelectedTrouble(t.id)}
                    className="bg-[#13131e] rounded-xl border border-gray-800 p-6 text-left hover:border-blue-500/50 transition-colors">
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <h3 className="font-bold text-lg">{t.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{t.desc}</p>
                  </button>
                ))}
              </div>
            ) : (() => {
              const t = troubleTemplates.find(x => x.id === selectedTrouble)!
              return (
                <div className="space-y-4">
                  <button onClick={() => setSelectedTrouble(null)} className="text-sm text-blue-400 hover:text-blue-300">← トラブル一覧に戻る</button>
                  <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                    <h3 className="text-2xl mb-1">{t.icon} {t.title}</h3>
                    <p className="text-gray-400 mb-6">段階的な対処フロー</p>
                    <div className="space-y-4">
                      {t.steps.map((s, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">{i + 1}</div>
                            {i < t.steps.length - 1 && <div className="w-0.5 flex-1 bg-gray-800 mt-1" />}
                          </div>
                          <div className="pb-4">
                            <div className="font-bold text-sm text-blue-400">{s.step}</div>
                            <div className="font-medium">{s.action}</div>
                            <div className="text-sm text-gray-400 mt-1">{s.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#13131e] rounded-xl border border-blue-500/30 p-6">
                    <h3 className="font-bold mb-3">📝 管理会社への連絡テンプレート</h3>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans bg-[#1a1a2e] rounded-lg p-4">{t.template}</pre>
                    <button onClick={() => navigator.clipboard.writeText(t.template)}
                      className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">📋 コピー</button>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ─── Cost Tab ─── */}
        {activeTab === 'cost' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">💰 引っ越しコスト計算機</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <h3 className="font-bold mb-4">家賃から初期費用を計算</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">家賃（万円）</label>
                  <input type="number" placeholder="7" value={costInput.rent} onChange={e => setCostInput(c => ({ ...c, rent: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">敷金（ヶ月）</label>
                  <select value={costInput.deposit} onChange={e => setCostInput(c => ({ ...c, deposit: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="0">0ヶ月</option><option value="1">1ヶ月</option><option value="2">2ヶ月</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">礼金（ヶ月）</label>
                  <select value={costInput.key} onChange={e => setCostInput(c => ({ ...c, key: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="0">0ヶ月</option><option value="1">1ヶ月</option><option value="2">2ヶ月</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">仲介手数料（ヶ月）</label>
                  <select value={costInput.agent} onChange={e => setCostInput(c => ({ ...c, agent: e.target.value }))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    <option value="0.5">0.5ヶ月</option><option value="1">1ヶ月</option>
                  </select>
                </div>
              </div>
              {rent > 0 && (
                <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 text-center">
                  <div className="text-sm text-gray-400 mb-1">初期費用の見積もり</div>
                  <div className="text-4xl font-bold text-blue-400">約¥{Math.round(initialCost * 10000).toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-2">敷金 + 礼金 + 仲介手数料 + 前家賃 + 火災保険 + 鍵交換 + 保証会社</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {movingCosts.map((cat, ci) => (
                <div key={ci} className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold mb-4">{cat.category}</h3>
                  <div className="space-y-3">
                    {cat.items.map((item, ii) => (
                      <div key={ii} className="flex justify-between items-start py-2 border-b border-gray-800 last:border-0">
                        <div><div className="text-sm">{item.name}</div><div className="text-xs text-gray-500">{item.note}</div></div>
                        <span className="text-sm font-bold text-amber-400 whitespace-nowrap ml-4">{item.typical}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Help Tab ─── */}
        {activeTab === 'help' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">📞 相談窓口ガイド</h2>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-sm text-blue-300">
              💡 近隣トラブルは我慢し続けると悪化します。早めに相談することが解決の第一歩です。相談は無料・秘密厳守です。
            </div>
            <div className="space-y-4">
              {consultGuide.map((c, i) => (
                <div key={i} className="bg-[#13131e] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{c.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{c.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{c.desc}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <span className="text-lg font-bold text-blue-400">📞 {c.phone}</span>
                        <span className="text-sm text-gray-500">🕐 {c.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Affiliate */}
      <div className="mt-8 border rounded-xl p-4 bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <span className="text-[10px] text-muted-foreground font-medium mr-2">PR</span>
          <span className="text-sm">🎬 引っ越しの夜に観たい —「STILL: マイケル・J・フォックス」</span>
          <p className="text-xs text-muted-foreground mt-0.5">人生の転機に立ち向かい続けた男のドキュメンタリー。Amazon Prime Videoで視聴できます。</p>
        </div>
        <a href="https://amzn.to/4ejfQ5J" target="_blank" rel="noopener noreferrer sponsored"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors">
          Primeで観る →
        </a>
      </div>
      </div>
    </div>
  )
}
