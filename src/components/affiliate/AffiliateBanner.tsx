'use client'
import React from 'react'
import { AFFILIATE_LINKS, trackUrl } from '@/lib/affiliate-links'
import { ExternalLink } from 'lucide-react'

interface Props {
  toolId: string
}

// ツールアプリ内フッターに表示するさりげないAmazonアフィリエイトバナー
export default function AffiliateBanner({ toolId }: Props) {
  const links = AFFILIATE_LINKS[toolId]
  if (!links || links.length === 0) return null

  return (
    <div className="mt-8 pt-6 border-t border-white/5">
      {/* ラベル */}
      <p className="text-[11px] text-slate-500 mb-3">関連商品（Amazon）</p>

      {/* リンクカード */}
      <div className={`grid gap-2 ${links.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {links.map(link => (
          <a
            key={link.id}
            href={trackUrl(link, toolId)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-3 bg-[#13141f] border border-white/5 hover:border-emerald-500/20 rounded-lg px-4 py-3 transition-all group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors truncate">
                {link.label}
              </p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">{link.desc}</p>
            </div>
            <ExternalLink size={12} className="text-slate-600 group-hover:text-emerald-500 transition-colors shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}
