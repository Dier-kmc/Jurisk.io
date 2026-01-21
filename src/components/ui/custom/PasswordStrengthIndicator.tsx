// components/ui/custom/PasswordStrengthIndicator.tsx
'use client'

interface PasswordStrengthIndicatorProps {
  strength: {
    hasMinLength: boolean
    hasLetter: boolean
    hasNumber: boolean
  }
}

export function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
  return (
    <div className="flex gap-3 mt-3">
      {Object.entries(strength).map(([key, value]) => (
        <div
          key={key}
          className={`flex items-center gap-1.5 text-xs ${value ? 'text-green-400' : 'text-gray-500'}`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${value ? 'bg-green-400' : 'bg-gray-600'}`}></div>
          {key === 'hasMinLength' && '8+ caractères'}
          {key === 'hasLetter' && 'Lettres'}
          {key === 'hasNumber' && 'Chiffres'}
        </div>
      ))}
    </div>
  )
}