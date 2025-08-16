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
  return (
    <div className="flex flex-col gap-1">
      <label className="sr-only">{label}</label>
      <div className="relative">
        <select
          className="w-full appearance-none rounded-2xl border border-neutral-700 bg-neutral-900 px-6 py-4 pr-12 text-xl text-gray-100 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-700 disabled:bg-neutral-800/60"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
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
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-300">
            <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
