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
      console.log("have token")
      try {
        console.log("try")
        const user = utils.getDataJwtToken(token);
        console.log("decoded token")
        if (user.loginTokenVersion === Config.secretConfig.loginTokenVersion) {
          console.log("good token")
          if (sessionId) {
            console.log("have session id")
            const session = await prisma.session.findUnique({
              data: {
                session_id: sessionId,
              },
            });
            if (session) {
              console.log("session in db")
              if (session.user_id === user.id) {
                console.log("match session id")
                // eslint-disable-next-line no-param-reassign
                socket.session = session;
                return next();
              }
              console.log("no match session id")
              return next(new Error('this sessionId doesn\'t match the one in database'));
            }
            console.log("no session in db")
            return next(new Error('no session found for this Id in database'));
          }
          console.log("no session id")
          // eslint-disable-next-line no-param-reassign
          socket.session = {
            userId: user.id,
          };
          return next();
        }
        console.log("bad token")
        return next(new Error('no user for this token'));
      } catch (error) {
        console.log("error decoding token", error)
        return next(error);
      }
    }
    console.log("no token")
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
            chat_id: chatId,
          },
        });
      } else {
        chat = await prisma.chat.create({
          data: {
            chat_initiator_id: socket.session.userId,
            chat_target_id: toUserId,
          },
        });
        socket.to(toUserId).to(socket.session.id).emit('new chat', chat);
      }
      const message = await prisma.message.create({
        data: {
          content,
          chat_id: chat.id,
          from_user_id: socket.session.userId,
          to_user_id: toUserId,
        },
      });
      socket.to(toUserId).to(socket.session.id).emit('private message', message);
    });

    socket.on('disconnect', async () => {
      console.log('disconnect');
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
