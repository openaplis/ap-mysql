const assert = require('chai').assert
const path = require('path')
const clone = require('clone')
const deepDiff = require('deep-diff')
const fs = require('fs')

const cmdBuilder = require('../src/core/cmd-builder')

describe('MySql Command Builder Tests', function() {
  describe('Testing Update Commands', function() {

    it('AccessionOrder', function(done) {
      var testDataFile = path.join(__dirname, 'test-data.17-8171.json')
      fs.readFile(testDataFile, function (err, fileData) {
        var ao = JSON.parse(fileData.toString())
        var aoClone = clone(ao)
        ao.AccessionOrder.PLastName = 'Mini'
        var diff = deepDiff(aoClone, ao)

        cmdBuilder.buildUpdateCommands(diff, ao, function (err, result) {
          assert.equal(result.length, 1, 'The length of the result array should be 1.')
          assert.equal(result[0].type, 'update', 'The command type should be: update.')
          assert.equal(result[0].cmd, 'update tblAccessionOrder set PLastName = \'Mini\' where MasterAccessionNo = \'17-8171\'', 'The MySql update statement is not correct.')
          done()
        })

      })
    })

    it('PanelSetOrder', function(done) {
      var testDataFile = path.join(__dirname, 'test-data.17-8171.json')
      fs.readFile(testDataFile, function (err, fileData) {
        var ao = JSON.parse(fileData.toString())
        var aoClone = clone(ao)
        ao.AccessionOrder.PanelSetOrders[0].PanelSetOrder.PanelSetName = 'Thin Prep pap'        
        var diff = deepDiff(aoClone, ao)
        cmdBuilder.buildUpdateCommands(diff, ao, function (err, result) {
          assert.equal(result[0].type, 'update', 'the update type should be: update.')
          assert.equal(result[0].cmd, 'update tblPanelSetOrder set PanelSetName = \'Thin Prep pap\' where ReportNo = \'17-8171.Q1\'')
          done()
        })
      })
    })

  })
})
