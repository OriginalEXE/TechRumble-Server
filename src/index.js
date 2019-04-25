require ('dotenv').config ();

const express = require ('express');

require ('./db/init');
require ('./websockets/server');
require ('./data-collectors/init');

const app = express ();

app.use ((error, req, res, next) => {
  console.log (error);
  next ();
});

app.listen (4000);
