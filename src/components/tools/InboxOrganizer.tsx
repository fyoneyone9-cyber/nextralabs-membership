'use client'

import { useState, useEffect } from 'react'

// ==================== TYPES ====================
type Tab = 'sort' | 'reply' | 'tasks' | 'schedule' | 'checklist' | 'habits'

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

// ==================== DATA ====================
const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'sort', icon: '📥', label: '仕分けルール' },
  { id: 'reply', icon: '✉️', label: '返信テンプレ' },
  { id: 'tasks', icon: '📋', label: 'タスク整理' },
  { id: 'schedule', icon: '📅', label: '日程調整' },
  { id: 'checklist', icon: '🧹', label: 'Inbox Zero' },
  { id: 'habits', icon: '📊', label: '習慣診断' },
]

const FILTER_TEMPLATES = [
  { name: 'ニュースレター自動アーカイブ', provider: 'gmail', rule: 'from:(newsletter OR noreply OR news@) → ラベル「ニュースレター」→ アーカイブ → 既読にする', keywords: ['newsletter', 'noreply', 'news@', '配信停止'] },
  { name: 'ECサイト通知', provider: 'gmail', rule: 'from:(amazon.co.jp OR rakuten.co.jp OR yahoo-corp.jp) subject:(発送 OR 注文確認 OR 配送) → ラベル「買い物」→ アーカイブ', keywords: ['amazon', 'rakuten', '発送', '注文確認'] },
  { name: 'SNS通知まとめ', provider: 'gmail', rule: 'from:(twitter.com OR facebook.com OR instagram.com OR linkedin.com) → ラベル「SNS」→ アーカイブ → 既読', keywords: ['twitter', 'facebook', 'notification'] },
  { name: '請求書・領収書', provider: 'gmail', rule: 'subject:(請求書 OR 領収書 OR invoice OR receipt) → ラベル「経理」→ スター付き', keywords: ['請求書', '領収書', 'invoice'] },
  { name: '重要クライアント優先', provider: 'gmail', rule: 'from:(client1@example.com OR client2@example.com) → ラベル「重要」→ 受信トレイに残す → スター付き', keywords: ['重要', 'クライアント'] },
  { name: 'カレンダー招待', provider: 'gmail', rule: 'filename:invite.ics OR subject:(招待 OR invitation OR 会議) → ラベル「予定」', keywords: ['invite', '招待', '会議'] },
  { name: '営業メール自動削除', provider: 'gmail', rule: 'subject:(無料トライアル OR 限定オファー OR セール) from:(-known_contacts) → ゴミ箱', keywords: ['無料', 'オファー', 'セール', '限定'] },
  { name: '社内メール分類', provider: 'gmail', rule: 'from:(@yourcompany.co.jp) → ラベル「社内」→ 受信トレイに残す', keywords: ['社内', '@company'] },
]

const REPLY_CATEGORIES = [
  { id: 'thanks', label: '🙏 お礼', templates: [
    { title: '打ち合わせ後のお礼', body: '{{相手名}}様\n\nお疲れ様です。{{自分名}}です。\n本日はお忙しい中、お時間をいただきありがとうございました。\n\n{{会議内容}}について、大変参考になりました。\nいただいたご意見をもとに、{{次のアクション}}を進めてまいります。\n\n引き続きよろしくお願いいたします。' },
    { title: '紹介のお礼', body: '{{相手名}}様\n\nお世話になっております。{{自分名}}です。\nこの度は{{紹介先}}様をご紹介いただき、誠にありがとうございます。\n\n早速ご連絡を取らせていただきました。\n{{相手名}}様のおかげで大変スムーズに話が進みそうです。\n\n今後ともよろしくお願いいたします。' },
  ]},
  { id: 'decline', label: '🙅 お断り', templates: [
    { title: '丁寧なお断り', body: '{{相手名}}様\n\nお世話になっております。{{自分名}}です。\nこの度は{{依頼内容}}のご依頼をいただき、ありがとうございます。\n\n大変恐縮ですが、現在{{理由}}のため、お受けすることが難しい状況です。\nせっかくお声がけいただいたにも関わらず、申し訳ございません。\n\nまたの機会がございましたら、ぜひお声がけください。\n何卒よろしくお願いいたします。' },
    { title: '営業メールへの断り', body: '{{相手名}}様\n\nお世話になっております。{{自分名}}です。\nサービスのご案内をいただき、ありがとうございます。\n\n社内で検討いたしましたが、現時点では導入の予定がございません。\n今後ニーズが生じた際には改めてご相談させていただければ幸いです。\n\nよろしくお願いいたします。' },
  ]},
  { id: 'schedule', label: '📅 日程調整', templates: [
    { title: '候補日提案', body: '{{相手名}}様\n\nお世話になっております。{{自分名}}です。\n{{件名}}の打ち合わせについて、以下の日程でご都合いかがでしょうか。\n\n① {{日時1}}\n② {{日時2}}\n③ {{日時3}}\n\n所要時間は{{時間}}程度を想定しております。\nオンライン/対面のどちらでも対応可能です。\n\nご検討のほど、よろしくお願いいたします。' },
    { title: '日程確定の返信', body: '{{相手名}}様\n\nご返信ありがとうございます。\nそれでは、{{確定日時}}でお願いいたします。\n\n{{場所/URL}}にてお待ちしております。\n当日はよろしくお願いいたします。' },
  ]},
  { id: 'followup', label: '🔄 催促・フォロー', templates: [
    { title: '丁寧な催促', body: '{{相手名}}様\n\nお世話になっております。{{自分名}}です。\n先日ご連絡させていただいた{{件名}}の件について、その後のご状況はいかがでしょうか。\n\nお忙しいところ恐縮ですが、{{期限}}までにご回答いただけますと幸いです。\n何かご不明点等ございましたら、お気軽にご連絡ください。\n\nよろしくお願いいたします。' },
    { title: '進捗確認', body: '{{相手名}}様\n\nお世話になっております。{{自分名}}です。\n{{プロジェクト名}}の進捗について確認させてください。\n\n現在の状況と、次のマイルストーンの見通しを共有いただけますでしょうか。\n特に{{確認事項}}について把握しておきたいです。\n\nよろしくお願いいたします。' },
  ]},
  { id: 'apology', label: '🙇 お詫び', templates: [
    { title: '返信遅延のお詫び', body: '{{相手名}}様\n\nお世話になっております。{{自分名}}です。\nご返信が遅くなり、大変申し訳ございません。\n\n{{理由}}により対応が遅れておりました。\n{{本題の回答}}\n\n今後はこのようなことがないよう注意いたします。\n引き続きよろしくお願いいたします。' },
    { title: 'ミスのお詫び', body: '{{相手名}}様\n\nお世話になっております。{{自分名}}です。\nこの度は{{ミス内容}}につきまして、多大なご迷惑をおかけし、深くお詫び申し上げます。\n\n原因を確認したところ、{{原因}}であることが判明いたしました。\n再発防止として{{対策}}を実施いたします。\n\n修正版を{{期日}}までにお送りいたします。\n重ねてお詫び申し上げます。' },
  ]},
  { id: 'intro', label: '🤝 紹介・自己紹介', templates: [
    { title: '自己紹介メール', body: '{{相手名}}様\n\n初めまして。{{紹介者}}様からご紹介いただきました、{{自分名}}と申します。\n{{自分の肩書き/会社名}}にて{{業務内容}}を担当しております。\n\n{{紹介者}}様から{{相手名}}様の{{話題}}について伺い、ぜひお話しさせていただきたくご連絡いたしました。\n\nご都合の良い日時がございましたら、お気軽にご連絡ください。\n何卒よろしくお願いいたします。' },
  ]},
]

const INBOX_ZERO_CHECKLIST: CheckItem[] = [
  { id: 'iz1', label: '未読メールを全件確認する（読むだけ。返信は後）', done: false, category: '① 全件スキャン' },
  { id: 'iz2', label: '2分以内に返信できるメールはその場で返信', done: false, category: '② 即処理' },
  { id: 'iz3', label: '自分がアクション不要なメールをアーカイブ', done: false, category: '② 即処理' },
  { id: 'iz4', label: 'ニュースレター・通知メールを一括アーカイブ', done: false, category: '② 即処理' },
  { id: 'iz5', label: '返信が必要だが時間がかかるメールにスター付け', done: false, category: '③ 仕分け' },
  { id: 'iz6', label: 'タスクが発生するメールをToDoリストに転記', done: false, category: '③ 仕分け' },
  { id: 'iz7', label: '参照用メールにラベルを付けてアーカイブ', done: false, category: '③ 仕分け' },
  { id: 'iz8', label: '不要な配信メールの「配信停止」をクリック（3件以上）', done: false, category: '④ 削減' },
  { id: 'iz9', label: 'フィルタールールを1つ以上新規作成', done: false, category: '④ 削減' },
  { id: 'iz10', label: 'スター付きメールの返信を全て完了', done: false, category: '⑤ 完了' },
  { id: 'iz11', label: '受信トレイのメール数が0になった', done: false, category: '⑤ 完了' },
  { id: 'iz12', label: '明日の「メール処理タイム」をカレンダーに30分ブロック', done: false, category: '⑥ 習慣化' },
]

const SCHEDULE_SITUATIONS = [
  { id: 'meeting', label: '🏢 社内ミーティング', duration: '30分〜1時間', format: 'オンライン or 会議室' },
  { id: 'client', label: '🤝 クライアント打ち合わせ', duration: '1時間', format: 'オンライン or 訪問' },
  { id: 'interview', label: '🎤 面接・面談', duration: '30分〜1時間', format: 'オンライン or 対面' },
  { id: 'lunch', label: '🍽️ ランチミーティング', duration: '1時間', format: '対面（レストラン）' },
  { id: 'casual', label: '☕ カジュアル面談', duration: '30分', format: 'オンライン or カフェ' },
]

// ==================== COMPONENT ====================
export default function InboxOrganizer() {
  const [tab, setTab] = useState<Tab>('sort')
  const [copied, setCopied] = useState('')
  
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
    location: 'オンライン（Zoom）',
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

  // Load/save
  useEffect(() => {
    try {
      const saved = localStorage.getItem('inbox-organizer-emails')
      if (saved) setEmails(JSON.parse(saved))
      const savedChecklist = localStorage.getItem('inbox-organizer-checklist')
      if (savedChecklist) setChecklist(JSON.parse(savedChecklist))
    } catch {}
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
    const urgencyKeywords = ['至急', '急ぎ', '今日中', '本日', 'ASAP', '緊急', '締切', 'deadline']
    const importanceKeywords = ['契約', '請求', '決算', '社長', '役員', 'CEO', '重要', '必須', '確認必須']
    const urgency: EmailEntry['urgency'] = urgencyKeywords.some(k => (newEmail.subject + newEmail.summary).includes(k)) ? 'high' : 'medium'
    const importance: EmailEntry['importance'] = importanceKeywords.some(k => (newEmail.subject + newEmail.summary).includes(k)) ? 'high' : 'medium'
    
    let category = '📁 その他'
    if (/請求|領収|invoice|見積/.test(newEmail.subject + newEmail.summary)) category = '💰 経理'
    else if (/打ち合わせ|会議|ミーティング|MTG|日程/.test(newEmail.subject + newEmail.summary)) category = '📅 予定'
    else if (/タスク|依頼|お願い|対応/.test(newEmail.subject + newEmail.summary)) category = '📋 タスク'
    else if (/報告|共有|FYI|周知/.test(newEmail.subject + newEmail.summary)) category = '📢 情報共有'
    else if (/確認|承認|レビュー|チェック/.test(newEmail.subject + newEmail.summary)) category = '✅ 承認'
    
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
    return `${f.partnerName || '○○'}様

お世話になっております。${f.myName || '○○'}です。
${f.topic ? `${f.topic}について、` : ''}お打ち合わせのお時間をいただけないでしょうか。

以下の日程でご都合いかがでしょうか。

① ${f.date1 || '○月○日（○）00:00〜'}
② ${f.date2 || '○月○日（○）00:00〜'}
③ ${f.date3 || '○月○日（○）00:00〜'}

所要時間：${f.duration || sit?.duration || '1時間'}程度
形式：${f.location || sit?.format || 'オンライン'}

上記以外でもご都合の良い日時がございましたら、お気軽にご指定ください。
お忙しいところ恐縮ですが、ご検討のほどよろしくお願いいたします。`
  }

  // Habits diagnosis
  const diagnoseHabits = () => {
    let score = 100
    const tips: string[] = []
    const h = habits

    if (h.unreadCount > 50) { score -= 25; tips.push('🔴 未読50件以上は危険。まず「2分ルール」で即返信できるものを片付けましょう') }
    else if (h.unreadCount > 20) { score -= 15; tips.push('🟡 未読20件超。1日の終わりに受信トレイを空にする習慣をつけましょう') }
    else if (h.unreadCount <= 5) { tips.push('🟢 未読5件以下は優秀！Inbox Zeroに近い状態です') }

    if (h.processTimeMin > 120) { score -= 20; tips.push('🔴 メール処理に2時間以上。フィルタールールで自動仕分けを強化しましょう') }
    else if (h.processTimeMin > 60) { score -= 10; tips.push('🟡 1時間以上のメール処理。テンプレート活用で返信時間を短縮できます') }

    if (h.checkFrequency > 15) { score -= 15; tips.push('🔴 1日15回以上メールチェックは集中力の大敵。1日3〜4回のバッチ処理に切り替えましょう') }
    else if (h.checkFrequency > 8) { score -= 8; tips.push('🟡 メールチェック回数が多め。通知をOFFにして決まった時間にだけ確認する習慣を') }

    if (h.avgReplyHours > 48) { score -= 15; tips.push('🔴 返信に48時間以上。「受領しました」の一次返信だけでも24時間以内に送りましょう') }
    else if (h.avgReplyHours > 24) { score -= 5; tips.push('🟡 返信は24時間以内が理想。スター機能で要返信メールを見失わない工夫を') }

    if (h.subscriptions > 30) { score -= 15; tips.push('🔴 購読30件超はノイズの元。今すぐ不要なニュースレターを10件解除しましょう') }
    else if (h.subscriptions > 15) { score -= 5; tips.push('🟡 購読が多め。月1で「配信停止デー」を設けて棚卸しを') }

    if (h.dailyEmails > 100) { score -= 10; tips.push('💡 1日100通超の受信は構造的な問題。Slack等へのチャネル移行を検討しましょう') }

    if (tips.length === 0) tips.push('🎉 素晴らしい！あなたのメール管理は非常に健全です')

    const level = score >= 80 ? '🟢 優秀' : score >= 60 ? '🟡 改善の余地あり' : score >= 40 ? '🟠 要注意' : '🔴 危険'
    setHabitsResult({ score: Math.max(0, score), level, tips })
  }

  const checklistProgress = checklist.filter(c => c.done).length
  const checklistCategories = Array.from(new Set(checklist.map(c => c.category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📬</span>
              <h1 className="text-lg font-bold">AI Inbox整理コーチ</h1>
            </div>
            <span className="text-xs text-white/30">ブラウザ内処理・データ送信なし</span>
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

        {/* ① 仕分けルール */}
        {tab === 'sort' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📥 Gmailフィルタールール集</h2>
              <p className="text-sm text-white/50">コピーして Gmail 設定 → フィルタ → 新規作成 で適用</p>
            </div>
            
            <div className="space-y-3">
              {FILTER_TEMPLATES.map((f, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">{f.name}</h3>
                    <button onClick={() => copyText(f.rule, `filter-${i}`)} className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-lg text-xs hover:bg-teal-500/30">
                      {copied === `filter-${i}` ? '✅ コピー済み' : '📋 コピー'}
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
              <h3 className="text-sm font-bold text-teal-400 mb-2">💡 カスタムルール作成のコツ</h3>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• <strong>from:</strong> で送信者を指定（OR で複数可）</li>
                <li>• <strong>subject:</strong> で件名のキーワードを指定</li>
                <li>• <strong>has:attachment</strong> で添付ファイル付きメールを抽出</li>
                <li>• <strong>larger:5M</strong> で大きいメールだけフィルタ</li>
                <li>• フィルタは「受信済みメールにも適用」にチェックを忘れずに</li>
              </ul>
            </div>
          </div>
        )}

        {/* ② 返信テンプレート */}
        {tab === 'reply' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">✉️ 返信テンプレート集</h2>
              <p className="text-sm text-white/50">{'{{変数}}'} を自分の内容に置き換えて使用</p>
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
                      {copied === `reply-${replyCategory}-${i}` ? '✅ コピー済み' : '📋 コピー'}
                    </button>
                  </div>
                  <pre className="bg-black/30 rounded-lg p-3 text-xs text-white/70 whitespace-pre-wrap leading-relaxed">{t.body}</pre>
                </div>
              ))}
            </div>

            <button onClick={() => {
              const allTemplates = REPLY_CATEGORIES.flatMap(c => c.templates.map(t => `【${c.label} — ${t.title}】\n\n${t.body}`)).join('\n\n' + '='.repeat(40) + '\n\n')
              copyText(allTemplates, 'all-templates')
            }} className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-sm font-bold hover:opacity-90">
              {copied === 'all-templates' ? '✅ 全テンプレートコピー済み' : '📋 全テンプレートを一括コピー'}
            </button>
          </div>
        )}

        {/* ③ タスク整理 */}
        {tab === 'tasks' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📋 タスク整理（緊急×重要マトリクス）</h2>
              <p className="text-sm text-white/50">メールの件名・要約を入力すると自動分類</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <input value={newEmail.from} onChange={e => setNewEmail(p => ({ ...p, from: e.target.value }))} placeholder="差出人（例: 田中さん）" className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              <input value={newEmail.subject} onChange={e => setNewEmail(p => ({ ...p, subject: e.target.value }))} placeholder="件名（例: 【至急】来週の見積書確認）" className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              <textarea value={newEmail.summary} onChange={e => setNewEmail(p => ({ ...p, summary: e.target.value }))} placeholder="要約（任意）" className="w-full h-16 bg-black/20 border border-white/10 rounded-lg p-2.5 text-xs text-white/70 resize-none placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              <button onClick={addEmail} className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-sm font-bold hover:opacity-90">📥 追加して自動分類</button>
            </div>

            {emails.length > 0 && (
              <>
                {/* Eisenhower Matrix */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: '🔴 緊急 × 重要', filter: (e: EmailEntry) => e.urgency === 'high' && e.importance === 'high', bg: 'bg-red-500/10 border-red-500/20', desc: '今すぐ対応' },
                    { label: '🟡 非緊急 × 重要', filter: (e: EmailEntry) => e.urgency !== 'high' && e.importance === 'high', bg: 'bg-amber-500/10 border-amber-500/20', desc: '計画して対応' },
                    { label: '🟠 緊急 × 非重要', filter: (e: EmailEntry) => e.urgency === 'high' && e.importance !== 'high', bg: 'bg-orange-500/10 border-orange-500/20', desc: '委任を検討' },
                    { label: '⚪ 非緊急 × 非重要', filter: (e: EmailEntry) => e.urgency !== 'high' && e.importance !== 'high', bg: 'bg-white/5 border-white/10', desc: 'アーカイブ候補' },
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
                      {emails.filter(q.filter).length === 0 && <div className="text-xs text-white/20 text-center py-2">なし</div>}
                    </div>
                  ))}
                </div>

                <button onClick={() => { setEmails([]); localStorage.removeItem('inbox-organizer-emails') }} className="text-xs text-white/30 hover:text-red-400">🗑️ 全件クリア</button>
              </>
            )}
          </div>
        )}

        {/* ④ 日程調整 */}
        {tab === 'schedule' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📅 日程調整メール生成</h2>
              <p className="text-sm text-white/50">入力するだけで丁寧な日程調整メールが完成</p>
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
                <input value={scheduleForm.partnerName} onChange={e => setScheduleForm(p => ({ ...p, partnerName: e.target.value }))} placeholder="相手の名前" className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
                <input value={scheduleForm.myName} onChange={e => setScheduleForm(p => ({ ...p, myName: e.target.value }))} placeholder="自分の名前" className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              </div>
              <input value={scheduleForm.topic} onChange={e => setScheduleForm(p => ({ ...p, topic: e.target.value }))} placeholder="打ち合わせの目的（任意）" className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              <div className="space-y-2">
                <label className="text-xs text-white/40">候補日時（3つ）</label>
                {['date1', 'date2', 'date3'].map((key, i) => (
                  <input key={key} value={scheduleForm[key as keyof typeof scheduleForm]} onChange={e => setScheduleForm(p => ({ ...p, [key]: e.target.value }))} placeholder={`候補${i + 1}: 例）5月10日（月）14:00〜`} className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={scheduleForm.duration} onChange={e => setScheduleForm(p => ({ ...p, duration: e.target.value }))} placeholder="所要時間" className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
                <input value={scheduleForm.location} onChange={e => setScheduleForm(p => ({ ...p, location: e.target.value }))} placeholder="場所・形式" className="bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white/80 placeholder-white/30 focus:outline-none focus:border-teal-500/30" />
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">生成結果</h3>
                <button onClick={() => copyText(generateScheduleEmail(), 'schedule-email')} className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-lg text-xs hover:bg-teal-500/30">
                  {copied === 'schedule-email' ? '✅ コピー済み' : '📋 コピー'}
                </button>
              </div>
              <pre className="bg-black/30 rounded-lg p-4 text-xs text-white/70 whitespace-pre-wrap leading-relaxed">{generateScheduleEmail()}</pre>
            </div>
          </div>
        )}

        {/* ⑤ Inbox Zero チェックリスト */}
        {tab === 'checklist' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">🧹 Inbox Zeroチェックリスト</h2>
              <p className="text-sm text-white/50">GTD式 × Inbox Zero — 毎日のルーティン</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold">{checklistProgress} / {checklist.length} 完了</span>
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
                    <span className="text-lg">{item.done ? '✅' : '⬜'}</span>
                    <span className={`text-sm ${item.done ? 'text-white/40 line-through' : 'text-white/80'}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}

            {checklistProgress === checklist.length && (
              <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 rounded-xl p-6 text-center">
                <p className="text-3xl mb-2">🎉</p>
                <p className="font-bold text-lg">Inbox Zero 達成！</p>
                <p className="text-sm text-white/50 mt-1">素晴らしい！明日も同じルーティンを続けましょう</p>
              </div>
            )}

            <button onClick={() => setChecklist(INBOX_ZERO_CHECKLIST)} className="text-xs text-white/30 hover:text-amber-400">🔄 リセット</button>
          </div>
        )}

        {/* ⑥ 習慣診断 */}
        {tab === 'habits' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">📊 メール習慣診断</h2>
              <p className="text-sm text-white/50">あなたのメール習慣を6指標でスコア化</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-4">
              {[
                { key: 'dailyEmails', label: '1日の受信メール数', min: 0, max: 300, step: 10, unit: '通' },
                { key: 'unreadCount', label: '現在の未読メール数', min: 0, max: 500, step: 5, unit: '件' },
                { key: 'processTimeMin', label: '1日のメール処理時間', min: 0, max: 240, step: 15, unit: '分' },
                { key: 'avgReplyHours', label: '平均返信時間', min: 1, max: 72, step: 1, unit: '時間' },
                { key: 'checkFrequency', label: '1日のメールチェック回数', min: 1, max: 30, step: 1, unit: '回' },
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
          <p className="text-xs text-white/20">すべてのデータはブラウザ内に保存されます。サーバーに送信されません。</p>
        </div>
      </div>
    </div>
  )
}
