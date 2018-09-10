'use strict';

exports.DATABASE_URL = 
  process.env.DATABASE_URL || "mongodb://localhost:27017/tennis-ladder-app";
exports.TEST_DATABASE_URL =
   process.env.TEST_DATABASE_URL || "mongodb://localhost:27017/test-tennis-ladder-app";
   exports.PORT = process.env.PORT || 8080;