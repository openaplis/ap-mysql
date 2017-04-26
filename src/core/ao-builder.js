var _ = require('lodash')

module.exports.build = (rows, callback) => {
  var aoRaw = _.find(rows, function(o) { return o.tablename == 'tblAccessionOrder'})
  delete aoRaw.tablename

  var ao = {
    AccessionOrder: aoRaw
  }

  buildPanelSetOrders(ao, rows)
  buildSpecimenOrders(ao, rows)
  callback(null, ao)
}

function buildSpecimenOrders(ao, rows) {
  ao.AccessionOrder.SpecimenOrders = []
  var specimenOrders = _.filter(rows, function(o) { return o.tablename =='tblSpecimenOrder' })

  specimenOrders.map(function (soRaw) {
    delete soRaw.tablename
    var so = {
      SpecimenOrder: soRaw
    }

    buildAliquotOrders(so, rows)
    ao.AccessionOrder.SpecimenOrders.push(so)
  })
}

function buildAliquotOrders(so, rows) {
  so.SpecimenOrder.AliquotOrders = []
  var aliquotOrders = _.filter(rows, function(o) { return o.tablename =='tblAliquotOrder' && o.SpecimenOrderId == so.SpecimenOrder.SpecimenOrderId })

  aliquotOrders.map(function (aloRaw) {
    delete aloRaw.tablename
    var alo = {
      AliquotOrder: aloRaw
    }
    so.SpecimenOrder.AliquotOrders.push(alo)
  })
}

function buildPanelSetOrders(ao, rows) {
  ao.AccessionOrder.PanelSetOrders = []
  var panelSetOrders = _.filter(rows, function(o) { return o.tablename =='tblPanelSetOrder' })

  panelSetOrders.map(function (psoRaw) {
    delete psoRaw.tablename
    var pso = {
      PanelSetOrder: psoRaw
    }

    buildPanelOrders(pso, rows)
    buildTaskOrders(pso, rows)
    buildTestOrderReportDistribution(pso, rows)

    ao.AccessionOrder.PanelSetOrders.push(pso)
  })
}

function buildTestOrderReportDistribution(pso, rows) {
  pso.PanelSetOrder.TestOrderReportDistributions = []
  var testOrderReportDistributions = _.filter(rows, function(o) { return o.tablename =='tblTestOrderReportDistribution' && o.ReportNo == pso.PanelSetOrder.ReportNo })
  testOrderReportDistributions.map(function (tordRaw) {
    delete tordRaw.tablename
    var tord = {
      TestOrderReportDistribution: tordRaw
    }
    pso.PanelSetOrder.TestOrderReportDistributions.push(tord)
  })
}

function buildPanelOrders(pso, rows) {
  pso.PanelSetOrder.PanelOrders = []
  var panelOrders = _.filter(rows, function(o) { return o.tablename =='tblPanelOrder' && o.ReportNo == pso.PanelSetOrder.ReportNo })
  panelOrders.map(function (poRaw) {
    delete poRaw.tablename
    var po = {
      PanelOrder: poRaw
    }

    buildTestOrders(po, rows)
    pso.PanelSetOrder.PanelOrders.push(po)
  })
}

function buildTestOrders(po, rows) {
  po.PanelOrder.TestOrders = []
  var testOrders = _.filter(rows, function(o) { return o.tablename =='tblTestOrder' && o.PanelOrderId == po.PanelOrder.PanelOrderId })
  testOrders.map(function (toRaw) {
    delete toRaw.tablename
    var to = {
      TestOrder: toRaw
    }
    po.PanelOrder.TestOrders.push(to)
  })
}

function buildTaskOrders(pso, rows) {
  pso.PanelSetOrder.TaskOrders = []
  var taskOrders = _.filter(rows, function(o) { return o.tablename =='tblTaskOrder' && o.ReportNo == pso.PanelSetOrder.ReportNo })  
  taskOrders.map(function (toRaw) {
    delete toRaw.tablename
    var to = {
      TaskOrder: toRaw
    }
    buildTaskOrderDetails(to, rows)
    pso.PanelSetOrder.TaskOrders.push(to)
  })
}

function buildTaskOrderDetails(to, rows) {
  to.TaskOrder.TaskOrderDetails = []
  var taskOrderDetails = _.filter(rows, function(o) { return o.tablename =='tblTaskOrderDetail' && o.TaskOrderId == to.TaskOrder.TaskOrderId })
  taskOrderDetails.map(function (todRaw) {
    delete todRaw.tablename
    var tod = {
      TaskOrderDetail: todRaw
    }
    to.TaskOrder.TaskOrderDetails.push(tod)
  })
}
