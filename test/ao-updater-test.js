'use strict'

const fs = require('fs')
const assert = require('assert')
const path = require('path')
const clone = require('clone')

const aoUpdater = require('../src/core/ao-updater')
const taskOrder = require('ap-object').TaskOrder
const taskOrderDetail = require('ap-object').TaskOrderDetail

var testAO = null;

describe('aoUpdater', function() {

  before(function(done) {
    var testDataPath = './test/test-data.17-8171.json'
    fs.readFile(testDataPath, function (err, data) {
      if(err) return console.log(err)
      testAO = JSON.parse(data)
      done()
    })
  })

  describe('update', function() {
    it('Testing the updater.', function(done) {
      var aoClone = clone(testAO)

      var toValues = {
        TaskName: 'Breast Fixation Check',
        OrderedById: 5134,
        OrderedByInitials: 'OP'
      }

      testAO.AccessionOrder.PLastName = 'DUCK'
      testAO.AccessionOrder.PanelSetOrders[0].PanelSetOrder.PanelSetName = 'Going to the sun.'

      var to = taskOrder.new(testAO.AccessionOrder.PanelSetOrders[0], toValues)
      testAO.AccessionOrder.PanelSetOrders[0].PanelSetOrder.TaskOrders.push(to)



      aoUpdater.update(testAO, aoClone, function (err, result) {
        console.log(result)
        assert.equal(err, null)
        done()
      })

    })
  })
})
