'use strict';
const express = require('express');
const http = require('http');
const io = require('socket.io');
const cors = require('cors');

const FETCH_INTERVAL = 5000;
const PORT = process.env.PORT || 4000;

const favoriteTickers = new Set();
const tickers = new Set([
  'AAPL', // Apple
  'GOOGL', // Alphabet
  'MSFT', // Microsoft
  'AMZN', // Amazon
  'FB', // Facebook
  'TSLA', // Tesla
]);

function randomValue(min = 0, max = 1, precision = 0) {
  const random = Math.random() * (max - min) + min;
  return random.toFixed(precision);
}

function utcDate() {
  const now = new Date();
  return new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
  ).toLocaleString();
}

function generateQuote(name) {
  const quote = {
    ticker: name,
    exchange: 'NASDAQ',
    price: randomValue(100, 300, 2),
    change: randomValue(-75, 200, 2),
    change_percent: 0,
    dividend: randomValue(0, 1, 2),
    yield: randomValue(0, 2, 2),
    last_trade_time: utcDate(),
    is_favorite: favoriteTickers.has(name),
  };

  const prevPrice = quote.price - quote.change;
  quote.change_percent = (100 - (prevPrice * 100) / quote.price).toFixed(2);
  return quote;
}

function generateQuotes(tickersSet) {
  const quotes = [];
  tickersSet.forEach(ticker => quotes.push(generateQuote(ticker)));
  return quotes;
}

function sendQuote(socketAction, tickersSet, socket) {
  socket.emit(socketAction, generateQuotes(tickersSet));
}

function sendQuotes(socket) {
  sendQuote('ticker', tickers, socket);
  sendQuote('favorite', favoriteTickers, socket);
}

function trackTickers(socket) {
  const _sendQuotes = () => sendQuotes(socket);
  // run the first time immediately
  _sendQuotes();
  // every N seconds
  const timer = setInterval(_sendQuotes, FETCH_INTERVAL);

  socket.on('disconnect', function () {
    clearInterval(timer);
  });
}

const app = express();
app.use(cors());
const server = http.createServer(app);

const socketServer = io(server, {
  cors: {
    origin: '*',
  },
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

socketServer.on('connection', socket => {
  socket.on('start', () => {
    trackTickers(socket);
  });

  socket.on('add-favorite', name => {
    favoriteTickers.add(name);
    sendQuotes(socket);
  });

  socket.on('remove-favorite', name => {
    favoriteTickers.delete(name);
    sendQuotes(socket);
  });
});

server.listen(PORT, () => {
  console.log(`Streaming service is running on http://localhost:${PORT}`);
});
