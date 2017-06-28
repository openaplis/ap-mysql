'use static'

var grpc = require('grpc')
var path = require('path')

var accessionOrderGateway = require(path.join(__dirname, 'accession-order-gateway'))
var taskGateway = require(path.join(__dirname, 'task-gateway'))

var PROTO_PATH = path.join(__dirname, '../../node_modules/ap-protobuf/src/core/gateway.proto')

var protobuf = grpc.load(PROTO_PATH).gateway
var server = {};

module.exports = {

  start: function (callback) {
    server = new grpc.Server()

    server.addService(protobuf.TaskGateway.service,
      {
        getUnacknowledgedTrackingNumbers: taskGateway.getUnacknowledgedTrackingNumbers,
        acknowledgeTaskOrder: taskGateway.acknowledgeTaskOrder
      })

    server.addService(protobuf.AccessionOrderGateway.service,
      {
        getAccessionOrderByMasterAccessionNo: accessionOrderGateway.getAccessionOrderByMasterAccessionNo
      })

    server.bind(process.env.AP_MYSQL_SERVICE_BINDING, grpc.ServerCredentials.createInsecure())
    server.start()

    callback(null, {
      message: 'The Mysql service has started.',
      serviceBinding: process.env.AP_MYSQL_SERVICE_BINDING
    })
  },

  shutdown: function (callback) {
    server.tryShutdown(function () {
      callback(null, { message: 'The service has been stopped.'} )
    })
  }

}
