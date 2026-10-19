/** The deploy experience's engine (engine.js, generated from the prototype's section files). */
export interface DeployApi {
  exec(command: string): void
  go(service: number): void
  overview(): void
  setMode(mode: 'explore' | 'tour' | 'read'): void
  skip(): void
  reboot(): void
  /** another route is showing: stop drawing, listening and sounding, and keep every bit of state */
  pause(): void
  /** the island is showing again: pick up where it was, following the address if it changed */
  resume(): void
}
export function mountDeploy(three: unknown, hairline: unknown, root: HTMLElement, images: Record<string, string>): DeployApi
