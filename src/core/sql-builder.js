
'use strict'
const path = require('path')

module.exports = {
  createStatement: function(updateObject, callback) {
    var statement = ''
    var fields = ''
    if(updateObject.type != 'update') return callback('Not an update')
    for (var i = 0, len = updateObject.fields.length; i < len; i++) {
      fields += (updateObject.fields[i].name + ' = \'' + updateObject.fields[i].value + '\',')
    }
    fields = fields.slice(0,-1)
    statement = [updateObject.type, ' ', updateObject.tableName, ' set ', fields, ' where ',
      updateObject.primaryKey, ' = \'', updateObject.primaryKeyValue + '\';'].join('')
    callback(null, statement)
  }
}
