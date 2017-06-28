const path = require('path')
const grpc = require('grpc')

const PROTO_PATH = path.join(__dirname, '../node_modules/ap-protobuf/src/core/mysql/mysql-service.proto')
const mysql_proto = grpc.load(PROTO_PATH).mysql


const mysqlService = new mysql_proto.MysqlService(process.env.AP_MYSQL_SERVICE_BINDING, grpc.credentials.createInsecure())

mysqlService.getUnacknowledgedTrackingNumbers({ message: 'null'}, function (err, message) {
  if(err) return console.log(err)
  console.log(message)
})
