module.exports = {
  select
}

function select(struct) {
  return buildSelects('', struct, {})
}

function buildSelects(path, spec, result) {
  Object.keys(spec).forEach((segment) => {
    var selectSpec = spec[segment]
    var segmentPath = (path + '_' + segment).replace(/^[_]/, '')
    
    buildSelect(segmentPath, selectSpec, result)
    
    Object.keys(selectSpec).forEach((key) => {
      if (typeof selectSpec[key] === 'object' || Array.isArray(selectSpec[key])) {
        buildSelect(segmentPath + '_' + key, selectSpec[key], result)
      }
    })
  })

  return result
}

function buildSelect(path, selectSpec, result) {
  var selectColumns = buildSelectColumns(selectSpec)

  result[path] = 'SELECT ' + selectColumns.map(quoteName).join(',') + ' FROM ' + quoteName(path)
}

function buildSelectColumns(node) {
  if (Array.isArray(node)) {
    return node
  }

  var result = []
  Object.keys(node).forEach((key) => {
    var value = node[key]

    // This is a reference
    if (typeof value === 'object') {
      result.push(key + 'Id')
    } else {
      result.push(key)
    }
  })
  return result
}

function quoteName(name) {
  return '`' + name + '`'
}