const assert = require('chai').assert
const deepDiff = require('deep-diff')
const fs = require('fs')
const path = require('path')
const clone = require('clone')

const insertCmdBuilder = require('../src/core/insert-cmd-builder')
const taskOrder = require('ap-object').TaskOrder

describe('MySql Insert Command Builder Tests', function() {
  describe('Testing Insert Commands', function() {
    it('AccessionOrder', function(done) {
      var testDataFile = path.join(__dirname, 'test-data.17-8171.json')
      fs.readFile(testDataFile, function (err, fileData) {
        var ao = JSON.parse(fileData.toString())
        var aoClone = clone(ao)

        var toValues = {
          TaskName: 'Breast Fixation Check',
          OrderedById: 5134,
          OrderedByInitials: 'OP'
        }

        var to = taskOrder.new(ao.AccessionOrder.PanelSetOrders[0], toValues)
        ao.AccessionOrder.PanelSetOrders[0].PanelSetOrder.TaskOrders.push(to)

        insertCmdBuilder.build(ao, aoClone, function (err, statements) {
          assert.equal(statements.length, 1)
          done()
        })
      })
    })
  })
})

insert tblTaskOrder (ObjectId, TaskOrderId, MasterAccessionNo, ReportNo,
  PanelSetName, TaskName, OrderDate, OrderedById, OrderedByInitials, TaskOrderDetails)
  values ('58f90fd2453a0e1f98029ff5', '58f90fd2453a0e1f98029ff5', '17-8171', '17-8171.Q1',
  'Prospective Review', 'Breast Fixation Check', '2017-04-20 13:45:22', 5134, 'OP')
