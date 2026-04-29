import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog')

export async function generateStaticParams() {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => ({ slug: f.replace(/\.md$/, '') }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const filePath = path.join(CONTENT_DIR, `${params.slug}.md`)
  if (!fs.existsSync(filePath)) return {}
  const { data } = matter(fs.readFileSync(filePath, 'utf8'))
  return {
    title: `${data.title} | HatarakAI`,
    description: data.description ?? '',
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const filePath = path.join(CONTENT_DIR, `${params.slug}.md`)
  if (!fs.existsSync(filePath)) notFound()

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const processed = await remark().use(remarkHtml).process(content)
  const html = processed.toString()

  const dateStr = data.date instanceof Date
    ? data.date.toISOString().slice(0, 10)
    : String(data.date).slice(0, 10)

  return (
    <>
      <header style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '14px 20px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💼</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#1E40AF' }}>HatarakAI</div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>AI求人アドバイザー</div>
            </div>
          </Link>
          <Link href="/blog" style={{ fontSize: '13px', fontWeight: 700, color: '#3B82F6', textDecoration: 'none' }}>コラム</Link>
        </div>
      </header>

      <main style={{ minHeight: '100vh', background: '#F8FAFC' }}>
        <div style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: 'white', padding: '28px 20px' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <p style={{ fontSize: '12px', opacity: 0.8, margin: '0 0 10px' }}>
              <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>トップ</Link>
              {' › '}
              <Link href="/blog" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>コラム</Link>
            </p>
            {data.category && (
              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '3px 12px', borderRadius: '20px', display: 'inline-block', marginBottom: '10px' }}>
                {data.category}
              </span>
            )}
            <h1 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 10px', lineHeight: 1.5 }}>{data.title}</h1>
            {dateStr && <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>{dateStr}</p>}
          </div>
        </div>

        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            className="blog-content"
            style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', borderRadius: '16px', padding: '24px', textAlign: 'center', color: 'white' }}>
            <p style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px' }}>AIに求人を相談する</p>
            <p style={{ fontSize: '13px', opacity: 0.9, margin: '0 0 16px' }}>あなたの条件を話すだけで、ぴったりの求人を無料で提案します</p>
            <Link href="/" style={{ display: 'inline-block', background: 'white', color: '#1E40AF', fontWeight: 700, fontSize: '14px', padding: '10px 28px', borderRadius: '24px', textDecoration: 'none' }}>
              無料で相談する →
            </Link>
          </div>

          <Link href="/blog" style={{ fontSize: '13px', color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>
            ← コラム一覧に戻る
          </Link>
        </div>
      </main>

      <style>{`
        .blog-content h2 { font-size: 18px; font-weight: 800; color: #1E293B; margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #E2E8F0; }
        .blog-content h3 { font-size: 15px; font-weight: 700; color: #1E293B; margin: 20px 0 8px; }
        .blog-content p { margin: 0 0 14px; font-size: 14px; line-height: 1.9; color: #374151; }
        .blog-content ul, .blog-content ol { padding-left: 20px; margin: 0 0 14px; }
        .blog-content li { margin-bottom: 6px; font-size: 14px; color: #374151; line-height: 1.7; }
        .blog-content table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
        .blog-content th { background: #1E40AF; color: #fff; padding: 8px 12px; text-align: left; }
        .blog-content td { padding: 8px 12px; border-bottom: 1px solid #E2E8F0; }
        .blog-content tr:nth-child(even) td { background: #F8FAFC; }
        .blog-content strong { color: #1E293B; }
        .blog-content a { color: #3B82F6; }
      `}</style>
    </>
  )
}
