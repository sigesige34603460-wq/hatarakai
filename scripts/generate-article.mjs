/**
 * HatarakAI 転職・求人コラム自動生成スクリプト
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = path.join(__dirname, '../src/content/blog')

const TOPICS = [
  { title: '看護師', slug: 'career-nurse', category: '職種ガイド' },
  { title: '介護福祉士', slug: 'career-care-worker', category: '職種ガイド' },
  { title: 'ITエンジニア', slug: 'career-it-engineer', category: '職種ガイド' },
  { title: '保育士', slug: 'career-nursery-teacher', category: '職種ガイド' },
  { title: '薬剤師', slug: 'career-pharmacist', category: '職種ガイド' },
  { title: '理学療法士', slug: 'career-pt', category: '職種ガイド' },
  { title: '作業療法士', slug: 'career-ot', category: '職種ガイド' },
  { title: '社会福祉士', slug: 'career-social-worker', category: '職種ガイド' },
  { title: '事務職', slug: 'career-office', category: '職種ガイド' },
  { title: '営業職', slug: 'career-sales', category: '職種ガイド' },
  { title: '医師', slug: 'career-doctor', category: '職種ガイド' },
  { title: '美容師', slug: 'career-hairdresser', category: '職種ガイド' },
  { title: '調理師・シェフ', slug: 'career-chef', category: '職種ガイド' },
  { title: '公務員', slug: 'career-civil-servant', category: '職種ガイド' },
  { title: '教師・教員', slug: 'career-teacher', category: '職種ガイド' },
  { title: 'Webデザイナー', slug: 'career-web-designer', category: '職種ガイド' },
  { title: 'ドライバー・運送', slug: 'career-driver', category: '職種ガイド' },
  { title: '経理・財務', slug: 'career-accounting', category: '職種ガイド' },
  { title: '施工管理', slug: 'career-construction', category: '職種ガイド' },
  { title: 'データサイエンティスト', slug: 'career-data-scientist', category: '職種ガイド' },
  { title: '20代の転職', slug: 'tenshoku-20s', category: '転職ガイド' },
  { title: '30代の転職', slug: 'tenshoku-30s', category: '転職ガイド' },
  { title: '40代の転職', slug: 'tenshoku-40s', category: '転職ガイド' },
  { title: '50代のキャリア再設計', slug: 'career-50s', category: '転職ガイド' },
  { title: '未経験からIT転職', slug: 'it-career-change', category: '転職ガイド' },
  { title: '異業種転職の成功法則', slug: 'industry-change', category: '転職ガイド' },
  { title: '転職面接の完全対策', slug: 'interview-guide', category: '転職ガイド' },
  { title: '職務経歴書の書き方', slug: 'resume-guide', category: '転職ガイド' },
  { title: '年収アップ転職の交渉術', slug: 'salary-negotiation', category: '転職ガイド' },
  { title: 'リモートワーク求人の探し方', slug: 'remote-work-job', category: '転職ガイド' },
  { title: '年収1000万円の職業一覧', slug: 'high-income-jobs', category: '年収・給与' },
  { title: '副業で稼げる職種ランキング', slug: 'side-job-ranking', category: '年収・給与' },
  { title: 'フリーランスになる方法', slug: 'freelance-guide', category: '年収・給与' },
  { title: '資格取得で年収アップできる職種', slug: 'certification-income', category: '年収・給与' },
  { title: '女性が活躍できる職業ランキング', slug: 'women-career', category: '年収・給与' },
  { title: 'パート・扶養内で働くポイント', slug: 'part-time-guide', category: '働き方' },
  { title: '在宅ワークで稼ぐ方法', slug: 'remote-work-income', category: '働き方' },
  { title: 'ダブルワーク・掛け持ちの注意点', slug: 'double-work', category: '働き方' },
  { title: '取得すべきITスキル・資格まとめ', slug: 'it-skills', category: 'スキル・資格' },
  { title: '医療・福祉系の人気資格一覧', slug: 'medical-certifications', category: 'スキル・資格' },
  { title: '英語力で転職を有利にする方法', slug: 'english-career', category: 'スキル・資格' },
  { title: '新卒就活の完全ロードマップ', slug: 'new-grad-guide', category: '就活' },
  { title: '第二新卒の転職を成功させる方法', slug: 'second-new-grad', category: '就活' },
]

async function generateArticle(topic) {
  const today = new Date().toISOString().split('T')[0]
  const filename = `${today}-${topic.slug}.md`
  const filepath = path.join(CONTENT_DIR, filename)

  if (fs.existsSync(filepath)) {
    console.log(`スキップ: ${filename}（既存）`)
    return false
  }

  const existing = fs.readdirSync(CONTENT_DIR).find(f => f.includes(topic.slug))
  if (existing) {
    console.log(`スキップ: ${topic.slug}（別日付で存在）`)
    return false
  }

  console.log(`生成中: ${topic.title}`)

  const prompt = `「${topic.title}」に関する転職・求人コラム記事を日本語で書いてください。

以下の構成でMarkdown形式で出力してください：
- 読者：転職・就職を検討している社会人
- 文字数：800〜1200文字
- 見出し（##）を3〜4個使う
- 具体的な数字や事例を含める
- 最後に「AIで求人を探す」という自然な誘導文で締める

記事本文のみ出力し、フロントマターは不要です。`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`API Error: ${JSON.stringify(err)}`)
  }

  const data = await res.json()
  const content = data.content[0].text

  const frontmatter = `---
title: "${topic.title}の転職・求人完全ガイド｜仕事内容・年収・転職のポイントまとめ"
description: "${topic.title}への転職を考えている方向けに、仕事内容・平均年収・必要なスキル・転職のコツを詳しく解説します。"
date: ${today}
category: ${topic.category}
---

`

  fs.writeFileSync(filepath, frontmatter + content, 'utf8')
  console.log(`✅ 生成完了: ${filename}`)
  return true
}

async function main() {
  if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true })

  const existingSlugs = fs.readdirSync(CONTENT_DIR)
    .map(f => f.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''))

  const remaining = TOPICS.filter(t => !existingSlugs.includes(t.slug))

  if (remaining.length === 0) {
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]
    await generateArticle({ ...topic, slug: topic.slug + '-2' })
    return
  }

  const topic = remaining[Math.floor(Math.random() * remaining.length)]
  await generateArticle(topic)
}

main().catch(console.error)
