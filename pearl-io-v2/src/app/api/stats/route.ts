import { NextResponse } from 'next/server'
import { getDashboardStats } from '@/lib/actions'

export async function GET() {
  try {
    const stats = await getDashboardStats()
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error in stats route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
} 