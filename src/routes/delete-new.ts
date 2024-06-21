import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../lib/prisma';
import { FastifyInstance } from 'fastify';
import { BadRequest } from './_errors/bad-request';

export async function deleteNew(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/news/:newsId',
    {
      schema: {
        summary: 'Delete a new',
        tags: ['news'],
        params: z.object({
          newsId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { newsId } = request.params;

      const existingNews = await prisma.new.findUnique({
        where: {
          id: newsId,
        },
      });

      if (existingNews === null) {
        throw new BadRequest('News not found');
      }

      await prisma.new.delete({
        where: { id: existingNews.id },
      });

      return reply.status(200).send({ message: 'News deleted successfully' });
    },
  );
}
