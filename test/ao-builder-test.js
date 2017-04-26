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
      assert.equal(testAO.AccessionOrder.MasterAccessionNo, '17-8171', 'Master Accession No not correct.')
      done()
    })

    it('SpecimenOrders.', function(done) {
      assert.equal(testAO.AccessionOrder.SpecimenOrders.length, 2, 'Number of SpecimenOrders is not correct.')
      assert.equal(testAO.AccessionOrder.SpecimenOrders[0].SpecimenOrder.SpecimenOrderId, '17-8171.1', 'The SpecimenOrderId on the first specimen is incorrect.')
      done()
    })

    it('AliquotOrders.', function(done) {
      assert.equal(testAO.AccessionOrder.SpecimenOrders[0].SpecimenOrder.AliquotOrders.length, 1, 'Number of aliquotOrders is not correct.')
      assert.equal(testAO.AccessionOrder.SpecimenOrders[0].SpecimenOrder.AliquotOrders[0].AliquotOrder.AliquotOrderId, '17-8171.1A', 'The AliquotOrderId on the first specimen is incorrect.')
      done()
    })

    it('PanelSetOrders.', function(done) {
      assert.equal(testAO.AccessionOrder.PanelSetOrders.length, 2, 'Number of PanelSetOrders is not correct.')
      assert.equal(testAO.AccessionOrder.PanelSetOrders[1].PanelSetOrder.ReportNo, '17-8171.S', 'ReportNo on second PanelSetOrder is not correct.')
      done()
    })

    it('PanelOrders.', function(done) {
      assert.equal(testAO.AccessionOrder.PanelSetOrders[1].PanelSetOrder.PanelOrders.length, 4, 'Number of PanelOrders on the second PanelSetOrder is not correct.')
      assert.equal(testAO.AccessionOrder.PanelSetOrders[1].PanelSetOrder.PanelOrders[0].PanelOrder.PanelOrderId, '58dc2c85d58b9611d85118bf', 'PanelOrderId on the second PanelSetOrder is not correct.')
      done()
    })

    it('TaskOrders.', function(done) {
      assert.equal(testAO.AccessionOrder.PanelSetOrders[0].PanelSetOrder.TaskOrders.length, 0, 'Number of TaskOrders on first PanelSetOrder is not correct.')
      assert.equal(testAO.AccessionOrder.PanelSetOrders[1].PanelSetOrder.TaskOrders.length, 0, 'Number of TaskOrders on second PanelSetOrder is not correct.')
      done()
    })

    it('TestOrderReportDistributions.', function(done) {
      assert.equal(testAO.AccessionOrder.PanelSetOrders[0].PanelSetOrder.TestOrderReportDistributions.length, 0, 'Number of TestOrderReportDistributions on first PanelSetOrder is not correct.')
      assert.equal(testAO.AccessionOrder.PanelSetOrders[1].PanelSetOrder.TestOrderReportDistributions.length, 1, 'Number of TestOrderReportDistributions on second PanelSetOrder is not correct.')
      done()
    })

  })
})
