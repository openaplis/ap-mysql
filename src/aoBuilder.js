var _ = require('lodash')

module.exports.build = (rows, callback) => {
  var accessionOrder = {}

  accessionOrder = _.find(rows, function(o) { return o.tablename == 'tblAccessionOrder'})

  accessionOrder.PanelSetOrders = _.filter(rows, function(o) { return o.tablename =='tblPanelSetOrder' })
  if(!accessionOrder.PanelSetOrders) accessionOrder.PanelSetOrders = []
  accessionOrder.PanelSetOrders.map(function (pso) {
      pso.TaskOrders = _.filter(rows, function(o) { return o.tablename =='tblTaskOrder' })
      if(!pso.TaskOrders) pso.TaskOrders = []

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

  callback(null, accessionOrder)
}
