const assert = require('assert')
const path = require('path')
const cmdSubmitter = require('../src/core/cmd-submitter')
const aoBuilder = require('../src/core/ao-builder')
const fs = require('fs')
const _ = require('lodash')

var testAO = null;

describe('aoBuilder', function() {

  before(function(done) {
    var testDataPath = path.resolve('./test/test-data-rows.17-8171.json')
    fs.readFile(testDataPath, function (err, data) {
      if(err) return console.log(err)
      var rows = JSON.parse(data)
      aoBuilder.build(rows, function (err, ao) {
        testAO = ao        
        done()
      })
    })
  })

  describe('build', function() {

    it('AccessionOrder.', function(done) {
      assert.equal(testAO.accessionOrder.masterAccessionNo, '17-8171', 'Master Accession No not correct.')
      done()
    })

    it('SpecimenOrders.', function(done) {
      assert.equal(testAO.accessionOrder.specimenOrders.length, 2, 'Number of SpecimenOrders is not correct.')
      assert.equal(testAO.accessionOrder.specimenOrders[0].specimenOrder.specimenOrderId, '17-8171.1', 'The SpecimenOrderId on the first specimen is incorrect.')
      done()
    })

    it('AliquotOrders.', function(done) {
      assert.equal(testAO.accessionOrder.specimenOrders[0].specimenOrder.aliquotOrders.length, 1, 'Number of aliquotOrders is not correct.')
      assert.equal(testAO.accessionOrder.specimenOrders[0].specimenOrder.aliquotOrders[0].aliquotOrder.aliquotOrderId, '17-8171.1A', 'The AliquotOrderId on the first specimen is incorrect.')
      done()
    })

    it('PanelSetOrders.', function(done) {
      assert.equal(testAO.accessionOrder.panelSetOrders.length, 2, 'Number of PanelSetOrders is not correct.')
      assert.equal(testAO.accessionOrder.panelSetOrders[1].panelSetOrder.reportNo, '17-8171.S', 'ReportNo on second PanelSetOrder is not correct.')
      done()
    })

    it('PanelOrders.', function(done) {
      assert.equal(testAO.accessionOrder.panelSetOrders[1].panelSetOrder.panelOrders.length, 4, 'Number of PanelOrders on the second PanelSetOrder is not correct.')
      assert.equal(testAO.accessionOrder.panelSetOrders[1].panelSetOrder.panelOrders[0].panelOrder.panelOrderId, '58dc2c85d58b9611d85118bf', 'PanelOrderId on the second PanelSetOrder is not correct.')
      done()
    })

    it('TaskOrders.', function(done) {
      assert.equal(testAO.accessionOrder.panelSetOrders[0].panelSetOrder.taskOrders.length, 0, 'Number of TaskOrders on first PanelSetOrder is not correct.')
      assert.equal(testAO.accessionOrder.panelSetOrders[1].panelSetOrder.taskOrders.length, 2, 'Number of TaskOrders on second PanelSetOrder is not correct.')
      done()
    })

    it('TestOrderReportDistributions.', function(done) {
      assert.equal(testAO.accessionOrder.panelSetOrders[0].panelSetOrder.testOrderReportDistributions.length, 0, 'Number of TestOrderReportDistributions on first PanelSetOrder is not correct.')
      assert.equal(testAO.accessionOrder.panelSetOrders[1].panelSetOrder.testOrderReportDistributions.length, 1, 'Number of TestOrderReportDistributions on second PanelSetOrder is not correct.')
      done()
    })

  })
})
