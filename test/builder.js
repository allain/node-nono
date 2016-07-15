var test = require('tape');
var builder = require('../lib/builder.js')

test('simple query with object', (t) => {
  var sqlStruct = builder.select({
    events: {
      id: true,
      start: true,
      status: true,
      placeId: true
    }
  })

  t.deepEquals(sqlStruct, {
    events: 'SELECT `id`,`start`,`status`,`placeId` FROM `events`'
  })

  t.end()
})

test('query with relation works', (t) => {
  var sqlStruct = builder.select({
    events: {
      id: true,
      start: true,
      status: true,
      place: {
        id: true,
        status: true
      }
    }
  }, {
    mappings: {
      events_place: {
        table: 'places',
        multiplicity: '*_1',
        join: 'placeId => id'
      }
    }
  })

  t.deepEquals(sqlStruct, {
    events: 'SELECT `id`,`start`,`status`,`placeId` FROM `events`',
    events_place: 'SELECT `id`,`status` FROM `places` WHERE id IN (SELECT `placeId` FROM `events`)'
  })

  t.end()
})

test('buildSelect', (t) => {
  t.deepEquals(builder.buildSelect({
    table: 'test',
    columns: ['a', 'b'],
    where: 'a = 10'
  }), 'SELECT `a`,`b` FROM `test` WHERE a = 10')
  t.end()
})