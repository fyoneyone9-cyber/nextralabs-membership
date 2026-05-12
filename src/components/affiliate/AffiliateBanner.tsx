'use client'
import React from 'react'
import { AFFILIATE_LINKS, trackUrl } from '@/lib/affiliate-links'
import { ExternalLink, ShoppingBag, Tag } from 'lucide-react'

interface Props {
  toolId: string
}

// ツールアプリ内フッターに表示するAmazonアフィリエイトバナー
export default function AffiliateBanner({ toolId }: Props) {
  const links = AFFILIATE_LINKS[toolId]
  if (!links || links.length === 0) return null

  return (
    <div className="mt-10 pt-8 border-t border-white/5">
      <div>

        {/* セクションヘッダー */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <ShoppingBag size={14} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300 tracking-wide">NextraLabs Select</p>
            <p className="text-[10px] text-slate-600">このツールに関連するおすすめ商品</p>
          </div>
          <div className="ml-auto">
            <span className="text-[9px] font-medium text-slate-600 bg-white/3 border border-white/5 rounded px-2 py-0.5">PR / Amazon</span>
          </div>
        </div>

        {/* リンクカード */}
        <div className={`grid gap-3 ${links.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {links.map((link, idx) => (
            <a
              key={link.id}
              href={trackUrl(link, toolId)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group flex items-center gap-4 bg-[#13141f] border border-white/5 hover:border-emerald-500/30 hover:bg-[#0f1118] rounded-xl px-4 py-3.5 transition-all"
            >
              {/* アイコン枠 */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/4 border border-white/6 group-hover:bg-emerald-500/8 group-hover:border-emerald-500/15 transition-all">
                <Tag size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>

              {/* テキスト */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors leading-snug line-clamp-1">
                  {link.label}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{link.desc}</p>
              </div>

              {/* 矢印 */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[9px] font-medium text-slate-600 group-hover:text-emerald-500 transition-colors">Amazon</span>
                <ExternalLink size={11} className="text-slate-600 group-hover:text-emerald-500 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
