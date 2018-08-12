const { Pool } = require('pg');

module.exports = (options, withPool) => {
  console.log(options instanceof Pool);
  const pool = options instanceof Pool ? options : new Pool(options);

  if (withPool) {
    withPool(pool);
  }

  return async fn => {
    const client = await pool.connect();

    try {
      return await fn(client);
    } finally {
      client.release();
    }
  }
}
