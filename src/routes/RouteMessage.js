// import { Types } from 'koa-smart';

import Route from './Route';

@Route.Route({
  disable: true,
})
class RouteMessage extends Route {
  constructor(params) {
    super({ ...params });
  }
}

export default RouteMessage;
