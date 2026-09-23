'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

/**
 * Container for every world object card (§07.3): right-docked 440px panel on
 * desktop, 88vh bottom sheet on mobile. Radix gives focus trap + Esc; the
 * caller returns focus to the invoking object via onCloseAutoFocus.
 */
export function Panel({
  open,
  onOpenChange,
  title,
  children,
  footer,
  onCloseAutoFocus,
  wide = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  onCloseAutoFocus?: (e: Event) => void
  /** Wide mode (640px) for the research pipeline and airfoil demo (I-09, I-10). */
  wide?: boolean
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          onCloseAutoFocus={onCloseAutoFocus}
          aria-describedby={undefined}
          className={`fixed z-50 flex flex-col bg-parchment text-ink border-loam pixel-shadow
            inset-x-0 bottom-0 max-h-[88vh] border-t-2
            md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:max-h-none ${wide ? 'md:w-[640px]' : 'md:w-[440px]'} md:border-t-0 md:border-l-2
            data-[state=open]:animate-in data-[state=closed]:animate-out duration-200
            data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom
            md:data-[state=open]:slide-in-from-right md:data-[state=closed]:slide-out-to-right`}
        >
          <div className="pixel-panel-header flex items-center justify-between gap-3 px-5 py-3 shrink-0">
            <Dialog.Title className="font-display text-base">{title}</Dialog.Title>
            <Dialog.Close className="pixel-focus p-1" aria-label="Close">
              <X className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="overflow-y-auto px-5 py-5 flex-1">{children}</div>
          {footer && <div className="shrink-0 border-t-2 border-loam px-5 py-3">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
