import { getSortedPostsData } from '@/lib/blog'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ブログ | NextraLabs',
  description: 'AIツール・副業・テクノロジーに関する最新情報をNextraLabsがお届けします。',
}

export default function BlogPage() {
  const posts = getSortedPostsData()

  return (
    <main className="min-h-screen bg-[#050507] text-slate-200">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* ヘッダー */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-emerald-400 tracking-tight">NextraLabs — Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">
            ブログ
          </h1>
          <p className="text-slate-400 text-lg">
            AIツール・副業・テクノロジーの最新情報
          </p>
        </div>

        {/* 記事一覧 */}
        {posts.length === 0 ? (
          <p className="text-center text-slate-500">記事がまだありません。</p>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="bg-[#0d1117] border border-white/5 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-[0_0_24px_rgba(16,185,129,0.08)]">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-lg font-semibold mb-2 text-white group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <time className="text-xs text-slate-500">
                      {new Date(post.date).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span className="text-xs text-emerald-400 font-medium group-hover:underline">
                      続きを読む →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
