const assert = require('chai').assert
const path = require('path')
const clone = require('clone')
const fs = require('fs')

const updateCmdBuilder = require('../src/core/update-cmd-builder')
const cmdBuilder = require('../src/index')

describe('MySql Command Builder Tests', function() {
  describe('Testing Update Commands', function() {

    it('index.js', function(done) {
      assert.isNotNull(cmdBuilder.updateCmdBuilder)
      assert.isNotNull(cmdBuilder.cmdSubmitter)
      done()
    })

    it('simple test', function(done) {
      var o = { accessionOrder: { pLastName: 'mouse', masterAccessionNo: '17-11111'} }
      var oClone = clone(o)
      o.accessionOrder.pLastName = 'mini'
      updateCmdBuilder.build(o, oClone, function (err, result) {
        assert.equal(result[0].cmd, 'update tblAccessionOrder set PLastName = \'mini\' where MasterAccessionNo = \'17-11111\'')        
        done()
      })
    })

    it('AccessionOrder', function(done) {
      var testDataFile = path.join(__dirname, 'test-data.17-8171.json')
      fs.readFile(testDataFile, function (err, fileData) {
        var ao = JSON.parse(fileData.toString())
        var aoClone = clone(ao)
        ao.accessionOrder.pLastName = 'Mini'
        updateCmdBuilder.build(ao, aoClone, function (err, result) {
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
        ao.accessionOrder.panelSetOrders[0].panelSetOrder.panelSetName = 'Thin Prep pap'
        updateCmdBuilder.build(ao, aoClone, function (err, result) {
          assert.equal(result[0].type, 'update', 'the update type should be: update.')
          assert.equal(result[0].cmd, 'update tblPanelSetOrder set PanelSetName = \'Thin Prep pap\' where ReportNo = \'17-8171.Q1\'')
          done()
        })
      })
    })

  })
})
