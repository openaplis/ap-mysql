'use static'

var grpc = require('grpc')
var path = require('path')

var cmdSubmitter = require(path.join(__dirname, 'cmd-submitter'))

var PROTO_PATH = path.join(__dirname, '../../node_modules/ap-protobuf/src/core/mysql/mysql-service.proto')

var protobuf = grpc.load(PROTO_PATH).mysql
var server = {};

module.exports = {

  start: function (callback) {
    server = new grpc.Server()
    server.addService(protobuf.MysqlService.service,
      {
        ping: ping,
        getUnacknowledgedTrackingNumbers: getUnacknowledgedTrackingNumbers,
        acknowledgeTaskOrder: acknowledgeTaskOrder
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

function ping (call, callback) {
  callback(null, { message: 'I recieved this message: ' + call.request.message } )
}

function getUnacknowledgedTrackingNumbers (call, callback) {
  var sql = ['Select distinct todf.trackingNumber, t.reportNo ',
    'from tblTaskOrderDetail tod join tblTaskOrderDetailFedexShipment todf on tod.TaskOrderDetailId = todf.TaskOrderDetailid ',
    'join tblTaskOrder t on tod.TaskOrderid = t.TaskOrderId where tod.Acknowledged = 0 and todf.TrackingNumber is not null'].join('\n')
  cmdSubmitter.submit(sql, function (err, trackingNumbers) {
    if(err) return callback(err)
    callback(null, { trackingNumbers: trackingNumbers } )
  })
}

function acknowledgeTaskOrder (call, callback) {
  var sql = [
      'Update tblTaskOrderDetail tod',
      'inner join tblTaskOrderDetailFedexShipment todf on  tod.TaskOrderDetailId = todf.TaskOrderDetailId',
      'Set tod.Acknowledged = 1, tod.AcknowledgedbyId = 5134, tod.AcknowledgedByInitials = \'OP\', tod.AcknowledgedDate = \'' + call.request.acknowledgeDate + '\'',
      'where todf.TrackingNumber = \'' + call.request.trackingNumber + '\';',
      'Update tblTaskOrder t',
      'inner join tblTaskOrderDetail tod on t.TaskOrderId = tod.TaskOrderId',
      'inner join tblTaskOrderDetailFedexShipment todf on tod.TaskOrderDetailId = todf.TaskOrderDetailId',
      'Set t.Acknowledged = 1, t.AcknowledgedbyId = 5134, t.AcknowledgedByInitials = \'OP\', t.AcknowledgedDate = \'' + call.request.acknowledgeDate + '\'',
      'where todf.TrackingNumber = \'' + call.request.trackingNumber + '\';'
    ].join('\n')

  cmdSubmitter.submit(sql, function (err, result) {
    if(err) return callback(err)
    callback(null, { result: 'OK' } )
  })
}
