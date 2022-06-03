'use strict';
const express = require('express');
const http = require('http');
const io = require('socket.io');
const cors = require('cors');

const yahooFinance = require('yahoo-finance2').default;


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

async function getQuote (tickerName) {
  const queryOptions = { modules: ['price', 'summaryDetail'] };
  let data = await yahooFinance.quoteSummary(tickerName, queryOptions);
  // console.log('->', data);
  return data;
}
          
async function generateQuotes(tickersSet) {
  const quotes = [];
  tickersSet.forEach(ticker => quotes.push( getQuote(ticker) )) ;
  // const quotes = Promise.all(tickersSet.forEach(symb => getQuote(symb)));
  // console.log('---', quotes);
  return Promise.all(quotes)
}

let prevPrice = 0;
async function parsedStocks(stocks) {
  let data = [];  
  // console.log('stocks', stocks);
  (await stocks).map( s => {
    data.push({
      price           : s.price.regularMarketPrice,
      ticker          : s.price.symbol,
      exchange        : s.price.exchangeName,
      change          : `${(prevPrice - s.price.regularMarketPrice).toFixed(2)} $`,
      change_percent  : `${(100 - (prevPrice * 100) / s.price.regularMarketPrice).toFixed(2)} %`,
      dividend        : (s.summaryDetail.dividendRate) 
                        ? `${(s.summaryDetail.dividendRate).toFixed(2)}%` : 'N/A',
      yield           : (s.summaryDetail.dividendYield)
                        ? `${(s.summaryDetail.dividendYield).toFixed(2)}%`: 'N/A',
      last_trade_time : utcDate(),
      is_favorite     : favoriteTickers.has(s.price.symbol)
     })
  });
  console.log('->', data);
  return [...data]
}

function sendQuote(socketAction, tickers, socket) {
  socket.emit(socketAction, parsedStocks(generateQuotes(tickers)));
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
