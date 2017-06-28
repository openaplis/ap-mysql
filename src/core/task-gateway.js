'use strict'

var path = require('path')

module.exports = {
  getUnacknowledgedTrackingNumbers: function (call, callback) {
    var sql = ['Select distinct todf.trackingNumber, t.reportNo ',
      'from tblTaskOrderDetail tod join tblTaskOrderDetailFedexShipment todf on tod.TaskOrderDetailId = todf.TaskOrderDetailid ',
      'join tblTaskOrder t on tod.TaskOrderid = t.TaskOrderId where tod.Acknowledged = 0 and todf.TrackingNumber is not null'].join('\n')
    cmdSubmitter.submit(sql, function (err, trackingNumbers) {
      if(err) return callback(err)
      callback(null, { trackingNumbers: trackingNumbers } )
    })
  },

  acknowledgeTaskOrder: function (call, callback) {
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
}
