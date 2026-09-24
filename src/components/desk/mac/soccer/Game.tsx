'use client'
/**
 * The match: your plywood bot against a keeper bot, 60 seconds. Tank
 * controls: arrows or WASD, or the on-screen pad on touch screens.
 */
import { useEffect, useRef, useState } from 'react'

const W = 600
const H = 380
const GOAL = { y: H / 2 - 58, h: 116 }
const BOT_R = 18
const BALL_R = 9
const KEEPER = { x: W - 46, r: 16, speed: 95 }
const SECONDS = 60

type Bot = { x: number; y: number; a: number; v: number }

function drawBot(ctx: CanvasRenderingContext2D, b: Bot, ours: boolean) {
  ctx.save()
  ctx.translate(b.x, b.y)
  ctx.rotate(b.a)
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.fillRect(-19, -15, 42, 36)
  // wheels, poking out on both sides
  for (const wx of [-13, 9]) {
    for (const wy of [-21, 15]) {
      ctx.fillStyle = '#161617'
      ctx.fillRect(wx, wy, 13, 6)
      ctx.fillStyle = ours ? '#3a86c8' : '#9aa0a6'
      ctx.fillRect(wx + 4, wy + 1.5, 5, 3)
    }
  }
  // plywood body and lid
  ctx.fillStyle = ours ? '#b98a57' : '#6b7076'
  ctx.fillRect(-20, -16, 40, 32)
  ctx.fillStyle = ours ? '#cfa373' : '#858a90'
  ctx.fillRect(-16, -12, 30, 24)
  // the white scoop plates at the front
  ctx.fillStyle = '#f4f2ec'
  ctx.fillRect(16, -17, 9, 7)
  ctx.fillRect(16, 10, 9, 7)
  if (ours) {
    ctx.fillStyle = '#7cf08f'
    ctx.beginPath()
    ctx.arc(-9, 0, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

export function Game({ built, onStory }: { built: boolean; onStory: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const keys = useRef(new Set<string>())
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(SECONDS)
  const [state, setState] = useState<'ready' | 'play' | 'over'>('ready')
  const [flash, setFlash] = useState(false)
  const game = useRef({
    bot: { x: 110, y: H / 2, a: 0, v: 0 } as Bot,
    keeper: { x: KEEPER.x, y: H / 2, a: Math.PI, v: 0 } as Bot,
    ball: { x: W / 2, y: H / 2, vx: 0, vy: 0 },
  })

  useEffect(() => {
    if (state !== 'play') return
    const t = setInterval(() => setLeft((s) => (s <= 1 ? (setState('over'), 0) : s - 1)), 1000)
    return () => clearInterval(t)
  }, [state])

  useEffect(() => {
    const ctx = canvas.current!.getContext('2d')!
    let raf = 0
    let last = performance.now()
    const kickoff = () => {
      const g = game.current
      g.ball = { x: W / 2, y: H / 2 + (Math.random() - 0.5) * 120, vx: 0, vy: 0 }
    }
    const bounceOff = (ball: { x: number; y: number; vx: number; vy: number }, cx: number, cy: number, r: number, push: number) => {
      const dx = ball.x - cx
      const dy = ball.y - cy
      const d = Math.hypot(dx, dy)
      if (d < r + BALL_R && d > 0) {
        const nx = dx / d
        const ny = dy / d
        ball.x = cx + nx * (r + BALL_R)
        ball.y = cy + ny * (r + BALL_R)
        ball.vx = nx * push
        ball.vy = ny * push
      }
    }
    const step = (dt: number) => {
      const { bot, keeper, ball } = game.current
      const k = keys.current
      if (state === 'play') {
        const fwd = (k.has('ArrowUp') || k.has('KeyW') ? 1 : 0) - (k.has('ArrowDown') || k.has('KeyS') ? 1 : 0)
        const turn = (k.has('ArrowRight') || k.has('KeyD') ? 1 : 0) - (k.has('ArrowLeft') || k.has('KeyA') ? 1 : 0)
        bot.a += turn * 3.4 * dt
        bot.v += fwd * 540 * dt
        // Keeper: slides along the goal line after the ball, a little slower than you.
        const target = Math.max(GOAL.y + 10, Math.min(GOAL.y + GOAL.h - 10, ball.y))
        keeper.y += Math.max(-KEEPER.speed * dt, Math.min(KEEPER.speed * dt, target - keeper.y))
      }
      bot.v *= Math.pow(0.02, dt)
      bot.x = Math.max(BOT_R, Math.min(W - BOT_R, bot.x + Math.cos(bot.a) * bot.v * dt))
      bot.y = Math.max(BOT_R, Math.min(H - BOT_R, bot.y + Math.sin(bot.a) * bot.v * dt))

      ball.x += ball.vx * dt
      ball.y += ball.vy * dt
      ball.vx *= Math.pow(0.35, dt)
      ball.vy *= Math.pow(0.35, dt)
      bounceOff(ball, bot.x, bot.y, BOT_R, Math.max(90, Math.abs(bot.v) * 1.35))
      bounceOff(ball, keeper.x, keeper.y, KEEPER.r, 150)

      if (ball.y < BALL_R || ball.y > H - BALL_R) {
        ball.vy *= -0.8
        ball.y = Math.max(BALL_R, Math.min(H - BALL_R, ball.y))
      }
      const mouth = ball.y > GOAL.y && ball.y < GOAL.y + GOAL.h
      if (ball.x > W - BALL_R && mouth) {
        if (state === 'play') {
          setScore((s) => s + 1)
          setFlash(true)
          setTimeout(() => setFlash(false), 600)
        }
        kickoff()
      } else if (ball.x < BALL_R || ball.x > W - BALL_R) {
        ball.vx *= -0.8
        ball.x = Math.max(BALL_R, Math.min(W - BALL_R, ball.x))
      }
    }
    const draw = () => {
      const { bot, keeper, ball } = game.current
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 2 ? '#4a8a55' : '#529560'
        ctx.fillRect((i * W) / 8, 0, W / 8, H)
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.75)'
      ctx.lineWidth = 2
      ctx.strokeRect(6, 6, W - 12, H - 12)
      ctx.beginPath()
      ctx.moveTo(W / 2, 6)
      ctx.lineTo(W / 2, H - 6)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(W / 2, H / 2, 46, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeRect(W - 70, GOAL.y - 20, 64, GOAL.h + 40)
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.fillRect(W - 12, GOAL.y, 12, GOAL.h)
      drawBot(ctx, keeper, false)
      drawBot(ctx, bot, true)
      ctx.fillStyle = 'rgba(0,0,0,0.25)'
      ctx.beginPath()
      ctx.arc(ball.x + 2, ball.y + 3, BALL_R, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#1d1e20'
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, 3.2, 0, Math.PI * 2)
      ctx.fill()
    }
    // Fixed 60 Hz physics, so the game runs at the same speed on slow devices.
    let acc = 0
    const loop = (t: number) => {
      acc += Math.min(0.25, (t - last) / 1000)
      last = t
      while (acc >= 1 / 60) {
        step(1 / 60)
        acc -= 1 / 60
      }
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [state])

  const start = () => {
    game.current = {
      bot: { x: 110, y: H / 2, a: 0, v: 0 },
      keeper: { x: KEEPER.x, y: H / 2, a: Math.PI, v: 0 },
      ball: { x: W / 2, y: H / 2, vx: 0, vy: 0 },
    }
    setScore(0)
    setLeft(SECONDS)
    setState('play')
    canvas.current?.focus()
  }

  const hold = (code: string) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      keys.current.add(code)
    },
    onPointerUp: () => keys.current.delete(code),
    onPointerLeave: () => keys.current.delete(code),
    onPointerCancel: () => keys.current.delete(code),
  })

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 bg-[#23392a] text-[#efe6d6] p-3 sm:p-4 overflow-y-auto">
      <div className="flex w-full max-w-[600px] items-center justify-between text-[13px]">
        <span>
          Goals <b className="text-[18px] tabular-nums">{score}</b>
        </span>
        <span className="hidden sm:inline text-white/60">{built ? 'Your build · ' : ''}arrows or WASD · beat the keeper</span>
        <span>
          <b className="text-[18px] tabular-nums">{left}</b>s
        </span>
      </div>
      <div className="relative w-full max-w-[600px]">
        <canvas
          ref={canvas}
          width={W}
          height={H}
          tabIndex={0}
          aria-label="Soccer field. Drive with the arrow keys or WASD."
          className={`block w-full h-auto rounded-lg outline-none focus-visible:ring-2 ring-[#efe6d6] ${flash ? 'brightness-125' : ''}`}
          onKeyDown={(e) => {
            if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault()
            keys.current.add(e.code)
            if (state !== 'play' && (e.code === 'Space' || e.code === 'Enter')) start()
          }}
          onKeyUp={(e) => keys.current.delete(e.code)}
          onBlur={() => keys.current.clear()}
        />
        {flash && <p className="pointer-events-none absolute inset-x-0 top-6 text-center text-[28px] font-black tracking-wide text-white drop-shadow">GOAL!</p>}
        {state !== 'play' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/55 px-6 text-center">
            <p className="text-[22px] font-semibold">{state === 'over' ? `Full time: ${score} goal${score === 1 ? '' : 's'}` : built ? 'Your bot is on the pitch' : 'Kick-off'}</p>
            <p className="mt-1 max-w-[400px] text-[13px] text-white/75">
              {state === 'over' ? 'Want to see the real one?' : 'Drive into the ball to push it past the keeper.'}
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={start} className="rounded-lg bg-[#efe6d6] px-5 py-1.5 font-semibold text-black hover:bg-white">
                {state === 'over' ? 'Play again' : 'Kick off'}
              </button>
              {state === 'over' && (
                <button type="button" onClick={onStory} className="rounded-lg bg-[#7fc08c] px-5 py-1.5 font-semibold text-black hover:bg-[#98d3a3]">
                  The real Soccer Bot →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Touch pad: only on touch screens */}
      <div className="hidden [@media(pointer:coarse)]:grid grid-cols-3 gap-2 select-none" aria-label="Driving controls">
        <span />
        <button type="button" aria-label="Forward" className="h-14 w-14 rounded-xl bg-white/15 text-xl active:bg-white/30" {...hold('ArrowUp')}>
          ▲
        </button>
        <span />
        <button type="button" aria-label="Turn left" className="h-14 w-14 rounded-xl bg-white/15 text-xl active:bg-white/30" {...hold('ArrowLeft')}>
          ◀
        </button>
        <button type="button" aria-label="Reverse" className="h-14 w-14 rounded-xl bg-white/15 text-xl active:bg-white/30" {...hold('ArrowDown')}>
          ▼
        </button>
        <button type="button" aria-label="Turn right" className="h-14 w-14 rounded-xl bg-white/15 text-xl active:bg-white/30" {...hold('ArrowRight')}>
          ▶
        </button>
      </div>
    </div>
  )
}
