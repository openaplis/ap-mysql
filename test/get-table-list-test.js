'use strict'

const path = require('path')
var _ = require('lodash')
var camelCase = require(path.resolve('.//src/core/camel-case'))
var assert = require('chai').assert
var tables = require(path.resolve('.//src/core/tables'))
const fs = require('fs')

describe('Table Create Script Tests', function() {
  it('Table List Test', function(done) {
      tables.getList(function(err, data) {
        if(err) return console.log(err)
        assert.isAtLeast(data.length, 1)
        //console.log(data)
        done()
      })
  })

  it('Get Create Statement', function(done) {
    tables.getCreateStatement('tblClient', function(err, data) {
      if(err) return console.log(err)
      assert.isNotNull(data)
      //console.log(data)
      done()
    })
  })

  it('Write Create Table Script File', function(done) {
    tables.writeToFile(path.join(__dirname, 'CreateTables.sql'), 'This is a test.', function(err, result){
      if(err)return console.log(err)
      assert.equal(result, 'success')
      done()
    })
  })

  it('Remove Create Table Script File', function(done) {
    tables.removeFile(path.join(__dirname, 'CreateTables.sql'), function(err, result){
      if(err)return console.log(err)
      assert.equal(result, 'success')
      done()
    })
  })

  it('Generate full File Test', function(done){
    tables.generateCreateTableFile('test', path.join(__dirname, 'CreateTables.sql'), function(err, result) {
      if(err) return console.log(err)
      assert.equal(result, 'success')
      done()
    })
  })
})
