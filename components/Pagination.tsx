import React from 'react'

type Props = {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < totalPages

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(total, page * pageSize)

  function goTo(p: number) {
    const clamped = Math.min(totalPages, Math.max(1, p))
    onPageChange(clamped)
  }

  const Box = ({ children }: { children: React.ReactNode }) => (
    <div className="inline-flex items-center gap-1.5 rounded-md bg-neutral-800 px-2 py-1 justify-center cursor-pointer">
      {children}
    </div>
  )

  const IconBtn = ({ disabled, dir, onClick }: { disabled?: boolean; dir: 'left' | 'right'; onClick: () => void }) => (
    <button
      className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
      disabled={disabled}
      onClick={onClick}
      aria-label={dir === 'left' ? 'Previous page' : 'Next page'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-300">
        {dir === 'left' ? (
          <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  )

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-3 text-sm text-gray-400">
      <div className="flex items-center gap-2">
        <span>Page</span>
        <Box>
          <span className="text-gray-100">{page}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Box>
      </div>

      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <Box>
          <span className="text-gray-100">{pageSize}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Box>
      </div>

      <span className="tabular-nums">
        {start} - {end} of {total || 0}
      </span>

      <div className="flex items-center gap-1">
        <IconBtn dir="left" disabled={!canPrev} onClick={() => goTo(page - 1)} />
        <IconBtn dir="right" disabled={!canNext} onClick={() => goTo(page + 1)} />
      </div>
    </div>
  )
}
