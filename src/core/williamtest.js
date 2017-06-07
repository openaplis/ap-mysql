'use strict'

const path = require('path')
const cmdSubmitter = require(path.join(__dirname, 'cmd-submitter'))

var sql = 'create database if not exists williamtest;'
sql += 'show schemas;'
sql += 'use williamtest;'
sql += 'create table if not exists williamtest.provider(providerId varchar(50) not null, providerFName varchar(50) default null, providerLName varchar(50) default null, npi varchar(10) default null);'
sql += 'insert williamtest.provider(providerId, providerFName, providerLName, npi) values("12345", "Wilma", "Jones", "9876543210");'
sql += 'insert williamtest.provider(providerId, providerFName, providerLName, npi) values("54321", "Ed","Smith", "2223334441");'
sql += 'select * from williamtest.provider;'
sql += 'delete from williamtest.provider where providerId = "54321";'
sql += 'select * from williamtest.provider;'
sql += 'update williamtest.provider set providerFName = "John" where providerId = "54321";'
sql += 'select * from williamtest.provider;'
sql += 'drop database williamtest;'
sql += 'show schemas;'
cmdSubmitter.submit(sql, function(err, results){
  if(err) return console.log(err)
  console.log(results)
})
