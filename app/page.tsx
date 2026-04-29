'use client'

import { useState, useEffect, useRef } from 'react'

const DAILY_LIMIT = 10
const STORAGE_KEY = 'hatarakai_ai_usage'

type Message = { role: 'user' | 'ai'; text: string }

const QUICK_REPLIES = [
  '転職を考えています',
  '在宅で働きたい',
  'パートを探しています',
  '未経験でも大丈夫？',
]

function getUsage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const today = new Date().toDateString()
    if (data.date !== today) return { date: today, count: 0 }
    return data
  } catch { return { date: new Date().toDateString(), count: 0 } }
}

function saveUsage(count: number) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: new Date().toDateString(), count }))
}

function formatText(text: string) {
  return text.split('\n').map((line, i) => (
    <span key={i}>{line}{i < text.split('\n').length - 1 && <br />}</span>
  ))
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'こんにちは！HatarakAIです😊\n\nどんなお仕事をお探しですか？\n今のご状況を教えていただけると、ぴったりの求人をご提案できます！' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [limitReached, setLimitReached] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const usage = getUsage()
    setUsageCount(usage.count)
    if (usage.count >= DAILY_LIMIT) setLimitReached(true)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text?: string) => {
    const msgText = text || input
    if (!msgText.trim() || loading || limitReached) return

    const usage = getUsage()
    if (usage.count >= DAILY_LIMIT) { setLimitReached(true); return }

    const newCount = usage.count + 1
    saveUsage(newCount)
    setUsageCount(newCount)
    if (newCount >= DAILY_LIMIT) setLimitReached(true)

    const userMsg: Message = { role: 'user', text: msgText }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    const apiMessages = updatedMessages.map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.text,
    }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || data.error || 'エラーが発生しました。' }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '申し訳ありません。エラーが発生しました。もう一度お試しください。' }])
    } finally {
      setLoading(false)
    }
  }

  const remaining = DAILY_LIMIT - usageCount
  const showQuickReplies = messages.length === 1

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EBF5FF 0%, #FFF8F0 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0 40px' }}>

      {/* ヘッダー */}
      <header style={{ width: '100%', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            💼
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', color: '#1E40AF' }}>HatarakAI</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>AI求人アドバイザー</div>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#64748B', background: '#F1F5F9', borderRadius: '20px', padding: '4px 12px' }}>
          残り <strong style={{ color: remaining <= 3 ? '#EF4444' : '#3B82F6' }}>{remaining}</strong> 回
        </div>
      </header>

      {/* ヒーロー */}
      <div style={{ width: '100%', maxWidth: '600px', background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: 'white', padding: '24px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '6px' }}>✨ AIと話すだけで仕事が見つかる</p>
        <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>あなたにぴったりの求人を<br />一緒に探しましょう！</h1>
      </div>

      {/* チャットエリア */}
      <div style={{ width: '100%', maxWidth: '600px', flex: 1, padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
            {msg.role === 'ai' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                💼
              </div>
            )}
            <div style={{
              maxWidth: '75%',
              background: msg.role === 'ai' ? 'white' : 'linear-gradient(135deg, #3B82F6, #06B6D4)',
              color: msg.role === 'ai' ? '#1E293B' : 'white',
              borderRadius: msg.role === 'ai' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
              padding: '12px 16px',
              fontSize: '14px',
              lineHeight: 1.7,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              {formatText(msg.text)}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💼</div>
            <div style={{ background: 'white', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', fontSize: '14px', color: '#64748B', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              考え中<span style={{ animation: 'blink 1s infinite' }}>...</span>
            </div>
          </div>
        )}

        {/* クイックリプライ */}
        {showQuickReplies && !loading && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
            {QUICK_REPLIES.map(qr => (
              <button key={qr} onClick={() => sendMessage(qr)} style={{
                background: 'white',
                border: '1.5px solid #3B82F6',
                color: '#3B82F6',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}>
                {qr}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 入力エリア */}
      <div style={{ width: '100%', maxWidth: '600px', padding: '16px', background: 'white', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)', marginTop: '16px' }}>
        {limitReached ? (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', color: '#DC2626', textAlign: 'center' }}>
            本日の利用回数（{DAILY_LIMIT}回）に達しました。明日またご利用ください🙏
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="メッセージを入力..."
              style={{
                flex: 1,
                border: '1.5px solid #E2E8F0',
                borderRadius: '24px',
                padding: '12px 18px',
                fontSize: '14px',
                outline: 'none',
                color: '#1E293B',
                background: '#F8FAFC',
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: loading || !input.trim() ? '#E2E8F0' : 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                border: 'none',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              ➤
            </button>
          </div>
        )}
        <p style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center', marginTop: '8px', marginBottom: 0 }}>
          AIの回答は参考情報です。詳細は各企業にご確認ください。
        </p>
      </div>
    </main>
  )
}
