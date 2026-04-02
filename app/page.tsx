export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
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
          <div className="bg-gray-800 px-4 py-3 flex items-center gap-3 border-b border-purple-900">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm">
              🤖
            </div>
            <div>
              <div className="text-sm font-bold">HatarakAI アシスタント</div>
              <div className="text-xs text-green-400">● オンライン中</div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs flex-shrink-0">🤖</div>
              <div className="bg-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 max-w-xs">
                こんにちは！どんな働き方をお探しですか？
              </div>
            </div>
            <div className="flex gap-2 flex-row-reverse">
              <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs flex-shrink-0">👤</div>
              <div className="bg-purple-900 rounded-xl px-3 py-2 text-sm text-gray-200 max-w-xs">
                週3日で、扶養内で働きたいです
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs flex-shrink-0">🤖</div>
              <div className="bg-gray-800 rounded-xl px-3 py-2 text-sm text-gray-200 max-w-xs">
                🔍 名古屋エリアで <strong>23件</strong> 見つかりました！
              </div>
            </div>
          </div>
          <div className="px-4 pb-4 flex gap-2">
            <input
              type="text"
              placeholder="例：土日だけ働きたい、在宅希望..."
              className="flex-1 bg-gray-800 border border-purple-900 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none"
            />
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl w-10 h-10 flex items-center justify-center text-white">
              ➤
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
