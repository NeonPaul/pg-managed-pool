# pg-managed-pool

A really small library for making your postgres pool connections easier by handling
the connection and release of the client for you. Works well with async functions.

## Install it:

```bash
npm install pg pg-managed-pool
```

## Use it:

```javascript
const managedPool = require('pg-managed-pool');

const connect = managedPool({ /* connection details */ });

connect(async client => {
  const result = await client.query('SELECT * FROM whatever');

  console.log(result.rows);

  // Whether or not your query throws, the client will be released back to the pool
  // at the end of this function. Then you can handle errors any way you like.
}).then(/* handle errors */);
```

If you want access to the pool object, you can create your own pool and pass it in
instead of the connection object, or you can add a function as the second argument
that accepts the pool object:

```javascript
const { Pool } = require('pg');
const managedPool = require('pg-managed-pool');

const pool = new Pool({ /* connection details */});
pool.on('error', () => /* do stuff */);
const connect = managedPool(pool);

// ...OR...

const connect2 = managedPool(
  { /* connection details */ },
  pool => pool.on('error', () => /* do stuff */);
);
```
