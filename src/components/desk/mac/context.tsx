'use client'
import { createContext, useContext } from 'react'

export type AppId = 'notes' | 'photos' | 'terminal' | 'gpu' | 'soccer' | 'mail' | 'preview' | 'about'

export type OS = {
  /** Open (or focus) an app; `arg` selects a note or a photo album. */
  open: (id: AppId, arg?: string) => void
}

const Ctx = createContext<OS>({ open: () => {} })
export const OSProvider = Ctx.Provider
export const useOS = () => useContext(Ctx)
