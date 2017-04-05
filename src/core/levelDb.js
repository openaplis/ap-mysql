'use strict'

var fs = require('fs')
var levelup = require('levelup')
var db = levelup('./src/map')


function putObjects() {
  fs.readdir('./src/schema', function (err, files) {
    files.map(function (file) {
      fs.readFile(__dirname + '\\schema\\' + file, function (err, data) {
        var objectName = file.substring(3, file.length - 5)
        console.log(objectName)
        db.put(objectName, data, function (err) {
          if (err) return console.log('Ooops!', err)
        })
      })
    })
  })
}

function putCollections() {
  db.put(objectName, data, function (err) {
    if (err) return console.log('Ooops!', err)
  })
}

function getObject(name) {
  db.get(name, function (err, value) {
    if (err) return console.log('Ooops!', err)
    var obj = JSON.parse(value)
    console.log(obj)
  })
}

//var obj = getObject('AccessionOrder')
//console.log(obj)

putObjects()
