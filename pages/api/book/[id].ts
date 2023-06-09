import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';


// fetch /api/book/:id
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
    } else if (req.method === "PUT") {
        if (session) {

            if (req.body.status) { // handleSwitch - only this function passes the status
                const book = await prisma.book.update({
                    where: {
                        id: bookId,
                    },
                    data: {
                        status: req.body.status,
                    },
                });
                res.json(book);

            } else { // handleEdit - the only other PUT request
                const { title, authors, isbn, publisher, genre } = req.body;
                const book = await prisma.book.update({
                    where: {
                        id: bookId,
                    },
                    data: {
                        title: title,
                        author: authors,
                        isbn: isbn,
                        publisher: publisher,
                        genre: genre,
                    },
                });
                res.json(book);
            }
        } else {
            res.status(401).send({ message: 'Unauthorized' })
        }
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        );
    }
}