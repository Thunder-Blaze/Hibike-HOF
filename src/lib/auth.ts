import { NextRequest } from 'next/server'
import Web3Token from 'web3-token'

export async function verifyToken(request: NextRequest) {
    try {
        const token = request.headers
            .get('Authorization')
            ?.replace('Bearer ', '')
        if (!token) return null

        const { address } = await Web3Token.verify(token)
        return address
    } catch (err) {
        if (err instanceof Error) {
            console.error('Token verification error:', err.message)
        }
        return null
    }
}
