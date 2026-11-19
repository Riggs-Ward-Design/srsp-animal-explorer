import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode
} from 'react'
import { BYPASS_INPUT_LOCK, InputLockContext, type ReleaseLock } from './useInputLock'

const DEFAULT_TIMEOUT_MS = 2000

let instanceCount = 0

const isBypassed = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest(`[${BYPASS_INPUT_LOCK}]`) !== null

const describeTarget = (target: EventTarget | null): string => {
  if (!(target instanceof Element)) return String(target)
  const classes = [...target.classList].map((c) => '.' + c).join('')
  return `<${target.tagName.toLowerCase()}${classes}>`
}

// First stack frame outside this folder and outside dependencies, e.g. "Panel (DirectionalTransitions.tsx)".
// Line numbers are dropped: Error.stack isn't source-mapped, so they'd point into transformed code.
const describeOrigin = (origin: Error): string => {
  const frames = (origin.stack ?? '').split('\n').slice(1)
  const frame = frames.find(
    (f) => !f.includes('/InputLock/') && !f.includes('node_modules') && f.includes('at ')
  )
  if (!frame) return 'unknown'
  const match = frame.match(/at (?:(.+?) \()?(.+?):\d+:\d+\)?$/)
  if (!match) return frame.trim()
  const fn = match[1]?.replace(/^Object\./, '') ?? 'anonymous'
  const file = match[2].split('/').pop()?.split('?')[0] ?? match[2]
  return `${fn} (${file})`
}

interface InputLockProps {
  children?: ReactNode
  isVerbose?: boolean
}

/**
 * Blocks pointerdown in its subtree while any lock is held. Locks are counted, and each
 * releases itself after a timeout so a missed release can't freeze input.
 */
const InputLock = (props: InputLockProps): ReactElement => {
  //
  const [instance] = useState(() => ++instanceCount)
  const held = useRef(new Map<number, string>())
  const nextId = useRef(1)

  // A ref so toggling verbosity doesn't change `lock` and re-run every holder's effect.
  const verbose = useRef(props.isVerbose ?? false)
  verbose.current = props.isVerbose ?? false

  // Takes a function so the message is only built when logging is on.
  const log = useCallback(
    (level: 'log' | 'warn', message: () => string): void => {
      if (verbose.current) console[level](`[InputLock ${instance}] ${message()}`)
    },
    [instance]
  )

  const heldSummary = (): string =>
    `held by ${[...held.current].map(([id, holder]) => `#${id} ${holder}`).join(', ')}`

  const acquire = useCallback(
    (holder: string, timeoutMs = DEFAULT_TIMEOUT_MS): ReleaseLock => {
      const id = nextId.current++
      const start = performance.now()
      held.current.set(id, holder)
      log('log', () => `lock #${id} acquired by ${holder} (${held.current.size} held)`)

      let released = false
      const finish = (timedOut: boolean): void => {
        if (released) return
        released = true
        clearTimeout(timer)
        held.current.delete(id)
        const elapsed = Math.round(performance.now() - start)
        if (timedOut) {
          log(
            'warn',
            () => `lock #${id} (${holder}) TIMED OUT after ${elapsed}ms (${held.current.size} held)`
          )
        } else {
          log('log', () => `lock #${id} released after ${elapsed}ms (${held.current.size} held)`)
        }
      }
      const timer = setTimeout(() => finish(true), timeoutMs)
      return () => finish(false)
    },
    [log]
  )

  const lock = useCallback(
    (timeoutMs?: number, origin?: Error): ReleaseLock =>
      acquire(verbose.current ? describeOrigin(origin ?? new Error()) : '', timeoutMs),
    [acquire]
  )

  const api = useMemo(() => ({ lock }), [lock])

  const onPointerDownCapture = (e: ReactPointerEvent): void => {
    if (held.current.size > 0) {
      if (!isBypassed(e.target)) {
        e.stopPropagation()
        e.preventDefault()
        log('log', () => `BLOCKED pointerdown on ${describeTarget(e.target)} (${heldSummary()})`)
        return
      }
      log(
        'log',
        () => `pointerdown on ${describeTarget(e.target)} bypassed the lock (${heldSummary()})`
      )
    } else {
      log('log', () => `allowed pointerdown on ${describeTarget(e.target)}`)
    }

    // Covers the frames between this input and any animation it starts taking its own lock.
    const release = acquire('input settle')
    requestAnimationFrame(() => requestAnimationFrame(release))
  }

  return (
    <InputLockContext.Provider value={api}>
      <div style={{ display: 'contents' }} onPointerDownCapture={onPointerDownCapture}>
        {props.children}
      </div>
    </InputLockContext.Provider>
  )
}

export default InputLock
