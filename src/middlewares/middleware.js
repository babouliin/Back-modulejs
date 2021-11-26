import Config from 'config';
import crypto from '../utils';

async function addUserToCtx(ctx) {
  const bearerToken = ctx.get('Authorization');
  if (bearerToken) {
    try {
      const user = crypto.getDataJwtToken(bearerToken);
      if (user.loginTokenVersion === Config.secretConfig.loginTokenVersion) {
        ctx.state.user = user;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  return null;
}

function loginUser(ctx) {
  return async (user) => {
    const userToRegister = {
      email: user.email,
      loginTokenVersion: Config.secretConfig.loginTokenVersion,
      date: new Date(),
    };
    const token = crypto.generateJwtToken(userToRegister);
    ctx.state.user = userToRegister;
    ctx.body = { ...ctx.body };
    ctx.body.token = token;
    return {
      token,
    };
  };
}

export default async (ctx, next) => {
  await addUserToCtx(ctx);
  ctx.loginUser = loginUser(ctx);
  await next();
};
