import { Server } from 'socket.io';
import Config from 'config';
import prisma from '../config/prisma.config';
import utils from '../utils';

function initSocket(koaApp) {
  const io = new Server(koaApp, {
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  io.use(async (socket, next) => {
    const { token, sessionId } = socket.handshake.auth;
    if (token) {
      try {
        const user = utils.getDataJwtToken(token);
        if (user.loginTokenVersion === Config.secretConfig.loginTokenVersion) {
          if (sessionId) {
            const session = await prisma.session.findUnique({
              where: {
                id: sessionId,
              },
            });
            if (session) {
              if (session.user_id === user.id) {
                // eslint-disable-next-line no-param-reassign
                socket.session = session;
                return next();
              }
              return next(new Error('this sessionId doesn\'t match the one in database'));
            }
            return next(new Error('no session found for this Id in database'));
          }
          // eslint-disable-next-line no-param-reassign
          socket.session = {
            userId: user.id,
          };
          return next();
        }
        return next(new Error('no user for this token'));
      } catch (error) {
        return next(error);
      }
    }
    return next(new Error('no JWT provided'));
  });

  io.on('connection', async (socket) => {
    const session = await prisma.session.create({
      data: {
        user_id: socket.session.userId,
      },
    });

    socket.emit('session', {
      sessionId: session.id,
    });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        pseudo: true,
      },
      orderBy: [
        {
          pseudo: 'asc',
        },
      ],
    });

    socket.emit('users', {
      users,
    });

    const chatsOfUser = await prisma.chat.findMany({
      where: {
        OR: [
          {
            chat_initiator_id: socket.session.userId,
          },
          {
            chat_target_id: socket.session.userId,
          },
        ],
      },
      select: {
        id: true,
        chat_initiator: {
          select: {
            id: true,
            pseudo: true,
          },
        },
        chat_target: {
          select: {
            id: true,
            pseudo: true,
          },
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
      if (chat.chat_initiator.id === socket.session.userId) {
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

    socket.emit('chats', {
      chats,
    });

    socket.join(socket.session.userId);

    socket.on('private message', async ({ chatId, content, toUserId }) => {
      let chat;
      if (chatId) {
        chat = await prisma.chat.findUnique({
          where: {
            id: chatId,
          },
        });
      } else {
        chat = await prisma.chat.create({
          data: {
            chat_initiator_id: socket.session.userId,
            chat_target_id: toUserId,
          },
          select: {
            id: true,
            chat_initiator: {
              select: {
                id: true,
                pseudo: true,
              },
            },
            chat_target: {
              select: {
                id: true,
                pseudo: true,
              },
            },
            updatedAt: true,
          },
        });
        const chatEmitter = {
          id: chat.id,
          other_user: chat.chat_target,
          updatedAt: chat.updatedAt,
        };
        const chatReceiver = {
          id: chat.id,
          other_user: chat.chat_initiator,
          updatedAt: chat.updatedAt,
        };
        socket.emit('new chat', chatEmitter);
        socket.to(toUserId).emit('new chat', chatReceiver);
      }
      const message = await prisma.message.create({
        data: {
          content,
          chat_id: chat.id,
          from_user_id: socket.session.userId,
          to_user_id: toUserId,
        },
        include: {
          from_user: {
            select: {
              id: true,
              pseudo: true,
            },
          },
          to_user: {
            select: {
              id: true,
              pseudo: true,
            },
          },
        },
      });
      socket.to(toUserId).emit('private message', message);
    });

    socket.on('disconnect', async () => {
      const matchingSockets = await io.in(socket.session.id).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        await prisma.session.deleteMany({
          where: {
            user_id: socket.session.userId,
          },
        });
        socket.disconnect();
      }
    });
  });
}

export default initSocket;
