import { Types } from 'koa-smart';
import bcrypt from 'bcrypt';
import Route from './Route';
import prisma from '../config/prisma.config';
import accesses from '../middlewares/accesses';
import crypto from '../utils';

class RouteUser extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Get({
    path: '',
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
      return this.throwNotFound(ctx.i18n.__('user not found'));
    }
    return this.sendOk(ctx, userInDB);
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
      return this.throwNotFound(ctx.i18n.__('user not found'));
    }
    const resCompare = await bcrypt.compare(password, userInDB.password);
    if (resCompare === true) {
      await ctx.loginUser({ email: userInDB.email });
      return this.sendOk(ctx);
    }
    return this.throwNotFound(ctx.i18n.__('incorrect password'));
  }

  @Route.Post({
    path: '',
    bodyType: Types.object().keys({
      email: Types.string().required(),
      pseudo: Types.string().required(),
      password: Types.string().required(),
    }),
  })
  async createUser(ctx) {
    const { email, pseudo, password } = this.body(ctx);
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user !== null) {
      return this.throwNotFound(ctx.i18n.__('user already exists'));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        pseudo,
        password: hashedPassword,
      },
    });
    return this.sendCreated(ctx, newUser);
  }
}

export default RouteUser;
