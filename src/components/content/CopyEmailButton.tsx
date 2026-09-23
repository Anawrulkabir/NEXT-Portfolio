'use client'
import { useState } from 'react'

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable — the mailto link next to this button still works.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="pixel-btn-secondary pixel-frame pixel-focus px-3 py-1.5 text-sm"
    >
      {copied ? 'Copied' : 'Copy email'}
    </button>
  )
}
