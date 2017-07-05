'use strict'

var cmdSubmitter = require('../src/core/cmd-submitter')

cmdSubmitter.submit('select * from tblClient where clientid = 558', function (err, rows) {
  if(err) return callback(err)
  console.log(rows[0])
})
