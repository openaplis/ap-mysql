var mysql = require('mysql')
var _ = require('lodash')

var connection = mysql.createConnection({
  host     : '10.1.2.26',
  user     : 'sqldude',
  password : '123Whatsup',
  database : 'lis',
  multipleStatements: true,
})

connection.connect()
//var query = connection.query('Set @ClientName = \'Internal Medicine, SVH Clinic\'; CALL sidtest(@ClientName);')
var query = connection.query('Set @MasterAccessionNo = \'17-16\'; CALL prcGetAccessionOrder(@MasterAccessionNo);')

var schemaList = [
  {
    obj: {},
    name: "accessionOrder",
    tablename: "tblAccessionOrder",
    pk: "MasterAccessionNo",
    hasParent: false,
    isCollection: false,
    childCollections: [
      { name: "panelSetOrders", tablename: "tblPanelSetOrder" },
      { name: "specimenOrders", tablename: "tblSpecimenOrder" }
    ]
  },
  {
    obj: [],
    name: "panelSetOrders",
    tablename: "tblPanelSetOrder",
    pk: "ReportNo",
    hasParent: true,
    isCollection: true,
    childCollections: [
      { name: "panelOrders", tablename: "tblPanelOrder" }
    ]
  },
  {
    obj: [],
    name: "panelOrders",
    tablename: "tblPanelOrder",
    pk: "panelOrderId",
    hasParent: true,
    isCollection: true,
    childCollections: [
      { name: "testOrders", tablename: "tblTestOrder" }
    ]
  },
  {
    obj: [],
    name: "testOrders",
    tablename: "tblTestOrder",
    pk: "testOrderId",
    hasParent: true,
    isCollection: true,
    childCollections: []
  },
  {
    obj: [],
    name: "specimenOrders",
    tablename: "tblSpecimenOrder",
    pk: "specimenOrderId",
    hasParent: true,
    isCollection: true,
    childCollections: [
      { name: "aliquotOrders", tablename: "tblAliquotOrder" }
    ]
  }
]

var accessionOrder = {}

query
  .on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
  })
  .on('fields', function(fields) {
    // the field packets for the rows to follow
  })
  .on('result', function(row) {
    if(row.constructor.name == 'RowDataPacket') {
      handleRow(row)
    }
  })
  .on('end', function() {
    assembleObjects(schemaList[0])
    console.log(schemaList[0].obj)
  })

connection.end()

function handleRow(row) {
  var result = _.find(schemaList, function (o) {
    return o.tablename == row.tablename
  })

  if(result) {
    var newObject = cloneRow(row)
    if(result.isCollection == false) {
      result.obj = newObject
    } else {
      result.obj.push(newObject)
    }
  }
}

function assembleObjects(schema) {
  schema.childCollections.forEach(function (collectionSchema) {
    if(!_.has(schema, collectionSchema.name)) {
        schema[collectionSchema.name] = []
    }
    _.find(schemaList, function (childSchema) {
      if(collectionSchema.tablename == childSchema.tablename) {
        childSchema.obj.forEach(function (childObj) {
          schema[collectionSchema.name].push(childObj)
          assembleObjects(childSchema)
         })
       }
    })
  })
}

function cloneRow (row) {
  var newObject = {}
  for(var field in row) {
    newObject[field]=row[field]
  }
  return newObject
}
