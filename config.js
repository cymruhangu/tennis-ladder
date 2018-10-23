'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://dbadmin:cde32wsxzaq1@ds147592.mlab.com:47592/tennis-ladder-app";
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "mongodb://dbadmin:cde32wsxzaq1@ds245762.mlab.com:45762/test-tennis-ladder-app";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';