
'use strict'
const path = require('path')

module.exports = {
  createUpdateStatement: function(updateObject, callback) {
    var statement = ''
    var fields = ''
    for (var i = 0, len = updateObject.fields.length; i < len; i++) {
      fields += (updateObject.fields[i].name + ' = \'' + updateObject.fields[i].value + '\',')
    }
    fields = fields.slice(0,-1)
    statement = ['update ', updateObject.tableName, ' set ', fields, ' where ',
      updateObject.primaryKey, ' = \'', updateObject.primaryKeyValue + '\';'].join('')
    callback(null, statement)
  }
}
