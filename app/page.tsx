'use client'

import { useState, useEffect } from 'react'

const DAILY_LIMIT = 10
const STORAGE_KEY = 'hatarakai_ai_usage'

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

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'こんにちは！どんな働き方をお探しですか？週の希望日数や、得意なことを教えてください😊' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [limitReached, setLimitReached] = useState(false)

  useEffect(() => {
    const usage = getUsage()
    setUsageCount(usage.count)
    if (usage.count >= DAILY_LIMIT) setLimitReached(true)
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || loading || limitReached) return

    const usage = getUsage()
    if (usage.count >= DAILY_LIMIT) {
      setLimitReached(true)
      return
    }

    const newCount = usage.count + 1
    saveUsage(newCount)
    setUsageCount(newCount)
    if (newCount >= DAILY_LIMIT) setLimitReached(true)

    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '申し訳ありません。エラーが発生しました。もう一度お試しください。' }])
    } finally {
      setLoading(false)
    }
  }

  const remaining = DAILY_LIMIT - usageCount

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-4 text-sm text-purple-400 border border-purple-800 rounded-full px-4 py-1">
          AIが求人を提案する、新しい就活体験
        </div>
        <h1 className="text-5xl font-black mb-6">
          話すだけで、<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            仕事が見つかる。
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          条件を入力するのではなく、AIと会話するだけ。<br />
          あなたにぴったりの求人を、全国から瞬時に提案します。
        </p>

        {/* Chat Box */}
        <div className="w-full max-w-lg bg-gray-900 border border-purple-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-purple-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm">
                🤖
              </div>
              <div>
                <div className="text-sm font-bold">HatarakAI アシスタント</div>
                <div className="text-xs text-green-400">● オンライン中</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              本日残り <span className={remaining <= 3 ? 'text-red-400 font-bold' : 'text-purple-400 font-bold'}>{remaining}</span> 回
            </div>
          </div>

          <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${msg.role === 'ai' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'}`}>
                  {msg.role === 'ai' ? '🤖' : '👤'}
                </div>
                <div className={`rounded-xl px-3 py-2 text-sm text-gray-200 max-w-xs ${msg.role === 'ai' ? 'bg-gray-800' : 'bg-purple-900'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs">🤖</div>
                <div className="bg-gray-800 rounded-xl px-3 py-2 text-sm text-gray-400">考え中...</div>
              </div>
            )}
          </div>

          <div className="px-4 pb-4">
            {limitReached ? (
              <div className="bg-red-900 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-200 text-center">
                本日の利用回数（{DAILY_LIMIT}回）に達しました。<br />
                明日またご利用ください🙏
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="例：土日だけ働きたい、在宅希望..."
                  className="flex-1 bg-gray-800 border border-purple-900 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl w-10 h-10 flex items-center justify-center text-white disabled:opacity-50"
                >
                  ➤
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
