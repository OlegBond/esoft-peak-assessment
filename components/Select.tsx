import React from 'react'

type Option = { label: string; value: string }

type Props = {
    label: string
    value: string | undefined
    options: Option[]
    placeholder?: string
    onChange: (v: string) => void
    disabled?: boolean
}

export function Select({ label, value, options, placeholder = 'Select…', onChange, disabled }: Props) {
    const selectId = React.useId()
    return (
        <div className="flex flex-col  pr-2">
            <label className="sr-only" htmlFor={selectId}>{label}</label>
            <div className="relative">
                <select
                    id={selectId}
                    className="w-full appearance-none rounded-lg bg-[#1D1D1D] px-4 md:px-8 py-3 md:py-4 pr-3 text-base md:text-2xl leading-normal md:leading-[29px] text-white focus:outline-none disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed border border-[#2F2F2F]"
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    aria-disabled={disabled ? true : undefined}
                >
                    <option value="">
                        {placeholder}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-8 md:right-3 flex items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white" aria-hidden="true" focusable="false">
                        <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    )
}
