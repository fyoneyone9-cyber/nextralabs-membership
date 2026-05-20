'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const CATS = [
  { id: 'hotel',      label: '🏨 宿泊・ホテルDX' },
  { id: 'konkatsu',   label: '💕 婚活DX' },
  { id: 'reputation', label: '⭐ 口コミDX' },
  { id: 'tourism',    label: '🗺️ 観光インバウンド' },
  { id: 'inbound',    label: '🕌 宗教・食習慣対応' },
  { id: 'sales',      label: '📞 営業・テレアポ' },
  { id: 'content',    label: '🎬 動画・コンテンツ' },
]

export default function EnterpriseCategoryBar() {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    CATS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="sticky top-[88px] z-40 w-full border-b border-amber-500/10 bg-[#050507]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-1 h-10 overflow-x-auto scrollbar-none">
          {CATS.map(({ id, label }) => {
            const isActive = activeId === id
            return (
              <Link
                key={id}
                href={`#${id}`}
                scroll={false}
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById(id)
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 110
                    window.scrollTo({ top: y, behavior: 'smooth' })
                  }
                }}
                className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 border border-transparent'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
