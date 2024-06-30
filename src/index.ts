export function debounce<T extends any[]>(
  func: (...args: T) => void,
  wait: number
): (...args: T) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (...args: T): void {
    const later = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
        timeoutId = null
      }

      func(...args)
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(later, wait)
  }
}

type ThrottleOptions = {
  leading?: boolean
  trailing?: boolean
}

export function throttle<T extends any[]>(
  func: (...args: T) => void,
  wait: number,
  options: ThrottleOptions = {}
): ((...args: T) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastInvocationTime: number | null = null
  let lastArgs: T | null = null
  const { leading = true, trailing = true } = options

  const later = () => {
    const now = Date.now()

    if (trailing && lastArgs) {
      if (now - (lastInvocationTime || 0) >= wait) {
        func(...(lastArgs as T))
        lastInvocationTime = now
        lastArgs = null
      }
    }

    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const throttledFunction = (...args: T): void => {
    lastArgs = args

    if (!lastInvocationTime && leading) {
      func(...args)
      lastInvocationTime = Date.now()
    }

    if (!timeoutId) {
      timeoutId = setTimeout(later, wait)
    }
  }

  // Add the cancel method
  throttledFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }

    lastArgs = null
    lastInvocationTime = null
  }

  return throttledFunction
}
