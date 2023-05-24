import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';


// fetch /api/user/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const userId = req.query.id as string;

    const session = await getServerSession(req, res, authOptions)

    if (req.method === "PUT") {
        if (session) {
            const { sectionSetting } = req.body;
            const user = await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    settingBookSave: sectionSetting
                },
            });
            res.json(user);
        } else {
            res.status(401).send({ message: 'Unauthorized' })
        }
    } else {
        throw new Error(
            `The HTTP ${req.method} method is not supported at this route.`
        );
    }
}