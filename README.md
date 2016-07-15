# node-nono

A NoSQL approach to storing data in a boring old SQL backend.

I'm writing this to answer this question:

What would it feel like to use a SQL database as the backend for a frontend that feels a lot like a NoSQL one.

The goal is eventually put an API infront of a legacy MySQL database.

The schema can be made to update itself based on how it's being used. For example refering to a column that doesn't exist can create it in some cases.

## Dreamcode

```js
var NoNo = require('nono')

var nono = NoNo({...}) // config here

nono.fetch({
    // Simple query
    pages: ['id', 'title'],

    // Query with relations
    places: {
        id: true,
        title: true,
        events: ['id', 'title', 'start']
    }
})

nano.store({events: [
    // An UPDATE because id is given
    {
      id: 1,
      title: 'New Title: ' + Math.random()
    },

    // A DELETE (is there a better way?)
    {
      id: 3,
      _deleted: true
    },

    // An INSERT because PK is not given
    {
      title: 'New Title: ' + Math.random()
    }
]})
```