module.exports = {
  select,
  buildSelect
}


function select(spec, config) {

  var selectTree = constructSelectTree(spec, '', {})

  var result = {};
  Object.keys(selectTree).forEach(key => {
    result[key] = buildSelect(selectTree[key])
  })

  return result

  function constructSelectTree(spec, parentPath, result) {
    Object.keys(spec).forEach((segment) => {
      var value = spec[segment]
      if (typeof value !== 'object')
        return;

      var segmentPath = parentPath ? parentPath + '_' + segment : segment

      var sql = {
        type: 'SELECT',
        columns: buildSelectColumns(value),
        table: table(segmentPath)
      }

      if (parentPath) {
        var m = mapping(segmentPath)

        var joinSpec = m.join

        var parts = joinSpec.split(/\s*=>\s*/)
        var subQuery = Object.assign({}, result[parentPath], {
          columns: [parts[0]]
        })

        sql.where = parts[1] + ' IN (' + buildSelect(subQuery) + ')'
      }
      result[segmentPath] = sql

      Object.assign(result, constructSelectTree(value, segmentPath, result))
    })

    return result
  }

  function table(segmentPath) {
    var m = mapping(segmentPath)
    return m ? m.table : segmentPath
  }

  function mapping(segmentPath) {
    if (config && config && config.mappings && config.mappings[segmentPath]) {
      return config.mappings[segmentPath]
    }
  }
}



function buildSelect(spec) {
  var sql = 'SELECT ' + spec.columns.map(quoteName).join(',') + ' FROM ' + quoteName(spec.table);

  if (spec.where) {
    sql += ' WHERE ' + spec.where
  }

  return sql;
}

function buildSelectColumns(node) {
  return Object.keys(node).map((key) => {
    var value = node[key]

    // This is a reference
    return (typeof value === 'object') ? key + 'Id' : key
  })
}

function quoteName(name) {
  return '`' + name + '`'
}