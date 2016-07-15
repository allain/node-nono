# node-nono

A NoSQL approach to storing data in a boring old SQL backend.

I'm writing this to answer this question:

How practical is using a SQL databse as the backend to a NoSQL API.

The schema can be made to update itself based on how it's being used. For example referring to a column that doesn't exist can create it in some cases.

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


// Maybe a JSONish, query language
nono.fetch('{pages: {id,title,status>0}, places: {id,title,events:{id,title,start}}')

nono.store({events: [
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