import { Types } from 'koa-smart';
import Route from './Route';
import prisma from '../config/prisma.config';
import accesses from '../middlewares/accesses';

@Route.Route({
  routeBase: '/',
})
class RouteMessage extends Route {
  constructor(params) {
    super({ ...params });
  }

  @Route.Get({
    path: '/messages',
    accesses: [accesses.isConnected],
    queryType: Types.object().keys({
      chatId: Types.string().required(),
    }),
  })
  async getMessagesOfChat(ctx) {
    const queryParams = this.queryParam(ctx);
    const { chatId } = queryParams;
    const messagesOfChat = await prisma.message.findMany({
      where: {
        chat_id: chatId,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
    return this.sendOk(ctx, messagesOfChat);
  }
}

export default RouteMessage;
