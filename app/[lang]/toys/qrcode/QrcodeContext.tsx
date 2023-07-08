'use client'

import type { Dispatch } from 'react'
import { createContext, useContext, useReducer } from 'react'
import type { QrcodeOptions } from '@/hooks/useQRCode'

const QrcodeContext = createContext<QrcodeOptions | null>(null)

const QrcodeDispatchContext = createContext<Dispatch<QrcodeReducerAction> | null>(null)

interface QrcodeProviderProps {
  children: React.ReactNode
}

export function QrcodeProvider({ children }: QrcodeProviderProps) {
  const [qrcode, dispatch] = useReducer(
    qrcodeReducer,
    {
      typeNumber: 0,
      errorCorrectionLevel: 'L',
      mode: 'Byte',
      content: 'Hi!',
      cellSize: 10,
      multibyte: 'UTF-8',
    } as QrcodeOptions,
  )

  return (
    <QrcodeContext.Provider value={qrcode}>
      <QrcodeDispatchContext.Provider value={dispatch}>
        {children}
      </QrcodeDispatchContext.Provider>
    </QrcodeContext.Provider>
  )
}

export function useQrcodeOptions() {
  return useContext(QrcodeContext)!
}

export function useQrcodeDispatch() {
  return useContext(QrcodeDispatchContext)!
}

export interface QrcodeReducerAction {
  type: 'changed'
  options: Partial<QrcodeOptions>
}

function qrcodeReducer(options: QrcodeOptions, action: QrcodeReducerAction): QrcodeOptions {
  switch (action.type) {
    case 'changed': {
      return Object.assign({}, options, action.options)
    }
    default: {
      throw new Error('Unknown action')
    }
  }
}
