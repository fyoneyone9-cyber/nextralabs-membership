import { getPostData, getAllPostSlugs } from '@/lib/blog'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await getPostData(slug)
    return {
      title: `${post.title} | NextraLabs`,
      description: post.description,
    }
  } catch {
    return { title: 'ブログ | NextraLabs' }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  let post
  try {
    post = await getPostData(slug)
  } catch {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* パンくず */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-foreground transition-colors">
            ブログ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{post.title}</span>
        </nav>

        {/* 記事ヘッダー */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--gsk-purple)_/_0.15)] text-[hsl(var(--gsk-purple))] border border-[hsl(var(--gsk-purple)_/_0.3)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time>
              {new Date(post.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>by NextraLabs</span>
          </div>
        </header>

        {/* 記事本文 */}
        <article
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-foreground
            prose-p:text-muted-foreground
            prose-strong:text-foreground
            prose-a:text-[hsl(var(--gsk-purple))]
            prose-ul:text-muted-foreground
            prose-ol:text-muted-foreground
            prose-li:text-muted-foreground
            prose-h1:text-2xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-4
            prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-6 prose-h2:mb-3
            prose-h3:text-lg prose-h3:font-medium prose-h3:mt-4 prose-h3:mb-2"
          dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
        />

        {/* 戻るリンク */}
        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[hsl(var(--gsk-purple))] hover:opacity-80 transition-opacity"
          >
            ← ブログ一覧に戻る
          </Link>
        </div>
      </div>
    </main>
  )
}
