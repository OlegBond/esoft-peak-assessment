import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DFS Slate Explorer',
  description: 'Operator, game type, slate and players explorer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-900 text-gray-100 flex flex-col">
        {/* Full-width top toolbar */}
        <header className="w-full bg-neutral-950 border-b border-neutral-800" >
          <div className="flex items-center px-4 md:px-6 h-20">
            <div className="flex items-center gap-8">
              <span className="inline-flex items-center justify-center text-4xl">🏈</span>
              <h1 className="text-2xl text-gray-100">Fantasy Football</h1>
            </div>
          </div>
        </header>
        <div className="px-6 md:px-8 pt-4 pb-6 md:pb-8 flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  )
}
