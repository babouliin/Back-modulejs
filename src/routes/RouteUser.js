import { Types } from 'koa-smart';
import bcrypt from 'bcrypt';
import Route from './Route';
import prisma from '../config/prisma.config';
import validJWTNeeded from '../middlewares/jwt.middleware';

class RouteUser extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Get({
    path: '/:email',
    queryType: Types.object().keys({
      email: Types.string().required(),
    }),
    middlewares: [
      async (ctx, next) => {
        await validJWTNeeded(ctx, next);
      },
    ],
  })
  async getByEmail(ctx) {
    const { email } = ctx.params;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        pseudo: true,
      },
    });
    if (user === null) {
      return this.throwBadRequest('User doesn\'t exist', true);
    }
    return this.sendOk(ctx, user);
  }

  @Route.Get({
    path: '/:pseudo',
    queryType: Types.object().keys({
      pseudo: Types.string().required(),
    }),
  })
  async getByPseudo(ctx) {
    const { pseudo } = ctx.params;
    const user = await prisma.user.findUnique({
      where: {
        pseudo,
      },
      select: {
        email: true,
        pseudo: true,
      },
    });
    if (user === null) {
      return this.send(ctx, Route.StatusCode.badRequest, { error: `User with pseduo ${pseudo} doesn't exist.` });
    }
    return this.sendOk(ctx, user);
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
      return this.send(ctx, Route.StatusCode.badRequest, { error: `User with email ${email} already exists.` });
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
