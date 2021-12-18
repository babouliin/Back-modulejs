import Route from './Route';
import prisma from '../config/prisma.config';
import accesses from '../middlewares/accesses';

@Route.Route({
  routeBase: '/',
})
class RouteChat extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Get({
    path: '/chats',
    accesses: [accesses.isConnected],
  })
  async getAllChats(ctx) {
    const { user } = ctx.state;
    const chatsOfUser = await prisma.chat.findMany({
      where: {
        OR: [
          {
            chat_initiator_id: user.id,
          },
          {
            chat_target_id: user.id,
          },
        ],
      },
    });
    return this.sendOk(ctx, chatsOfUser);
  }
}

export default RouteChat;
