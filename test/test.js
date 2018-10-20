'use strict';
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {User} = require('../models/user');
const {Ladder} = require('../models/ladder');
const {Match} = require('../models/match');
const { app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

// const seedLadder = require('./ladders');
const seedOneUser = require('./users');

//before({()=>seedDatabase()})   /utils 
//prehook to login and get a token before running tests



chai.use(chaiHttp);

const { router: authRouter, localStrategy, jwtStrategy } = require('../auth');
const passport = require('passport');
passport.use(localStrategy);
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate('jwt', { session: false });



//Seed Ladder
function seedUserData(){
  console.info('seeding user data');
  // seedFirstUser();
  
  const newUserData = [];

  for(let i=0; i<=10; i++){
    newUserData.push(generateUsers());
  }
  console.log(newUserData);
  return User.insertMany(newUserData);
}

// function seedFirstUser(){
//   console.info('seeding first user');
//   return User.insertMany(seedOneUser);
// }

function generateUsers(){
  return {
    name: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    },
    username: faker.name.lastName(),
    password: '1qazxsw23e'
  }
}

//Seed Ladder
// function seedLadderData(){
//   console.info('seeding ladder data');
//   return Ladder.insertMany(seedLadder);
// }

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

// // we need each of these hook functions to return a promise
//   // otherwise we'd need to call a `done` callback. `runServer`,
//   // `seedData and `tearDownDb` each return a promise,
//   // so we return the value returned by these function calls.

  describe('Tennis Ladder API resource', function() {

    before(function() {
      return runServer(TEST_DATABASE_URL);
    });
  
    // beforeEach(function() {
    //   return seedLadderData();
    // });
  
    beforeEach(function() {
      return seedUserData();
    });
  
  
    afterEach(function() {
      return tearDownDb();
    });
  
    after(function() {
      return closeServer();
    });

  //GET USERS
  describe('GET Users endpoint', function(){
    it('should return all existing users', function() {
      let res;
      return chai.request(app)
        .get('/users')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.users).to.have.lengthOf.at.least(1);
          return User.count();
        })
        .then(function(count){
          expect(res.body.users).to.have.lengthOf(count);
        })
    });
  });

    // Confirm static page is served
    describe('splash page', function() {
      it('should exist', function() {
        return chai.request(app)
          .get('/', function(res) {
            expect(res).to.have.status(200);
        });
      });
    })
  })