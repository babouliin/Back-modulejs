import { Route as RouteBase } from 'koa-smart';

export default class Route extends RouteBase {
  // eslint-disable-next-line no-underscore-dangle
  async _mlTestAccess(ctx, { accesses = [] }) {
    if (Array.isArray(accesses) && accesses.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const access of accesses) {
        // eslint-disable-next-line no-await-in-loop
        if (await access(ctx)) {
          return true;
        }
      }
      this.throwUnauthorized(null, true);
    }
    if (Array.isArray(this.accesses) && this.accesses.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const access of this.accesses) {
        // eslint-disable-next-line no-await-in-loop
        if (await access(ctx)) {
          return true;
        }
      }
      this.throwUnauthorized(null, true);
    }
    return true;
  }
}
