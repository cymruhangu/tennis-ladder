
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const { User } = require('../models/user');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;
//Show all users
router.get('/', (req, res) => {
    User
        .find()
        .then(users => {
            res.json({
              users: users.map(user => user.serialize())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'something went wrong'});
        });
});

//Show an individual user
router.get('/:id', (req, res) => {
  User
    .findById(req.params.id)
    .then(user => res.json(user.serialize()))
    .catch(err => {
      console.log(req.params.id);
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

//add a user
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['name', 'username'];
  for(let i=0; i<requiredFields.length; i++){
    const field = requiredFields[i];
    if(!(field in req.body)){
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  User.create({
    name: req.body.name,
    username: req.body.username,
    age: req.body.age,
    gender: req.body.gender,
    isActive: req.body.isActive
  })
  .then(user => res.status(201).json(user.serialize()))
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  });
});

//UPDATE A USER
//a user would be updated by adding matches, ladders, lastplayed, and isActive

router.put('/:id', (req, res) => {
  res.send(`trying to post something to ${req.params.id}`);
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }
    const toUpdate = {};
    const updateableFields = ["age", "username", "email"];

    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });

    User
      .findByIdAndUpdate(req.params.id, { $set: toUpdate})
      .then(user => res.status(204).end())
      .catch(err => res.status(500).json({ message: "Internal server error" }));
});


//DELETE A USER
router.delete('/:id', (req, res) => {
  console.log(req.params.id);
  User
  .findByIdAndRemove(req.params.id)
  .then(user => res.status(204).end())
  .catch(err => res.status(500).json({message: "Internal server error"}));
});

module.exports = router;