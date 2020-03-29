import express from 'express';
import { v4 as uuid } from 'uuid';
import redisInstance from './redis';
import store from './redux/store';

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const server = require('http').Server(app);
const io = require('socket.io')(server);

const Redis = require('ioredis');
const redisURL = "redis://redis";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('build'));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.post('/createTable', (req, res) => {
  const tableId = uuid();
  const {username} = req.body;
  redisInstance.set(tableId, [username]);
  // res.send({tableId: tableId})
  res.redirect(`/game/${tableId}`)
});

app.post('/join', async (req, res) => {
  const tableId = req.body.tableId || uuid();
  // const {tableId, username} = req.body;
  res.redirect(`/game/${tableId}`)
  // res.send({tableId: tableId})
});

app.get('/game/:tableId', async (req, res) => {
  res.sendFile('build/index.html', {root: `${__dirname}/..`});
});


io.on('connection', (socket) => {

  socket.on('distribute', action => {
    store.dispatch(action);
    socket.emit('newState', store.getState());
  });

});

server.listen(PORT, () => {
  console.log(`Le coincheur listening on port ${PORT}!`)
})