module.exports = {
  toLower: (obj) => {
    if(Array.isArray(obj)) {
      return handleArrayToLower(obj)
    } else if(typeof obj === 'string') {
      return obj.charAt(0).toLowerCase() + obj.slice(1);
    } else {
      return handleObjToLower(obj)
    }
  },

  toUpper: (obj) => {
    if(Array.isArray(obj)) {
      return handleArrayToUpper(obj)
    } else if(typeof obj === 'string') {
      return obj.charAt(0).toUpperCase() + obj.slice(1);
    } else {
      return handleObjToUpper(obj)
    }
  }
}

function handleObjToUpper(obj) {
  var newObj = {}
  for (var property in obj) {
    if(obj.hasOwnProperty(property)) {
      newObj[property.upperCase()] = obj[property]
    }
  }
  return newObj
}

function handleArrayToUpper(array) {
  return array.map(function (obj) {
    return handleObjToUpper(obj)
  })
}

String.prototype.upperCase = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function handleObjToLower(obj) {
  var newObj = {}
  for (var property in obj) {
    if(obj.hasOwnProperty(property)) {
      newObj[property.lowerCase()] = obj[property]
    }
  }
  return newObj
}

function handleArrayToLower(array) {
  return array.map(function (obj) {
    return handleObjToLower(obj)
  })
}

String.prototype.lowerCase = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
}
