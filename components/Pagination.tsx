import React from 'react'

type Props = {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    pageSizeOptions?: number[]
}

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [5, 8, 10, 12, 20, 50] }: Props) {
    const [openPage, setOpenPage] = React.useState(false)
    const [openSize, setOpenSize] = React.useState(false)
    const pageRef = React.useRef<HTMLDivElement>(null)
    const sizeRef = React.useRef<HTMLDivElement>(null)

    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const canPrev = page > 1
    const canNext = page < totalPages

    const start = total === 0 ? 0 : (page - 1) * pageSize + 1
    const end = Math.min(total, page * pageSize)

    function goTo(p: number) {
        const clamped = Math.min(totalPages, Math.max(1, p))
        onPageChange(clamped)
    }

    function changeSize(size: number) {
        if (size !== pageSize) {
            onPageSizeChange(size)
        }
    }

    // Close dropdowns when clicking outside their containers
    React.useEffect(() => {
        function onDocMouseDown(e: MouseEvent) {
            const target = e.target as Node
            if (openPage && pageRef.current && !pageRef.current.contains(target)) {
                setOpenPage(false)
            }
            if (openSize && sizeRef.current && !sizeRef.current.contains(target)) {
                setOpenSize(false)
            }
        }
        document.addEventListener('mousedown', onDocMouseDown)
        return () => document.removeEventListener('mousedown', onDocMouseDown)
    }, [openPage, openSize])

    const Box = ({ children, onClick, ariaLabel }: { children: React.ReactNode; onClick?: () => void; ariaLabel?: string }) => (
        <button
            type="button"
            aria-label={ariaLabel}
            onClick={onClick}
            className="relative inline-flex items-center gap-2 md:gap-4 rounded-lg bg-[#1D1D1D] px-3 py-2 md:px-4 md:py-3 justify-center cursor-pointer h-10 md:h-12"
        >
            {children}
        </button>
    )

    const IconBtn = ({ disabled, dir, onClick }: { disabled?: boolean; dir: 'left' | 'right'; onClick: () => void }) => (
        <button
            className="inline-flex h-6 w-6 items-center justify-center rounded-md hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            disabled={disabled}
            onClick={onClick}
            aria-label={dir === 'left' ? 'Previous page' : 'Next page'}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-200">
                {dir === 'left' ? (
                    <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                    <path d="M9 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                )}
            </svg>
        </button>
    )

    const Menu = ({ open, children }: { open: boolean; children: React.ReactNode }) => (
        open ? (
            <div className="absolute bottom-full left-0 mb-2 z-10 min-w-full rounded-md bg-[#1D1D1D] shadow-lg border border-neutral-800">
                {children}
            </div>
        ) : null
    )

    const MenuItem = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
        <button
            type="button"
            onClick={onClick}
            className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-white cursor-pointer text-base"
        >
            {children}
        </button>
    )

    return (
        <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-y-3 gap-x-6 text-base md:text-[15px] lg:text-2xl md:leading-[29px] text-white">
            <div className="flex items-center gap-x-2 md:gap-x-4 relative">
                <span>Page</span>
                <div className="relative" ref={pageRef}>
                    <Box onClick={() => { setOpenPage((v) => !v); setOpenSize(false) }} ariaLabel="Select page">
                        <span className="text-white">{page}</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Box>
                    <Menu open={openPage}>
                        <div className="max-h-60 overflow-auto">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <MenuItem key={p} onClick={() => { setOpenPage(false); goTo(p) }}>
                                    {p}
                                </MenuItem>
                            ))}
                        </div>
                    </Menu>
                </div>
            </div>

            <div className="flex items-center gap-x-2 md:gap-x-4 relative">
                <span>Rows per page</span>
                <div className="relative" ref={sizeRef}>
                    <Box onClick={() => { setOpenSize((v) => !v); setOpenPage(false) }} ariaLabel="Select rows per page">
                        <span className="text-white">{pageSize}</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Box>
                    <Menu open={openSize}>
                        {pageSizeOptions.map((s) => (
                            <MenuItem key={s} onClick={() => { setOpenSize(false); changeSize(s) }}>
                                {s}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </div>

            <span className="tabular-nums">{start} - {end} of {total || 0}</span>

            <div className="flex items-center gap-2">
                <IconBtn dir="left" disabled={!canPrev} onClick={() => goTo(page - 1)} />
                <IconBtn dir="right" disabled={!canNext} onClick={() => goTo(page + 1)} />
            </div>
        </div>
    )
}
