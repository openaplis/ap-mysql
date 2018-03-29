const assert = require('chai').assert
const path = require('path')

var sqlBuilder = require('../src/core/sql-builder')

var inputParams = {
  reportNo: '18-99999',
  accepted: false,
  papIsFinal: true,
  specimenIsUnsat: true
}

var hpvUpdate = {
  tableName : 'tblHPVTestOrder',
  type : 'update',
  primaryKey : 'ReportNo',
  primaryKeyValue : '18-99999',
  fields : [
    {
      name : 'Result',
      value : 'Negative'
    }
  ]
}

describe('Sql Tests', function () {
  it('', function (done) {
    sqlBuilder.createStatement(hpvUpdate, function(err, statement) {
      if(err) console.log(err)
      var updateStatement = 'update tblHPVTestOrder set Result = \'Negative\' where ReportNo = \'18-99999\';'
      assert.equal(statement, updateStatement)
      done()
    })
  })
})
