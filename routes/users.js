'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {User} = require('../models/user');

const router = express.Router();
const jwt = require('jsonwebtoken');
const jsonParser = bodyParser.json();
const middleware = require("../middleware");

// Post to register a new user
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();
  // const name = {"firstName": firstName, "lastName": lastName};

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        name: {"firstName":firstName, "lastName":lastName}
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Created before auth
const jwtAuth = passport.authenticate('jwt', {session: false});
//READ USERS
//Show all users
router.get('/', jwtAuth, (req, res) => {
  console.log(req.headers);
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
  
  //UPDATE A USER
  //a user would be updated by adding/deleting matches, ladders, lastplayed, and isActive
  
  router.put('/:id', jwtAuth, (req, res) => {
    res.send(`trying to post something to ${req.params.id}`);
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      const message =
        `Request path id (${req.params.id}) and request body id ` +
        `(${req.body.id}) must match`;
      console.error(message);
      return res.status(400).json({ message: message });
    }
      const toUpdate = {};
      const updateableFields = ["age", "username", "name", "email", "matches", "ladders", "isActive"];

      updateableFields.forEach(field => {
        if (field in req.body) {
          toUpdate[field] = req.body[field];
        }
      });
   //if the update field is a match then handle differently   
   // object contains a match type: delete or add 
      if("matches" in toUpdate){
        console.log("USER PUT called from match creation");
        const action = toUpdate.matches.action;
        delete toUpdate.matches.action;
        if(toUpdate.matches.action === "add"){
          User
            .findById(req.params.id, function(err, user){
                user.matches.push(toUpdate.matches);
                user.save(function(err, updatedUser){
                  console.log(err);
                });
            })
            .then(user => res.status(204).end())
            .catch(err => res.status(500).json ({ message: "Internal server error"}));
        }else if(action === "delete") {
          //pull the match from users match array
          const match = toUpdate.matches
          User
            .findByIdAndUpdate(req.params.id, 
              {$pull: {matches: match}},
              {safe: true, upsert: true},
              function(err, doc) {
                  if(err){
                  console.log(err);
                  }else{
                  //do stuff
                  console.log('Not sure what to do here');
                  return res.send(doc);
                  }
              }  
            );

        } //it's a delete

      }else {
        User
          .findByIdAndUpdate(req.params.id, { $set: toUpdate})
          .then(user => res.status(204).end())
          .catch(err => res.status(500).json({ message: "Internal server error" }));
      }
  });
  
  
  //DELETE A USER
  // ******************** NEED TO DELETE MATCHES THAT THE USER WAS PART OF 
  router.delete('/:id', jwtAuth, (req, res) => {
    console.log(req.params.id);
    User
    .findByIdAndRemove(req.params.id)
    .then(user => res.status(204).end())
    .catch(err => res.status(500).json({message: "Internal server error"}));
  });


module.exports = router;
