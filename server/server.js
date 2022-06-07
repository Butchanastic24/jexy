require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {SERVER_PORT} = process.env
const {seed, addUser, getFitnessMacros} = require('./controllers/database');

app.use(express.json());
app.use(cors());


app.post('/user', addUser);

app.post('/seed', seed);

app.post('/diet', getFitnessMacros);


app.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}`)
  });