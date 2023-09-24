interface DefaultOpts { [x: string]: (...args: any[]) => void }

type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P extends any[]
    ? P
    : never
  : never

export class Emitter<T extends DefaultOpts = DefaultOpts, K extends keyof T = keyof T> {
  private eventMap = new Map<K, Array<T[K]>>()

  subscribe<E extends K>(event: E, callback: T[E]) {
    if (this.eventMap.has(event))
      this.eventMap.get(event)?.push(callback)
    else this.eventMap.set(event, [callback])
  }

  unsubscribe<E extends K>(event: E, callback: T[E]) {
    const cbQueue = this.eventMap.get(event)
    const index = cbQueue?.findIndex(cb => cb === callback)
    if (typeof index === 'number')
      cbQueue?.splice(index, 1)
  }

  once<E extends K>(event: E, callback: T[E]) {
    const fn = (...args: any[]) => {
      callback(...args)
      this.unsubscribe(event, fn as any)
    }

    this.eventMap.get(event)?.push(fn as any)
  }

  emit<E extends K>(event: E, ...args: Parameters<T[E]>) {
    this.eventMap.get(event)?.forEach(callback => callback(...args))
  }
}
