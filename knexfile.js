// Database, Migration and Seed Setup
module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'simple' // Replace this with your DB name.
    },
    migrations: {
        directory: __dirname + '/db/migrations',
    },
    seeds: {
        directory: __dirname + '/db/seeds',
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: true,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
        directory: __dirname + '/db/migrations',
    },
    seeds: {
        directory: __dirname + '/db/seeds/production',
    }
  }

};
