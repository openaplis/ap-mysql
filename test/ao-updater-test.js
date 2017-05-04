'use strict'

const fs = require('fs')
const assert = require('assert')
const path = require('path')
const clone = require('clone')

const aoUpdater = require('../src/core/ao-updater')
const taskOrderHelper = require('ap-object').taskOrderHelper
const taskOrderDetailHelper = require('ap-object').taskOrderHelperDetail
const taskGeneric = require('ap-object').taskGeneric

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

      testAO.accessionOrder.pLastName = 'DUCK'
      testAO.accessionOrder.panelSetOrders[0].panelSetOrder.panelSetName = 'Going to the sun.'

      taskOrderHelper.createTaskOrder({
        pso: testAO.accessionOrder.panelSetOrders[0],
        tsk: taskGeneric,
        orderedById: 5134,
        orderedByInitials: 'OP'
      }, function (err, to) {
        testAO.accessionOrder.panelSetOrders[0].panelSetOrder.taskOrders.push(to)
        aoUpdater.update(testAO, aoClone, function (err, result) {
          console.log(result)
          assert.equal(err, null)
          done()
        })
      })
    })
  })

})
