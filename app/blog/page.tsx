import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog')

function getArticles() {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const { data } = matter(fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8'))
      return {
        slug: filename.replace(/\.md$/, ''),
        title: data.title ?? '',
        description: data.description ?? '',
        date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date).slice(0, 10),
        category: data.category ?? 'コラム',
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

const CATEGORY_COLOR: Record<string, string> = {
  '職種ガイド': '#2563EB',
  '転職ガイド': '#059669',
  '年収・給与': '#7C3AED',
  '働き方': '#D97706',
  'スキル・資格': '#DC2626',
  '就活': '#0891B2',
}

export const metadata = {
  title: '転職・求人コラム | HatarakAI',
  description: '転職・就職・年収・職種ガイドなど、仕事探しに役立つ情報をお届けします。',
}

export default function BlogIndexPage() {
  const articles = getArticles()

  return (
    <main style={{ minHeight: '100vh', background: '#F8FAFC' }}>
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

      <div style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: 'white', padding: '28px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px' }}>転職・求人コラム</h1>
          <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>全{articles.length}記事 · 転職・職種・年収・働き方の情報をお届けします</p>
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px' }}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94A3B8' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📝</p>
            <p>記事を準備中です。しばらくお待ちください。</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {articles.map(article => (
              <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', color: 'white', background: CATEGORY_COLOR[article.category] ?? '#64748B' }}>
                      {article.category}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{article.date}</span>
                  </div>
                  <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', margin: '0 0 8px', lineHeight: 1.5 }}>{article.title}</h2>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 10px', lineHeight: 1.6 }}>{article.description}</p>
                  <p style={{ fontSize: '13px', color: '#3B82F6', fontWeight: 600, margin: 0 }}>読む →</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ marginTop: '32px', background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', borderRadius: '16px', padding: '24px', textAlign: 'center', color: 'white' }}>
          <p style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px' }}>AIに相談してみよう</p>
          <p style={{ fontSize: '13px', opacity: 0.9, margin: '0 0 16px' }}>あなたの条件を話すだけで、ぴったりの求人を提案します</p>
          <Link href="/" style={{ display: 'inline-block', background: 'white', color: '#1E40AF', fontWeight: 700, fontSize: '14px', padding: '10px 28px', borderRadius: '24px', textDecoration: 'none' }}>
            無料で相談する →
          </Link>
        </div>
      </div>
    </main>
  )
}
