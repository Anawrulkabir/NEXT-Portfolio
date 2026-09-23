'use client'
import { useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

const SWIPE_CLOSE = 80 // px dragged down before the sheet closes

/**
 * Container for every world object card (§07.3): a right-docked panel from
 * 1024 px up (440 px, or 640 px in wide mode); below that an 88vh bottom
 * sheet with a drag handle that closes on swipe-down (§08.8, §12.2). Radix
 * gives the focus trap + Esc; the caller returns focus to the invoking
 * object via onCloseAutoFocus.
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
  const sheetRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ y0: number; dy: number } | null>(null)

  // Swipe-down to close, from the handle or header only, so scrolling the
  // card body never fights the gesture.
  const onTouchStart = (e: React.TouchEvent) => {
    if (window.matchMedia('(min-width: 1024px)').matches) return
    drag.current = { y0: e.touches[0].clientY, dy: 0 }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!drag.current || !sheetRef.current) return
    drag.current.dy = Math.max(0, e.touches[0].clientY - drag.current.y0)
    sheetRef.current.style.transform = `translateY(${drag.current.dy}px)`
  }
  const onTouchEnd = () => {
    if (!drag.current || !sheetRef.current) return
    const close = drag.current.dy > SWIPE_CLOSE
    sheetRef.current.style.transform = ''
    drag.current = null
    if (close) onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          ref={sheetRef}
          onCloseAutoFocus={onCloseAutoFocus}
          aria-describedby={undefined}
          className={`fixed z-50 flex flex-col bg-parchment text-ink border-loam pixel-shadow
            inset-x-0 bottom-0 max-h-[88vh] border-t-2
            lg:inset-x-auto lg:right-0 lg:top-0 lg:bottom-0 lg:max-h-none ${wide ? 'lg:w-[640px]' : 'lg:w-[440px]'} lg:border-t-0 lg:border-l-2
            data-[state=open]:animate-in data-[state=closed]:animate-out duration-200
            data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom
            lg:data-[state=open]:slide-in-from-right lg:data-[state=closed]:slide-out-to-right`}
        >
          <div className="shrink-0" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <div className="lg:hidden flex justify-center bg-moss pt-2" aria-hidden="true">
              <span className="block h-1.5 w-12 bg-parchment/60" />
            </div>
            <div className="pixel-panel-header flex items-center justify-between gap-3 px-5 py-3">
              <Dialog.Title className="font-display text-base">{title}</Dialog.Title>
              <Dialog.Close
                className="pixel-focus p-1 min-w-[44px] min-h-[44px] -m-2 inline-flex items-center justify-center"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Dialog.Close>
            </div>
          </div>
          <div className="overflow-y-auto overscroll-contain px-5 py-5 flex-1">{children}</div>
          {footer && <div className="shrink-0 border-t-2 border-loam px-5 py-3">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
