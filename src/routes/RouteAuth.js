import { Types } from 'koa-smart';
import Route from './Route';
import prisma from '../config/prisma.config';
import utils from '../utils';

class RouteAuth extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Post({
    path: '/login',
    bodyType: Types.object().keys({
      email: Types.string().required(),
      password: Types.string().required(),
    }),
  })
  async loginUser(ctx) {
    const { email, password } = this.body(ctx);
    const userInDB = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userInDB === null) {
      // eslint-disable-next-line no-underscore-dangle
      return this.throwNotFound(ctx.i18n.__('user not found'));
    }
    const resCompare = await utils.comparePassword(password, userInDB.password);
    if (resCompare === true) {
      await ctx.loginUser({
        id: userInDB.id,
        email: userInDB.email,
      });
      return this.sendOk(ctx);
    }
    // eslint-disable-next-line no-underscore-dangle
    return this.throwUnauthorized(ctx.i18n.__('incorrect password'));
  }

  @Route.Post({
    path: '/signup',
    bodyType: Types.object().keys({
      email: Types.string().required(),
      pseudo: Types.string().required(),
      password: Types.string().required(),
    }),
  })
  async createUser(ctx) {
    const { email, pseudo, password } = this.body(ctx);
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email },
          { pseudo },
        ],
      },
    });
    if (users.length !== 0) {
      // eslint-disable-next-line no-underscore-dangle
      return this.throwUnauthorized(ctx.i18n.__('user already exists'));
    }
    const hashedPassword = await utils.hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        pseudo,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        pseudo: true,
      },
    });
    await ctx.loginUser({
      id: newUser.id,
      email: newUser.email,
    });
    return this.sendCreated(ctx, newUser);
  }
}

export default RouteAuth;
