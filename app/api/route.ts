import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestHeaders = new Headers(request.headers)

  return NextResponse.json({ headers: Array.from(requestHeaders.entries()) })
}
