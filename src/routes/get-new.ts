import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { BadRequest } from './_errors/bad-request';

export async function getNewInfo(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/news/:newsId',
    {
      schema: {
        summary: 'Get new',
        tags: ['news'],
        params: z.object({
          newsId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            new: z.object({
              id: z.string().uuid(),
              title: z.string(),
              description: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { newsId } = request.params;

      const news = await prisma.new.findUnique({
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          id: newsId,
        },
      });

      if (news === null) {
        throw new BadRequest('News not found');
      }

      return reply.send({
        new: {
          id: news.id,
          title: news.title,
          description: news.description,
          createdAt: news.createdAt,
          updatedAt: news.updatedAt,
        },
      });
    },
  );
}
