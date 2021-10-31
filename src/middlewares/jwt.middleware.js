import jwt from 'jsonwebtoken';
import Config from 'config';
import prisma from '../config/prisma.config';

// middlewares: [
//   async (ctx, next) => {
//     await validJWTNeeded(ctx, next);
//   },
// ],

async function validJWTNeeded(ctx, next) {
  const { header } = ctx.request;
  if (header.authorization) {
    const authorization = header.authorization.split(' ');
    try {
      if (authorization[0] !== 'Bearer') {
        ctx.response.status = 401;
        ctx.response.body = { error: 'Wrong JWT token format. Use \'Bearer TOKEN\'.' };
        return ctx;
      }
      const decoded = await jwt.verify(authorization[1], Config.secretConfig.PASSWORD_SECRET_KEY);
      const users = await prisma.user.findMany({
        where: {
          email: decoded.email,
          password: decoded.password,
        },
      });
      if (users.lengh === 0) {
        ctx.response.status = 412;
        ctx.response.body = { error: `A user with id ${jwt.email} does not exist.` };
        return ctx;
      }
      return next();
    } catch (e) {
      ctx.response.status = 401;
      ctx.response.body = { error: 'Wrong JWT token.' };
      return ctx;
    }
  } else {
    ctx.response.status = 401;
    ctx.response.body = { error: 'Missing JWT Token.' };
    return ctx;
  }
}

export default validJWTNeeded;
