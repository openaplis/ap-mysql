var fs = require('fs')
var deepDiff = require('deep-diff')
var clone = require('clone')

var cmdBuilder = require('./cmdBuilder')
var cmdSubmitter = require('./cmdSubmitter')
var aoBuilder = require('./aoBuilder')

function testFromDB () {
  var sql = 'Set @MasterAccessionNo = \'17-16\'; CALL prcGetAccessionOrder(@MasterAccessionNo);'
  cmdSubmitter.submit(sql, function (err, rows) {
    aoBuilder.build(rows, function (err, ao) {
      console.log(ao)
    })
  })
}

testFromDB()

function testFromFile () {
  fs.readFile('ao.json', function (err, data) {
    ao = JSON.parse(data)
    aoClone = clone(ao)

    //aoClone.AccessionOrder.PLastName = "HARVEY"
    aoClone.AccessionOrder.SpecimenOrders[0].Description = 'Hello world'
    //aoClone.AccessionOrder.SpecimenOrders[0].AliquotOrders.pop()

    //var newSpecimenOrder1 = clone(aoClone.AccessionOrder.SpecimenOrders[0])
    //aoClone.AccessionOrder.SpecimenOrders.push(newSpecimenOrder1)

    //var newSpecimenOrder2 = clone(aoClone.AccessionOrder.SpecimenOrders[0])
    //aoClone.AccessionOrder.SpecimenOrders.push(newSpecimenOrder2)

    //var newAliquotOrder = clone(aoClone.AccessionOrder.SpecimenOrders[0].AliquotOrders[1])
    //aoClone.AccessionOrder.SpecimenOrders[0].AliquotOrders.push(newAliquotOrder)

    var diff = deepDiff(ao, aoClone)

    //commandBuiler.buildInsertCommands(diff, ao, function (err, statements) {
    //      console.log(statements)
    //})

    cmdBuilder.buildUpdateCommands(diff, ao, function (err, statements) {
      cmdSubmitter.submit(statements[0].cmd)
      //console.log(statements)
    })
  })
}
