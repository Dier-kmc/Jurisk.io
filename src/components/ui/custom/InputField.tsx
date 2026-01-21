// components/ui/custom/InputField.tsx
'use client'

import { ReactNode, useState } from 'react'
import { Eye, EyeOff, LucideIcon } from 'lucide-react'

interface InputFieldProps {
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  label: string
  required?: boolean
  icon: LucideIcon
  showPasswordToggle?: boolean
  error?: string
  success?: string
  className?: string
}

export function InputField({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  required = false,
  icon: Icon,
  showPasswordToggle = false,
  error,
  success,
  className = ''
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showPasswordToggle && showPassword ? 'text' : type

  const getBorderColor = () => {
    if (error) return 'border-red-500/50 focus:ring-red-500/50'
    if (success) return 'border-green-500/50 focus:ring-green-500/50'
    return 'border-gray-700/50 focus:ring-yellow-500/50 focus:border-yellow-500/50'
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-600 transition-colors" />
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-2.5 bg-black/50 border rounded-xl focus:outline-none focus:ring-1 text-white placeholder-gray-500 transition-all ${getBorderColor()} ${className}`}
          required={required}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-green-400 flex items-center gap-1">
          {success}
        </p>
      )}
    </div>
  )
}   