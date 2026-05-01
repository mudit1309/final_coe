const serverless = require("serverless-http");
const { app } = require("../../server/dist/index");

exports.handler = serverless(app);
