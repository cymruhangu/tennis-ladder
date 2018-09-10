const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { User } = require('./models/user');

app.use(express.static(__dirname + '/public'));

app.use(morgan('common'));
app.use(express.json());

app.use(express.json());

//USER ROUTES
app.get('/users', (req, res) => {
    User
        .find()
        .then(users => {
            res.json({
              users: users.map(user => user.serialize())
            });
            console.log('Here');
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'something went wrong'});
        });
});

app.get('/users/:id', (req, res) => {
  User
    .findById(req.params.id)
    .then(user => res.json(user.serialize()))
    .catch(err => {
      console.log(req.params.id);
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

//NEXT STEPS
// Add routes for user create and delete
// Fix testing 
// Add tests for user routes
// Add ladder and match routes
 
//===========================
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
      databaseUrl, 
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