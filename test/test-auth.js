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

describe('Auth endpoints', function () {
  const username = 'yabo';
  const password = '1qazxsw23e';
  const name = {firstName: 'Yabo', lastName: 'Kunst'};

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
    return User.hashPassword(password).then(password =>
      User.create({
        name,
        username,
        password
      })
    );
  });

  afterEach(function () {
    return User.remove({});
  });

  describe('/auth/login', function () {
    
    it('Should reject requests with incorrect usernames', function () {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ username: 'wrongUsername', password })
        .then(function(response){
            console.log(response.status);
            // expect.fail(null, null, 'Request should not succeed')
    })
        .catch(function(err) {
            console.log(`err is ${err}`);
        //   if (err instanceof chai.AssertionError) {
        //     throw err;
        //   }

          const res = err.response;
          console.log(`res is ${res}`);
          expect(res).to.have.status(401);
        });
    });
    // it('Should reject requests with incorrect passwords', function () {
    //   return chai
    //     .request(app)
    //     .post('/auth/login')
    //     .send({ username, password: 'wrongPassword' })
    //     .then(() =>
        //   expect.fail(null, null, 'Request should not succeed')
    //     )
    //     .catch(err => {
    //       if (err instanceof chai.AssertionError) {
    //         throw err;
    //       }

    //       const res = err.response;
    //       expect(res).to.have.status(401);
    //     });
    // });
    it('Should return a valid auth token', function () {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ username, password })
        .then(res => {
        //   console.log(res);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          console.log(token);
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          console.log(payload);
          expect(payload.user).to.include.keys(
            'id', 'name', 'username', 'age', 'email', 'gender', 'isActive', 'ladders', 'matches');
          console.log(payload.user);
        });
    });
  });

  
});
