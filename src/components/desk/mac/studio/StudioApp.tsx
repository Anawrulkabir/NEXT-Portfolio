'use client'
/**
 * AI Studio: how my work at Poridhi.io launches a GPU session, before and
 * after the bare-metal migration, and a session you can launch and use.
 */
import { useState } from 'react'
import { Architecture } from './Architecture'
import { Launcher } from './Launcher'

export function StudioApp() {
  const [tab, setTab] = useState<'how' | 'try'>('how')
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#10150f] text-[#e9e6de] text-[13px]">
      <header className="flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-2">
        <div className="mr-2">
          <p className="text-[15px] font-semibold leading-tight">AI Studio</p>
          <p className="text-[11px] text-white/45">GPU sessions at Poridhi.io · my work, 2025–now</p>
        </div>
        <div className="inline-flex rounded-lg bg-white/10 p-0.5" role="tablist" aria-label="AI Studio">
          {(
            [
              ['how', 'How a session starts'],
              ['try', 'Launch one yourself'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`rounded-md px-3 py-1 text-[12.5px] ${tab === id ? 'bg-[#efe6d6] font-medium text-black' : 'text-white/70 hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <a href="https://ai.poridhi.io" target="_blank" rel="noopener noreferrer" className="ml-auto text-[12px] text-white/50 underline-offset-2 hover:text-white hover:underline">
          ai.poridhi.io ↗
        </a>
      </header>
      <div className="min-h-0 flex-1" role="tabpanel">
        {tab === 'how' ? <Architecture /> : <Launcher />}
      </div>
    </div>
  )
}
