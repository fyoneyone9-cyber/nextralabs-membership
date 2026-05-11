'use client'
import React from 'react'
import { AFFILIATE_LINKS, trackUrl } from '@/lib/affiliate-links'
import { ShoppingCart, ExternalLink } from 'lucide-react'

interface Props {
  toolId: string
}

// ツールアプリ内フッターに表示するさりげないAmazonアフィリエイトバナー
export default function AffiliateBanner({ toolId }: Props) {
  const links = AFFILIATE_LINKS[toolId]
  if (!links || links.length === 0) return null

  return (
    <div className="mt-8 border-t border-white/5 pt-6">
      {/* ラベル */}
      <div className="flex items-center gap-2 mb-3">
        <ShoppingCart size={11} className="text-slate-600" />
        <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Sponsored · Amazon</span>
      </div>

      {/* リンクカード */}
      <div className={`grid gap-3 ${links.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {links.map(link => (
          <a
            key={link.id}
            href={trackUrl(link, toolId)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-3 bg-[#0d1117] border border-white/5 hover:border-white/15 rounded-xl px-4 py-3 transition-all group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors truncate">
                {link.label}
              </p>
              <p className="text-[10px] text-slate-600 truncate mt-0.5">{link.desc}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[9px] font-bold text-amber-500/70">Amazon</span>
              <ExternalLink size={10} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
            </div>
          </a>
        ))}
      </div>

      <p className="text-[9px] text-slate-700 mt-2">
        ※ Amazonアソシエイト・プログラム参加者。リンク経由の購入でNextraLabsの運営に役立てられます。
      </p>
    </div>
  )
}
