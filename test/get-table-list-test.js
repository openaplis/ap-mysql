'use strict'

const path = require('path')
//var _ = require('lodash')
//var camelCase = require(path.resolve('.//src/core/camel-case'))
var assert = require('chai').assert
var tables = require(path.resolve('.//src/core/tables'))
const fs = require('fs')

describe('Create Table Script File Tests', function() {
  //this.timeout(15000);

  it('Get Create Statement Test', function(done) {
    tables.getCreateStatement('tblClient', function(err, data) {
      if(err) return console.log(err)
      assert.isNotNull(data)
      //console.log(data)
      done()
    })
  })

  it('Remove File Test', function(done) {
    tables.removeFile(path.join(__dirname, 'CreateTables.sql'), function(err, result){
      if(err)return console.log(err)
      assert.equal(result, 'success')
      done()
    })
  })

  it('Get Table Constraints Test', function(done) {
    tables.getTableConstraints(function(err, result) {
      if(err) return console.log(err)
      assert.isAtLeast(result.length, 1)
      done()
    })
  })

  it('Generate Ordered Table File Test', function(done) {
    //setTimeout(done, 15000)
    tables.generateOrderedTableFile(path.join(__dirname, 'Tables.json'), function(err, result) {
      if(err) return console.log(err)
      assert.equal(result, 'success')
      done()
    })
  })

  it('Generate Ordered Table Script File Test', function(done) {
    tables.generateOrderedTableScriptFile('test', path.join(__dirname, 'Tables.json'), path.join(__dirname, 'CreateTables.sql'), function(err, result) {
      if(err) return console.log(err)
      assert.equal(result, 'success')
      done()
    })
  })
})
