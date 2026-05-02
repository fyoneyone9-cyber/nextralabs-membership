'use client'

import { useState, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Copy,
  Check,
  Download,
  FileText,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Eye,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────
type ReportTemplate = 'weekly' | 'monthly' | 'project' | 'research'

interface TemplateConfig {
  label: string
  emoji: string
  sections: { title: string; instruction: string }[]
  headerPrefix: string
}

// ─── Template Definitions ────────────────────────────────
const templates: Record<ReportTemplate, TemplateConfig> = {
  weekly: {
    label: '週次報告',
    emoji: '📅',
    sections: [
      { title: '今週のサマリー', instruction: '今週の活動の概要を記述してください。' },
      { title: '実施事項', instruction: '今週実施した主要なタスクや活動を記述してください。' },
      { title: '進捗状況', instruction: '各タスクの進捗状況を記述してください。' },
      { title: '課題・懸念事項', instruction: '現在の課題や懸念事項を記述してください。' },
      { title: '来週の計画', instruction: '来週の予定・計画を記述してください。' },
    ],
    headerPrefix: '週次報告書',
  },
  monthly: {
    label: '月次報告',
    emoji: '📊',
    sections: [
      { title: '月次サマリー', instruction: '今月の活動の概要を記述してください。' },
      { title: '目標達成状況', instruction: '月初に設定した目標の達成状況を記述してください。' },
      { title: '主要な成果', instruction: '今月の主要な成果や実績を記述してください。' },
      { title: 'KPI・数値レポート', instruction: '重要な数値やKPIの推移を記述してください。' },
      { title: '課題と改善策', instruction: '発生した課題と今後の改善策を記述してください。' },
      { title: '来月の方針', instruction: '来月の方針や計画を記述してください。' },
    ],
    headerPrefix: '月次報告書',
  },
  project: {
    label: 'プロジェクト報告',
    emoji: '🚀',
    sections: [
      { title: 'プロジェクト概要', instruction: 'プロジェクトの目的と背景を記述してください。' },
      { title: '現状分析', instruction: '現在の進捗状況と分析結果を記述してください。' },
      { title: '実施内容', instruction: '実施した作業や対応内容を記述してください。' },
      { title: 'リスク・課題', instruction: '認識しているリスクと課題を記述してください。' },
      { title: '提案・次のステップ', instruction: '今後の提案やアクションプランを記述してください。' },
      { title: 'スケジュール', instruction: '今後のスケジュールやマイルストーンを記述してください。' },
    ],
    headerPrefix: 'プロジェクト報告書',
  },
  research: {
    label: '調査レポート',
    emoji: '🔍',
    sections: [
      { title: '背景', instruction: '調査の背景と目的を記述してください。' },
      { title: '調査方法', instruction: '調査の手法やアプローチを記述してください。' },
      { title: '調査結果', instruction: '調査結果の詳細を記述してください。' },
      { title: '分析・考察', instruction: '調査結果の分析と考察を記述してください。' },
      { title: '提案', instruction: '調査結果に基づく提案を記述してください。' },
      { title: 'まとめ', instruction: '全体のまとめと結論を記述してください。' },
    ],
    headerPrefix: '調査レポート',
  },
}

// ─── Report Generator Logic ─────────────────────────────
function expandBulletsToReport(
  title: string,
  bullets: string,
  template: ReportTemplate,
  authorName: string
): string {
  const config = templates[template]
  const bulletList = bullets
    .split('\n')
    .map(l => l.replace(/^[\s\-\*•·]+/, '').trim())
    .filter(l => l.length > 0)

  const now = new Date()
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`

  let report = ''
  report += `# ${config.headerPrefix}：${title}\n\n`
  report += `**作成日:** ${dateStr}  \n`
  if (authorName.trim()) {
    report += `**作成者:** ${authorName}  \n`
  }
  report += `**テンプレート:** ${config.emoji} ${config.label}  \n`
  report += '\n---\n\n'

  // Distribute bullets across sections
  const sectionCount = config.sections.length
  const bulletsPerSection = Math.max(1, Math.ceil(bulletList.length / sectionCount))

  config.sections.forEach((section, i) => {
    report += `## ${section.title}\n\n`

    const startIdx = i * bulletsPerSection
    const sectionBullets = bulletList.slice(startIdx, startIdx + bulletsPerSection)

    if (sectionBullets.length > 0) {
      sectionBullets.forEach(bullet => {
        report += `- ${bullet}\n`
      })
    } else {
      report += `*${section.instruction}*\n`
    }
    report += '\n'
  })

  report += '---\n\n'
  report += `*本レポートは「AIレポートジェネレーター」により${dateStr}に作成されました。*\n`

  return report
}

// ─── Simple Markdown Renderer ────────────────────────────
function renderMarkdown(md: string): string {
  return md
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4 text-foreground">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-3 text-foreground border-b pb-2">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-foreground">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-muted-foreground">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1 list-disc text-foreground/90">$1</li>')
    .replace(/^---$/gm, '<hr class="my-6 border-border">')
    .replace(/\n\n/g, '<br/>')
    .replace(/  \n/g, '<br/>')
}

// ─── Component ───────────────────────────────────────────
export default function AiReportGenerator() {
  const [title, setTitle] = useState('')
  const [bullets, setBullets] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [template, setTemplate] = useState<ReportTemplate>('weekly')
  const [report, setReport] = useState('')
  const [viewMode, setViewMode] = useState<'preview' | 'markdown'>('preview')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const generate = useCallback(() => {
    if (!title.trim() || !bullets.trim()) return
    setIsGenerating(true)

    setTimeout(() => {
      const result = expandBulletsToReport(title, bullets, template, authorName)
      setReport(result)
      setIsGenerating(false)
    }, 500)
  }, [title, bullets, template, authorName])

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [report])

  const downloadAsText = useCallback(() => {
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'report'}_${new Date().toISOString().slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }, [report, title])

  const bulletCount = useMemo(() => {
    return bullets
      .split('\n')
      .map(l => l.replace(/^[\s\-\*•·]+/, '').trim())
      .filter(l => l.length > 0).length
  }, [bullets])

  const renderedHtml = useMemo(() => renderMarkdown(report), [report])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-green-500/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products/ai-report-generator"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            ツール紹介ページに戻る
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">AIレポートジェネレーター</h1>
              <p className="text-sm text-muted-foreground">箇条書きを入力 → ビジネスレポートを自動生成</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="border-2 border-green-500/20">
              <CardContent className="p-6 space-y-4">
                {/* Template Selector */}
                <div>
                  <label className="text-sm font-medium mb-2 block">📋 テンプレート選択</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(templates) as [ReportTemplate, TemplateConfig][]).map(([key, t]) => (
                      <Button
                        key={key}
                        variant={template === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTemplate(key)}
                        className={template === key ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0' : ''}
                      >
                        {t.emoji} {t.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Sections Preview */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-medium mb-2 text-muted-foreground">このテンプレートのセクション構成：</p>
                  <div className="flex flex-wrap gap-1">
                    {templates[template].sections.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{s.title}</Badge>
                    ))}
                  </div>
                </div>

                {/* Report Title */}
                <div>
                  <label className="text-sm font-medium mb-2 block">📝 レポートタイトル</label>
                  <Input
                    placeholder="例: 2024年Q1 マーケティング施策の振り返り"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-base"
                  />
                </div>

                {/* Author Name */}
                <div>
                  <label className="text-sm font-medium mb-2 block">👤 作成者名（任意）</label>
                  <Input
                    placeholder="例: 山田太郎"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </div>

                {/* Bullet Points */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">📌 箇条書きメモ</label>
                    <Badge variant="outline" className="text-xs">
                      {bulletCount}項目
                    </Badge>
                  </div>
                  <Textarea
                    placeholder={`各行に1つずつ箇条書きで入力してください。\n例:\n- 売上が前月比15%増加\n- 新規顧客を20社獲得\n- SNS広告のCPA改善\n- チーム2名増員完了\n- 来月はコンテンツマーケに注力予定`}
                    value={bullets}
                    onChange={(e) => setBullets(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ヒント: 箇条書きは各セクションに自動で振り分けられます。多めに書くとより充実したレポートになります。
                  </p>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generate}
                  disabled={!title.trim() || !bullets.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg py-6"
                >
                  {isGenerating ? (
                    <><RefreshCw className="h-5 w-5 mr-2 animate-spin" />生成中...</>
                  ) : (
                    <><Sparkles className="h-5 w-5 mr-2" />レポートを生成する</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            {report ? (
              <>
                {/* Toolbar */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'preview' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('preview')}
                      className={viewMode === 'preview' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0' : ''}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      プレビュー
                    </Button>
                    <Button
                      variant={viewMode === 'markdown' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('markdown')}
                      className={viewMode === 'markdown' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0' : ''}
                    >
                      <BookOpen className="h-4 w-4 mr-1" />
                      Markdown
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      {copied ? (
                        <><Check className="h-4 w-4 mr-1 text-green-500" />コピー済</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-1" />コピー</>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadAsText}>
                      <Download className="h-4 w-4 mr-1" />
                      ダウンロード
                    </Button>
                  </div>
                </div>

                {/* Report Display */}
                <Card className="border-2">
                  <CardContent className="p-6">
                    {viewMode === 'preview' ? (
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderedHtml }}
                      />
                    ) : (
                      <pre className="text-sm font-mono whitespace-pre-wrap bg-muted/50 p-4 rounded-lg overflow-x-auto text-foreground">
                        {report}
                      </pre>
                    )}
                  </CardContent>
                </Card>

                {/* Regenerate */}
                <div className="text-center">
                  <Button variant="outline" onClick={generate} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    再生成する
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10 mb-4">
                    <FileText className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">レポートがここに表示されます</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    左のフォームにタイトルと箇条書きメモを入力して「レポートを生成する」をクリックしてください。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Affiliate */}
      <div className="mt-8 border rounded-xl p-4 bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <span className="text-[10px] text-muted-foreground font-medium mr-2">PR</span>
          <span className="text-sm">⚡ 仕事が速い人が使っているアイテムを見る</span>
          <p className="text-xs text-muted-foreground mt-0.5">レポート作成が終わったら次は「作業環境」を整えよう。デスク周り・効率化グッズを探そう。</p>
        </div>
        <a href="https://www.amazon.co.jp/s?k=仕事効率化+デスク+グッズ&tag=nextralabs-22" target="_blank" rel="noopener noreferrer sponsored"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors">
          チェックする →
        </a>
      </div>
    </div>
  )
}
