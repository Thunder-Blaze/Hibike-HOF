import { NextRequest, NextResponse } from 'next/server'
import Web3Token from 'web3-token'

export async function POST(req: NextRequest) {
    const { message, signature } = await req.json()

    try {
        const token = await Web3Token.sign(
            (msg: unknown) => Promise.resolve(msg),
            {
                statement: message,
                signature,
                expiresIn: '1d',
            }
        )

        const res = NextResponse.json({ success: true })
        res.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        })
        return res
    } catch (err) {
        if (err instanceof Error) {
            console.error('Token signing error:', err.message)
        }
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 401 }
        )
    }
}
