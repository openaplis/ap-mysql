const assert = require('chai').assert
const deepDiff = require('deep-diff')
const fs = require('fs')
const path = require('path')
const clone = require('clone')

const insertCmdBuilder = require('../src/core/insert-cmd-builder')
const taskOrderHelper = require('ap-object').taskOrderHelper
const tsk = require('ap-object').taskBreastFixationCheck

describe('MySql Insert Command Builder Tests', function() {
  describe('Testing Insert Commands', function() {
    it('AccessionOrder', function(done) {
      var testDataFile = path.join(__dirname, 'test-data.17-8171.json')
      fs.readFile(testDataFile, function (err, fileData) {
        var ao = JSON.parse(fileData.toString())
        var aoClone = clone(ao)

        var to = taskOrderHelper.createTaskOrder({
          pso: ao.accessionOrder.panelSetOrders[0],
          tsk: tsk,
          orderedById: 5134,
          orderedByInitials: 'OP'
        }, function (err, to) {
          ao.accessionOrder.panelSetOrders[0].panelSetOrder.taskOrders.push(to)
          insertCmdBuilder.build(ao, aoClone, function (err, statements) {
            assert.equal(statements.length, 1)
            console.log(statements[0])
            done()
          })
        })
      })
    })
  })
})
