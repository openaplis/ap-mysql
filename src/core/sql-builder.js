
'use strict'
const path = require('path')

var resultHelper = require('../../../ap-panther/src/core/result-helper')

module.exports = {
  createStatement: function(pantherResult) {
    var statement = ''
    var fields = ''
    if(pantherResult.type == 'update') {
      for (var i = 0, len = pantherResult.fields.length; i < len; i++) {
        fields += (pantherResult.fields[i].name + ' = \'' + pantherResult.fields[i].value + '\',')
      }
      fields = fields.slice(0,-1)
      statement = [pantherResult.type, ' ', pantherResult.tableName, ' set ', fields, ' where ',
        pantherResult.primaryKey, ' = \'', pantherResult.primaryKeyValue + '\';'].join('')
    }
    return statement
  }
}
