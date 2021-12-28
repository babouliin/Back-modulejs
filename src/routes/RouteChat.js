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
    disable: true,
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
      select: {
        id: true,
        chat_initiator: {
          id: true,
          pseudo: true,
        },
        chat_target: {
          id: true,
          pseudo: true,
        },
        updatedAt: true,
      },
      orderBy: [
        {
          updatedAt: 'desc',
        },
      ],
    });
    const chats = [];
    chatsOfUser.forEach((chat) => {
      if (chat.chat_initiator.id === user.id) {
        chats.push({
          id: chat.id,
          other_user: chat.chat_target,
          updatedAt: chat.updatedAt,
        });
      } else {
        chats.push({
          id: chat.id,
          other_user: chat.chat_initiator,
          updatedAt: chat.updatedAt,
        });
      }
    });
    return this.sendOk(ctx, chats);
  }
}

export default RouteChat;
