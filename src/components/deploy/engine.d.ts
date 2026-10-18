/** The deploy experience's engine (engine.js, generated from the prototype's section files). */
export interface DeployApi {
  exec(command: string): void
  go(service: number): void
  overview(): void
  setMode(mode: 'explore' | 'tour' | 'read'): void
  skip(): void
  reboot(): void
}
export function mountDeploy(three: unknown, hairline: unknown, root: HTMLElement, images: Record<string, string>): DeployApi
