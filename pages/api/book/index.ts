import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"


// POST /api/book
// Temporarily everything is optional in req.body (but status is always passed)
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { title, authors, isbn, publisher, genre, status } = req.body;
    const session = await getServerSession(req, res, authOptions)

    if (session) {
        const result = await prisma.book.create({
            data: {
                userId: session.user.id,
                title: title,
                author: authors,
                isbn: isbn,
                publisher: publisher,
                genre: genre,
                status: status,
            },
        });
        res.json(result);
    } else {
        res.status(401).send({ message: 'Unauthorized' })
    }
}