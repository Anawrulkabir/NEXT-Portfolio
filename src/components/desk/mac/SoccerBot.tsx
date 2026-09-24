'use client'
/**
 * Soccer Bot: a nod to the remote-controlled robot I built in 2022.
 * Tank controls (arrows or WASD), push the ball into the goal, 60 seconds.
 */
import { useEffect, useRef, useState } from 'react'

const W = 600
const H = 380
const GOAL = { y: H / 2 - 55, h: 110 }
const BOT_R = 17
const BALL_R = 9

export function SoccerBotApp() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const keys = useRef(new Set<string>())
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(60)
  const [state, setState] = useState<'ready' | 'play' | 'over'>('ready')
  const [flash, setFlash] = useState(false)
  const game = useRef({
    bot: { x: 110, y: H / 2, a: 0, v: 0 },
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
    const reset = () => {
      const g = game.current
      g.ball = { x: W / 2, y: H / 2 + (Math.random() - 0.5) * 120, vx: 0, vy: 0 }
    }
    const step = (dt: number) => {
      const { bot, ball } = game.current
      const k = keys.current
      if (state === 'play') {
        const fwd = (k.has('ArrowUp') || k.has('KeyW') ? 1 : 0) - (k.has('ArrowDown') || k.has('KeyS') ? 1 : 0)
        const turn = (k.has('ArrowRight') || k.has('KeyD') ? 1 : 0) - (k.has('ArrowLeft') || k.has('KeyA') ? 1 : 0)
        bot.a += turn * 3.4 * dt
        bot.v += fwd * 520 * dt
      }
      bot.v *= Math.pow(0.02, dt)
      bot.x = Math.max(BOT_R, Math.min(W - BOT_R, bot.x + Math.cos(bot.a) * bot.v * dt))
      bot.y = Math.max(BOT_R, Math.min(H - BOT_R, bot.y + Math.sin(bot.a) * bot.v * dt))

      ball.x += ball.vx * dt
      ball.y += ball.vy * dt
      ball.vx *= Math.pow(0.35, dt)
      ball.vy *= Math.pow(0.35, dt)
      const dx = ball.x - bot.x
      const dy = ball.y - bot.y
      const d = Math.hypot(dx, dy)
      if (d < BOT_R + BALL_R && d > 0) {
        const nx = dx / d
        const ny = dy / d
        ball.x = bot.x + nx * (BOT_R + BALL_R)
        ball.y = bot.y + ny * (BOT_R + BALL_R)
        const push = Math.max(90, Math.abs(bot.v) * 1.35)
        ball.vx = nx * push
        ball.vy = ny * push
      }
      if (ball.y < BALL_R || ball.y > H - BALL_R) {
        ball.vy *= -0.8
        ball.y = Math.max(BALL_R, Math.min(H - BALL_R, ball.y))
      }
      const inGoalMouth = ball.y > GOAL.y && ball.y < GOAL.y + GOAL.h
      if (ball.x > W - BALL_R && inGoalMouth) {
        if (state === 'play') {
          setScore((s) => s + 1)
          setFlash(true)
          setTimeout(() => setFlash(false), 600)
        }
        reset()
      } else if (ball.x < BALL_R || ball.x > W - BALL_R) {
        ball.vx *= -0.8
        ball.x = Math.max(BALL_R, Math.min(W - BALL_R, ball.x))
      }
    }
    const draw = () => {
      const { bot, ball } = game.current
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
      // Goal
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      ctx.fillRect(W - 14, GOAL.y, 14, GOAL.h)
      ctx.fillStyle = '#fff'
      ctx.fillRect(W - 6, GOAL.y - 3, 6, 4)
      ctx.fillRect(W - 6, GOAL.y + GOAL.h - 1, 6, 4)
      // Bot: a little square chassis with wheels, in the R65's colours.
      ctx.save()
      ctx.translate(bot.x, bot.y)
      ctx.rotate(bot.a)
      ctx.fillStyle = 'rgba(0,0,0,0.25)'
      ctx.fillRect(-BOT_R + 3, -BOT_R + 4, BOT_R * 2, BOT_R * 2)
      ctx.fillStyle = '#1d1e20'
      ctx.fillRect(-12, -BOT_R - 3, 22, 6)
      ctx.fillRect(-12, BOT_R - 3, 22, 6)
      ctx.fillStyle = '#efe6d6'
      ctx.fillRect(-BOT_R, -BOT_R + 2, BOT_R * 2, BOT_R * 2 - 4)
      ctx.fillStyle = '#a9444c'
      ctx.fillRect(BOT_R - 7, -BOT_R + 2, 7, BOT_R * 2 - 4)
      ctx.fillStyle = '#4d8059'
      ctx.fillRect(-8, -5, 10, 10)
      ctx.restore()
      // Ball
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
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      step(dt)
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [state])

  const start = () => {
    game.current = { bot: { x: 110, y: H / 2, a: 0, v: 0 }, ball: { x: W / 2, y: H / 2, vx: 0, vy: 0 } }
    setScore(0)
    setLeft(60)
    setState('play')
    canvas.current?.focus()
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 bg-[#23392a] text-[#efe6d6] p-4">
      <div className="flex w-[600px] items-center justify-between text-[13px]">
        <span>
          Goals <b className="text-[18px] tabular-nums">{score}</b>
        </span>
        <span className="text-white/60">Arrows or WASD · push the ball into the goal on the right</span>
        <span>
          <b className="text-[18px] tabular-nums">{left}</b>s
        </span>
      </div>
      <div className="relative">
        <canvas
          ref={canvas}
          width={W}
          height={H}
          tabIndex={0}
          aria-label="Soccer Bot field. Use the arrow keys or WASD to drive."
          className={`rounded-lg outline-none ring-offset-2 ring-offset-[#23392a] focus-visible:ring-2 ring-[#efe6d6] ${flash ? 'brightness-125' : ''}`}
          onKeyDown={(e) => {
            if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault()
            keys.current.add(e.code)
            if (state !== 'play' && (e.code === 'Space' || e.code === 'Enter')) start()
          }}
          onKeyUp={(e) => keys.current.delete(e.code)}
          onBlur={() => keys.current.clear()}
        />
        {state !== 'play' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/45 text-center">
            <p className="text-[20px] font-semibold">{state === 'over' ? `Full time: ${score} goal${score === 1 ? '' : 's'}` : 'Soccer Bot'}</p>
            <p className="mt-1 max-w-[380px] text-[13px] text-white/75">
              In 2022 I built a remote-controlled robot for a robosoccer competition. This one is easier to drive.
            </p>
            <button type="button" onClick={start} className="mt-4 rounded-lg bg-[#efe6d6] px-5 py-1.5 font-semibold text-black hover:bg-white">
              {state === 'over' ? 'Play again' : 'Kick off'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
