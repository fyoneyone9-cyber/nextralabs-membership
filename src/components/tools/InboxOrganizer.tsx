'use client'

import { useState, useEffect, useCallback } from 'react'

// ==================== TYPES ====================
type Tab = 'gmail' | 'sort' | 'reply' | 'tasks' | 'schedule' | 'checklist' | 'habits'

interface EmailEntry {
  id: string
  from: string
  subject: string
  summary: string
  urgency: 'high' | 'medium' | 'low'
  importance: 'high' | 'medium' | 'low'
  category: string
  addedAt: string
}

interface CheckItem { id: string; label: string; done: boolean; category: string }

interface GmailMessage {
  id: string
  threadId: string
  subject: string
  from: string
  date: string
  snippet: string
  labelIds: string[]
  isUnread: boolean
}

interface GmailAuth {
  accessToken: string
  refreshToken: string
  expiresAt: number
  email: string
}

// ==================== DATA ====================
const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'gmail', icon: '🔗', label: 'Gmail連携' },
  { id: 'sort', icon: '📥', label: '仕�Eけルール' },
  { id: 'reply', icon: '✉︁E, label: '返信チE��プレ' },
  { id: 'tasks', icon: '📋', label: 'タスク整琁E },
  { id: 'schedule', icon: '📅', label: '日程調整' },
  { id: 'checklist', icon: '🧹', label: 'Inbox Zero' },
  { id: 'habits', icon: '📊', label: '習�E診断' },
]

const FILTER_TEMPLATES = [
  { name: 'ニュースレター自動アーカイチE, provider: 'gmail', rule: 'from:(newsletter OR noreply OR news@) ↁEラベル「ニュースレター」�E アーカイチEↁE既読にする', keywords: ['newsletter', 'noreply', 'news@', '配信停止'] },
  { name: 'ECサイト通知', provider: 'gmail', rule: 'from:(amazon.co.jp OR rakuten.co.jp OR yahoo-corp.jp) subject:(発送EOR 注斁E��誁EOR 配送E ↁEラベル「買ぁE��」�E アーカイチE, keywords: ['amazon', 'rakuten', '発送E, '注斁E��誁E] },
  { name: 'SNS通知まとめE, provider: 'gmail', rule: 'from:(twitter.com OR facebook.com OR instagram.com OR linkedin.com) ↁEラベル「SNS」�E アーカイチEↁE既読', keywords: ['twitter', 'facebook', 'notification'] },
  { name: '請求書・領収書', provider: 'gmail', rule: 'subject:(請求書 OR 領収書 OR invoice OR receipt) ↁEラベル「経理」�E スター付き', keywords: ['請求書', '領収書', 'invoice'] },
  { name: '重要クライアント優允E, provider: 'gmail', rule: 'from:(client1@example.com OR client2@example.com) ↁEラベル「重要」�E 受信トレイに残す ↁEスター付き', keywords: ['重要E, 'クライアンチE] },
  { name: 'カレンダー招征E, provider: 'gmail', rule: 'filename:invite.ics OR subject:(招征EOR invitation OR 会議) ↁEラベル「予定、E, keywords: ['invite', '招征E, '会議'] },
  { name: '営業メール自動削除', provider: 'gmail', rule: 'subject:(無料トライアル OR 限定オファー OR セール) from:(-known_contacts) ↁEゴミ箱', keywords: ['無斁E, 'オファー', 'セール', '限宁E] },
  { name: '社冁E��ール刁E��E, provider: 'gmail', rule: 'from:(@yourcompany.co.jp) ↁEラベル「社冁E���E 受信トレイに残す', keywords: ['社冁E, '@company'] },
]

const REPLY_CATEGORIES = [
  { id: 'thanks', label: '🙏 お礼', templates: [
    { title: '打ち合わせ後�Eお礼', body: '{{相手名}}様\n\nお疲れ様です、E{自刁E��}}です、En本日はお忙しぁE��、お時間をいただきありがとぁE��ざいました、En\n{{会議冁E��}}につぁE��、大変参老E��なりました、EnぁE��だぁE��ご意見をもとに、{{次のアクション}}を進めてまぁE��ます、En\n引き続きよろしくお願いぁE��します、E },
    { title: '紹介�Eお礼', body: '{{相手名}}様\n\nお世話になっております、E{自刁E��}}です、Enこ�E度は{{紹介�E}}様をご紹介いただき、誠にありがとぁE��ざいます、En\n早速ご連絡を取らせてぁE��だきました、En{{相手名}}様�Eおかげで大変スムーズに話が進みそうです、En\n今後ともよろしくお願いぁE��します、E },
  ]},
  { id: 'decline', label: '🙅 お断めE, templates: [
    { title: '丁寧なお断めE, body: '{{相手名}}様\n\nお世話になっております、E{自刁E��}}です、Enこ�E度は{{依頼冁E��}}のご依頼をいただき、ありがとぁE��ざいます、En\n大変恐縮ですが、現在{{琁E��}}のため、お受けすることが難しい状況です、Enせっかくお声がけぁE��だぁE��にも関わらず、申し訳ござぁE��せん、En\nまた�E機会がござぁE��したら、ぜひお声がけください、En何卒よろしくお願いぁE��します、E },
    { title: '営業メールへの断めE, body: '{{相手名}}様\n\nお世話になっております、E{自刁E��}}です、Enサービスのご案�Eをいただき、ありがとぁE��ざいます、En\n社冁E��検討いたしましたが、現時点では導�Eの予定がござぁE��せん、En今後ニーズが生じた際には改めてご相諁E��せてぁE��だければ幸ぁE��す、En\nよろしくお願いぁE��します、E },
  ]},
  { id: 'schedule', label: '📅 日程調整', templates: [
    { title: '候補日提桁E, body: '{{相手名}}様\n\nお世話になっております、E{自刁E��}}です、En{{件名}}の打ち合わせにつぁE��、以下�E日程でご�E合いかがでしょぁE��、En\n① {{日晁E}}\n② {{日晁E}}\n③ {{日晁E}}\n\n所要時間�E{{時間}}程度を想定しております、Enオンライン/対面のどちらでも対応可能です、En\nご検討�Eほど、よろしくお願いぁE��します、E },
    { title: '日程確定�E返信', body: '{{相手名}}様\n\nご返信ありがとぁE��ざいます、Enそれでは、{{確定日晁E}でお願いぁE��します、En\n{{場所/URL}}にてお征E��しております、En当日はよろしくお願いぁE��します、E },
  ]},
  { id: 'followup', label: '🔄 催俁E�Eフォロー', templates: [
    { title: '丁寧な催俁E, body: '{{相手名}}様\n\nお世話になっております、E{自刁E��}}です、En先日ご連絡させてぁE��だぁE��{{件名}}の件につぁE��、その後�Eご状況�EぁE��がでしょぁE��、En\nお忙しぁE��ころ恐縮ですが、{{期限}}までにご回答いただけますと幸ぁE��す、En何かご不�E点等ございましたら、お気軽にご連絡ください、En\nよろしくお願いぁE��します、E },
    { title: '進捗確誁E, body: '{{相手名}}様\n\nお世話になっております、E{自刁E��}}です、En{{プロジェクト名}}の進捗につぁE��確認させてください、En\n現在の状況と、次のマイルスト�Eンの見通しを�E有いただけますでしょぁE��、En特に{{確認事頁E}につぁE��把握しておきたいです、En\nよろしくお願いぁE��します、E },
  ]},
  { id: 'apology', label: '🙇 お詫び', templates: [
    { title: '返信遁E��のお詫び', body: '{{相手名}}様\n\nお世話になっております、E{自刁E��}}です、Enご返信が遅くなり、大変申し訳ござぁE��せん、En\n{{琁E��}}により対応が遁E��ておりました、En{{本題�E回答}}\n\n今後�Eこ�EようなことがなぁE��ぁE��意いたします、En引き続きよろしくお願いぁE��します、E },
    { title: 'ミスのお詫び', body: '{{相手名}}様\n\nお世話になっております、E{自刁E��}}です、Enこ�E度は{{ミス冁E��}}につきまして、多大なご迷惑をおかけし、深くお詫び申し上げます、En\n原因を確認したところ、{{原因}}であることが判明いたしました、En再発防止として{{対策}}を実施ぁE��します、En\n修正版を{{期日}}までにお送りぁE��します、En重�Eてお詫び申し上げます、E },
  ]},
  { id: 'intro', label: '🤁E紹介�E自己紹仁E, templates: [
    { title: '自己紹介メール', body: '{{相手名}}様\n\n初めまして、E{紹介老E}様からご紹介いただきました、{{自刁E��}}と申します、En{{自刁E�E肩書ぁE会社名}}にて{{業務�E容}}を担当しております、En\n{{紹介老E}様から{{相手名}}様�E{{話題}}につぁE��伺ぁE��ぜひお話しさせてぁE��だきたくご連絡ぁE��しました、En\nご�E合�E良ぁE��時がござぁE��したら、お気軽にご連絡ください、En何卒よろしくお願いぁE��します、E },
  ]},
]

const INBOX_ZERO_CHECKLIST: CheckItem[] = [
  { id: 'iz1', label: '未読メールを�E件確認する（読むだけ。返信は後！E, done: false, category: '① 全件スキャン' },
  { id: 'iz2', label: '2刁E��冁E��返信できるメールはそ�E場で返信', done: false, category: '② 即処琁E },
  { id: 'iz3', label: '自刁E��アクション不要なメールをアーカイチE, done: false, category: '② 即処琁E },
  { id: 'iz4', label: 'ニュースレター・通知メールを一括アーカイチE, done: false, category: '② 即処琁E },
  { id: 'iz5', label: '返信が忁E��だが時間がかかるメールにスター付け', done: false, category: '③ 仕�EぁE },
  { id: 'iz6', label: 'タスクが発生するメールをToDoリストに転訁E, done: false, category: '③ 仕�EぁE },
  { id: 'iz7', label: '参�E用メールにラベルを付けてアーカイチE, done: false, category: '③ 仕�EぁE },
  { id: 'iz8', label: '不要な配信メールの「�E信停止」をクリチE���E�E件以上！E, done: false, category: '④ 削渁E },
  { id: 'iz9', label: 'フィルタールールめEつ以上新規作�E', done: false, category: '④ 削渁E },
  { id: 'iz10', label: 'スター付きメールの返信を�Eて完亁E, done: false, category: '⑤ 完亁E },
  { id: 'iz11', label: '受信トレイのメール数ぁEになっぁE, done: false, category: '⑤ 完亁E },
  { id: 'iz12', label: '明日の「メール処琁E��イム」をカレンダーに30刁E��ロチE��', done: false, category: '⑥ 習�E匁E },
]

const SCHEDULE_SITUATIONS = [
  { id: 'meeting', label: '🏢 社冁E��ーチE��ング', duration: '30刁E��E時間', format: 'オンライン or 会議室' },
  { id: 'client', label: '🤁Eクライアント打ち合わぁE, duration: '1時間', format: 'オンライン or 訪啁E },
  { id: 'interview', label: '🎤 面接・面諁E, duration: '30刁E��E時間', format: 'オンライン or 対面' },
  { id: 'lunch', label: '🍽�E�EランチミーチE��ング', duration: '1時間', format: '対面�E�レストラン�E�E },
  { id: 'casual', label: '☁Eカジュアル面諁E, duration: '30刁E, format: 'オンライン or カフェ' },
]

// ==================== COMPONENT ====================
export default function InboxOrganizer() {
  const [tab, setTab] = useState<Tab>('gmail')
  const [copied, setCopied] = useState('')
  
  // Gmail API state
  const [gmailAuth, setGmailAuth] = useState<GmailAuth | null>(null)
  const [gmailMessages, setGmailMessages] = useState<GmailMessage[]>([])
  const [gmailLoading, setGmailLoading] = useState(false)
  const [gmailError, setGmailError] = useState('')
  const [gmailClassified, setGmailClassified] = useState<Map<string, { urgency: string; importance: string; category: string; action: string }>>(new Map())
  const [draftStatus, setDraftStatus] = useState<Map<string, string>>(new Map())
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null)
  const [draftBody, setDraftBody] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiError, setAiError] = useState(false)
  const [messageBody, setMessageBody] = useState('')
  const [loadingBody, setLoadingBody] = useState(false)
  
  // Reply tab
  const [replyCategory, setReplyCategory] = useState('thanks')
  
  // Tasks tab
  const [emails, setEmails] = useState<EmailEntry[]>([])
  const [newEmail, setNewEmail] = useState({ from: '', subject: '', summary: '' })
  
  // Schedule tab
  const [scheduleForm, setScheduleForm] = useState({
    situation: 'meeting',
    partnerName: '',
    myName: '',
    topic: '',
    date1: '',
    date2: '',
    date3: '',
    duration: '1時間',
    location: 'オンライン�E�Eoom�E�E,
  })
  
  // Checklist
  const [checklist, setChecklist] = useState<CheckItem[]>(INBOX_ZERO_CHECKLIST)
  
  // Habits
  const [habits, setHabits] = useState({
    dailyEmails: 50,
    unreadCount: 30,
    processTimeMin: 60,
    avgReplyHours: 24,
    checkFrequency: 10,
    subscriptions: 20,
  })
  const [habitsResult, setHabitsResult] = useState<null | { score: number; level: string; tips: string[] }>(null)

  // Gmail: classify messages client-side
  const classifyMessage = useCallback((msg: GmailMessage) => {
    const text = (msg.subject + ' ' + msg.from + ' ' + msg.snippet).toLowerCase()
    const urgencyKeywords = ['至急', '急ぁE, '今日中', '本日', 'asap', '緊急', '締刁E, 'deadline', 'urgent']
    const importanceKeywords = ['契紁E, '請汁E, '決箁E, '社長', '役員', 'ceo', '重要E, '忁E��E, '確認忁E��E, 'invoice', '見穁E]
    
    const urgency = urgencyKeywords.some(k => text.includes(k)) ? '🔴 髁E : '🟡 中'
    const importance = importanceKeywords.some(k => text.includes(k)) ? '🔴 髁E : '🟡 中'
    
    let category = '📁 そ�E仁E
    let action = 'アーカイブ候裁E
    if (/請汁E領収|invoice|見積|receipt/.test(text)) { category = '💰 経理'; action = '確認して保孁E }
    else if (/打ち合わせ|会議|ミ�EチE��ング|mtg|日程|meeting|calendar/.test(text)) { category = '📅 予宁E; action = 'カレンダー確誁E }
    else if (/タスク|依頼|お願い|対応|todo/.test(text)) { category = '📋 タスク'; action = 'ToDoに追加' }
    else if (/報告|共有|fyi|周知|newsletter|ニュースレター/.test(text)) { category = '📢 惁E��共朁E; action = '後で読む' }
    else if (/確認|承認|レビュー|チェチE��|approve|review/.test(text)) { category = '✁E承誁E; action = '今すぐ対忁E }
    else if (/noreply|no-reply|配信停止|unsubscribe/.test(text)) { category = '🔕 自動通知'; action = 'アーカイチE }
    
    if (urgency === '🔴 髁E && importance === '🔴 髁E) action = '🔥 今すぐ対応！E
    else if (urgency === '🔴 髁E) action = '⚡ 早めに対忁E
    
    return { urgency, importance, category, action }
  }, [])

  // Gmail: fetch messages
  const fetchGmailMessages = useCallback(async () => {
    if (!gmailAuth) return
    setGmailLoading(true)
    setGmailError('')
    try {
      const res = await fetch('/api/gmail/messages?maxResults=30&q=in:inbox', {
        headers: { Authorization: `Bearer ${gmailAuth.accessToken}` },
      })
      if (!res.ok) {
        if (res.status === 401) {
          setGmailAuth(null)
          sessionStorage.removeItem('gmail-auth')
          setGmailError('セチE��ョンが�Eれました。�Eログインしてください、E)
          return
        }
        throw new Error('Failed to fetch')
      }
      const data = await res.json()
      setGmailMessages(data.messages || [])
      
      // Classify all messages
      const classified = new Map<string, { urgency: string; importance: string; category: string; action: string }>()
      for (const msg of (data.messages || [])) {
        classified.set(msg.id, classifyMessage(msg))
      }
      setGmailClassified(classified)
    } catch {
      setGmailError('メールの取得に失敗しました、E)
    } finally {
      setGmailLoading(false)
    }
  }, [gmailAuth, classifyMessage])

  // Gmail: create draft
  const createDraft = async (msg: GmailMessage, body: string) => {
    if (!gmailAuth || !body.trim()) return
    setDraftStatus(prev => new Map(prev).set(msg.id, 'saving...'))
    try {
      const fromMatch = msg.from.match(/<(.+?)>/)
      const to = fromMatch ? fromMatch[1] : msg.from
      const res = await fetch('/api/gmail/draft', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${gmailAuth.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject: `Re: ${msg.subject}`,
          body,
          threadId: msg.threadId,
        }),
      })
      if (!res.ok) throw new Error('Draft creation failed')
      setDraftStatus(prev => new Map(prev).set(msg.id, '✁E下書き保存済み'))
      setDraftBody('')
      setSelectedMessage(null)
    } catch {
      setDraftStatus(prev => new Map(prev).set(msg.id, '❁E失敁E))
    }
  }

  // Fetch full message body when opening draft modal
  const openDraftModal = async (msg: GmailMessage) => {
    setSelectedMessage(msg)
    setDraftBody('')
    setAiError(false)
    setMessageBody('')
    setLoadingBody(true)
    try {
      const res = await fetch(`/api/gmail/message?id=${msg.id}`, {
        headers: { Authorization: `Bearer ${gmailAuth?.accessToken}` },
      })
      if (res.ok) {
        const data = await res.json()
        setMessageBody(data.body || msg.snippet || '')
      } else {
        setMessageBody(msg.snippet || '')
      }
    } catch {
      setMessageBody(msg.snippet || '')
    } finally {
      setLoadingBody(false)
    }
  }

  // Build prompt for AI reply (reusable for copy-to-clipboard fallback)
  const buildReplyPrompt = (msg: GmailMessage) => {
    const content = messageBody || msg.snippet
    return `以下�Eメールに対する丁寧な日本語ビジネスメールの返信本斁E��作�Eしてください、E
【差出人、E{msg.from}
【件名、E{msg.subject}
【メール本斁E��E${content}

ルール�E�E- 「お世話になっております。」から始めめE- 件名と冁E��に具体的に言及すめE- 5、E0行程度
- 最後�E「よろしくお願いぁE��します。」で締める
- 署名�E含めなぁE- 返信本斁E�Eみ出力`
  }

  // AI auto-generate reply
  const generateAiReply = async (msg: GmailMessage) => {
    setAiGenerating(true)
    setAiError(false)
    setDraftBody('')
    try {
      const res = await fetch('/api/gmail/ai-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: msg.subject,
          from: msg.from,
          snippet: messageBody || msg.snippet,
        }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'AI generation failed')
      }
      const data = await res.json()
      if (data.reply) {
        setDraftBody(data.reply)
        setAiError(false)
      } else {
        setAiError(true)
      }
    } catch (err) {
      console.error('AI reply error:', err)
      setAiError(true)
    } finally {
      setAiGenerating(false)
    }
  }

  // Gmail: trash message
  const trashMessage = async (msg: GmailMessage) => {
    if (!gmailAuth) return
    if (!confirm(`、E{msg.subject}」をゴミ箱に移動しますか�E�`)) return
    try {
      const res = await fetch('/api/gmail/trash', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${gmailAuth.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId: msg.id }),
      })
      if (!res.ok) throw new Error('Trash failed')
      // Remove from local list
      setGmailMessages(prev => prev.filter(m => m.id !== msg.id))
      setGmailClassified(prev => {
        const next = new Map(prev)
        next.delete(msg.id)
        return next
      })
    } catch (err) {
      console.error('Trash error:', err)
      alert('ゴミ箱への移動に失敗しました、Emailに再ログインしてください、E)
    }
  }

  // Load/save + Gmail auth from URL hash
  useEffect(() => {
    try {
      const saved = localStorage.getItem('inbox-organizer-emails')
      if (saved) setEmails(JSON.parse(saved))
      const savedChecklist = localStorage.getItem('inbox-organizer-checklist')
      if (savedChecklist) setChecklist(JSON.parse(savedChecklist))
    } catch {}

    // Check for Gmail OAuth callback in URL hash
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash.startsWith('#gmail_auth=')) {
        const params = new URLSearchParams(hash.slice('#gmail_auth='.length))
        const accessToken = params.get('access_token')
        const email = params.get('email')
        const expiresIn = parseInt(params.get('expires_in') || '3600')
        if (accessToken) {
          const auth: GmailAuth = {
            accessToken,
            refreshToken: params.get('refresh_token') || '',
            expiresAt: Date.now() + expiresIn * 1000,
            email: email || '',
          }
          setGmailAuth(auth)
          sessionStorage.setItem('gmail-auth', JSON.stringify(auth))
          // Clean URL hash
          window.history.replaceState(null, '', window.location.pathname)
        }
      }

      // Check URL for error
      const urlParams = new URLSearchParams(window.location.search)
      const gmailErr = urlParams.get('gmail_error')
      if (gmailErr) {
        setGmailError(`Gmail認証エラー: ${gmailErr}`)
        window.history.replaceState(null, '', window.location.pathname)
      }

      // Restore session
      try {
        const savedAuth = sessionStorage.getItem('gmail-auth')
        if (savedAuth) {
          const auth = JSON.parse(savedAuth) as GmailAuth
          if (auth.expiresAt > Date.now()) {
            setGmailAuth(auth)
          } else {
            sessionStorage.removeItem('gmail-auth')
          }
        }
      } catch {}
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem('inbox-organizer-emails', JSON.stringify(emails)) } catch {}
  }, [emails])

  useEffect(() => {
    try { localStorage.setItem('inbox-organizer-checklist', JSON.stringify(checklist)) } catch {}
  }, [checklist])

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  // Task categorization
  const addEmail = () => {
    if (!newEmail.subject.trim()) return
    const urgencyKeywords = ['至急', '急ぁE, '今日中', '本日', 'ASAP', '緊急', '締刁E, 'deadline']
    const importanceKeywords = ['契紁E, '請汁E, '決箁E, '社長', '役員', 'CEO', '重要E, '忁E��E, '確認忁E��E]
    const urgency: EmailEntry['urgency'] = urgencyKeywords.some(k => (newEmail.subject + newEmail.summary).includes(k)) ? 'high' : 'medium'
    const importance: EmailEntry['importance'] = importanceKeywords.some(k => (newEmail.subject + newEmail.summary).includes(k)) ? 'high' : 'medium'
    
    let category = '📁 そ�E仁E
    if (/請汁E領収|invoice|見穁E.test(newEmail.subject + newEmail.summary)) category = '💰 経理'
    else if (/打ち合わせ|会議|ミ�EチE��ング|MTG|日稁E.test(newEmail.subject + newEmail.summary)) category = '📅 予宁E
    else if (/タスク|依頼|お願い|対忁E.test(newEmail.subject + newEmail.summary)) category = '📋 タスク'
    else if (/報告|共有|FYI|周知/.test(newEmail.subject + newEmail.summary)) category = '📢 惁E��共朁E
    else if (/確認|承認|レビュー|チェチE��/.test(newEmail.subject + newEmail.summary)) category = '✁E承誁E
    
    const entry: EmailEntry = {
      id: Date.now().toString(),
      ...newEmail,
      urgency,
      importance,
      category,
      addedAt: new Date().toLocaleString('ja-JP'),
    }
    setEmails(prev => [entry, ...prev])
    setNewEmail({ from: '', subject: '', summary: '' })
  }

  // Schedule email generator
  const generateScheduleEmail = () => {
    const f = scheduleForm
    const sit = SCHEDULE_SITUATIONS.find(s => s.id === f.situation)
    return `${f.partnerName || '○○'}槁E
お世話になっております、E{f.myName || '○○'}です、E${f.topic ? `${f.topic}につぁE��、` : ''}お打ち合わせ�Eお時間をぁE��だけなぁE��しょぁE��、E
以下�E日程でご�E合いかがでしょぁE��、E
① ${f.date1 || '○月○日�E�○�E�E0:00、E}
② ${f.date2 || '○月○日�E�○�E�E0:00、E}
③ ${f.date3 || '○月○日�E�○�E�E0:00、E}

所要時間！E{f.duration || sit?.duration || '1時間'}程度
形式！E{f.location || sit?.format || 'オンライン'}

上記以外でもご都合�E良ぁE��時がござぁE��したら、お気軽にご指定ください、Eお忙しぁE��ころ恐縮ですが、ご検討�Eほどよろしくお願いぁE��します。`
  }

  // Habits diagnosis
  const diagnoseHabits = () => {
    let score = 100
    const tips: string[] = []
    const h = habits

    if (h.unreadCount > 50) { score -= 25; tips.push('🔴 未読50件以上�E危険。まず、E刁E��ール」で即返信できるも�Eを片付けましょぁE) }
    else if (h.unreadCount > 20) { score -= 15; tips.push('🟡 未読20件趁E��E日の終わりに受信トレイを空にする習�EをつけましょぁE) }
    else if (h.unreadCount <= 5) { tips.push('🟢 未読5件以下�E優秀�E�Inbox Zeroに近い状態でぁE) }

    if (h.processTimeMin > 120) { score -= 20; tips.push('🔴 メール処琁E��2時間以上。フィルタールールで自動仕�Eけを強化しましょぁE) }
    else if (h.processTimeMin > 60) { score -= 10; tips.push('🟡 1時間以上�Eメール処琁E��テンプレート活用で返信時間を短縮できまぁE) }

    if (h.checkFrequency > 15) { score -= 15; tips.push('🔴 1日15回以上メールチェチE��は雁E��力�E大敵、E日3、E回�Eバッチ�E琁E��刁E��替えましょぁE) }
    else if (h.checkFrequency > 8) { score -= 8; tips.push('🟡 メールチェチE��回数が多め。通知をOFFにして決まった時間にだけ確認する習�EめE) }

    if (h.avgReplyHours > 48) { score -= 15; tips.push('🔴 返信に48時間以上。「受領しました」�E一次返信だけでめE4時間以冁E��送りましょぁE) }
    else if (h.avgReplyHours > 24) { score -= 5; tips.push('🟡 返信は24時間以冁E��琁E��。スター機�Eで要返信メールを見失わなぁE��夫めE) }

    if (h.subscriptions > 30) { score -= 15; tips.push('🔴 購読30件趁E�Eノイズの允E��今すぐ不要なニュースレターめE0件解除しましょぁE) }
    else if (h.subscriptions > 15) { score -= 5; tips.push('🟡 購読が多め。月1で「�E信停止チE�E」を設けて棚卸しを') }

    if (h.dailyEmails > 100) { score -= 10; tips.push('💡 1日100通趁E�E受信は構造皁E��問題。Slack等へのチャネル移行を検討しましょぁE) }

    if (tips.length === 0) tips.push('🎉 素晴らしぁE��あなた�Eメール管琁E�E非常に健全でぁE)

    const level = score >= 80 ? '🟢 優秀' : score >= 60 ? '🟡 改喁E�E余地あり' : score >= 40 ? '🟠 要注愁E : '🔴 危険'
    setHabitsResult({ score: Math.max(0, score), level, tips })
  }

  const checklistProgress = checklist.filter(c => c.done).length
  const checklistCategories = Array.from(new Set(checklist.map(c => c.category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📬</span>
              <h1 className="text-lg font-bold">Gmail AI Accelerator</h1>
            </div>
            <span className="text-xs text-white/30">ブラウザ冁E�E琁E�EチE�Eタ送信なぁE/span>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ⓪ Gmail連携 */}
        {tab === 'gmail' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🔗 Gmail連携</h2>
              <p className="text-sm text-white/50">Googleアカウントでログインして受信トレイを�E動�E顁E/p>
            </div>

            {!gmailAuth ? (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-6 text-center space-y-4">
                  <div className="text-5xl">📬</div>
                  <h3 className="text-lg font-bold">Gmailに接綁E/h3>
                  <p className="text-sm text-white/50 max-w-md mx-auto">
                    Googleアカウントでログインすると、受信トレイのメールを�E動で
                    <strong className="text-teal-400">緊急度×重要度マトリクス</strong>で刁E��します、E                  </p>
                  <a
                    href="/api/auth/gmail"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Googleでログイン
                  </a>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-300/70 max-w-md mx-auto">
                    ⚠�E�E読み取り専用�E�件名�E差出人�E�E 下書き作�E + ゴミ箱移動。メールの送信は行いません、E                  </div>
                </div>

                {gmailError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                    ❁E{gmailError}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Connected status */}
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✁E/span>
                    <div>
                      <p className="text-sm font-bold text-teal-400">Gmail接続済み</p>
                      <p className="text-xs text-white/50">{gmailAuth.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={fetchGmailMessages}
                      disabled={gmailLoading}
                      className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg text-xs font-medium hover:bg-teal-500/30 disabled:opacity-50"
                    >
                      {gmailLoading ? '⏳ 取得中...' : '📥 メール取征E}
                    </button>
                    <button
                      onClick={() => { setGmailAuth(null); sessionStorage.removeItem('gmail-auth'); setGmailMessages([]); setGmailClassified(new Map()) }}
                      className="px-3 py-2 bg-white/5 text-white/40 rounded-lg text-xs hover:bg-white/10"
                    >
                      ログアウチE                    </button>
                  </div>
                </div>

                {gmailError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                    ❁E{gmailError}
                  </div>
                )}

                {/* Draft modal */}
                {selectedMessage && (
                  <div className="bg-white/5 border border-teal-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold">✏︁E下書き作�E</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { trashMessage(selectedMessage); setSelectedMessage(null); setDraftBody('') }}
                          className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
                          title="ゴミ箱に移勁E
                        >
                          🗑�E�E削除
                        </button>
                        <button onClick={() => { setSelectedMessage(null); setDraftBody('') }} className="text-xs text-white/30 hover:text-white/60">✁E閉じめE/button>
                      </div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-3 text-xs space-y-1.5">
                      <p className="text-white/40">From: {selectedMessage.from}</p>
                      <p className="text-white/40">Subject: {selectedMessage.subject}</p>
                      <p className="text-white/40">Date: {selectedMessage.date}</p>
                      <div className="border-t border-white/10 pt-1.5 mt-1.5">
                        {loadingBody ? (
                          <p className="text-white/40 animate-pulse">📨 メール本斁E��読み込み中...</p>
                        ) : (
                          <pre className="text-white/70 leading-relaxed whitespace-pre-wrap font-sans max-h-[60vh] overflow-y-auto">{(messageBody || selectedMessage.snippet).replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')}</pre>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => generateAiReply(selectedMessage)}
                      disabled={aiGenerating}
                      className="w-full py-2 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-lg text-xs font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {aiGenerating ? (
                        <><span className="animate-spin">⏳</span> AIが返信斁E��生�E中...</>
                      ) : (
                        <>🤁EAIで返信斁E��自動生戁E/>
                      )}
                    </button>

                    {/* AI error fallback: copy prompt + external links */}
                    {aiError && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 space-y-2">
                        <p className="text-xs text-amber-300">⚠�E�EAIサーバ�Eが混雑中です。以下�E方法で返信斁E��作�Eできます！E/p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(buildReplyPrompt(selectedMessage))
                            alert('プロンプトをコピ�Eしました�E�E)
                          }}
                          className="w-full py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg text-xs font-bold text-amber-200 hover:bg-amber-500/30"
                        >
                          📋 プロンプトをコピ�E
                        </button>
                        <div className="flex gap-2">
                          <a
                            href="https://gemini.google.com/app"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => navigator.clipboard.writeText(buildReplyPrompt(selectedMessage))}
                            className="flex-1 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs font-bold text-blue-200 hover:bg-blue-500/30 text-center"
                          >
                            ✨ Geminiで作�E
                          </a>
                          <a
                            href="https://chatgpt.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => navigator.clipboard.writeText(buildReplyPrompt(selectedMessage))}
                            className="flex-1 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg text-xs font-bold text-green-200 hover:bg-green-500/30 text-center"
                          >
                            💬 ChatGPTで作�E
                          </a>
                        </div>
                        <p className="text-[10px] text-white/30">↑ プロンプトが自動コピーされます → 外部AIに貼り付けてください</p>
                      </div>
                    )}

                    <textarea
                      value={draftBody}
                      onChange={e => setDraftBody(e.target.value)}
                      placeholder="返信本斁E��入劁E..&#10;�E�🤁E上�EボタンでAIが�E動生成、また�E手動入力！E
                      className="w-full h-32 bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white/80 placeholder-white/30 resize-none focus:outline-none focus:border-teal-500/30"
                    />
                    <button
                      onClick={() => createDraft(selectedMessage, draftBody)}
                      disabled={!draftBody.trim()}
                      className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-30"
                    >
                      📝 Gmailの下書きに保存（送信はしません�E�E                    </button>
                  </div>
                )}

                {/* Messages list (hidden when draft modal is open) */}
                {gmailMessages.length > 0 && !selectedMessage && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold">📬 受信トレイ�E�EgmailMessages.length}件�E�E/h3>
                      <div className="flex gap-2 text-xs text-white/30">
                        <span>🔴髁E🟡中</span>
                      </div>
                    </div>

                    {/* Eisenhower summary */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: '🔥 今すぐ対忁E, count: Array.from(gmailClassified.values()).filter(c => c.urgency === '🔴 髁E && c.importance === '🔴 髁E).length, bg: 'bg-red-500/10 border-red-500/20' },
                        { label: '⚡ 早めに対忁E, count: Array.from(gmailClassified.values()).filter(c => c.urgency === '🔴 髁E && c.importance !== '🔴 髁E).length, bg: 'bg-orange-500/10 border-orange-500/20' },
                        { label: '📌 計画して対忁E, count: Array.from(gmailClassified.values()).filter(c => c.urgency !== '🔴 髁E && c.importance === '🔴 髁E).length, bg: 'bg-amber-500/10 border-amber-500/20' },
                        { label: '📂 後回しOK', count: Array.from(gmailClassified.values()).filter(c => c.urgency !== '🔴 髁E && c.importance !== '🔴 髁E).length, bg: 'bg-white/5 border-white/10' },
                      ].map(q => (
                        <div key={q.label} className={`rounded-lg p-3 border ${q.bg}`}>
                          <div className="text-xs font-bold">{q.label}</div>
                          <div className="text-2xl font-bold mt-1">{q.count}</div>
                        </div>
                      ))}
                    </div>

                    {/* Message rows */}
                    <div className="space-y-1.5 max-h-[60vh] overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch', willChange: 'scroll-position' }}>
                      {gmailMessages.map(msg => {
                        const cls = gmailClassified.get(msg.id)
                        const status = draftStatus.get(msg.id)
                        return (
                          <div key={msg.id} className={`bg-white/5 rounded-lg p-3 space-y-1.5 cursor-pointer hover:bg-white/10 ${msg.isUnread ? 'border-l-2 border-teal-500' : ''}`} onClick={() => openDraftModal(msg)}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  {msg.isUnread && <span className="w-2 h-2 bg-teal-400 rounded-full flex-shrink-0" />}
                                  <span className="text-xs text-white/40 line-clamp-1">{msg.from.replace(/<.*>/, '').trim()}</span>
                                </div>
                                <p className={`text-sm line-clamp-1 ${msg.isUnread ? 'font-bold text-white/90' : 'text-white/70'}`}>{msg.subject || '(件名なぁE'}</p>
                                <p className="text-xs text-white/30 line-clamp-1 mt-0.5">{msg.snippet}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <span className="text-xs text-white/30">{new Date(msg.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</span>
                                {cls && <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/50">{cls.category}</span>}
                              </div>
                            </div>
                            {cls && (
                              <div className="flex items-center justify-between">
                                <div className="flex gap-2 text-xs">
                                  <span>緊急{cls.urgency}</span>
                                  <span>重要{cls.importance}</span>
                                  <span className="text-teal-400 font-medium">ↁE{cls.action}</span>
                                </div>
                                <div className="flex gap-1.5">
                                  {status ? (
                                    <span className="text-xs text-white/40">{status}</span>
                                  ) : (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); openDraftModal(msg) }}
                                      className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs hover:bg-teal-500/30"
                                    >
                                      ✏︁E下書ぁE                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); trashMessage(msg) }}
                                    className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
                                    title="ゴミ箱に移勁E
                                  >
                                    🗑�E�E                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {!gmailLoading && gmailMessages.length === 0 && (
                  <div className="bg-white/5 rounded-xl p-8 text-center">
                    <p className="text-3xl mb-2">📬</p>
                    <p className="text-sm text-white/50">「メール取得」�Eタンを押して受信トレイを取征E/p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ① 仕�Eけルール */}
        {tab === 'sort' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📥 Gmailフィルタールール雁E/h2>
              <p className="text-sm text-white/50">コピ�Eして Gmail 設宁EↁEフィルタ ↁE新規作�E で適用</p>
            </div>
            
            <div className="space-y-3">
              {FILTER_TEMPLATES.map((f, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">{f.name}</h3>
                    <button onClick={() => copyText(f.rule, `filter-${i}`)} className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-lg text-xs hover:bg-teal-500/30">
                      {copied === `filter-${i}` ? '✁Eコピ�E済み' : '📋 コピ�E'}
                    </button>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 text-xs text-white/70 font-mono">{f.rule}</div>
                  <div className="flex flex-wrap gap-1">
                    {f.keywords.map(k => (
                      <span key={k} className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/40">{k}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-teal-400 mb-2">💡 カスタムルール作�EのコチE/h3>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• <strong>from:</strong> で送信老E��持E��！ER で褁E��可�E�E/li>
                <li>• <strong>subject:</strong> で件名�Eキーワードを持E��E/li>
                <li>• <strong>has:attachment</strong> で添付ファイル付きメールを抽出</li>
                <li>• <strong>larger:5M</strong> で大きいメールだけフィルタ</li>
                <li>• フィルタは「受信済みメールにも適用」にチェチE��を忘れずに</li>
              </ul>
            </div>
          </div>
        )}

        {/* ② 返信チE��プレーチE*/}
        {tab === 'reply' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">✉︁E返信チE��プレート集</h2>
              <p className="text-sm text-white/50">{'{{変数}}'} を�E刁E�E冁E��に置き換えて使用</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {REPLY_CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setReplyCategory(c.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${replyCategory === c.id ? 'bg-teal-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {c.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {REPLY_CATEGORIES.find(c => c.id === replyCategory)?.templates.map((t, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">{t.title}</h3>
                    <button onClick={() => copyText(t.body, `reply-${replyCategory}-${i}`)} className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-lg text-xs hover:bg-teal-500/30">
                      {copied === `reply-${replyCategory}-${i}` ? '✁Eコピ�E済み' : '📋 コピ�E'}
                    </button>
                  </div>
                  <pre className="bg-black/30 rounded-lg p-3 text-xs text-white/70 whitespace-pre-wrap leading-relaxed">{t.body}</pre>
                </div>
              ))}
            </div>

            <button onClick={() => {
              const allTemplates = REPLY_CATEGORIES.flatMap(c => c.templates.map(t => `、E{c.label}  E${t.title}】\n\n${t.body}`)).join('\n\n' + '='.repeat(40) + '\n\n')
              copyText(allTemplates, 'all-templates')
            }} className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-sm font-bold hover:opacity-90">
              {copied === 'all-templates' ? '✁E全チE��プレートコピ�E済み' : '📋 全チE��プレートを一括コピ�E'}
            </button>
          </div>
        )}

        {/* ③ タスク整琁E*/}
        {tab === 'tasks' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📋 タスク整琁E��緊急×重要�Eトリクス�E�E/h2>
              <p className="text-sm text-white/50">メールの件名�E要紁E��入力すると自動�E顁E/p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <input value={newEmail.from} onChange={e => setNewEmail(p => ({ ...p, from: e.target.value }))} placeholder="差出人�E�侁E 田中さん�E�E className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              <input value={newEmail.subject} onChange={e => setNewEmail(p => ({ ...p, subject: e.target.value }))} placeholder="件名（侁E 【�E急】来週の見積書確認！E className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              <textarea value={newEmail.summary} onChange={e => setNewEmail(p => ({ ...p, summary: e.target.value }))} placeholder="要紁E��任意！E className="w-full h-16 bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-white/70 resize-none placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              <button onClick={addEmail} className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-sm font-bold hover:opacity-90">📥 追加して自動�E顁E/button>
            </div>

            {emails.length > 0 && (
              <>
                {/* Eisenhower Matrix */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: '🔴 緊急 ÁE重要E, filter: (e: EmailEntry) => e.urgency === 'high' && e.importance === 'high', bg: 'bg-red-500/10 border-red-500/20', desc: '今すぐ対忁E },
                    { label: '🟡 非緊急 ÁE重要E, filter: (e: EmailEntry) => e.urgency !== 'high' && e.importance === 'high', bg: 'bg-amber-500/10 border-amber-500/20', desc: '計画して対忁E },
                    { label: '🟠 緊急 ÁE非重要E, filter: (e: EmailEntry) => e.urgency === 'high' && e.importance !== 'high', bg: 'bg-orange-500/10 border-orange-500/20', desc: '委任を検訁E },
                    { label: '⚪ 非緊急 ÁE非重要E, filter: (e: EmailEntry) => e.urgency !== 'high' && e.importance !== 'high', bg: 'bg-white/5 border-white/10', desc: 'アーカイブ候裁E },
                  ].map((q, qi) => (
                    <div key={qi} className={`rounded-xl p-3 border ${q.bg}`}>
                      <div className="text-xs font-bold mb-1">{q.label}</div>
                      <div className="text-xs text-white/30 mb-2">{q.desc}</div>
                      {emails.filter(q.filter).map(e => (
                        <div key={e.id} className="bg-black/20 rounded-lg p-2 mb-1.5 text-xs">
                          <div className="font-medium text-white/80 truncate">{e.subject}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-white/30">{e.from}</span>
                            <span className="px-1.5 py-0.5 bg-white/5 rounded text-white/40">{e.category}</span>
                          </div>
                        </div>
                      ))}
                      {emails.filter(q.filter).length === 0 && <div className="text-xs text-white/20 text-center py-2">なぁE/div>}
                    </div>
                  ))}
                </div>

                <button onClick={() => { setEmails([]); localStorage.removeItem('inbox-organizer-emails') }} className="text-xs text-white/30 hover:text-red-400">🗑�E�E全件クリア</button>
              </>
            )}
          </div>
        )}

        {/* ④ 日程調整 */}
        {tab === 'schedule' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📅 日程調整メール生�E</h2>
              <p className="text-sm text-white/50">入力するだけで丁寧な日程調整メールが完�E</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {SCHEDULE_SITUATIONS.map(s => (
                <button key={s.id} onClick={() => setScheduleForm(p => ({ ...p, situation: s.id }))} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${scheduleForm.situation === s.id ? 'bg-teal-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {s.label}
                </button>
              ))}
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={scheduleForm.partnerName} onChange={e => setScheduleForm(p => ({ ...p, partnerName: e.target.value }))} placeholder="相手�E名前" className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
                <input value={scheduleForm.myName} onChange={e => setScheduleForm(p => ({ ...p, myName: e.target.value }))} placeholder="自刁E�E名前" className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              </div>
              <input value={scheduleForm.topic} onChange={e => setScheduleForm(p => ({ ...p, topic: e.target.value }))} placeholder="打ち合わせ�E目皁E��任意！E className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              <div className="space-y-2">
                <label className="text-xs text-white/40">候補日時！Eつ�E�E/label>
                {['date1', 'date2', 'date3'].map((key, i) => (
                  <input key={key} value={scheduleForm[key as keyof typeof scheduleForm]} onChange={e => setScheduleForm(p => ({ ...p, [key]: e.target.value }))} placeholder={`候裁E{i + 1}: 例！E朁E0日�E�月�E�E4:00〜`} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={scheduleForm.duration} onChange={e => setScheduleForm(p => ({ ...p, duration: e.target.value }))} placeholder="所要時閁E className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
                <input value={scheduleForm.location} onChange={e => setScheduleForm(p => ({ ...p, location: e.target.value }))} placeholder="場所・形弁E className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">生�E結果</h3>
                <button onClick={() => copyText(generateScheduleEmail(), 'schedule-email')} className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-lg text-xs hover:bg-teal-500/30">
                  {copied === 'schedule-email' ? '✁Eコピ�E済み' : '📋 コピ�E'}
                </button>
              </div>
              <pre className="bg-black/30 rounded-lg p-4 text-xs text-white/70 whitespace-pre-wrap leading-relaxed">{generateScheduleEmail()}</pre>
            </div>
          </div>
        )}

        {/* ⑤ Inbox Zero チェチE��リスチE*/}
        {tab === 'checklist' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🧹 Inbox ZeroチェチE��リスチE/h2>
              <p className="text-sm text-white/50">GTD弁EÁEInbox Zero  E毎日のルーチE��ン</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold">{checklistProgress} / {checklist.length} 完亁E/span>
                <span className="text-xs text-white/40">{Math.round(checklistProgress / checklist.length * 100)}%</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all" style={{ width: `${checklistProgress / checklist.length * 100}%` }} />
              </div>
            </div>

            {checklistCategories.map(cat => (
              <div key={cat} className="space-y-2">
                <h3 className="text-sm font-bold text-teal-400">{cat}</h3>
                {checklist.filter(c => c.category === cat).map(item => (
                  <button key={item.id} onClick={() => setChecklist(prev => prev.map(c => c.id === item.id ? { ...c, done: !c.done } : c))} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${item.done ? 'bg-teal-500/10 border border-teal-500/20' : 'bg-white/5 hover:bg-white/10'}`}>
                    <span className="text-lg">{item.done ? '✁E : '⬁E}</span>
                    <span className={`text-sm ${item.done ? 'text-white/40 line-through' : 'text-white/80'}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}

            {checklistProgress === checklist.length && (
              <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-xl p-6 text-center">
                <p className="text-3xl mb-2">🎉</p>
                <p className="font-bold text-lg">Inbox Zero 達�E�E�E/p>
                <p className="text-sm text-white/50 mt-1">素晴らしぁE���E日も同じルーチE��ンを続けましょぁE/p>
              </div>
            )}

            <button onClick={() => setChecklist(INBOX_ZERO_CHECKLIST)} className="text-xs text-white/30 hover:text-amber-400">🔄 リセチE��</button>
          </div>
        )}

        {/* ⑥ 習�E診断 */}
        {tab === 'habits' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📊 メール習�E診断</h2>
              <p className="text-sm text-white/50">あなた�Eメール習�EめE持E��でスコア匁E/p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-4">
              {[
                { key: 'dailyEmails', label: '1日の受信メール数', min: 0, max: 300, step: 10, unit: '送E },
                { key: 'unreadCount', label: '現在の未読メール数', min: 0, max: 500, step: 5, unit: '件' },
                { key: 'processTimeMin', label: '1日のメール処琁E��閁E, min: 0, max: 240, step: 15, unit: '刁E },
                { key: 'avgReplyHours', label: '平坁E��信時間', min: 1, max: 72, step: 1, unit: '時間' },
                { key: 'checkFrequency', label: '1日のメールチェチE��回数', min: 1, max: 30, step: 1, unit: '囁E },
                { key: 'subscriptions', label: '購読中のニュースレター数', min: 0, max: 100, step: 1, unit: '件' },
              ].map(s => (
                <div key={s.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{s.label}</span>
                    <span className="font-bold text-teal-400">{habits[s.key as keyof typeof habits]}{s.unit}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={habits[s.key as keyof typeof habits]} onChange={e => setHabits(p => ({ ...p, [s.key]: Number(e.target.value) }))} className="w-full accent-teal-500" />
                </div>
              ))}
            </div>

            <button onClick={diagnoseHabits} className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-sm font-bold hover:opacity-90">📊 診断する</button>

            {habitsResult && (
              <div className="bg-white/5 rounded-xl p-6 space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{habitsResult.score}<span className="text-lg text-white/40">/100</span></div>
                  <div className="text-lg font-bold">{habitsResult.level}</div>
                </div>
                <div className="space-y-2">
                  {habitsResult.tips.map((tip, i) => (
                    <div key={i} className="bg-black/20 rounded-lg p-3 text-sm text-white/70">{tip}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
          <p className="text-xs text-white/20">
            {gmailAuth ? 'Gmail連携: メールチE�EタはセチE��ョン中のみ保持。ログアウトで全消去、E : 'すべてのチE�Eタはブラウザ冁E��保存されます。サーバ�Eに送信されません、E}
          </p>
        </div>
      </div>
    </div>
  )
}
