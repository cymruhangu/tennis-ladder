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

const seedLadder = require('./ladders');
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
  seedFirstUser();
  
  const newUserData = [];

  for(let i=0; i<=10; i++){
    newUserData.push(generateUsers());
  }
  // console.log(newUserData);
  return User.insertMany(newUserData);
}

function seedFirstUser(){
  console.info('seeding first user');
  return User.insertMany(seedOneUser);
}

function generateUsers(){
  return {
    name: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    },
    username: faker.internet.userName(),
    password: '1qazxsw23e'
  }
}

//Create a ladder
function seedLadderData(){
  console.info('seeding ladder data');
  return Ladder.insertMany(seedLadder);
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

//PRE-HOOKES

  describe('Tennis Ladder API resource', function() {

    before(function() {
      return runServer(TEST_DATABASE_URL);
    });
  
    beforeEach(function() {
      return seedLadderData();
    });
  
    beforeEach(function() {
      return seedUserData();
    });

    afterEach(function() {
      return tearDownDb();
    });
  
    after(function() {
      return closeServer();
    });

  // //GET USERS
  // describe('GET Users endpoint', function(){

  //   it('should return all existing users', function() {

  //     let res;
  //     return chai.request(app)
  //       .get('/users')
  //       .then(function(_res) {
  //         res = _res;
  //         console.log(res.body.users[0]);
  //         expect(res).to.have.status(200);
  //         expect(res.body.users).to.have.lengthOf.at.least(1);
  //         return User.count();
  //       })
  //       .then(function(count){
  //         expect(res.body.users).to.have.lengthOf(count);
  //       })
  //   });

  // });

//Ladders
  describe('GET Ladders endpoint', function(){
    it('should return all existing ladders', function() {
      let res;
      return chai.request(app)
        .get('/ladders')
        .then(function(_res) {
          res = _res;
          console.log(res.body.ladders);
          expect(res).to.have.status(200);
          expect(res.body.ladders).to.have.lengthOf.at.least(1);
          return Ladder.count();
        })
        .then(function(count){
          expect(res.body.ladders).to.have.lengthOf(count);
        })
    });
  });

  it('should return ladders with the right fields', function(){
    let resLadder;
    return chai.request(app)
      .get('/ladders')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.ladders).to.be.a('array');
        expect(res.body.ladders).to.have.lengthOf.at.least(1);
        // console.log(res.body.ladders[0]);
        res.body.ladders.forEach(function(ladder){
          expect(ladder).to.be.a('object');
          expect(ladder).to.include.keys('id', 'name', 'region', 'rankings', 'isActive', 'gender');
        });
        resLadder = res.body.ladders[0];
        return Ladder.findById(resLadder.id);
      })
      .then(function(ladder){
        console.log(ladder);
        expect(resLadder.id).to.equal(ladder.id);
      })
    });
  
    //Register a new user
    describe('POST a new user', function(){

      it('return a json with user info and password', function(){
        const newUserObj = {
          firstName: 'Billy', 
          lastName: 'Kidd',
          username: "bkidd",
          password: "cde32wsxzaq1"
        };

        return chai.request(app)
          .post('/users')
          .send(newUserObj)
          .then(function(res){
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'id','username', 'name', 'age', 'email', 'ladders', 'matches', 'isActive', 'gender');

            expect(res.body.username).to.equal(newUserObj.username);
            // console.log(res.body);
            const nameArr = res.body.name.split(' ');
            expect(nameArr[0]).to.equal(newUserObj.firstName);
            expect(nameArr[1]).to.equal(newUserObj.lastName);
            return User.findById(res.body.id);
          })
          .then(user => {
            console.log(user);
            expect(user).to.not.be.null;
            expect(user.name.firstName).to.equal(newUserObj.firstName);
            expect(user.name.lastName).to.equal(newUserObj.lastName);
            return user.validatePassword(newUserObj.password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
          })

    });


    // Confirm static page is served
    describe('splash page', function() {
      it('should exist', function() {
        return chai.request(app)
          .get('/', function(res) {
            expect(res).to.have.status(200);
        });
      });
    });

  });//end