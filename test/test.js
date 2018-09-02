'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
//const mongoose = require('mongoose');

const expect = chai.expect;

// const {Restaurant} = require('../models');
const {app, runServer, closeServer} = require('../server');
// const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

describe('Root return', function(){
  it('should return 200', function(){
    let res;
      return chai.request(app)
        .get('/')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          console.log(res);
          expect(res).to.have.status(200);
        })
  });
});