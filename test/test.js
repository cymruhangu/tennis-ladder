'use strict';
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {User} = require('../models/user');
// const {Ladder} = require('../models/ladder');
const {Match} = require('../models/match');
const { app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');


// app.use('/users', userRoutes);
// app.use('/ladders', ladderRoutes);
// app.use('/matches', matchRoutes);
// app.use('/auth', authRouter);

//prehook to login and get a token before running tests
chai.use(chaiHttp);

describe('Root return', function(){
  it('should exist and return 200', function(){
    let res;
      return chai.request(app)
        .get('/matches')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          console.log(`res is ${res}`);
          expect(res).to.have.status(200);
        })
  });
});

// function seedUserData(){
//   console.info('seeding user data');
//   const seedData = [];

//   for(let i=1; i<=10; i++){
//     seedData.push(generateUserData())
//   }
//   return User.insertMany(seedData);
// }


// function generateUserData(){
//   const randAge = Math.floor(Math.random() * 18) + 60;
//   return {
//     name: {
//       firstName: faker.name.firstName(),
//       lastName: faker.name.lastName()
//     },
//     username: faker.name.firstName(),
//     age: randAge,
//     gender: "male",
//     isActive: true,
//     ladders: [ "5b8b17c354c1e18445736711" ],
//     matches:[ "5b8b17c3e62428d45fe1f9ab"]
//   }
// }

// function tearDownDb() {
//   console.warn('Deleting database');
//   return mongoose.connection.dropDatabase();
// }

// describe('Users API resource', function() {

//   before(function() {
//     return runServer(TEST_DATABASE_URL);
//   });

//   beforeEach(function() {
//     return seedUserData();
//   });

//   afterEach(function() {
//     return tearDownDb();
//   });

//   after(function() {
//     return closeServer();
//   });

//   describe('GET endpoint', function() {
//     console.log("here!");
//     it('should return all existing users', function() {
//       let res;
//       return chai.request(app)
//         .get('/users')
//         .then(function(_res) {
//           // so subsequent .then blocks can access response object
//           res = _res;
//           console.log("here!");
//           expect(res).to.have.status(200);
//           // otherwise our db seeding didn't work
//           expect(res.body.users).to.have.lengthOf.at.least(1);
//           return User.count();
//         })
//         .then(function(count) {
//           expect(res.body.users).to.have.lengthOf(count);
//         });
//     });
//     it('should return  with right fields', function() {
//       // Strategy: Get back all users, and ensure they have expected keys

//       let resUser;
//       return chai.request(app)
//         .get('/users')
//         .then(function(res) {
//           expect(res).to.have.status(200);
//           expect(res).to.be.json;
//           expect(res.body.users).to.be.a('array');
//           expect(res.body.users).to.have.lengthOf.at.least(1);

//           res.body.users.forEach(function(user) {
//             expect(user).to.be.a('object');
//             expect(user).to.include.keys(
//               'id', 'name', 'username', 'age', 'gender', 'isActive', 'ladders', 'matches');
//           });
//           resUser = res.body.users[0];
//           return User.findById(resUser.id);
//         })
//         .then(function(user) {
//           expect(resUser.id).to.equal(`${user._id}`);
//           expect(resUser.name.firstName).to.equal(user.name.firstName);
//           expect(resUser.username).to.equal(user.username);
//           expect(resUser.age).to.equal(user.age);
//           expect(resUser.gender).to.equal(user.gender);
//           expect(resUser.isActive).to.equal(user.isActive);
//           expect(resUser.matches).to.have.same.members(user.matches);   //Comparing arrays??
//         });
//     });
//   });

  // describe('POST endpoint', function() {
   
  //   it('should add a new user', function() {

  //     const newUser = generateUserData();
  //     console.info(newUser);
  //     return chai.request(app)
  //       .post('/users')
  //       .send(newUser)
  //       .then(function(res) {
  //         expect(res).to.have.status(201);
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.include.keys(
  //           'id', 'name.firstName', 'name.lastName', 'username', 'age', 'gender');
  //         expect(res.body.name.firstName).to.equal(newUser.name.firstName);
  //         expect(res.body.name.lastName).to.equal(newUser.name.lastName);
  //         // cause Mongo should have created id on insertion
  //         expect(res.body.id).to.not.be.null;
  //         expect(res.body.username).to.equal(newUser.username);
  //         expect(res.body.gender).to.equal(newUser.gender);

  //         return User.findById(res.body.id);
  //       })
  //       .then(function(user) {
  //         expect(user.name.firstName).to.equal(newUser.name.firstName);
  //         expect(user.name.lastName).to.equal(newUser.name.lastName);
  //         expect(user.username).to.equal(newUser.username);
  //         expect(user.age).to.equal(newUser.age);
  //         expect(user.gender).to.equal(newUser.gender);
  //       });
  //   });
  // });

  // describe('PUT endpoint', function() {
  //   // strategy:
  //   //  1. Get an existing restaurant from db
  //   //  2. Make a PUT request to update that restaurant
  //   //  3. Prove restaurant returned by request contains data we sent
  //   //  4. Prove restaurant in db is correctly updated
  //   it('should update fields you send over', function() {
  //     const updateData = {
  //       name: {
  //         firstName: 'Philip',
  //         lastName: 'Kohlschreiber'
  //       },
  //       age: 34
  //     };

  //     return User
  //       .findOne()
  //       .then(function(user) {
  //         updateData.id = user.id;

  //         // make request then inspect it to make sure it reflects
  //         // data we sent
  //         return chai.request(app)
  //           .put(`/users/${user.id}`)
  //           .send(updateData);
  //       })
  //       .then(function(res) {
  //         expect(res).to.have.status(204);

  //         return User.findById(updateData.id);
  //       })
  //       .then(function(user) {
  //         expect(user.name.firstName).to.equal(updateData.name.firstName);
  //         expect(user.name.lastName).to.equal(updateData.name.lastName);
  //         expect(user.age).to.equal(updateData.age);
  //       });
  //   });
  // });

  // describe('DELETE endpoint', function() {
  //   // strategy:
  //   //  1. get a user
  //   //  2. make a DELETE request for that user's id
  //   //  3. assert that response has right status code
  //   //  4. prove that user with the id doesn't exist in db anymore
  //   it('delete a user by id', function() {

  //     let user;

  //     return User
  //       .findOne()
  //       .then(function(_user) {
  //         user = _user;
  //         return chai.request(app).delete(`/users/${user.id}`);
  //       })
  //       .then(function(res) {
  //         expect(res).to.have.status(204);
  //         return User.findById(restaurant.id);
  //       })
  //       .then(function(_user) {
  //         expect(_user).to.be.null;
  //       });
  //   });
  // });
//
// });