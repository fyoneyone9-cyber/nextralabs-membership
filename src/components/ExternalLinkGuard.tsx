'use client'
import { useEffect, useState } from 'react'
import { ExternalLink, X, ArrowRight } from 'lucide-react'

// DMSページでは確認モーダルをスキップするドメイン
const DMS_BYPASS_DOMAINS = ['daily.co', 'supabase.co', 'supabase.com']

export default function ExternalLinkGuard() {
  const [pending, setPending] = useState<string | null>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href') || ''

      // 外部リンク判定: http/https で始まり、自サイトドメインでないもの
      const isExternal =
        (href.startsWith('http://') || href.startsWith('https://')) &&
        !href.includes('membership-site-nextralabos.vercel.app') &&
        !href.includes('localhost')

      if (!isExternal) return

      // /dms 配下 または DMS用バイパスドメイン → 確認なしで開く
      const isDmsPage = window.location.pathname.startsWith('/dms')
      const isBypassDomain = DMS_BYPASS_DOMAINS.some(d => href.includes(d))
      if (isDmsPage || isBypassDomain) return  // デフォルト動作に任せる

      e.preventDefault()
      e.stopPropagation()
      setPending(href)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  if (!pending) return null

  // ドメイン表示用
  let domain = ''
  try { domain = new URL(pending).hostname } catch { domain = pending }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={() => setPending(null)}
    >
      <div
        className="bg-[#0d1117] border border-white/10 rounded-2xl p-7 max-w-sm w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 閉じる */}
        <button
          onClick={() => setPending(null)}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
        />

        {/* アイコン */}
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
          <ExternalLink size={22} className="text-amber-400" />
        </div>

        <h3 className="text-base font-bold text-white mb-1">外部サイトへ移動します</h3>
        <p className="text-xs text-slate-500 mb-1">以下のサイトに移動しようとしています：</p>
        <p className="text-xs font-mono text-slate-400 bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-5 break-all">
          {domain}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setPending(null)}
            className="flex-1 h-10 rounded-xl border border-white/10 text-slate-400 text-sm hover:text-slate-200 hover:border-white/20 transition-colors"
          >
            <X size={13} className="inline mr-1.5" />
            戻る
          </button>
          <button
            onClick={() => { window.open(pending, '_blank', 'noopener,noreferrer'); setPending(null) }}
            className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            移動する
            <ArrowRight size={13} />
          </button>
        </div>

        <p className="text-[10px] text-slate-700 mt-4 text-center">
          NextraLabs はこの外部サイトの内容に責任を負いません
        </p>
      </div>
    </div>
  )
}
