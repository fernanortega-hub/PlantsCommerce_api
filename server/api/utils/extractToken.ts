import { Request } from "express";

export default function extractToken(req: Request): string | null {
    const auth = req.headers.authorization ?? null

    if (auth == null)
        return null

    const [bearer, token] = auth.split(' ')

    if (bearer.trim().length === 0 || token.trim().length === 0) 
        return null

    return token
}