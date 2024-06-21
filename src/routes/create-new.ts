import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from '../lib/prisma';
import { FastifyInstance } from 'fastify';

export async function createNew(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/news',
    {
      schema: {
        summary: 'Create a new',
        tags: ['news'],
        body: z.object({
          title: z.string(),
          description: z.string(),
        }),
        response: {
          201: z.object({
            newId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, description } = request.body;

      const news = await prisma.new.create({
        data: {
          title,
          description,
        },
      });

      return reply.status(201).send({ newId: news.id });
    },
  );
}
