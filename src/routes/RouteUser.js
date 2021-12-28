import { Types } from 'koa-smart';
import Route from './Route';
import prisma from '../config/prisma.config';
import accesses from '../middlewares/accesses';
import utils from '../utils';

@Route.Route({
  routeBase: '/',
})
class RouteUser extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Get({
    path: '/user',
    accesses: [accesses.isConnected],
  })
  async getUser(ctx) {
    const { user } = ctx.state;
    const userInDB = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        email: true,
        pseudo: true,
      },
    });
    if (userInDB === null) {
      // eslint-disable-next-line no-underscore-dangle
      return this.throwNotFound(ctx.i18n.__('user not found'));
    }
    return this.sendOk(ctx, userInDB);
  }

  @Route.Get({
    path: '/users',
    accesses: [accesses.isConnected],
    disable: true,
  })
  async getAllUser(ctx) {
    const usersInDB = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        pseudo: true,
      },
      orderBy: [
        {
          pseudo: 'asc',
        },
      ],
    });
    return this.sendOk(ctx, usersInDB);
  }

  @Route.Put({
    path: '/user',
    accesses: [accesses.isConnected],
    bodyType: Types.object().keys({
      pseudo: Types.string().required(),
      password: Types.string().required(),
    }),
  })
  async updateUser(ctx) {
    const { user } = ctx.state;
    const { pseudo, password } = this.body(ctx);
    const userInDB = await prisma.user.findUnique({
      where: {
        pseudo,
      },
    });
    if (userInDB !== null && userInDB.id !== user.id) {
      // eslint-disable-next-line no-underscore-dangle
      return this.throwUnauthorized(ctx.i18n.__('user already exists'));
    }
    const hashedPassword = await utils.hashPassword(password);
    const userUpdated = await prisma.user.update(
      {
        where: {
          email: user.email,
        },
        data: {
          pseudo,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          pseudo: true,
        },
      },
    );
    return this.sendCreated(ctx, userUpdated);
  }
}

export default RouteUser;
