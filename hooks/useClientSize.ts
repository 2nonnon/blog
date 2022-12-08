import { useSyncExternalStore } from 'react'
import { store } from './store'

function subscribe(callback) {
  window.addEventListener('resize', callback)
  return () => {
    window.removeEventListener('resize', callback)
  }
}

export function useClientSize() {
  return useSyncExternalStore(
    subscribe,
    () => ({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    }), // How to get the value on the client
    store.getServerSnapshot,
  )
}
