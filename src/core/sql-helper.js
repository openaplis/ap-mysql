
'use strict'
const path = require('path')
var _ = require('lodash')

module.exports = {
  createUpdateStatement: function(updateObject) {
    var sql = ''
    _.each(updateObject, function(tableObject) {
      var fields = ''
      var statement = ''
      _.each(tableObject.fields, function(field) {
        fields += field.name + ' = \'' + field.value + '\','
      })
      fields = fields.slice(0,-1)
      statement = ['update ', tableObject.tableName, ' set ', fields, ' where ',
      tableObject.primaryKey, ' = \'', tableObject.primaryKeyValue + '\'; '].join('')
      sql += statement
    })
    sql = sql.slice(0,-1)
    return sql
  }
}
