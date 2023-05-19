import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]';


// GET /api/getBooks

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)

    if (session) {
        const booksFromDb = await prisma.book.findMany({
            where: {
                userId: session?.user.id,
            },
        })
        res.json(booksFromDb);
    } else {
        res.status(401).send({ message: 'Unauthorized' })
    }
}