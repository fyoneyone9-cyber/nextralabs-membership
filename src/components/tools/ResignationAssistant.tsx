'use client'


import { useState, useCallback } from 'react'

// Types
interface EmployeeInfo {
  companyName: string
  employeeType: '豁｣遉ｾ蜩｡' | '螂醍ｴ・､ｾ蜩｡' | '繝代・繝医・繧｢繝ｫ繝舌う繝・
  startDate: string
  resignDate: string
  reason: '荳霄ｫ荳翫・驛ｽ蜷・ | '莨夂､ｾ驛ｽ蜷・ | '螂醍ｴ・悄髢捺ｺ莠・ | '縺昴・莉・
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
  type: '蠑∬ｭｷ螢ｫ蝙・ | '蜉ｴ蜒咲ｵ・粋蝙・ | '豌鷹俣蝙・
  price: string
  features: string[]
  risks: string
  recommendation: string
}

const defaultInfo: EmployeeInfo = {
  companyName: '',
  employeeType: '豁｣遉ｾ蜩｡',
  startDate: '',
  resignDate: '',
  reason: '荳霄ｫ荳翫・驛ｽ蜷・,
  customReason: '',
  fullName: '',
  department: '',
  monthlySalary: 0,
  monthlyOvertimeHours: 0,
  unpaidMonths: 0,
  paidLeaveDays: 0,
}

const defaultChecklist: CheckItem[] = [
  { id: 'c1', label: '騾閨ｷ螻翫・騾閨ｷ鬘倥・菴懈・', category: '譖ｸ鬘樊ｺ門ｙ', description: '譛ｬ繝・・繝ｫ縺ｧ閾ｪ蜍慕函謌舌〒縺阪∪縺・, done: false, dueOffset: 30 },
  { id: 'c2', label: '荳雁昇縺ｸ縺ｮ騾閨ｷ諢乗昴・莨晞＃', category: '蝣ｱ蜻・, description: '騾閨ｷ螻頑署蜃ｺ縺ｮ2騾ｱ髢薙・繝ｶ譛亥燕縺ｫ蜿｣鬆ｭ縺ｧ莨昴∴繧九・縺後・繝翫・', done: false, dueOffset: 45 },
  { id: 'c3', label: '騾閨ｷ螻翫・謠仙・', category: '譖ｸ鬘樊ｺ門ｙ', description: '豕募ｾ倶ｸ翫・2騾ｱ髢灘燕縺ｾ縺ｧ縺ｫ謠仙・縺吶ｌ縺ｰ騾閨ｷ蜿ｯ閭ｽ・域ｰ第ｳ・27譚｡・・, done: false, dueOffset: 14 },
  { id: 'c4', label: '譛臥ｵｦ莨第嚊縺ｮ谿区律謨ｰ遒ｺ隱・, category: '讓ｩ蛻ｩ遒ｺ隱・, description: '騾閨ｷ譌･縺ｾ縺ｧ縺ｫ豸亥喧縺吶ｋ縺九∬ｲｷ蜿紋ｺ､貂峨ｒ縺吶ｋ', done: false, dueOffset: 30 },
  { id: 'c5', label: '蠑慕ｶ吶℃雉・侭縺ｮ菴懈・', category: '蠑慕ｶ吶℃', description: '諡・ｽ捺･ｭ蜍吶・荳隕ｧ縲∵焔鬆・嶌縲・｣邨｡蜈医Μ繧ｹ繝育ｭ・, done: false, dueOffset: 21 },
  { id: 'c6', label: '遘∫黄縺ｮ謨ｴ逅・・謖√■蟶ｰ繧・, category: '騾閨ｷ貅門ｙ', description: '蟆代＠縺壹▽謖√■蟶ｰ繧九よ怙邨よ律縺ｫ縺ｾ縺ｨ繧√ｋ縺ｨ逶ｮ遶九▽', done: false, dueOffset: 14 },
  { id: 'c7', label: '蛛･蠎ｷ菫晞匱縺ｮ蛻・崛謇狗ｶ壹″', category: '遉ｾ莨壻ｿ晞匱', description: '蝗ｽ豌大▼蠎ｷ菫晞匱 or 莉ｻ諢冗ｶ咏ｶ夲ｼ磯閨ｷ蠕・0譌･莉･蜀・↓謇狗ｶ壹″・・, done: false, dueOffset: 0 },
  { id: 'c8', label: '蝗ｽ豌大ｹｴ驥代∈縺ｮ蛻・崛', category: '遉ｾ莨壻ｿ晞匱', description: '騾閨ｷ蠕・4譌･莉･蜀・↓蟶ょ玄逕ｺ譚大ｽｹ蝣ｴ縺ｧ謇狗ｶ壹″', done: false, dueOffset: 0 },
  { id: 'c9', label: '髮｢閨ｷ逾ｨ縺ｮ蜿怜叙', category: '騾閨ｷ蠕・, description: '莨夂､ｾ縺九ｉ螻翫￥縺ｮ繧堤｢ｺ隱搾ｼ亥ｱ翫°縺ｪ縺・ｴ蜷医・繝上Ο繝ｼ繝ｯ繝ｼ繧ｯ縺ｫ逶ｸ隲・ｼ・, done: false, dueOffset: -10 },
  { id: 'c10', label: '螟ｱ讌ｭ菫晞匱縺ｮ逕ｳ隲・, category: '騾閨ｷ蠕・, description: '髮｢閨ｷ逾ｨ繧呈戟縺｣縺ｦ繝上Ο繝ｼ繝ｯ繝ｼ繧ｯ縺ｸ・磯閨ｷ蠕梧掠繧√↓・・, done: false, dueOffset: -14 },
  { id: 'c11', label: '貅先ｳ牙ｾｴ蜿守･ｨ縺ｮ蜿怜叙', category: '騾閨ｷ蠕・, description: '蟷ｴ譛ｫ隱ｿ謨ｴ or 遒ｺ螳夂筏蜻翫↓蠢・ｦ・, done: false, dueOffset: -30 },
  { id: 'c12', label: '騾閨ｷ驥代・遒ｺ隱・, category: '讓ｩ蛻ｩ遒ｺ隱・, description: '蟆ｱ讌ｭ隕丞援縺ｧ騾閨ｷ驥題ｦ丞ｮ壹ｒ遒ｺ隱阪よ髪邨ｦ譎よ悄繧りｦ√メ繧ｧ繝・け', done: false, dueOffset: 14 },
  { id: 'c13', label: '遶ｶ讌ｭ驕ｿ豁｢鄒ｩ蜍吶・遒ｺ隱・, category: '讓ｩ蛻ｩ遒ｺ隱・, description: '隱鍋ｴ・嶌縺ｫ鄂ｲ蜷阪＠縺溷ｴ蜷医〒繧ゅ∽ｸ榊ｽ薙↓蠎・＞遽・峇縺ｯ辟｡蜉ｹ縺ｮ蜿ｯ閭ｽ諤ｧ縺ゅｊ', done: false, dueOffset: 14 },
  { id: 'c14', label: '菴乗ｰ醍ｨ弱・謾ｯ謇輔＞譁ｹ豕慕｢ｺ隱・, category: '遞朱≡', description: '騾閨ｷ譛医↓繧医▲縺ｦ荳諡ｬ蠕ｴ蜿・or 譎ｮ騾壼ｾｴ蜿弱↓蛻・崛', done: false, dueOffset: 7 },
]

const agencies: AgencyInfo[] = [
  {
    name: '蠑∬ｭｷ螢ｫ豕穂ｺｺ縺ｿ繧・・ etc.',
    type: '蠑∬ｭｷ螢ｫ蝙・,
    price: 'ﾂ･50,000縲慊･100,000',
    features: ['譛ｪ謇輔＞谿区･ｭ莉｣縺ｮ莠､貂峨・隲区ｱゅ′蜿ｯ閭ｽ', '謳榊ｮｳ雉蜆溯ｫ区ｱゅ↓繧ょｯｾ蠢・, '豕慕噪繝医Λ繝悶Ν縺ｫ蜈ｨ髱｢蟇ｾ蠢・, '譛臥ｵｦ豸亥喧縺ｮ莠､貂・],
    risks: '雋ｻ逕ｨ縺碁ｫ倥＞',
    recommendation: '譛ｪ謇輔＞谿区･ｭ莉｣縺後≠繧区婿縲√ヱ繝ｯ繝上Λ遲峨〒謠峨ａ縺昴≧縺ｪ譁ｹ',
  },
  {
    name: '騾閨ｷ莉｣陦郡ARABA etc.',
    type: '蜉ｴ蜒咲ｵ・粋蝙・,
    price: 'ﾂ･24,000縲慊･30,000',
    features: ['蝗｣菴謎ｺ､貂画ｨｩ縺ゅｊ・域ｳ慕噪縺ｫ菫晁ｭｷ・・, '譛臥ｵｦ豸亥喧縺ｮ莠､貂牙庄閭ｽ', '騾閨ｷ譚｡莉ｶ縺ｮ莠､貂牙庄閭ｽ', '豈碑ｼ・噪螳我ｾ｡'],
    risks: '險ｴ險溷ｯｾ蠢懊・縺ｧ縺阪↑縺・,
    recommendation: '譛臥ｵｦ豸亥喧繝ｻ騾閨ｷ譚｡莉ｶ縺ｮ莠､貂峨′蠢・ｦ√↑譁ｹ',
  },
  {
    name: 'EXIT, 繝｢繝ｼ繝繝ｪ etc.',
    type: '豌鷹俣蝙・,
    price: 'ﾂ･10,000縲慊･20,000',
    features: ['譛螳牙､繧ｯ繝ｩ繧ｹ', '蟇ｾ蠢懊せ繝斐・繝峨′譌ｩ縺・, '謇狗ｶ壹″縺後す繝ｳ繝励Ν'],
    risks: '莠､貂画ｨｩ縺ｪ縺暦ｼ井ｼ晞＃縺ｮ縺ｿ・峨ゆｼ夂､ｾ縺梧拠蜷ｦ縺励◆蝣ｴ蜷医・蟇ｾ蠢懷鴨縺ｫ髯千阜',
    recommendation: '蜀・ｺ騾閨ｷ縺ｧ縲√◆縺莨昴∴縺ｦ縺ｻ縺励＞縺縺代・譁ｹ',
  },
]

// Utility
function formatDate(dateStr: string): string {
  if (!dateStr) return '____蟷ｴ__譛・_譌･'
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const reiwa = year - 2018
  return `莉､蜥・{reiwa}蟷ｴ${d.getMonth() + 1}譛・{d.getDate()}譌･`
}

function calcOvertimePay(salary: number, overtimeHours: number, months: number): { total: number; hourly: number; details: string } {
  if (!salary || !overtimeHours || !months) return { total: 0, hourly: 0, details: '' }
  // 譛育ｵｦ ﾃｷ 謇螳壼感蜒肴凾髢・160h) ﾃ・1.25 ﾃ・谿区･ｭ譎る俣 ﾃ・譛域焚
  const hourly = Math.round(salary / 160)
  const overtimeRate = Math.round(hourly * 1.25)
  const total = overtimeRate * overtimeHours * months
  const details = `譎らｵｦ逶ｸ蠖・ ﾂ･${hourly.toLocaleString()} ﾃ・蜑ｲ蠅礼紫1.25 = ﾂ･${overtimeRate.toLocaleString()}/h ﾃ・${overtimeHours}h ﾃ・${months}繝ｶ譛・
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
    { id: 'letter' as const, label: '統 騾閨ｷ螻顔函謌・, icon: '統' },
    { id: 'overtime' as const, label: '腸 谿区･ｭ莉｣險育ｮ・, icon: '腸' },
    { id: 'checklist' as const, label: '笨・繝√ぉ繝・け繝ｪ繧ｹ繝・, icon: '笨・ },
    { id: 'agencies' as const, label: '笞厄ｸ・騾閨ｷ莉｣陦梧ｯ碑ｼ・, icon: '笞厄ｸ・ },
    { id: 'rights' as const, label: '孱・・讓ｩ蛻ｩQ&A', icon: '孱・・ },
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
    const type = info.reason === '荳霄ｫ荳翫・驛ｽ蜷・ || info.reason === '縺昴・莉・ ? '騾閨ｷ螻・ : '騾閨ｷ螻・
    const reasonText = info.reason === '縺昴・莉・ ? info.customReason : info.reason
    return {
      type,
      date: formatDate(info.resignDate),
      today: formatDate(new Date().toISOString().split('T')[0]),
      company: info.companyName || '笳銀雷笳区ｪ蠑丈ｼ夂､ｾ',
      name: info.fullName || '笳銀雷 笳銀雷',
      department: info.department || '笳銀雷驛ｨ',
      reason: reasonText || '荳霄ｫ荳翫・驛ｽ蜷・,
    }
  }

  const letter = generateLetter()

  // Rights Q&A
  const rightsDatabase: Record<string, string> = {
    '譛臥ｵｦ': `縲先怏邨ｦ莨第嚊縺ｫ縺､縺・※縲曾n騾閨ｷ譎ゅ・譛臥ｵｦ豸亥喧縺ｯ蜉ｴ蜒崎・・讓ｩ蛻ｩ縺ｧ縺呻ｼ亥感蜒榊渕貅匁ｳ・9譚｡・峨ゆｼ夂､ｾ縺ｯ譎ょｭ｣螟画峩讓ｩ繧定｡御ｽｿ縺ｧ縺阪∪縺吶′縲・閨ｷ譌･莉･髯阪↓螟画峩縺吶ｋ譌･縺後↑縺・◆繧√∝ｮ溯ｳｪ逧・↓諡貞凄縺ｧ縺阪∪縺帙ｓ縲・n\n谿区律謨ｰ縺ｮ險育ｮ暦ｼ壼・遉ｾ6繝ｶ譛亥ｾ後↓10譌･莉倅ｸ弱∽ｻ･蠕・蟷ｴ縺斐→縺ｫ蠅怜刈・域怙螟ｧ20譌･/蟷ｴ・峨・n\n笞・・譛臥ｵｦ雋ｷ蜿悶・豕慕噪鄒ｩ蜍吶〒縺ｯ縺ゅｊ縺ｾ縺帙ｓ・井ｻｻ諢擾ｼ峨Ａ,
    '騾閨ｷ驥・: `縲宣閨ｷ驥代↓縺､縺・※縲曾n騾閨ｷ驥代・豕募ｾ倶ｸ翫・鄒ｩ蜍吶〒縺ｯ縺ｪ縺上∝ｰｱ讌ｭ隕丞援繧・閨ｷ驥題ｦ冗ｨ九↓蝓ｺ縺･縺阪∪縺吶・n\n遒ｺ隱阪☆縺ｹ縺咲せ・喀n繝ｻ蟆ｱ讌ｭ隕丞援縺ｫ騾閨ｷ驥題ｦ丞ｮ壹′縺ゅｋ縺欺n繝ｻ蜍､邯壼ｹｴ謨ｰ縺ｮ譚｡莉ｶ繧呈ｺ縺溘＠縺ｦ縺・ｋ縺欺n繝ｻ閾ｪ蟾ｱ驛ｽ蜷磯閨ｷ縺ｮ蝣ｴ蜷医・貂幃｡咲紫\n繝ｻ謾ｯ邨ｦ譎よ悄・磯閨ｷ蠕・縲・繝ｶ譛医′荳闊ｬ逧・ｼ噂n\n笞・・隕丞ｮ壹′縺ゅｋ縺ｮ縺ｫ謾ｯ謇輔ｏ繧後↑縺・ｴ蜷医・蜉ｴ蝓ｺ鄂ｲ縺ｫ逶ｸ隲・Ａ,
    '遶ｶ讌ｭ驕ｿ豁｢': `縲千ｫｶ讌ｭ驕ｿ豁｢鄒ｩ蜍吶↓縺､縺・※縲曾n騾閨ｷ蠕後・遶ｶ讌ｭ驕ｿ豁｢鄒ｩ蜍呻ｼ亥酔讌ｭ莉也､ｾ縺ｸ縺ｮ霆｢閨ｷ蛻ｶ髯撰ｼ峨・縲∽ｻ･荳九・譚｡莉ｶ繧呈ｺ縺溘＆縺ｪ縺・→辟｡蜉ｹ縺ｨ縺輔ｌ繧句愛萓九′螟壹＞縺ｧ縺呻ｼ喀n\n繝ｻ蛻ｶ髯先悄髢薙′蜷育炊逧・ｼ・縲・蟷ｴ遞句ｺｦ・噂n繝ｻ蝨ｰ蝓溽噪蛻ｶ髯舌′蜷育炊逧Ыn繝ｻ莉｣蜆滓蒔鄂ｮ縺後≠繧具ｼ磯閨ｷ驥代・荳贋ｹ励○遲会ｼ噂n繝ｻ蛻ｶ髯舌＆繧後ｋ讌ｭ蜍咏ｯ・峇縺梧・遒ｺ\n\n笞・・荳榊ｽ薙↓蠎・＞遽・峇縺ｮ隱鍋ｴ・嶌縺ｯ辟｡蜉ｹ縺ｮ蜿ｯ閭ｽ諤ｧ螟ｧ縲ょｼ∬ｭｷ螢ｫ縺ｫ逶ｸ隲・ｒ謗ｨ螂ｨ縲Ａ,
    '谿区･ｭ莉｣': `縲先悴謇輔＞谿区･ｭ莉｣縺ｫ縺､縺・※縲曾n譎ょ柑縺ｯ3蟷ｴ・・020蟷ｴ4譛井ｻ･髯阪・蛻・ｼ峨ゅ◎繧御ｻ･蜑阪・2蟷ｴ縲・n\n隲区ｱゅ↓蠢・ｦ√↑繧ゅ・・喀n繝ｻ繧ｿ繧､繝繧ｫ繝ｼ繝・蜍､諤險倬鹸縺ｮ繧ｳ繝斐・\n繝ｻ邨ｦ荳取・邏ｰ\n繝ｻ髮・畑螂醍ｴ・嶌\n繝ｻ蟆ｱ讌ｭ隕丞援\n\n縺ｾ縺壽悽繝・・繝ｫ縺ｮ谿区･ｭ莉｣繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ縺ｧ讎らｮ励ｒ遒ｺ隱阪＠縲∵ｭ｣遒ｺ縺ｪ驥鷹｡阪・蠑∬ｭｷ螢ｫ縺ｫ逶ｸ隲・＠縺ｦ縺上□縺輔＞縲Ａ,
    '螟ｱ讌ｭ菫晞匱': `縲仙､ｱ讌ｭ菫晞匱縺ｫ縺､縺・※縲曾n繝ｻ閾ｪ蟾ｱ驛ｽ蜷磯閨ｷ・壼ｾ・ｩ滓悄髢・譌･ + 邨ｦ莉伜宛髯・繝ｶ譛亥ｾ後°繧画髪邨ｦ\n繝ｻ莨夂､ｾ驛ｽ蜷磯閨ｷ・壼ｾ・ｩ滓悄髢・譌･蠕後°繧画髪邨ｦ\n\n蜿礼ｵｦ譚｡莉ｶ・夐閨ｷ蜑・蟷ｴ髢薙↓12繝ｶ譛井ｻ･荳翫・陲ｫ菫晞匱閠・悄髢貼n\n謇狗ｶ壹″・夐屬閨ｷ逾ｨ繧呈戟縺｣縺ｦ繝上Ο繝ｼ繝ｯ繝ｼ繧ｯ縺ｸ縲・n笞・・騾閨ｷ蠕後☆縺舌↓謇狗ｶ壹″縺励↑縺・→蜿礼ｵｦ髢句ｧ九′驕・ｌ縺ｾ縺吶Ａ,
    '2騾ｱ髢・: `縲・騾ｱ髢灘燕縺ｮ騾閨ｷ縺ｫ縺､縺・※縲曾n豌第ｳ・27譚｡縺ｫ繧医ｊ縲∵悄髢薙・螳壹ａ縺ｮ縺ｪ縺・寐逕ｨ螂醍ｴ・ｼ域ｭ｣遉ｾ蜩｡遲会ｼ峨・縲・閨ｷ縺ｮ諢乗晁｡ｨ遉ｺ縺九ｉ2騾ｱ髢薙〒騾閨ｷ縺梧・遶九＠縺ｾ縺吶・n\n蟆ｱ讌ｭ隕丞援縺ｧ縲・繝ｶ譛亥燕縲咲ｭ峨→螳壹ａ縺ｦ縺・※繧ゅ∵ｰ第ｳ輔′蜆ｪ蜈医＆繧後∪縺吶・n\n笞・・縺溘□縺励∝・貅騾閨ｷ縺ｮ縺溘ａ縺ｫ縺ｯ蟆ｱ讌ｭ隕丞援縺ｫ蠕薙≧縺ｮ縺後・繧ｿ繝ｼ縲・n笞・・螂醍ｴ・､ｾ蜩｡縺ｮ蝣ｴ蜷医・縺薙・隕丞ｮ壹・驕ｩ逕ｨ縺輔ｌ縺ｾ縺帙ｓ縲Ａ,
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
      answer = `逕ｳ縺苓ｨｳ縺ゅｊ縺ｾ縺帙ｓ縲ゅ・{rightsQuery}縲阪↓髢｢縺吶ｋ諠・ｱ縺ｯ迴ｾ蝨ｨ縺ｮ繝・・繧ｿ繝吶・繧ｹ縺ｫ縺ゅｊ縺ｾ縺帙ｓ縲・n\n莉･荳九・繧ｭ繝ｼ繝ｯ繝ｼ繝峨〒讀懃ｴ｢縺ｧ縺阪∪縺呻ｼ喀n繝ｻ譛臥ｵｦ\n繝ｻ騾閨ｷ驥曾n繝ｻ遶ｶ讌ｭ驕ｿ豁｢\n繝ｻ谿区･ｭ莉｣\n繝ｻ螟ｱ讌ｭ菫晞匱\n繝ｻ2騾ｱ髢貼n\n蜈ｷ菴鍋噪縺ｪ豕募ｾ狗嶌隲・・蠑∬ｭｷ螢ｫ繧・､ｾ蜉ｴ螢ｫ縺ｫ縺皮嶌隲・￥縺縺輔＞縲Ａ
    }
    setRightsAnswer(answer)
  }

  // Copy letter to clipboard
  const copyLetter = () => {
    const text = `${letter.today}\n\n${letter.company}\n莉｣陦ｨ蜿也ｷ蠖ｹ遉ｾ髟ｷ 谿ｿ\n\n${letter.type}\n\n縺薙・縺溘・縲・{letter.reason}縺ｫ繧医ｊ縲・{letter.date}繧偵ｂ縺｣縺ｦ騾閨ｷ縺・◆縺励◆縺上√％縺薙↓縺雁ｱ翫￠縺・◆縺励∪縺吶・n\n${letter.today}\n${letter.department}\n${letter.name}`
    navigator.clipboard.writeText(text)
    alert('騾閨ｷ螻翫ｒ繧ｯ繝ｪ繝・・繝懊・繝峨↓繧ｳ繝斐・縺励∪縺励◆')
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0f0f1a]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-4xl mb-2">統</div>
          <h1 className="text-2xl font-bold">騾閨ｷ縺ゅｓ縺励ｓAI</h1>
          <p className="text-gray-400 mt-1">騾閨ｷ螻顔函謌・ﾃ・谿区･ｭ莉｣險育ｮ・ﾃ・螳悟・繝√ぉ繝・け繝ｪ繧ｹ繝・/p>
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
              <h2 className="text-xl font-bold">騾閨ｷ螻翫ユ繝ｳ繝励Ξ繝ｼ繝育函謌・/h2>
              <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">豌丞錐</label>
                  <input
                    type="text" placeholder="邀ｳ螻ｱ 譁・ｲｴ"
                    value={info.fullName} onChange={e => updateInfo('fullName', e.target.value)}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">莨夂､ｾ蜷・/label>
                  <input
                    type="text" placeholder="譬ｪ蠑丈ｼ夂､ｾ笳銀雷笳・
                    value={info.companyName} onChange={e => updateInfo('companyName', e.target.value)}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">謇螻樣Κ鄂ｲ</label>
                  <input
                    type="text" placeholder="蝟ｶ讌ｭ驛ｨ"
                    value={info.department} onChange={e => updateInfo('department', e.target.value)}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">髮・畑蠖｢諷・/label>
                    <select
                      value={info.employeeType} onChange={e => updateInfo('employeeType', e.target.value)}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option>豁｣遉ｾ蜩｡</option>
                      <option>螂醍ｴ・､ｾ蜩｡</option>
                      <option>繝代・繝医・繧｢繝ｫ繝舌う繝・/option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">騾閨ｷ逅・罰</label>
                    <select
                      value={info.reason} onChange={e => updateInfo('reason', e.target.value)}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option>荳霄ｫ荳翫・驛ｽ蜷・/option>
                      <option>莨夂､ｾ驛ｽ蜷・/option>
                      <option>螂醍ｴ・悄髢捺ｺ莠・/option>
                      <option>縺昴・莉・/option>
                    </select>
                  </div>
                </div>
                {info.reason === '縺昴・莉・ && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">騾閨ｷ逅・罰・郁ｩｳ邏ｰ・・/label>
                    <input
                      type="text" placeholder="蜈ｷ菴鍋噪縺ｪ逅・罰繧貞・蜉・
                      value={info.customReason} onChange={e => updateInfo('customReason', e.target.value)}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">蜈･遉ｾ譌･</label>
                    <input
                      type="date" value={info.startDate} onChange={e => updateInfo('startDate', e.target.value)}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">騾閨ｷ蟶梧悍譌･</label>
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
                <h2 className="text-xl font-bold">繝励Ξ繝薙Η繝ｼ</h2>
                <button
                  onClick={copyLetter}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  搭 繧ｳ繝斐・
                </button>
              </div>
              <div className="bg-white text-gray-900 rounded-xl p-8 shadow-xl font-serif leading-loose min-h-[500px]">
                <p className="text-right mb-8">{letter.today}</p>
                <p className="mb-1">{letter.company}</p>
                <p className="mb-8">莉｣陦ｨ蜿也ｷ蠖ｹ遉ｾ髟ｷ 谿ｿ</p>
                <h2 className="text-center text-2xl font-bold mb-8 tracking-[0.5em]">{letter.type}</h2>
                <p className="text-base leading-8 mb-8">
                  縺薙・縺溘・縲＋letter.reason}縺ｫ繧医ｊ縲＋letter.date}繧偵ｂ縺｣縺ｦ騾閨ｷ縺・◆縺励◆縺上√％縺薙↓縺雁ｱ翫￠縺・◆縺励∪縺吶・                </p>
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
            <h2 className="text-xl font-bold">腸 譛ｪ謇輔＞谿区･ｭ莉｣繧ｷ繝溘Η繝ｬ繝ｼ繧ｿ繝ｼ</h2>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
              笞・・縺薙・險育ｮ礼ｵ先棡縺ｯ縺ゅ￥縺ｾ縺ｧ讎らｮ励〒縺吶よｭ｣遒ｺ縺ｪ驥鷹｡阪・遉ｾ蜉ｴ螢ｫ繝ｻ蠑∬ｭｷ螢ｫ縺ｫ縺皮｢ｺ隱阪￥縺縺輔＞縲よ凾蜉ｹ縺ｯ3蟷ｴ・・020蟷ｴ4譛井ｻ･髯搾ｼ峨〒縺吶・            </div>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">譛育ｵｦ・磯｡埼擇・・/label>
                  <input
                    type="number" placeholder="250000"
                    value={info.monthlySalary || ''} onChange={e => updateInfo('monthlySalary', Number(e.target.value))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">譛亥ｹｳ蝮・ｮ区･ｭ譎る俣</label>
                  <input
                    type="number" placeholder="30"
                    value={info.monthlyOvertimeHours || ''} onChange={e => updateInfo('monthlyOvertimeHours', Number(e.target.value))}
                    className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">譛ｪ謇輔＞譛域焚</label>
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
                  <div className="text-sm text-gray-400 mb-1">讎らｮ・譛ｪ謇輔＞谿区･ｭ莉｣</div>
                  <div className="text-5xl font-bold text-green-400">ﾂ･{overtimeResult.total.toLocaleString()}</div>
                </div>
                <div className="text-sm text-gray-400 bg-[#1a1a2e] rounded-lg p-4 font-mono">
                  <p>險育ｮ怜ｼ・</p>
                  <p>{overtimeResult.details}</p>
                  <p className="mt-2 text-xs text-gray-500">窶ｻ 謇螳壼感蜒肴凾髢薙ｒ160h/譛医→縺励※險育ｮ励よｷｱ螟懈ｮ区･ｭ(50%)繝ｻ莨第律谿区･ｭ(35%)縺ｯ蜷ｫ縺ｾ繧後※縺・∪縺帙ｓ縲・/p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Checklist */}
        {activeTab === 'checklist' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">笨・騾閨ｷ螳悟・繝√ぉ繝・け繝ｪ繧ｹ繝・/h2>
              <span className="text-sm text-gray-400">
                {completedChecks}/{totalChecks} 螳御ｺ・              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedChecks / totalChecks) * 100}%` }}
              />
            </div>

            {['譖ｸ鬘樊ｺ門ｙ', '蝣ｱ蜻・, '讓ｩ蛻ｩ遒ｺ隱・, '蠑慕ｶ吶℃', '騾閨ｷ貅門ｙ', '遉ｾ莨壻ｿ晞匱', '遞朱≡', '騾閨ｷ蠕・].map(category => {
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
                          {item.done && <span className="text-xs text-white">笨・/span>}
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
            <h2 className="text-xl font-bold">笞厄ｸ・騾閨ｷ莉｣陦後し繝ｼ繝薙せ豈碑ｼ・/h2>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-300">
              笞・・莉･荳九・荳闊ｬ逧・↑諠・ｱ縺ｧ縺吶よ侭驥代・繧ｵ繝ｼ繝薙せ蜀・ｮｹ縺ｯ螟画峩縺輔ｌ繧句ｴ蜷医′縺ゅｊ縺ｾ縺吶よ怙譁ｰ諠・ｱ縺ｯ蜷・し繝ｼ繝薙せ縺ｮ蜈ｬ蠑上し繧､繝医〒縺皮｢ｺ隱阪￥縺縺輔＞縲・            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agencies.map((agency, i) => (
                <div key={i} className={`bg-[#13131e] rounded-xl border p-6 ${
                  agency.type === '蠑∬ｭｷ螢ｫ蝙・ ? 'border-red-500/30' :
                  agency.type === '蜉ｴ蜒咲ｵ・粋蝙・ ? 'border-blue-500/30' :
                  'border-gray-700'
                }`}>
                  <div className={`text-xs font-bold px-2 py-1 rounded inline-block mb-3 ${
                    agency.type === '蠑∬ｭｷ螢ｫ蝙・ ? 'bg-red-500/20 text-red-400' :
                    agency.type === '蜉ｴ蜒咲ｵ・粋蝙・ ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {agency.type}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{agency.name}</h3>
                  <p className="text-2xl font-bold text-green-400 mb-4">{agency.price}</p>
                  <ul className="space-y-2 mb-4">
                    {agency.features.map((f, j) => (
                      <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-green-400 flex-shrink-0">笨・/span> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs text-red-400 mb-3">笞・・{agency.risks}</div>
                  <div className="text-xs text-gray-500 bg-[#1a1a2e] rounded-lg p-3">
                    庁 縺翫☆縺吶ａ: {agency.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Rights */}
        {activeTab === 'rights' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold">孱・・騾閨ｷ譎ゅ・讓ｩ蛻ｩQ&A</h2>
            <div className="bg-[#13131e] rounded-xl border border-gray-800 p-6">
              <label className="block text-sm text-gray-400 mb-2">豌励↓縺ｪ繧九く繝ｼ繝ｯ繝ｼ繝峨ｒ蜈･蜉帙＠縺ｦ縺上□縺輔＞</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="譛臥ｵｦ縲・閨ｷ驥代∫ｫｶ讌ｭ驕ｿ豁｢縲∵ｮ区･ｭ莉｣縲∝､ｱ讌ｭ菫晞匱縲・騾ｱ髢・.."
                  value={rightsQuery}
                  onChange={e => setRightsQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRightsQuery()}
                  className="flex-1 bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleRightsQuery}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  讀懃ｴ｢
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['譛臥ｵｦ', '騾閨ｷ驥・, '遶ｶ讌ｭ驕ｿ豁｢', '谿区･ｭ莉｣', '螟ｱ讌ｭ菫晞匱', '2騾ｱ髢・].map(keyword => (
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




