import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HatarakAI - AIがあなたの仕事を見つける',
  description: 'AIと会話するだけで、あなたにぴったりの求人が見つかる新しい求人サイト',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
