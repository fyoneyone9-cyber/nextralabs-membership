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
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* ヘッダー */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[hsl(var(--gsk-purple))] to-[hsl(var(--gsk-cyan))] bg-clip-text text-transparent">
              ブログ
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            AIツール・副業・テクノロジーの最新情報
          </p>
        </div>

        {/* 記事一覧 */}
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">記事がまだありません。</p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block"
              >
                <article className="bg-card border border-border rounded-xl p-6 hover:border-[hsl(var(--gsk-purple))] transition-colors duration-200">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--gsk-purple)_/_0.15)] text-[hsl(var(--gsk-purple))] border border-[hsl(var(--gsk-purple)_/_0.3)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <time className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span className="text-xs text-[hsl(var(--gsk-purple))] font-medium">
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
