var _ = require('lodash')
var camelCase = require('./camel-case')

module.exports.build = (rows, callback) => {
  var aoRaw = camelCase.toLower(_.find(rows, function(o) { return o.tablename == 'tblAccessionOrder'}))
  delete aoRaw.tablename

  var ao = {
    accessionOrder: aoRaw
  }

  buildPanelSetOrders(ao, rows)
  buildSpecimenOrders(ao, rows)
  callback(null, ao)
}

function buildSpecimenOrders(ao, rows) {
  ao.accessionOrder.specimenOrders = []
  var specimenOrders = camelCase.toLower(_.filter(rows, function(o) { return o.tablename =='tblSpecimenOrder' }))

  specimenOrders.map(function (soRaw) {
    delete soRaw.tablename
    var so = {
      specimenOrder: soRaw
    }

    buildAliquotOrders(so, rows)
    ao.accessionOrder.specimenOrders.push(so)
  })
}

function buildAliquotOrders(so, rows) {
  so.specimenOrder.aliquotOrders = []
  var aliquotOrders = camelCase.toLower(_.filter(rows, function(o) { return o.tablename =='tblAliquotOrder' && o.SpecimenOrderId == so.specimenOrder.specimenOrderId }))

  aliquotOrders.map(function (aloRaw) {
    delete aloRaw.tablename
    var alo = {
      aliquotOrder: aloRaw
    }
    so.specimenOrder.aliquotOrders.push(alo)
  })
}

function buildPanelSetOrders(ao, rows) {
  ao.accessionOrder.panelSetOrders = []
  var panelSetOrders = camelCase.toLower(_.filter(rows, function(o) { return o.tablename =='tblPanelSetOrder' }))

  panelSetOrders.map(function (psoRaw) {
    delete psoRaw.tablename
    var pso = {
      panelSetOrder: psoRaw
    }

    buildPanelOrders(pso, rows)
    buildTaskOrders(pso, rows)
    buildTestOrderReportDistribution(pso, rows)

    ao.accessionOrder.panelSetOrders.push(pso)
  })
}

function buildTestOrderReportDistribution(pso, rows) {
  pso.panelSetOrder.testOrderReportDistributions = []
  var testOrderReportDistributions = camelCase.toLower(_.filter(rows, function(o) { return o.tablename =='tblTestOrderReportDistribution' && o.ReportNo == pso.panelSetOrder.reportNo }))
  testOrderReportDistributions.map(function (tordRaw) {
    delete tordRaw.tablename
    var tord = {
      testOrderReportDistribution: tordRaw
    }
    pso.panelSetOrder.testOrderReportDistributions.push(tord)
  })
}

function buildPanelOrders(pso, rows) {
  pso.panelSetOrder.panelOrders = []
  var panelOrders = camelCase.toLower(_.filter(rows, function(o) { return o.tablename =='tblPanelOrder' && o.ReportNo == pso.panelSetOrder.reportNo }))
  panelOrders.map(function (poRaw) {
    delete poRaw.tablename
    var po = {
      panelOrder: poRaw
    }

    buildTestOrders(po, rows)
    pso.panelSetOrder.panelOrders.push(po)
  })
}

function buildTestOrders(po, rows) {
  po.panelOrder.testOrders = []
  var testOrders = camelCase.toLower(_.filter(rows, function(o) { return o.tablename =='tblTestOrder' && o.PanelOrderId == po.panelOrder.panelOrderId }))
  testOrders.map(function (toRaw) {
    delete toRaw.tablename
    var to = {
      TestOrder: toRaw
    }
    po.panelOrder.testOrders.push(to)
  })
}

function buildTaskOrders(pso, rows) {
  pso.panelSetOrder.taskOrders = []
  var taskOrders = camelCase.toLower(_.filter(rows, function(o) { return o.tablename =='tblTaskOrder' && o.ReportNo == pso.panelSetOrder.reportNo }))
  taskOrders.map(function (toRaw) {
    delete toRaw.tablename
    var to = {
      taskOrder: toRaw
    }
    buildTaskOrderDetails(to, rows)
    pso.panelSetOrder.taskOrders.push(to)
  })
}

function buildTaskOrderDetails(to, rows) {
  to.taskOrder.taskOrderDetails = []
  var taskOrderDetails = camelCase.toLower(_.filter(rows, function(o) { return o.tablename =='tblTaskOrderDetail' && o.TaskOrderId == to.taskOrder.taskOrderId }))
  taskOrderDetails.map(function (todRaw) {
    delete todRaw.tablename
    var tod = {
      taskOrderDetail: todRaw
    }
    to.taskOrder.taskOrderDetails.push(tod)
  })
}
