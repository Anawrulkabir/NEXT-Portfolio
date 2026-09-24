'use client'
import { createContext, useContext } from 'react'

export type AppId = 'notes' | 'photos' | 'terminal' | 'gpu' | 'soccer' | 'mail' | 'preview' | 'about'

export type OS = {
  /** Open (or focus) an app; `arg` selects a note or a photo album. */
  open: (id: AppId, arg?: string) => void
  /** The desk's sound toggle, so apps can stay quiet too. */
  muted: boolean
}

const Ctx = createContext<OS>({ open: () => {}, muted: false })
export const OSProvider = Ctx.Provider
export const useOS = () => useContext(Ctx)
