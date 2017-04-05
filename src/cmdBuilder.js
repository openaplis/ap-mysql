'use strict'

var _ = require('lodash')
var fs = require('fs')
var levelup = require('levelup')
var async = require('async')

var db = levelup('./src/map')
var collectionMap = require('./collectionMap.js').Map()

module.exports.buildUpdateCommands = (deepDiff, obj, callback) => {
  var groupedDiffEdits = groupDiffEdits(deepDiff, 'E')
  var statements = []

  var diffEditKeys = _.keys(groupedDiffEdits)
  async.each(diffEditKeys, function (diffEditKey, next) {
    var oName = getObjectName(diffEditKey)

    var diffEdits = _.get(groupedDiffEdits, diffEditKey)

    db.get(oName, function (err, value) {
      if (err) return console.log('There was an error finding your key: ' + objectName, err)
      var objectMap = JSON.parse(value)

      var statement = {
        type: 'update',
        cmd: 'update ' + objectMap.tableName  + ' set ' + getSetFieldList(diffEdits, objectMap) + getWhereClause(diffEdits, objectMap, obj)
      }

      statements.push(statement)

      next()
    })
  }, function (err) {
    callback(null, statements)
  })
}

module.exports.buildInsertCommands = (deepDiff, obj, callback) => {
  var diffArrays = _.filter(deepDiff, function (o) { return o.kind == 'A'})
  var statements = []

  async.each(diffArrays, function (diffArray, next) {

    var colMap = _.find(collectionMap, function (o) { return o.collectionName == diffArray.path[diffArray.path.length - 1] })
    db.get(colMap.objectName, function (err, value) {
      if (err) return console.log('There was an error finding your key: ' + objectName, err)
      var objectMap = JSON.parse(value)

      var statement = {
        type: 'insert',
        cmd: 'insert ' + colMap.tableName + '(' + getInsertFieldList(diffArray) + ') values (' + getInsertValueList(diffArray, objectMap) + ')'
      }

      statements.push(statement)

      next()
    })

  }, function (err) {
    callback(null, statements)
  })
}

function getObjectName(objectName) {
  var mapObject = _.find(collectionMap, function (o) { return o.collectionName == objectName })
  if(mapObject) {
      return mapObject.objectName
  } else {
    return objectName
  }
}

function getInsertFieldList(diffArray) {
  var fields = ''
  _.forOwn(diffArray.item.rhs, function (value, key) {
    fields += key + ", "
  })
  return fields.substring(0, fields.length - 2)
}

function getInsertValueList(diffArray, objectMap) {
  var fields = ''
  _.forOwn(diffArray.item.rhs, function (value, key) {
    if(typeof(value) == 'boolean' || typeof(value) == 'number') {
      fields += value + ', '
    } else if(typeof(value) == 'string') {
      fields += '\'' + value + '\', '
    }
  })
  return fields.substring(0, fields.length - 2)
}

function getSetFieldList(diffEdits, objectMap) {
  var fields = ''
  diffEdits.map(function (diffEdit) {
    var fieldName = diffEdit.path[diffEdit.path.length - 1]
    fields += fieldName + ' = ' + getFieldValue(diffEdit, objectMap, fieldName) + ", "
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
    return ' where ' + pk.name + ' = \'' + pkValue + "\'"
  }
  else {
    return ' where ' + pk.name + ' = ' + pkValue
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
