var mysql = require('mysql')
var _ = require('lodash')

var connection = mysql.createConnection()

connection.connect()
//var query = connection.query('Set @ClientName = \'Internal Medicine, SVH Clinic\'; CALL sidtest(@ClientName);')
var query = connection.query('Set @MasterAccessionNo = \'17-16\'; CALL prcGetAccessionOrder(@MasterAccessionNo);')

var accessionOrder = {}
var rows = []

query
  .on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
  })
  .on('fields', function(fields) {
    // the field packets for the rows to follow
  })
  .on('result', function(row) {
    rows.push(Object.assign({}, row))
  })
  .on('end', function() {
    assembleRows()
    console.log(accessionOrder)
  })

connection.end()

function assembleRows() {
  accessionOrder = _.find(rows, function(o) { return o.tablename == 'tblAccessionOrder'})

  accessionOrder.PanelSetOrders = _.filter(rows, function(o) { return o.tablename =='tblPanelSetOrder' })
  if(!accessionOrder.PanelSetOrders) accessionOrder.PanelSetOrders = []
  accessionOrder.PanelSetOrders.map(function (pso) {
      pso.PanelOrders = _.filter(rows, function(o) { return o.tablename =='tblPanelOrder' })
      if(!pso.PanelOrders) pso.PanelOrders = []
      pso.PanelOrders.map(function (po) {
        po.TestOrders = _.filter(rows, function(o) { return o.tablename =='tblTestOrder' })
        if(!po.TestOrders) po.TestOrders = []
      })
  })

  accessionOrder.SpecimenOrders = _.filter(rows, function(o) { return o.tablename =='tblSpecimenOrder' })
  if(!accessionOrder.SpecimenOrders) accessionOrder.SpecimenOrders = []
  accessionOrder.SpecimenOrders.map(function (so) {
      so.AliquotOrders = _.filter(rows, function(o) { return o.tablename =='tblAliquotOrder' })
      if(!so.AliquotOrders) so.AliquotOrders = []
      so.AliquotOrders.map(function (alo) {
        alo.SlideOrders = _.filter(rows, function(o) { return o.tablename =='tblSlideOrder' })
        if(!alo.SlideOrders) alo.SlideOrders = []
      })
  })
}
