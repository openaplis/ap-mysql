'use strict'

module.exports = {
  host: process.env.AP_MYSQL_HOST,
  user: process.env.AP_MYSQL_USER,
  password: process.env.AP_MYSQL_PASS,
  database: process.env.AP_MYSQL_DATABASE,
  multipleStatements: true,
}
