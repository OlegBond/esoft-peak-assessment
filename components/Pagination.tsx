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
    const uid = React.useId()
    const pageMenuId = `page-menu-${uid}`
    const sizeMenuId = `size-menu-${uid}`
    const pageBtnId = `page-button-${uid}`
    const sizeBtnId = `size-button-${uid}`

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

    // Close dropdowns when clicking outside their containers and on Escape
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
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                if (openPage) setOpenPage(false)
                if (openSize) setOpenSize(false)
            }
        }
        document.addEventListener('mousedown', onDocMouseDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('mousedown', onDocMouseDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [openPage, openSize])

    const Box = ({ children, onClick, ariaLabel, ariaControls, ariaExpanded, ariaHasPopup }: { children: React.ReactNode; onClick?: () => void; ariaLabel?: string; ariaControls?: string; ariaExpanded?: boolean; ariaHasPopup?: boolean | "dialog" | "menu" | "listbox" | "tree" | "grid" | "false" | "true" }) => (
        <button
            type="button"
            id={ariaControls === pageMenuId ? pageBtnId : ariaControls === sizeMenuId ? sizeBtnId : undefined}
            aria-label={ariaLabel}
            aria-controls={ariaControls}
            aria-haspopup={ariaHasPopup}
            aria-expanded={ariaExpanded}
            onClick={onClick}
            className="relative inline-flex items-center gap-2 md:gap-4 rounded-lg bg-[#1D1D1D] px-3 py-2 md:px-4 md:py-3 justify-center cursor-pointer h-8 md:h-10"
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-200" aria-hidden="true" focusable="false">
                {dir === 'left' ? (
                    <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                    <path d="M9 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                )}
            </svg>
        </button>
    )

    const Menu = ({ open, children, id, labelledBy }: { open: boolean; children: React.ReactNode; id: string; labelledBy?: string }) => (
        open ? (
            <div id={id} role="listbox" aria-labelledby={labelledBy} className="absolute bottom-full left-0 mb-2 z-10 min-w-full rounded-md bg-[#1D1D1D] shadow-lg border border-neutral-800">
                {children}
            </div>
        ) : null
    )

    const MenuItem = ({ children, onClick, selected }: { children: React.ReactNode; onClick: () => void; selected?: boolean }) => (
        <button
            type="button"
            role="option"
            aria-selected={selected}
            onClick={onClick}
            className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-white cursor-pointer text-base"
        >
            {children}
        </button>
    )

    return (
        <div className="flex w-full flex-wrap md:flex-nowrap items-center justify-center md:justify-between gap-y-3 gap-x-6 text-base md:text-[15px] lg:text-2xl md:leading-[29px] text-white">
            <div className="flex items-center gap-x-2 md:gap-x-4 relative">
                <span id={`page-label-${uid}`}>Page</span>
                <div className="relative" ref={pageRef}>
                    <Box
                        onClick={() => { setOpenPage((v) => !v); setOpenSize(false) }}
                        ariaLabel="Select page"
                        ariaControls={pageMenuId}
                        ariaHasPopup="listbox"
                        ariaExpanded={openPage}
                    >
                        <span className="text-white">{page}</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white" aria-hidden="true" focusable="false">
                            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Box>
                    <Menu open={openPage} id={pageMenuId} labelledBy={pageBtnId}>
                        <div className="max-h-60 overflow-auto">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <MenuItem key={p} onClick={() => { setOpenPage(false); goTo(p) }} selected={p === page}>
                                    {p}
                                </MenuItem>
                            ))}
                        </div>
                    </Menu>
                </div>
            </div>

            <div className="flex items-center gap-x-2 md:gap-x-4 relative">
                <span id={`size-label-${uid}`}>Rows per page</span>
                <div className="relative" ref={sizeRef}>
                    <Box
                        onClick={() => { setOpenSize((v) => !v); setOpenPage(false) }}
                        ariaLabel="Select rows per page"
                        ariaControls={sizeMenuId}
                        ariaHasPopup="listbox"
                        ariaExpanded={openSize}
                    >
                        <span className="text-white">{pageSize}</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white" aria-hidden="true" focusable="false">
                            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Box>
                    <Menu open={openSize} id={sizeMenuId} labelledBy={sizeBtnId}>
                        {pageSizeOptions.map((s) => (
                            <MenuItem key={s} onClick={() => { setOpenSize(false); changeSize(s) }} selected={s === pageSize}>
                                {s}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </div>

            <span className="tabular-nums" aria-live="polite">{start} - {end} of {total || 0}</span>

            <div className="flex items-center gap-2">
                <IconBtn dir="left" disabled={!canPrev} onClick={() => goTo(page - 1)} />
                <IconBtn dir="right" disabled={!canNext} onClick={() => goTo(page + 1)} />
            </div>
        </div>
    )
}
