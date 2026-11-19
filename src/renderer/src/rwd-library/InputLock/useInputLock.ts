import { createContext, useCallback, useContext, useLayoutEffect, useRef } from 'react'

export type ReleaseLock = () => void

export interface InputLockApi {
  /** `origin` is where the lock was requested, for verbose logs; defaults to the caller. */
  lock: (timeoutMs?: number, origin?: Error) => ReleaseLock
}

/** Elements carrying this attribute (or inside one) receive input even while locked. */
export const BYPASS_INPUT_LOCK = 'data-bypass-input-lock'

const noop = (): void => {}

// Without a provider, locking is a no-op.
export const InputLockContext = createContext<InputLockApi>({ lock: () => noop })

export const useInputLock = (): InputLockApi => useContext(InputLockContext)

/** Holds the lock from commit until `release` is called or the component unmounts. */
export const useLockUntilReleased = (): ReleaseLock => {
  const { lock } = useInputLock()
  const releaseRef = useRef<ReleaseLock>(noop)
  // Captured during render: the effect's own stack would only show React internals.
  const origin = useRef<Error | undefined>(undefined)
  origin.current ??= new Error()

  useLayoutEffect(() => {
    releaseRef.current = lock(undefined, origin.current)
    return () => releaseRef.current()
  }, [lock])

  return useCallback(() => releaseRef.current(), [])
}
