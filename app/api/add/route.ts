import { NextResponse } from 'next/server'

let a = 1

export async function GET() {
  return NextResponse.json({ a: a++ })
}
