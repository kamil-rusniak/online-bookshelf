import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';


// DELETE /api/book/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const bookId = req.query.id as string;

    const session = await getServerSession(req, res, authOptions)

    if (req.method === "DELETE") {
        if (session) {
            const book = await prisma.book.delete({
                where: {
                    id: bookId,
                },
            });
            res.json(book);
        } else {
            res.status(401).send({ message: 'Unauthorized' })
        }
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        );
    }
}