import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DFS Slate Explorer',
  description: 'Operator, game type, slate and players explorer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-900 text-gray-100">
        {/* Full-width top toolbar */}
        <header className="w-full bg-neutral-950 border-b border-neutral-800">
          <div className="container flex items-center px-4 md:px-8 py-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center">🏈</span>
              <h1 className="text-lg font-semibold text-gray-100">Fantasy Football</h1>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 md:px-8 py-6">{children}</div>
      </body>
    </html>
  )
}
