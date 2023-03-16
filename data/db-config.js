const knex = require("knex");
const knexConfig = require("../knexfile");
const { NODE_ENV } = require("../config/index");
//const environment = process.env.NODE_ENV || "development";

module.exports = knex(knexConfig[NODE_ENV]);
