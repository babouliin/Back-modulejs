import config from 'config';
import { crypto } from '../../utils';

async function addUserToCtx(ctx) {
  const token = ctx.get('Authorization');
  if (token) {
    try {
      const user = crypto.getDataJwtToken(token);
      if (user.loginTokenVersion === config.loginTokenVersion) {
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
      id: user.id,
      account_id: user.account_id,
      is_admin: user.is_admin,
      loginTokenVersion: config.loginTokenVersion,
      date: new Date(),
    };
    const token = crypto.generateJwtToken(userToRegister);
    await ctx.models.tokens.createLogin({
      entity_id: user.id,
      token,
    });
    ctx.state.user = userToRegister;
    ctx.body = { ...ctx.body };
    ctx.body.token = token;
    ctx.body.expires = userToRegister.expires;
    return {
      token,
      expires: userToRegister.expires,
    };
  };
}

function logoutUser(ctx) {
  return async () => {
    const token = ctx.get('Authorization');
    if (token) {
      await ctx.models.tokens.consumeOne({ token });
    }
    ctx.state.user = undefined;
  };
}

export default async (ctx, next) => {
  await addUserToCtx(ctx);
  ctx.loginUser = loginUser(ctx);
  ctx.logoutUser = logoutUser(ctx);
  await next();
};
