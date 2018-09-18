const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { User } = require('./models/user');
const userRoutes = require('./routes/users');
const ladderRoutes = require('./routes/ladders');
const matchRoutes = require('./routes/matches');

app.use(express.static(__dirname + '/public'));

app.use(morgan('common'));
app.use(express.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  next();
});

app.use('/users', userRoutes);
app.use('/ladders', ladderRoutes);
app.use('/matches', matchRoutes);

app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});



// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server

function runServer(databaseUrl, port = PORT) {
  console.log(`databaseUrl is ${databaseUrl}`);
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,  {useNewUrlParser: true },
      err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}



module.exports = { app, runServer, closeServer };