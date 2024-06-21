import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { BadRequest } from './_errors/bad-request';

export async function updateNews(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/news/:newsId',
    {
      schema: {
        summary: 'Update a new',
        tags: ['news'],
        params: z.object({
          newsId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { newsId } = request.params;
      const { title, description } = request.body;

      const news = await prisma.new.findUnique({
        where: {
          id: newsId,
        },
      });

      if (news === null) {
        throw new BadRequest('News not found');
      }

      const updatedNews = await prisma.new.update({
        where: { id: newsId },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          updatedAt: new Date(),
        },
      });

      return reply.send({
        id: news.id,
      });
    },
  );
}
