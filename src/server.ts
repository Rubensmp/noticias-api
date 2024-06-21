import fastify from 'fastify';

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';

import { fastifyCors } from '@fastify/cors';

import { createNew } from './routes/create-new';
import { getNewInfo } from './routes/get-new';
import { getAllNews } from './routes/get-all-news';
import { updateNews } from './routes/update-news';
import { deleteNew } from './routes/delete-new';

const app = fastify();

app.register(fastifyCors, {
  origin: '*',
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'Noticias.Api',
      description:
        'Especificações da API para o back-end da aplicação Noticias.Api.',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createNew);
app.register(getNewInfo);
app.register(getAllNews);
app.register(updateNews);
app.register(deleteNew);

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running.');
});
