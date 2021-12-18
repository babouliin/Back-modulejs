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
    bodyType: Types.object().keys({
      chatId: Types.string().required(),
    }),
  })
  async getMessagesOfChat(ctx) {
    const { chatId } = this.body(ctx);
    const messagesOfChat = await prisma.message.findMany({
      where: {
        chat_id: chatId,
      },
    });
    return this.sendOk(ctx, messagesOfChat);
  }
}

export default RouteMessage;
