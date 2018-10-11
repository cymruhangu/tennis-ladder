'use strict';
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
// const {User} = require('../models/User');
// const {Match} = require('../models/Match');
// const {Ladder} = require('../models/Ladder');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;


module.exports = {
  verifyToken:  function(req, res, next) {
    // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
  },
  checkUser: function(req, res, next){

  },
  checkMatch: function(req, res, next){

  },
  isAdmin: function(req, res, next){

  }
}