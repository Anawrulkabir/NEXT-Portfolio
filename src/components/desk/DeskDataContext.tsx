'use client'
import { createContext, useContext } from 'react'
import type { DeskData } from './data'

const Ctx = createContext<DeskData | null>(null)
export const DeskDataProvider = Ctx.Provider

export function useDesk() {
  const d = useContext(Ctx)
  if (!d) throw new Error('useDesk outside DeskDataProvider')
  return d
}
