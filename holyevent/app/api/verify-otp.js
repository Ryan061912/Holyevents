import { NextResponse } from 'next/server'
import { otpStore } from '../send-otp/route'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, otp } = body

    console.log('🔍 Verifying OTP for:', email)

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Missing email or OTP' },
        { status: 400 }
      )
    }

    // Get stored OTP
    const storedData = otpStore.get(email)

    if (!storedData) {
      console.log('❌ No OTP found for:', email)
      return NextResponse.json(
        { error: 'OTP not found or expired' },
        { status: 400 }
      )
    }

    // Check expiration
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email)
      console.log('❌ OTP expired for:', email)
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      )
    }

    // Check attempts (max 3)
    if (storedData.attempts >= 3) {
      otpStore.delete(email)
      console.log('❌ Too many attempts for:', email)
      return NextResponse.json(
        { error: 'Too many failed attempts' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (storedData.code !== otp) {
      storedData.attempts++
      otpStore.set(email, storedData)
      console.log(`❌ Invalid OTP. Attempts: ${storedData.attempts}/3`)
      return NextResponse.json(
        { error: `Invalid OTP code. ${3 - storedData.attempts} attempts remaining.` },
        { status: 400 }
      )
    }

    // Success - remove OTP
    otpStore.delete(email)
    console.log('✅ OTP verified successfully for:', email)

    return NextResponse.json(
      { 
        message: 'Email verified successfully',
        verified: true 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Error in verify-otp:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    )
  }
}