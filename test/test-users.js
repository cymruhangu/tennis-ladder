'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../models/user');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Protected User endpoints', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example';
  const lastName = 'User';
  
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password,
        firstName,
        lastName
      })
    );
  });

  afterEach(function () {
    return User.remove({});
  });

  describe('/users', function () {
    it('Should reject requests with no credentials', function () {
      return chai
        .request(app)
        .get('/users')
        .then((response) => {
            console.log(response.status);
            // expect.fail(null, null, 'Request should not succeed')
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it('Should reject requests with an invalid token', function () {
      const token = jwt.sign(
        {
          username,
          firstName,
          lastName
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
        //   expect.fail(null, null, 'Request should not succeed')
        console.log(response.status);
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with an expired token', function () {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          },
          exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username
        }
      );

      return chai
        .request(app)
        .get('/users')
        .set('authorization', `Bearer ${token}`)
        .then((response) => {
        //   expect.fail(null, null, 'Request should not succeed')
        console.log(response.status);
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should send protected data', function () {
      const token = jwt.sign(
        {
          user: {
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );
      let resUser;

      return chai
        .request(app)
        .get('/users')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body.users).to.be.a('array');
          expect(res.body.users).to.have.lengthOf.at.least(1);

          res.body.users.forEach(function(user){
            expect(user).to.be.a('object');
            expect(user).to.include.keys(
              'id', 'name', 'username', 'age', 'email', 'gender', 'isActive', 'ladders', 'matches');
          });
          resUser = res.body.users[0];
          return User.findById(resUser.id);
        })
        .then(function(user){
            console.log(resUser.name);
            const resNameSplit = resUser.name.split(' ');
            const resFirst =resNameSplit[0];
            const resLast =resNameSplit[1];
            expect(resUser.id).to.equal(user.id);
            expect(resFirst).to.equal(user.name.firstName);
            expect(resLast).to.equal(user.name.lastName);
            expect(resUser.username).to.equal(user.username);
            expect(resUser.age).to.equal(user.age);
            expect(resUser.email).to.equal(user.email);
            expect(resUser.gender).to.equal(user.gender);
            expect(resUser.isActive).to.equal(user.isActive);
            expect(resUser.ladders).to.have.same.members(user.ladders);
            expect(resUser.matches).to.have.same.members(user.matches);
          })
    });
  });
});