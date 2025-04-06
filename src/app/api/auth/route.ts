import { NextRequest, NextResponse } from 'next/server'
import Web3Token from 'web3-token'
import { ethers } from 'ethers'

export async function POST(req: NextRequest) {
    const { message, signature } = await req.json()

    try {
        // Recover the address from the signature
        const address = ethers.verifyMessage(message, signature)

        // Create a token with the verified address
        const token = await Web3Token.sign(
            (msg: string) => Promise.resolve(signature),
            message,
            {
                domain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost',
                statement: 'Sign in to authenticate with web3-token',
                expires_in: '1d',
                address: address
            }
        )

        const res = NextResponse.json({ success: true })
        res.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 86400 // 1 day
        })
        return res
    } catch (err) {
        if (err instanceof Error) {
            console.error('Authentication error:', err.message)
        }
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 401 }
        )
    }
}
