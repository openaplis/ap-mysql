const deepDiff = require('deep-diff')
const async = require('async')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const objectPath = './src/core/object'

module.exports.build = (obj, clone, callback) => {
  var statements = []
  var diffs = deepDiff(clone, obj)
  var diffsFiltered = _.filter(diffs, function (o) { return o.kind == 'A' })
  async.each(diffsFiltered, function (diff, next) {

    var obj = diff.item.rhs
    var objectName = Object.getOwnPropertyNames(obj)[0]
    var sqlInsert = 'Insert '

    var objectMapPath = path.join(objectPath, objectName + '.json')
    fs.readFile(objectMapPath, function (err, value) {
      if (err) return callback(err)
      var objectMap = JSON.parse(value)
      sqlInsert = sqlInsert + objectMap.tableName + ' (' + getFieldList(obj[objectName], objectMap) + ') values (' + getValueList(obj[objectName]) + ')'
      statements.push(sqlInsert)
      next()
    })
  }, function (err) {
    callback(null, statements)
  })
}

function getFieldList(obj, objectMap) {
  var fields = ''
  _.forOwn(obj, function (value, key) {
    if(Array.isArray(value) == false) {
      var objectMapField = _.find(objectMap.fields, function (o) { return o.name == key })
      fields += objectMapField.sqlName + ', '
    }
  })
  return fields.substring(0, fields.length - 2)
}

function getValueList(obj) {
  var fields = ''
  _.forOwn(obj, function (value, key) {
    if(typeof(value) == 'boolean' || typeof(value) == 'number') {
      fields += value + ', '
    } else if(typeof(value) == 'string') {
      fields += '\'' + value + '\', '
    }
  })
  return fields.substring(0, fields.length - 2)
}
