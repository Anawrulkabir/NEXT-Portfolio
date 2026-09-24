'use client'
/**
 * AI Studio: how my work at Poridhi.io launches a GPU session, before and
 * after the bare-metal migration, and a session you can launch and use.
 */
import { useState } from 'react'
import { Architecture } from './Architecture'
import { Launcher } from './Launcher'
import { Academy } from './academy/Academy'

export function StudioApp() {
  const [tab, setTab] = useState<'learn' | 'how' | 'try'>('learn')
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#fbfaf7] text-[#1d1d1f] text-[13px]">
      <header className="flex flex-wrap items-center gap-3 border-b border-black/10 bg-white px-4 py-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#23392a] text-[13px] font-extrabold text-[#efe6d6]" aria-hidden="true">
          AI
        </span>
        <div className="mr-2">
          <p className="text-[15px] font-semibold leading-tight">AI Studio</p>
          <p className="text-[11px] text-black/50">GPU sessions at Poridhi.io · my work, 2025–now</p>
        </div>
        <div className="inline-flex rounded-lg bg-black/[0.06] p-0.5" role="tablist" aria-label="AI Studio">
          {(
            [
              ['learn', '🎮 Learn it'],
              ['how', 'See the architecture'],
              ['try', 'Launch one yourself'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`rounded-md px-3 py-1 text-[12.5px] ${tab === id ? 'bg-white font-semibold shadow-sm' : 'text-black/60 hover:text-black'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <a href="https://ai.poridhi.io" target="_blank" rel="noopener noreferrer" className="ml-auto text-[12px] text-[#1f5fd6] underline-offset-2 hover:underline">
          ai.poridhi.io ↗
        </a>
      </header>
      <div className="min-h-0 flex-1" role="tabpanel">
        {tab === 'learn' ? <Academy onLaunch={() => setTab('try')} /> : tab === 'how' ? <Architecture /> : <Launcher />}
      </div>
    </div>
  )
}
