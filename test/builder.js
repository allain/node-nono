var test = require('tape');
var builder = require('../lib/builder.js')

test('simple query with array', (t) => {
	var sqlStruct = builder.select({events: ['id','start','status','placeId']})

	t.deepEquals(sqlStruct, {
		events: 'SELECT `id`,`start`,`status`,`placeId` FROM `events`'
	})

	t.end()
})

test('simple query with object', (t) => {
	var sqlStruct = builder.select({events: {
		id: true,
		start: true,
		status: true,
		placeId: true
	}})

	t.deepEquals(sqlStruct, {
		events: 'SELECT `id`,`start`,`status`,`placeId` FROM `events`'
	})

	t.end()
})

test('query with relation works', (t) => {
	var sqlStruct = builder.select({events: {
		id: true,
		start: true,
		status: true,
		place: {
			id: true,
			status: true
		}
	}})

	t.deepEquals(sqlStruct, {
		'events': 'SELECT `id`,`start`,`status`,`placeId` FROM `events`',
		'events_place': 'SELECT `id`,`status` FROM `events_place`'
		//'events_place': 'SELECT `id`,`status` FROM `places` WHERE `id` IN (SELECT `id`,`start`,`status`,`placeId` FROM `events`)'
	})

	t.end()
})