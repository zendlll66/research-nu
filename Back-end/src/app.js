const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mysql = require('mysql');

require('dotenv').config();
const connection = mysql.createConnection(process.env.DATABASE_URL);
const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.get('/api/gg', (req, res) => {
  res.status(200).json({ message: 'hello GG' });
});

app.get('/api/hi', (req, res) => {
  res.status(200).json({ message: 'hiiiii' });
});

app.get('/api/attractions', (req, res,next) => {
  connection.query(
    'SELECT * FROM attractions',
    function(err,results,fields){
      res.json(results)
    }
  )
});



app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
