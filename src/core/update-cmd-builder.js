'use strict'

var _ = require('lodash')
var path = require('path')
var deepDiff = require('deep-diff')
var fs = require('fs')
var levelup = require('levelup')
var async = require('async')

var objectPath = './src/core/object/'

module.exports.build = (obj, objClone, callback) => {
  var diff = deepDiff(objClone, obj)
  var groupedDiffEdits = groupDiffEdits(diff, 'E')
  var statements = []

  var diffEditKeys = _.keys(groupedDiffEdits)
  async.each(diffEditKeys, function (diffEditKey, next) {

    var diffEdits = _.get(groupedDiffEdits, diffEditKey)
    var objectMapPath = path.join(objectPath, diffEditKey + '.json')
    fs.readFile(objectMapPath, function (err, value) {
      if (err) return callback(err)
      var objectMap = JSON.parse(value)
      var statement = {
        type: 'update',
        cmd: 'update ' + objectMap.tableName  + ' set ' + getSetFieldList(diffEdits, objectMap) + getWhereClause(diffEdits, objectMap, obj)
      }

      statements.push(statement)
      next()
    })
  }, function (err) {
    if(err) return callback(err)
    callback(null, statements)
  })
}

function getSetFieldList(diffEdits, objectMap) {
  var fields = ''
  diffEdits.map(function (diffEdit) {
    var fieldName = diffEdit.path[diffEdit.path.length - 1]
    var field = _.find(objectMap.fields, function (o) {
      return o.name == fieldName
    })

    fields += field.sqlName + ' = ' + getFieldValue(diffEdit, objectMap, fieldName) + ", "
  })
  return fields.substring(0, fields.length - 2)
}

function groupDiffEdits(deepDiff, type) {
  return _.groupBy(_.filter(deepDiff, function (o) { return o.kind == type}), function (diffEdit) { return getTableName(diffEdit) })
}

function getTableName(diffEdit) {
  if(Number.isInteger(diffEdit.path[diffEdit.path.length - 2])) {
    return diffEdit.path[diffEdit.path.length - 3]
  }
  else {
    return diffEdit.path[diffEdit.path.length - 2]
  }
}

function getFieldValue(diffEdit, objectMap, fieldName) {
  var field = _.find(objectMap.fields, function(o) { return o.name == fieldName })  
  if (field.dataType == 'string') {
    return '\'' + diffEdit.rhs + '\''
  } else {
    return diffEdit.rhs
  }
}

function getWhereClause(diffEdits, objectMap, clone) {
  var modifiedPath = _.slice(diffEdits[0].path, 0, diffEdits[0].path.length - 1)
  var pk = _.find(objectMap.fields, function(o) { return o.isPrimaryKey })
  modifiedPath.push(pk.name)
  var pkValue = _.get(clone, modifiedPath)

  if(pk.dataType == 'string') {
    return ' where ' + pk.sqlName + ' = \'' + pkValue + "\'"
  }
  else {
    return ' where ' + pk.sqlName + ' = ' + pkValue
  }
}

function isPathAnArray(path) {
  if(Number.isInteger(path[path.length - 2])) {
    return true
  }
  else {
    return false
  }
}
