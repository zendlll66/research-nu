const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mysql = require('mysql2');
const { URL } = require('url');
require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const parsedUrl = new URL(databaseUrl);

const host = parsedUrl.hostname;
const port = parsedUrl.port || 3306; // ใช้ค่า 3306 ถ้าไม่ระบุ port
const user = parsedUrl.username;
const password = parsedUrl.password;
const database = parsedUrl.pathname.substring(1); // เอาชื่อฐานข้อมูลจาก path

// การตั้งค่า SSL
const sslConfig = {
  rejectUnauthorized: true
};

const connection = mysql.createConnection({
  host,
  port,
  user,
  password,
  database,
  ssl: sslConfig
});

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

app.get('/api/attractions2', (req, res,next) => {
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
