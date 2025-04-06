import { cookies } from 'next/headers'
import Web3Token from 'web3-token'

export async function getUserFromToken() {
    const cookieStore = await cookies() // ✅ no await needed
    const token = cookieStore.get('auth-token')?.value
    if (!token) return null

    try {
        const { address } = Web3Token.verify(token)
        console.log(address)
        return address
    } catch (err) {
        if (err instanceof Error) {
            console.error('Token verification error:', err.message)
        }
        return null
    }
}
