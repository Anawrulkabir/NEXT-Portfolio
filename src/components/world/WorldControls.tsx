'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { MotionToggle } from '@/components/chrome/MotionToggle'

const SHORTCUTS: [string, string][] = [
  ['← → or A D', 'Walk (while the map has focus)'],
  ['Tab / Shift+Tab', 'Move between objects, in path order'],
  ['Enter or Space', 'Open the focused object'],
  ['E', 'Open the object you are standing next to'],
  ['Click or tap the ground', 'Walk there'],
  ['M', 'Map of every place and object'],
  ['?', 'This list'],
  ['Esc', 'Close any card or dialog'],
]

/** "Controls" popover (§03.3): every shortcut, plus the reduce-motion switch (I-17). */
export function WorldControls({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,460px)] bg-parchment text-ink border-2 border-loam pixel-shadow"
        >
          <div className="pixel-panel-header flex items-center justify-between px-5 py-3">
            <Dialog.Title className="font-display text-base">Controls</Dialog.Title>
            <Dialog.Close
              className="pixel-focus min-w-[44px] min-h-[44px] -m-2 inline-flex items-center justify-center"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="p-5 space-y-4">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              {SHORTCUTS.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt>
                    <kbd className="font-mono text-xs border-2 border-loam px-1.5 py-0.5 whitespace-nowrap">{k}</kbd>
                  </dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm">
              Everything on the map is also on the{' '}
              <a href="/journey" className="pixel-focus underline underline-offset-2">
                Journey page
              </a>{' '}
              as plain text.
            </p>
            <MotionToggle />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
