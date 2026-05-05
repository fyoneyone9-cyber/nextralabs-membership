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

// 笏笏笏 Types 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
type ReportTemplate = 'weekly' | 'monthly' | 'project' | 'research'

interface TemplateConfig {
  label: string
  emoji: string
  sections: { title: string; instruction: string }[]
  headerPrefix: string
}

// 笏笏笏 Template Definitions 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
const templates: Record<ReportTemplate, TemplateConfig> = {
  weekly: {
    label: '騾ｱ谺｡蝣ｱ蜻・,
    emoji: '套',
    sections: [
      { title: '莉企ｱ縺ｮ繧ｵ繝槭Μ繝ｼ', instruction: '莉企ｱ縺ｮ豢ｻ蜍輔・讎りｦ√ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '螳滓命莠矩・, instruction: '莉企ｱ螳滓命縺励◆荳ｻ隕√↑繧ｿ繧ｹ繧ｯ繧・ｴｻ蜍輔ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '騾ｲ謐礼憾豕・, instruction: '蜷・ち繧ｹ繧ｯ縺ｮ騾ｲ謐礼憾豕√ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '隱ｲ鬘後・諛ｸ蠢ｵ莠矩・, instruction: '迴ｾ蝨ｨ縺ｮ隱ｲ鬘後ｄ諛ｸ蠢ｵ莠矩・ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '譚･騾ｱ縺ｮ險育判', instruction: '譚･騾ｱ縺ｮ莠亥ｮ壹・險育判繧定ｨ倩ｿｰ縺励※縺上□縺輔＞縲・ },
    ],
    headerPrefix: '騾ｱ谺｡蝣ｱ蜻頑嶌',
  },
  monthly: {
    label: '譛域ｬ｡蝣ｱ蜻・,
    emoji: '投',
    sections: [
      { title: '譛域ｬ｡繧ｵ繝槭Μ繝ｼ', instruction: '莉頑怦縺ｮ豢ｻ蜍輔・讎りｦ√ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '逶ｮ讓咎＃謌千憾豕・, instruction: '譛亥・縺ｫ險ｭ螳壹＠縺溽岼讓吶・驕疲・迥ｶ豕√ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '荳ｻ隕√↑謌先棡', instruction: '莉頑怦縺ｮ荳ｻ隕√↑謌先棡繧・ｮ溽ｸｾ繧定ｨ倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: 'KPI繝ｻ謨ｰ蛟､繝ｬ繝昴・繝・, instruction: '驥崎ｦ√↑謨ｰ蛟､繧КPI縺ｮ謗ｨ遘ｻ繧定ｨ倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '隱ｲ鬘後→謾ｹ蝟・ｭ・, instruction: '逋ｺ逕溘＠縺溯ｪｲ鬘後→莉雁ｾ後・謾ｹ蝟・ｭ悶ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '譚･譛医・譁ｹ驥・, instruction: '譚･譛医・譁ｹ驥昴ｄ險育判繧定ｨ倩ｿｰ縺励※縺上□縺輔＞縲・ },
    ],
    headerPrefix: '譛域ｬ｡蝣ｱ蜻頑嶌',
  },
  project: {
    label: '繝励Ο繧ｸ繧ｧ繧ｯ繝亥ｱ蜻・,
    emoji: '噫',
    sections: [
      { title: '繝励Ο繧ｸ繧ｧ繧ｯ繝域ｦりｦ・, instruction: '繝励Ο繧ｸ繧ｧ繧ｯ繝医・逶ｮ逧・→閭梧勹繧定ｨ倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '迴ｾ迥ｶ蛻・梵', instruction: '迴ｾ蝨ｨ縺ｮ騾ｲ謐礼憾豕√→蛻・梵邨先棡繧定ｨ倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '螳滓命蜀・ｮｹ', instruction: '螳滓命縺励◆菴懈･ｭ繧・ｯｾ蠢懷・螳ｹ繧定ｨ倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '繝ｪ繧ｹ繧ｯ繝ｻ隱ｲ鬘・, instruction: '隱崎ｭ倥＠縺ｦ縺・ｋ繝ｪ繧ｹ繧ｯ縺ｨ隱ｲ鬘後ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '謠先｡医・谺｡縺ｮ繧ｹ繝・ャ繝・, instruction: '莉雁ｾ後・謠先｡医ｄ繧｢繧ｯ繧ｷ繝ｧ繝ｳ繝励Λ繝ｳ繧定ｨ倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '繧ｹ繧ｱ繧ｸ繝･繝ｼ繝ｫ', instruction: '莉雁ｾ後・繧ｹ繧ｱ繧ｸ繝･繝ｼ繝ｫ繧・・繧､繝ｫ繧ｹ繝医・繝ｳ繧定ｨ倩ｿｰ縺励※縺上□縺輔＞縲・ },
    ],
    headerPrefix: '繝励Ο繧ｸ繧ｧ繧ｯ繝亥ｱ蜻頑嶌',
  },
  research: {
    label: '隱ｿ譟ｻ繝ｬ繝昴・繝・,
    emoji: '剥',
    sections: [
      { title: '閭梧勹', instruction: '隱ｿ譟ｻ縺ｮ閭梧勹縺ｨ逶ｮ逧・ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '隱ｿ譟ｻ譁ｹ豕・, instruction: '隱ｿ譟ｻ縺ｮ謇区ｳ輔ｄ繧｢繝励Ο繝ｼ繝√ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '隱ｿ譟ｻ邨先棡', instruction: '隱ｿ譟ｻ邨先棡縺ｮ隧ｳ邏ｰ繧定ｨ倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '蛻・梵繝ｻ閠・ｯ・, instruction: '隱ｿ譟ｻ邨先棡縺ｮ蛻・梵縺ｨ閠・ｯ溘ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '謠先｡・, instruction: '隱ｿ譟ｻ邨先棡縺ｫ蝓ｺ縺･縺乗署譯医ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
      { title: '縺ｾ縺ｨ繧・, instruction: '蜈ｨ菴薙・縺ｾ縺ｨ繧√→邨占ｫ悶ｒ險倩ｿｰ縺励※縺上□縺輔＞縲・ },
    ],
    headerPrefix: '隱ｿ譟ｻ繝ｬ繝昴・繝・,
  },
}

// 笏笏笏 Report Generator Logic 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
function expandBulletsToReport(
  title: string,
  bullets: string,
  template: ReportTemplate,
  authorName: string
): string {
  const config = templates[template]
  const bulletList = bullets
    .split('\n')
    .map(l => l.replace(/^[\s\-\*窶｢ﾂｷ]+/, '').trim())
    .filter(l => l.length > 0)

  const now = new Date()
  const dateStr = `${now.getFullYear()}蟷ｴ${now.getMonth() + 1}譛・{now.getDate()}譌･`

  let report = ''
  report += `# ${config.headerPrefix}・・{title}\n\n`
  report += `**菴懈・譌･:** ${dateStr}  \n`
  if (authorName.trim()) {
    report += `**菴懈・閠・** ${authorName}  \n`
  }
  report += `**繝・Φ繝励Ξ繝ｼ繝・** ${config.emoji} ${config.label}  \n`
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
  report += `*譛ｬ繝ｬ繝昴・繝医・縲窟I繝ｬ繝昴・繝医ず繧ｧ繝阪Ξ繝ｼ繧ｿ繝ｼ縲阪↓繧医ｊ${dateStr}縺ｫ菴懈・縺輔ｌ縺ｾ縺励◆縲・\n`

  return report
}

// 笏笏笏 Simple Markdown Renderer 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
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

// 笏笏笏 Component 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
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
      .map(l => l.replace(/^[\s\-\*窶｢ﾂｷ]+/, '').trim())
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
            繝・・繝ｫ邏ｹ莉九・繝ｼ繧ｸ縺ｫ謌ｻ繧・          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">AI繝ｬ繝昴・繝医ず繧ｧ繝阪Ξ繝ｼ繧ｿ繝ｼ</h1>
              <p className="text-sm text-muted-foreground">邂・擅譖ｸ縺阪ｒ蜈･蜉・竊・繝薙ず繝阪せ繝ｬ繝昴・繝医ｒ閾ｪ蜍慕函謌・/p>
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
                  <label className="text-sm font-medium mb-2 block">搭 繝・Φ繝励Ξ繝ｼ繝磯∈謚・/label>
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
                  <p className="text-xs font-medium mb-2 text-muted-foreground">縺薙・繝・Φ繝励Ξ繝ｼ繝医・繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ讒区・・・/p>
                  <div className="flex flex-wrap gap-1">
                    {templates[template].sections.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{s.title}</Badge>
                    ))}
                  </div>
                </div>

                {/* Report Title */}
                <div>
                  <label className="text-sm font-medium mb-2 block">統 繝ｬ繝昴・繝医ち繧､繝医Ν</label>
                  <Input
                    placeholder="萓・ 2024蟷ｴQ1 繝槭・繧ｱ繝・ぅ繝ｳ繧ｰ譁ｽ遲悶・謖ｯ繧願ｿ斐ｊ"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-base"
                  />
                </div>

                {/* Author Name */}
                <div>
                  <label className="text-sm font-medium mb-2 block">側 菴懈・閠・錐・井ｻｻ諢擾ｼ・/label>
                  <Input
                    placeholder="萓・ 螻ｱ逕ｰ螟ｪ驛・
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </div>

                {/* Bullet Points */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">東 邂・擅譖ｸ縺阪Γ繝｢</label>
                    <Badge variant="outline" className="text-xs">
                      {bulletCount}鬆・岼
                    </Badge>
                  </div>
                  <Textarea
                    placeholder={`蜷・｡後↓1縺､縺壹▽邂・擅譖ｸ縺阪〒蜈･蜉帙＠縺ｦ縺上□縺輔＞縲・n萓・\n- 螢ｲ荳翫′蜑肴怦豈・5%蠅怜刈\n- 譁ｰ隕城｡ｧ螳｢繧・0遉ｾ迯ｲ蠕予n- SNS蠎・相縺ｮCPA謾ｹ蝟Ыn- 繝√・繝2蜷榊｢怜藤螳御ｺ・n- 譚･譛医・繧ｳ繝ｳ繝・Φ繝・・繝ｼ繧ｱ縺ｫ豕ｨ蜉帑ｺ亥ｮ啻}
                    value={bullets}
                    onChange={(e) => setBullets(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    繝偵Φ繝・ 邂・擅譖ｸ縺阪・蜷・そ繧ｯ繧ｷ繝ｧ繝ｳ縺ｫ閾ｪ蜍輔〒謖ｯ繧雁・縺代ｉ繧後∪縺吶ょ､壹ａ縺ｫ譖ｸ縺上→繧医ｊ蜈・ｮ溘＠縺溘Ξ繝昴・繝医↓縺ｪ繧翫∪縺吶・                  </p>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generate}
                  disabled={!title.trim() || !bullets.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg py-6"
                >
                  {isGenerating ? (
                    <><RefreshCw className="h-5 w-5 mr-2 animate-spin" />逕滓・荳ｭ...</>
                  ) : (
                    <><Sparkles className="h-5 w-5 mr-2" />繝ｬ繝昴・繝医ｒ逕滓・縺吶ｋ</>
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
                      繝励Ξ繝薙Η繝ｼ
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
                        <><Check className="h-4 w-4 mr-1 text-green-500" />繧ｳ繝斐・貂・/>
                      ) : (
                        <><Copy className="h-4 w-4 mr-1" />繧ｳ繝斐・</>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadAsText}>
                      <Download className="h-4 w-4 mr-1" />
                      繝繧ｦ繝ｳ繝ｭ繝ｼ繝・                    </Button>
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
                    蜀咲函謌舌☆繧・                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10 mb-4">
                    <FileText className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">繝ｬ繝昴・繝医′縺薙％縺ｫ陦ｨ遉ｺ縺輔ｌ縺ｾ縺・/h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    蟾ｦ縺ｮ繝輔か繝ｼ繝縺ｫ繧ｿ繧､繝医Ν縺ｨ邂・擅譖ｸ縺阪Γ繝｢繧貞・蜉帙＠縺ｦ縲後Ξ繝昴・繝医ｒ逕滓・縺吶ｋ縲阪ｒ繧ｯ繝ｪ繝・け縺励※縺上□縺輔＞縲・                  </p>
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
          <span className="text-sm">笞｡ 莉穂ｺ九′騾溘＞莠ｺ縺御ｽｿ縺｣縺ｦ縺・ｋ繧｢繧､繝・Β繧定ｦ九ｋ</span>
          <p className="text-xs text-muted-foreground mt-0.5">繝ｬ繝昴・繝井ｽ懈・縺檎ｵゅｏ縺｣縺溘ｉ谺｡縺ｯ縲御ｽ懈･ｭ迺ｰ蠅・阪ｒ謨ｴ縺医ｈ縺・ゅョ繧ｹ繧ｯ蜻ｨ繧翫・蜉ｹ邇・喧繧ｰ繝・ぜ繧呈爾縺昴≧縲・/p>
        </div>
        <a href="https://www.amazon.co.jp/s?k=莉穂ｺ句柑邇・喧+繝・せ繧ｯ+繧ｰ繝・ぜ&tag=nextralabs-22" target="_blank" rel="noopener noreferrer sponsored"
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors">
          繝√ぉ繝・け縺吶ｋ 竊・        </a>
      </div>
    
      </div>
  )
}




