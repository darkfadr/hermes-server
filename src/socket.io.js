import socketio from 'socket.io';
import api from '../api';
import log from '../logger';

const io = socketio.listen(api);

io.sockets.on('connection', socket => {
  log.info('Client is now connected to socket server');
  socket.on('disconnect', reason => log.warn(`socket lost connection due to: ${reason}`));

  //bind mailler events to socket to tunnnel data to client
});

export default io;
