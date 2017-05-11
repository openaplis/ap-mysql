const cmdSubmitter = require('../src/core/cmd-submitter')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const aoBuilder = require(path.resolve('./src/core/ao-builder'))
const camelCase = require(path.join(__dirname, '../src/core/camel-case'))

var masterAccessionNo = '17-8171'
var testDataRowsFilePath = './test/test-data-rows.' + masterAccessionNo + '.json'
var testDataObjectFilePath = './test/test-data.' + masterAccessionNo + '.json'

var sql = 'Set @MasterAccessionNo = \'' + masterAccessionNo + '\'; CALL prcGetAccessionOrder_2(@MasterAccessionNo);'

function submitCmd() {
  cmdSubmitter.submit(sql, function (err, rows) {
    CleanPatientInfo(rows)
    var rowJSON = JSON.stringify(rows)
    fs.writeFile(testDataRowsFilePath, rowJSON, function (err) {
      if(err) return callback(err)
      aoBuilder.build(rows, function (err, ao) {
        var objectJSON = JSON.stringify(ao)
        fs.writeFile(testDataObjectFilePath, objectJSON, function (err) {
          console.log('All done.')
        })
      })
    })
  })
}

function CleanPatientInfo(rows) {
  var aoRaw = _.find(rows, function(o) { return o.tablename == 'tblAccessionOrder'})
  aoRaw.PLastName = "MOUSE"
  aoRaw.PFirstname = "MICKEY"
  aoRaw.PSSN = "111-11-1111"
  aoRaw.SvhAccount = '999999'
  aoRaw.SvhMedicalRecord = '999999'
}

function getMsqlTable() {
  var sql = 'select * from tblPanelSet'
  cmdSubmitter.submit(sql, function (err, rows) {
    if(err) return console.log(err)
    var result = camelCase.toLower(rows)
    var json = JSON.stringify(result)
    fs.writeFile(path.join(__dirname, 'panelset-data.json'), json, function (err) {
      if(err) return console.log(err)
    })
  })
}

getMsqlTable();
