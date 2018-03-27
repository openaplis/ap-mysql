const assert = require('chai').assert
const path = require('path')

const pantherPath ='../../ap-panther'
const sqlBuilder = require('../src/core/sql-builder')
const resultHelper = require(path.join(pantherPath, 'src/core/result-helper'))
const pantherResultHPV = require(path.join(pantherPath, 'test/panther-result-hpv'))
const hpvResultHandler = require(path.join(pantherPath, 'src/core/hpv-result-handler'))
const hpvResult = require(path.join(pantherPath, 'src/core/hpv-result'))

var inputParams = {
  reportNo: '18-99999',
  accepted: false,
  papIsFinal: true,
  specimenIsUnsat: true
}

describe('Sql Tests', function () {
  it('HPV Negative Test', function (done) {
    var updates = hpvResultHandler.buildUpdateObject(pantherResultHPV.negative, inputParams)
    //var result = resultHelper.getField(updates, 'tblHPVTestOrder', 'Result')
    //assert.equal(hpvResult.negative.result, result.value)
    var hpvUpdate = updates.find(function (item) { return item.tableName == 'tblHPVTestOrder' })
    var psoUpdate = updates.find(function (item) { return item.tableName == 'tblPanelSetOrder' })
    var hpvstatement = sqlBuilder.createStatement(hpvUpdate)
    var updateStatement = 'update tblHPVTestOrder set Result = \'Negative\',Comment = \'HPV testing of unsatisfactory specimens may yield false negative results.  Recommend repeat HPV testing.\' where ReportNo = \'18-99999\';'

    assert.equal(hpvstatement, updateStatement)

    var psoStatement = sqlBuilder.createStatement(psoUpdate)
    console.log(psoStatement)
    done()
  })
})
