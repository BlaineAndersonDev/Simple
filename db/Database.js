const pg = require('pg');

const config = require('../knexfile.js');
const database = require('knex')(config[process.env.NODE_ENV] || config['development']);

const knexMigrations = async (production_env) => {
  console.log('>>> Running `knex migrate:latest`... <<<')
  if (production_env == true) {
    const migrationResults = await database.migrate.latest('production')
    console.log(migrationResults)
  } else {
    const migrationResults = await database.migrate.latest('development')
    console.log(migrationResults)
  }
  console.log('>>> Migrations Complete. <<<')
};

const knexSeeds = async (production_env) => {
  console.log('>>> Running `knex seed:run`... <<<')
  if (production_env == true) {
    await database.seed.run('production')
  } else {
    await database.seed.run('development')
  }
  console.log('>>> Seed Complete. <<<')
};

// On API startup, this will run knex migrate:latest to ensure that our DB is up to date.
const knexSetup = async () => {
  if (process.env.NODE_ENV != 'development') {
    console.log('>>> Production Environment Detected <<<')
    pg.defaults.ssl = true;
    await knexMigrations(true)
    await knexSeeds(true)
  } else {
    console.log('>>> Development Environment Detected <<<')
    await knexMigrations(false)
    await knexSeeds(false)
  }
  console.log('>>> Knex Setup Completed <<<')
}

knexSetup();

module.exports = database;
