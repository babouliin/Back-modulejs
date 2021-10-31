import { Types } from 'koa-smart';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Config from 'config';
import Route from './Route';
import prisma from '../config/prisma.config';

class RouteAuth extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Post({
    path: '',
    bodyType: Types.object().keys({
      email: Types.string().required(),
      password: Types.string().required(),
    }),
  })
  async login(ctx) {
    const { email, password } = this.body(ctx);
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user === null) {
      return this.send(ctx, Route.StatusCode.badRequest, { error: `User with email ${email} not sign up.` });
    }
    const resCompare = await bcrypt.compare(password, user.password);
    if (resCompare === true) {
      const token = jwt.sign(
        {
          email,
          password: user.password,
        },
        Config.secretConfig.PASSWORD_SECRET_KEY,
        // { expiresIn: '1d' },
      );
      return this.sendOk(ctx, {
        message: 'User logged in',
        token,
      });
    }
    return this.send(ctx, Route.StatusCode.badRequest, { error: 'Wrong password.' });
  }
}

export default RouteAuth;
