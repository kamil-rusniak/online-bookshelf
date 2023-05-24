import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]';


// GET /api/user/getUser

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)

    if (session) {
        const user = await prisma.user.findMany({
            where: {
                id: session?.user.id,
            },
        })
        res.json(user);
    } else {
        res.status(401).send({ message: 'Unauthorized' })
    }
}