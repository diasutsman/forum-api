import Hapi from '@hapi/hapi';
import Jwt from '@hapi/jwt';

// Plugin
import users from '../../Interfaces/http/api/users';
import authentications from '../../Interfaces/http/api/authentications';
import threads from '../../Interfaces/http/api/threads';

// Error Handler
import ClientError from '../../Commons/exceptions/ClientError';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator';

import { Container } from "../container";

const createServer = async (container: Container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  // Register External Plugin
  await server.register([
    {
      plugin: Jwt as any,
    }
  ]);

  // Define the authentication strategy jwt
  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCCESS_TOKEN_AGE,
    },
    validate: (artifacts: {
      decoded: {payload: {id: string}};
    }) => ({
      isValid: true,
      credential: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Register Plugin
  await server.register([
    {
      plugin: users,
      options: {container},
    },
    {
      plugin: authentications,
      options: {container},
    },
    {
      plugin: threads,
      options: {container},
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const {response} = request;

    if (response instanceof Error) {
      // bila response tersebut error, tangani sesuai kebutuhan
      const translatedError = DomainErrorTranslator.translate(response);

      // penanganan client error secara internal.
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error
      // oleh hapi secara native, seperti 404, etc.
      if (!(translatedError as any).isServer) {
        return h.continue;
      }

      console.log({response});

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya
    // (tanpa terintervensi)
    return h.continue;
  });

  return server;
};

export default createServer;
