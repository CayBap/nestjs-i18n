import { Test } from '@nestjs/testing';
import * as path from 'path';
import {
  CookieResolver,
  HeaderResolver,
  I18nModule,
  I18nJsonParser,
  AcceptLanguageResolver,
} from '../src';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HelloController } from './app/controllers/hello.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { CatModule } from './app/cats/cat.module';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import * as WebSocket from 'ws';
import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

describe('i18n module e2e graphql', () => {
  let app: INestApplication;

  let apollo: ApolloClient<NormalizedCacheObject>;
  let networkInterface: SubscriptionClient;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          fallbacks: {
            'en-CA': 'fr',
            'en-*': 'en',
            'fr-*': 'fr',
            pt: 'pt-BR',
          },
          resolvers: [
            new HeaderResolver(['x-custom-lang']),
            new AcceptLanguageResolver(),
            new CookieResolver(),
          ],
          parser: I18nJsonParser,
          parserOptions: {
            path: path.join(__dirname, '/i18n/'),
          },
        }),
        GraphQLModule.forRoot({
          installSubscriptionHandlers: true,
          typePaths: ['*/**/*.graphql'],
          context: ({ req, connection }) =>
            connection ? { req: connection.context } : { req },
          path: '/graphql',
        }),
        CatModule,
      ],
      controllers: [HelloController],
    }).compile();

    app = module.createNestApplication();
    await app.listen(3000);
    networkInterface = new SubscriptionClient(
      'ws://localhost:3000/graphql',
      {
        reconnect: true,
        connectionParams: { headers: { 'x-custom-lang': 'fr' } },
      },
      WebSocket,
    );
    networkInterface.onError((error) => {
      console.log('error', error);
    });
    apollo = new ApolloClient({
      link: new WebSocketLink(networkInterface),
      cache: new InMemoryCache(),
    });
  });

  it(`should query a particular cat in NL`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'nl')
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Kat',
          },
        },
      });
  });

  it(`should query a particular cat (using @I18nContext) in NL`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'nl')
      .send({
        operationName: null,
        variables: {},
        query: '{catUsingContext(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          catUsingContext: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Kat',
          },
        },
      });
  });

  it(`should query a particular cat in EN with cookie`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Cookie', ['lang=en'])
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Cat',
          },
        },
      });
  });

  it(`should query a particular cat in NL with cookie`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Cookie', ['lang=nl'])
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Kat',
          },
        },
      });
  });

  it(`should query a particular cat in EN when not providing x-custom-lang`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Cat',
          },
        },
      });
  });

  it(`should query a particular cat in EN`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'en')
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Cat',
          },
        },
      });
  });

  it(`should query a particular cat in EN when sending "en-US" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'en-US')
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Cat',
          },
        },
      });
  });

  it(`should query a particular cat in FR when sending "en-CA" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'en-CA')
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Chat',
          },
        },
      });
  });

  it(`should query a particular cat in FR`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'fr')
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Chat',
          },
        },
      });
  });

  it(`should query a particular cat in FR when sending "fr-BE" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'fr-BE')
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Chat',
          },
        },
      });
  });

  it(`should query a particular cat in PT-BR`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'pt-BR')
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Gato',
          },
        },
      });
  });

  it(`should query a particular cat in PT-BR when sending "pt" in x-custom-lang`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('x-custom-lang', 'pt')
      .send({
        operationName: null,
        variables: {},
        query: '{cat(id:2){id,name,age,description}}',
      })
      .expect(200, {
        data: {
          cat: {
            id: 2,
            name: 'bar',
            age: 6,
            description: 'Gato',
          },
        },
      });
  });

  it(`should subscribe to catAdded and return cat name with "fr" placeholder`, async (done) => {
    apollo
      .subscribe({
        query: gql`
          subscription catAdded {
            catAdded
          }
        `,
      })
      .subscribe({
        next: (catText) => {
          expect(catText).toEqual({ data: { catAdded: 'Chat: Haya' } });
        },
        error: (error) => {
          throw error;
        },
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query:
          'mutation {  createCat(createCatInput: {name: "Haya", age: 2})  { name, age }  }',
      })
      .expect(200, {
        data: {
          createCat: {
            name: 'Haya',
            age: 2,
          },
        },
      });

    setTimeout(() => {
      done();
    }, 2000);
  });

  afterAll(async () => {
    apollo.stop();
    networkInterface.close();
    await app.close();
  });
});
