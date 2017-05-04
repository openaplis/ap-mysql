const assert = require('chai').assert
const camelCase = require('../src/core/camel-case')

describe('Camel Case Tests', function () {

  it('ToLower Test with string', function (done) {
    var result = camelCase.toLower('FirstName')
    assert.equal(result, 'firstName')
    done()
  })

  it('ToLower Test with Object', function (done) {
    var result = camelCase.toLower({ FirstName: 'Mickey', LastName: 'Mouse' })
    assert.equal(result.firstName, 'Mickey')
    assert.equal(result.lastName, 'Mouse')
    done()
  })

  it('ToLower Test with Array', function (done) {
    var result = camelCase.toLower([
      { FirstName: 'Mickey', LastName: 'Mouse' },
      { FirstName: 'Donald', LastName: 'Duck' },
    ])

    assert.equal(result.length, 2)
    assert.equal(result[0].firstName, 'Mickey')
    assert.equal(result[0].lastName, 'Mouse')
    assert.equal(result[1].firstName, 'Donald')
    assert.equal(result[1].lastName, 'Duck')

    done()
  })

  it('ToUpper Test with string', function (done) {
    var result = camelCase.toUpper('firstName')
    assert.equal(result, 'FirstName')
    done()
  })

  it('ToUpper Test with Object', function (done) {
    var result = camelCase.toUpper({ firstName: 'Mickey', lastName: 'Mouse' })
    assert.equal(result.FirstName, 'Mickey')
    assert.equal(result.LastName, 'Mouse')
    done()
  })

  it('ToUpper Test with Array', function (done) {
    var result = camelCase.toUpper([
      { firstName: 'Mickey', lastName: 'Mouse' },
      { firstName: 'Donald', lastName: 'Duck' },
    ])

    assert.equal(result.length, 2)
    assert.equal(result[0].FirstName, 'Mickey')
    assert.equal(result[0].LastName, 'Mouse')
    assert.equal(result[1].FirstName, 'Donald')
    assert.equal(result[1].LastName, 'Duck')

    done()
  })

})
