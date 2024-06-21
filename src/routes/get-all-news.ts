import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function getAllNews(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/news-list',
    {
      schema: {
        summary: 'Get all news',
        tags: ['news'],
        querystring: z.object({
          pageIndex: z.string().nullish().default('0').transform(Number),
        }),
        response: {
          200: z.object({
            allNews: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { pageIndex } = request.query;

      const allNews = await prisma.new.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        take: 10,
        skip: pageIndex * 10,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return reply.send({
        allNews: allNews.map(news => {
          return {
            id: news.id,
            title: news.title,
            description: news.description,
            createdAt: news.createdAt,
            updatedAt: news.updatedAt,
          };
        }),
      });
    },
  );
}
