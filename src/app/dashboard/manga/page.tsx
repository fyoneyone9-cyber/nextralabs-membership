'use client'

import { useState, useEffect } from 'react'

interface Panel {
  panel: number
  name: string
  dialogue: string
  prompt: string
  speaker: string
  speaker_side: string
  files: string[]
}

interface Page {
  name: string
  page_prefix: string
  panels: Panel[]
}

export default function MangaDashboardPage() {
  const [status, setStatus] = useState<'unknown' | 'running' | 'offline'>('unknown')
  const [script, setScript] = useState('')
  const [pagePrefix, setPagePrefix] = useState('manga')
  const [panelsPerPage, setPanelsPerPage] = useState(3)
  const [generating, setGenerating] = useState(false)
  const [pages, setPages] = useState<Page[]>([])
  const [log, setLog] = useState('')
  const [editingPanel, setEditingPanel] = useState<{ pageName: string; panel: Panel } | null>(null)
  const [editPrompt, setEditPrompt] = useState('')
  const [editDialogue, setEditDialogue] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    try {
      const res = await fetch('/api/manga?action=status')
      const data = await res.json()
      setStatus(data.comfyui === 'running' ? 'running' : 'offline')
    } catch {
      setStatus('offline')
    }
  }

  async function loadPages() {
    const res = await fetch('/api/manga?action=pages')
    const data = await res.json()
    if (data.pages) setPages(data.pages)
  }

  async function handleGenerate() {
    if (!script.trim()) return
    setGenerating(true)
    setLog('生成中...')
    try {
      const res = await fetch('/api/manga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          script,
          page_prefix: pagePrefix,
          panels_per_page: panelsPerPage,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setLog(`完了！ ${data.pages} ページ / ${data.results} コマ 生成しました。`)
        await loadPages()
      } else {
        setLog(`エラー: ${data.error || data.detail}`)
      }
    } catch (e) {
      setLog(`接続エラー: ${String(e)}`)
    } finally {
      setGenerating(false)
    }
  }

  function openEdit(pageName: string, panel: Panel) {
    setEditingPanel({ pageName, panel })
    setEditPrompt(panel.prompt)
    setEditDialogue(panel.dialogue)
  }

  async function handleSavePrompt() {
    if (!editingPanel) return
    setSaving(true)
    try {
      const res = await fetch('/api/manga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_prompt',
          page_name: editingPanel.pageName,
          panel: editingPanel.panel.panel,
          prompt: editPrompt,
          dialogue: editDialogue,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setLog('プロンプトを保存しました。PDFも更新しました。')
        setEditingPanel(null)
        await loadPages()
      } else {
        setLog(`保存エラー: ${data.error || data.detail}`)
      }
    } catch (e) {
      setLog(`接続エラー: ${String(e)}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDownloadPdf() {
    window.open(`/api/manga?action=download&prefix=${pagePrefix}`, '_blank')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-sm">
      <h1 className="text-2xl font-bold mb-2">🎌 漫画生成ダッシュボード</h1>

      {/* ステータス */}
      <div className="flex items-center gap-3 mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          status === 'running' ? 'bg-green-500 text-white' :
          status === 'offline' ? 'bg-red-500 text-white' :
          'bg-gray-400 text-white'
        }`}>
          ComfyUI {status === 'running' ? '稼働中' : status === 'offline' ? 'オフライン' : '確認中'}
        </span>
        <button onClick={checkStatus} className="text-xs text-blue-500 underline">再確認</button>
      </div>

      {/* 台本入力 */}
      <div className="bg-gray-900 rounded-xl p-5 mb-6">
        <h2 className="font-bold mb-3 text-white">台本入力</h2>
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">プレフィックス</label>
            <input
              className="w-full bg-gray-800 text-white rounded px-3 py-1.5 text-sm"
              value={pagePrefix}
              onChange={e => setPagePrefix(e.target.value)}
            />
          </div>
          <div className="w-32">
            <label className="text-xs text-gray-400 mb-1 block">コマ数/ページ</label>
            <select
              className="w-full bg-gray-800 text-white rounded px-3 py-1.5 text-sm"
              value={panelsPerPage}
              onChange={e => setPanelsPerPage(Number(e.target.value))}
            >
              {[2,3,4,6].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <textarea
          className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm font-mono h-48 resize-y"
          placeholder={'[maid_girl] 今日は、私がご案内します。\n[customer_boy] じゃあ、ゆっくりお願い。\n\n---\n\n[maid_girl] えっと…少し緊張してます。'}
          value={script}
          onChange={e => setScript(e.target.value)}
        />
        <div className="flex gap-3 mt-3">
          <button
            onClick={handleGenerate}
            disabled={generating || !script.trim() || status !== 'running'}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-5 py-2 rounded-lg font-bold"
          >
            {generating ? '生成中...' : '生成実行'}
          </button>
          <button
            onClick={loadPages}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            ページ一覧を更新
          </button>
          <button
            onClick={handleDownloadPdf}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            PDFダウンロード
          </button>
        </div>
        {log && (
          <div className="mt-3 bg-gray-800 rounded p-3 text-xs text-gray-300 whitespace-pre-wrap">{log}</div>
        )}
      </div>

      {/* ページ一覧・プロンプト編集 */}
      {pages.length > 0 && (
        <div>
          <h2 className="font-bold text-white mb-3">ページ一覧 / プロンプト編集</h2>
          {pages.map(page => (
            <div key={page.name} className="bg-gray-900 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-blue-400 mb-2">{page.name}</h3>
              <div className="space-y-3">
                {page.panels.map(panel => (
                  <div key={panel.panel} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="text-xs text-gray-400 mb-1">
                          Panel {panel.panel} / {panel.speaker} ({panel.speaker_side})
                        </div>
                        <div className="text-white font-medium mb-1">
                          「{panel.dialogue}」
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-2">{panel.prompt}</div>
                      </div>
                      <button
                        onClick={() => openEdit(page.name, panel)}
                        className="shrink-0 bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded"
                      >
                        編集
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* プロンプト編集モーダル */}
      {editingPanel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl">
            <h3 className="font-bold text-white mb-4">
              プロンプト編集 — {editingPanel.pageName} / Panel {editingPanel.panel.panel}
            </h3>
            <label className="text-xs text-gray-400 mb-1 block">セリフ</label>
            <input
              className="w-full bg-gray-800 text-white rounded px-3 py-2 mb-4"
              value={editDialogue}
              onChange={e => setEditDialogue(e.target.value)}
            />
            <label className="text-xs text-gray-400 mb-1 block">プロンプト</label>
            <textarea
              className="w-full bg-gray-800 text-white rounded px-3 py-2 h-32 font-mono text-xs resize-y mb-4"
              value={editPrompt}
              onChange={e => setEditPrompt(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSavePrompt}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-5 py-2 rounded-lg font-bold"
              >
                {saving ? '保存中...' : '保存 & PDF更新'}
              </button>
              <button
                onClick={() => setEditingPanel(null)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
