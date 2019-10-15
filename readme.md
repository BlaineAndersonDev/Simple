# A Simple Node API
##### Create a Simple Node API
  > This API is setup to use RESTful routing to manipulate both a Static JS Object & A Relational PostgreSQL Database. It includes only the API (no frontend) and must be manipulated using calls (I.E. Postman). It is meant to be used when creating/learning cloud based hosting techniques.

  > This tutorial also assume you have a minimal understanding of Javascript, Node, RESTful Routing (Express), and can follow instructions :)
------

# Static Object Manipulation

## Create the API
  * Create a new directory.
    * `mkdir <DirName>`
  * Enter new directory.
    * `cd <DirName>`
  * Create the base file for our API.
    * `touch server.js`
    * Copy and paste the following into server.js:
      * You do not need to completely understand everything in these copy/paste files. Each line also includes a snippet of explanation for convenience.
    ```
    // =====================================
    // Base Imports ========================
    // =====================================
    // Allows use of backend routing.
    // https://expressjs.com/
    const express = require('express');
    // Path allows our Server to find build files stored in our frontend.
    // https://nodejs.org/api/path.html
    const path = require('path');
    // Helmet helps you secure your Express apps by setting various HTTP headers.
    // https://helmetjs.github.io/
    const helmet = require('helmet')
    // HTTP request logger
    // https://github.com/expressjs/morgan
    const morgan = require('morgan')

    // =====================================
    // Initial Setup =======================
    // =====================================
    // Initialize the 'app' using 'express'.
    const app = express();
    // Use the provided PORT if it exists else default to PORT 5000.
    const port = process.env.PORT || 5000;
    // Allows the app to parse 'application/json' request bodies.
    app.use(express.json());
    // Allows the app to parse 'x-ww-form-urlencoded' request bodies.
    app.use(express.urlencoded({ extended: false }));
    // Tells the app to use files in the Client's 'build' folder when rendering static pages (production pages).
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Logs all HTTP actions to the console (Only runs in 'development').
    app.use(morgan(':method :url {HTTP Status: :status} {Content Length: :res[content-length]} {Response Time: :response-time ms}'))
    // Increase App API security by setting Headers using Helemt.
    app.use(helmet())

    // =====================================
    // Router Setup ========================
    // =====================================
    // The app will use the required files below to generate API routes that allows the frontend to use HTTP calls (Axios) to retrieve data from the predetermined end points.
    app.use('/api/object/examples', require('./controllers/exampleObjectController.js'));

    // =====================================
    // Retrieve the local IP ===============
    // =====================================
    var os = require('os');

    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
          addresses.push(address.address);
        }
      }
    }

    // =====================================
    // Error Handling ======================
    // =====================================
    // Gets called because of `errorWrapper.js` in the controllers directory.
    // End all function for all errors.
    app.use(function(err, req, res, next) {
      // Example of specific error handling. Currently unused.
        // if (error instanceof ReferenceError) {}
      if (process.env.NODE_ENV === 'production') {
        res.status(500)
      } else {
        if (!err.name) {
          res.status(500).json({
            success: false,
            name: 'Blank Error',
            message: 'If this error is displayed, then you likely used `next()` without specifiying anything.'
          });
        } else {
          // Check for test ENV. If true then output only JSON.
          if (process.env.NODE_ENV === 'test') {
            res.status(500).json({
              success: false,
              name: err.name,
              message: err.message
            });
          } else {
            console.log('=================================');
            console.log('========= ERROR RESULTS =========');
            console.log('---------------------------------');
            console.log(err.name);
            console.log(err.message);
            console.log('=================================');
            // console.log(err.stack);
            res.status(500).json({
              success: false,
              name: err.name,
              message: err.message
            });
          };
        };
      };
    });

    // =====================================
    // Final Steps =========================
    // =====================================
    // Display to show the Node Enviornment, POSTman test route, and inform the developer what port the API is listening on.
    console.log('===============================')
    console.log('API successfully loaded.')
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
    console.log('Test functionality with POSTman using the following route:')
    console.log(`      ${addresses[0]}:5000/api/object/examples`)
    console.log(`Listening on port: ${port}`)
    console.log('===============================')

    // Sets the API to listen for calls.
    app.listen(port);

    // Exports the `app` to be used elsewhere in the project.
    module.exports = app
    ```
  * Create a readme. [Optional]
    * `touch readme.md`
  * Create you Package [npm/yarn] (I prefer yarn, however, Digital Ocean makes it much easier to use NPM over Yarn when working with droplets so we will use NPM during the tutorial).
    * `npm init -y` or `yarn init -y`
    * `-y` Accepts all default options and skips the installer for either option.
    * Copy and paste the following into package.json:
    ```
    {
      "name": "simpleAPI",
      "version": "1.0.0",
      "main": "index.js",
      "license": "MIT",
      "dependencies": {
        "dotenv": "^8.1.0",
        "express": "^4.17.1",
        "helmet": "^3.21.1",
        "knex": "0.16.5",
        "moment": "^2.24.0",
        "morgan": "^1.9.1",
        "node": "^12.11.1",
        "path": "^0.12.7",
        "pg": "^7.12.1"
      },
      "scripts": {
        "dev": "NODE_ENV=development node server.js",
        "start": "NODE_ENV=production node server.js"
      }
    }
    ```
  * Initiate Git.
    * `git init`
  * Create .gitignore.
    * `touch .gitignore`
    * Copy and paste the following into .gitignore:
    ```
    # Dependency directories
    node_modules/
    package-lock.json

    # dotenv environment variables file
    .env

    # SSH Keys
    simple
    simple.pub

    # Other
    .DS_Store
    ```
  * Install Dependencies:
    * `npm install express node morgan helmet path`
    * Descriptions for each can be found in server.js.
  * Crate a controllers directory.
    * `mkdir controllers`
    * [Please note: The proper and conventional way to setup Express Routing is subject to opinion. This is my opinion.]
  * Create errorWrapper.js to use for each route in both our controllers.
    * `touch controllers/errorWrapper.js`
    * Copy and paste the following into errorWrapper.js:
    ```
    // =====================================
    // Error Catching ======================
    // =====================================
    // This function passes any errors produces in any routes/functions that are wrapped within it to the error handler in server.js.
    function errorWrapper(fn) {
      return function(req, res, next) {
        fn(req, res, next).catch(next);
      };
    }
    module.exports = errorWrapper;
    ```
  * Create controller for our Static Object in controllers directory.
    * `touch controllers/exampleObjectController.js`
    * Copy and paste the following into exampleObjectController.js:
      * Please note, I've only included GET routes for simplicity as a complete CRUD set of routes is outside the scope of this tutorial.
    ```
    // ======================================
    // ======================================
    // This controller manipulates a single object using RESTful routes.
    // These routes include error catching and Object based returns.
    // ======================================
    // ======================================

    const express = require('express');
    const exampleObjectRouter = express.Router();
    const errorWrapper = require('./errorWrapper.js');

    // ======================================
    // The object to manipulate in place of read/write to a database.
    const helloWorld = [
      {id: 1, message: 'Hello World!'},
      {id: 2, message: 'This is pretty cool.'},
      {id: 3, message: 'You got this working!'},
      {id: 4, message: 'Amazing job!'}
    ]

    // ======================================
    // Get all Examples.
    // ROUTE: GET `/api/examples/`
    exampleObjectRouter.get('/', errorWrapper(async (req, res, next) => {
      // "Database" query.
      const readResults = helloWorld

      // Return HTTP status and JSON results object.
      return res.status(200).json({
        success: true,
        message: 'API returned list of all Examples',
        results: readResults
      });
    }));

    // ======================================
    // Get individual Example.
    // ROUTE: GET `api/examples/:exampleId`
    exampleObjectRouter.get('/:exampleId', errorWrapper(async (req, res, next) => {
      // Throw Error if body contains exampleId.
      if (req.body.exampleId) { throw new Error('Request body cannot contain exampleId') };

      // "Database" query.
      const readResults = helloWorld[req.params.exampleId]
      // Throw error if Example does not exist.
      if (!readResults) { throw new Error("Example with provided exampleId does not exist") };

      // Return HTTP status and JSON results object.
      return res.status(200).json({
        success: true,
        message: 'API returned Example with exampleId of ' + req.params.exampleId,
        results: readResults
      });
    }));

    // ======================================
    module.exports = exampleObjectRouter;
    ```
  * Add and Commit the changes to git.
    * `git add .`
    * `git commit -m "Initial commit. Object Routing Implemented."`
  * Create a Github repo & push up.
    * `git remote add origin <repoLink>`
    * `git push -u origin master`
  * Make sure you test the functionality using POSTman.
    * Start your local API in development:
      * `npm run dev` or 'yarn dev'
    * Then connect to the localhost routes.
      * Default Route: `localhost:5000/api/object/examples`
    * Once the Object based API is funtional, then move on to the next section.
------
# Setting up Digital Ocean:
## The Project (Houses API & PostgreSQL DB):
  * Create a Digital Ocean Account.
    * `https://www.digitalocean.com/`
  * Create a Project
    * For this I used the name "Simple"

## The API:
  * Create a Droplet (Cloud Server) in the project (For the purposes of these notes, I have elected to use a marketplace setup).
    * These are the options I chose to use:
      * Image (Distribution / OS): `Ubuntu 18.04.3 (LTS) x64`
      * Plan: `Standard, $5 mo` (Plan is technically free for 600 hours).`
      * Datacenter: `San Francisco [2]`
      * Additional Options: `Monitoring`
      * Authentication: `Create SSH Key` (Follow the Steps).
        * Identification File: `simple`
        * Public Key File: `simple.pub`
        * Public Key: Just copy the ENTIRE `simple.pub`.
        * Passphrase: Dont forget this.
        * Update your .gitignore to include both key files. DO NOT SKIP THIS PART!
      * Amount of Droplets: `1`
      * Droplet Hostname: `simple-001`
      * Selected Project: `Simple` (The one we just created)
  * Login from your local terminal:
    * `ssh root@<dropletIP>`
  * Accept the query: "Are you sure you want to continue connecting (yes/no)?"
    * `Are you sure you want to continue connecting (yes/no)?`
  * Now that you have accepted the query, use the ssh login one more time:
    * `ssh root@<dropletIP>`
    * [Optional] If you use `ssh root@<dropletIP>` and it returns "root@<dropletIP>: Permission denied (publickey)." then you have multiple SSH keys on your local system. To specify the key in the command line use:
      * `ssh -i <pathToSSHKey> <user/root>@<dropletIP>`
      * This will prompt you for your SSH passphrase. Enter that and you should have access.
        * If the above does not work, I ended up having to destroy and recreate the droplet.
  * Now we need to 'open' the port our API will accept calls from (specified as port 5000  in server.js):
    * `ufw allow 5000`
    * For additional info check out `http://do.co/node1804`
  * In the root directory of your droplet, clone your github repo:
    * `git clone <githubRepo>`
  * Enter the newly created repo:
    * `cd <repoName>`
  * Install everything using NPM (Mine produces an error but works perfectly)
    * `npm install`
    * Error to ignore: `npm ERR! enoent ENOENT: no such file or directory, chmod '/root/Simple/node_modules/node/bin/node'`
  * Start the API
    * `npm start`
    * If NPM fails to start with an error similar to: ``
      * Then the port you are trying to use is already in use.
      * Check port usage for Node on port <Port> with `sudo lsof -iTCP -sTCP:LISTEN -P`
        * I.E. `node 18534 root 12u IPv6 42780 0t0 TCP *:5000 (LISTEN)`
      * You can resolve this error by simply turning the Droplet on and off using:
        * `sudo poweroff`
        * and then turning the droplet back on via the Droplet panel in your browser.
  * Test the API using postman.
    * Link for POSTman should show in terminal:
    ```
    root@simple-001:~/Simple# npm start

    > simpleAPI@1.0.0 start /root/Simple
    > NODE_ENV=production node server.js

    ===============================
    API successfully loaded.
    NODE_ENV: production
    Test functionality with POSTman using the following route:
          138.197.194.240:5000/api/object/examples
    Listening on port: 5000
    ===============================
    ```
    * Copy and paste the link into POSTman, and, success!

## The PostgreSQL Database
### Preparing the API to communicate:
  * Add our database dependencies:
    * `yarn add knex moment pg dotenv`
    * (Also note: I have to manually set the Knex version to 16.5 for it to work properly with my setup. If you do need to change the version, make sure to run npm install again).
    * The package.json should looks something like this:
    ```
    {
      "name": "simpleAPI",
      "version": "1.0.0",
      "main": "index.js",
      "license": "MIT",
      "dependencies": {
        "dotenv": "^8.1.0",
        "express": "^4.17.1",
        "helmet": "^3.21.1",
        "knex": "0.16.5",
        "moment": "^2.24.0",
        "morgan": "^1.9.1",
        "node": "^12.12.0",
        "path": "^0.12.7",
        "pg": "^7.12.1"
      },
      "scripts": {
        "dev": "NODE_ENV=development node server.js",
        "start": "NODE_ENV=production node server.js"
      }
    }
    ```
  * Create our local database (Assumes you have PG installed locally):
    * `createdb simple`
  * Initiate Knex
    * `knex init`
    * Copy and paste the following into knexfile.js in your local root directory:
    ```
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
    ```
  * Add our database "activation" into our server.js (Just under the Router Setup)
    ```
    // =====================================
    // Database Setup ======================
    // =====================================
    // Activates our database detection and creation in db.js.
    const database = require('./db/Database.js');
    ```
  * Create our Database.js file in the db directory:
    * `mkdir db`
    * `touch db/Database.js`
    * Copy and paste the following into Database.js in your local root directory:
    ```
    var pg = require('pg');

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
    ```
  * Create our Migration:
    * `knex migrate:make examples`
    * Copy and paste the following into db/migrations/xxxxxxx_examples.js:
    ```
    exports.up = function(knex, Promise) {
      return Promise.all([
        knex.schema.createTable('examples', function(table) {
          table.increments('exampleId').primary();
          table.string('name').notNull();
          table.string('username').notNull();
          table.string('number').notNull();
          table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now());
          table.timestamp('updatedAt', { useTz: true }).defaultTo(knex.fn.now());
        })
      ])
    };

    exports.down = function(knex, Promise) {
      return Promise.all([
        knex.schema.dropTable('examples')
      ])
    };
    ```
  * Create our Seed data:
    * `knex seed:make 001_Examples`
    * Copy and paste the following into db/seeds/001_Examples.js:
    ```
    exports.seed = function(knex, Promise) {
      // Deletes ALL existing entries
      return knex('examples').del()
      .then(function () {
        // Inserts seed entries
        return knex('examples').insert([
          {
            name: 'Blaine Anderson',
            username: 'Mordred',
            number: 5
          },
          {
            name: 'Kelli Anderson',
            username: 'WickedWife',
            number: 7
          },
          {
            name: 'Chris Potter',
            username: 'Steel_Rabbit',
            number: 15
          },
          {
            name: 'Justin Robare',
            username: 'Lionell',
            number: 3
          },
          {
            name: 'Andy',
            username: 'Percival',
            number: 352
          }
        ]);
      });
    };
    ```
    * (Keep in mind, this is just to test the functionality of the API's connection to the local PG DB. Normally you would not pre-seed data into any production app.)
  * Finish setting up exampleDatabaseController.js:
    * Copy and paste the following into controllers/exampleDatabaseController.js:
    ```
    // ======================================
    // ======================================
    // This controller manipulates a single object using RESTful routes.
    // These routes include error catching and Object based returns.
    // ======================================
    // ======================================

    const express = require('express');
    const exampleObjectRouter = express.Router();
    const errorWrapper = require('./errorWrapper.js');
    const database = require('../db/Database.js');
    const moment = require('moment');

    // ======================================
    // Get all Examples.
    // ROUTE: GET `/api/examples/`
    exampleObjectRouter.get('/', errorWrapper(async (req, res, next) => {
      // Knex database query.
      const readResults = await database('examples')
        .select('*')
        .orderBy('exampleId', 'asc')
        .catch((err) => { throw new Error(err) });

        // Return HTTP status and JSON results object.
        return res.status(200).json({
          success: true,
          message: 'API returned list of all Examples',
          results: readResults
        });
    }));

    // ======================================
    // Get individual Example.
    // ROUTE: GET `api/examples/:exampleId`
    exampleObjectRouter.get('/:exampleId', errorWrapper(async (req, res, next) => {
      // Throw Error if body contains exampleId.
      if (req.body.exampleId) { throw new Error('Request body cannot contain exampleId') };

      // "Database" query.
      const readResults = helloWorld[req.params.exampleId]
      // Throw error if Example does not exist.
      if (!readResults) { throw new Error("Example with provided exampleId does not exist") };

      // Return HTTP status and JSON results object.
      return res.status(200).json({
        success: true,
        message: 'API returned Example with exampleId of ' + req.params.exampleId,
        results: readResults
      });
    }));

    // ======================================
    module.exports = exampleObjectRouter;
    ```
  * Add the router for exampleDatabaseController.js to server.js:
    * Copy & add this line into the routing section in server.js:
    ```
    app.use('/api/database/examples', require('./controllers/exampleDatabaseController.js'));
    ```
  * Lastly, add a .env file in your root directory, which we will use later:
    * `touch .env`
  * With everything done, boot up locally and make sure the routes work via POSTman.
    * `npm run dev`
    * Test route: `localhost:5000/api/database/examples`
    * It should return all the seeded data.
    * Now we can create a PG DB in Digital Ocean.

### Creating a Database Cluster (Cloud hosted PostgreSQL Database):
  * Create a Database Cluster in the Simple project on Digital Ocean (I chose the following options):
    * Database Engine: PostgreSQL 11
    * Cluster Configuration:
      * Node Plan: $15 a mo (cheapest option)
      * Datacenter: San Francisco 2
    * Cluster Name: simple-db
    * Selected Project: Simple
  * While Digital Ocean creates the Cluster (about 5+ minutes), they provide a very easy to use setup tutorial we will follow:
    * Click "Get Started"
    * Restrict Inbound Connections:
      * I set my local IP as well as the Droplet with my API on it. Digital Ocean has a dropdown to easily select your choices.
      * `<LocalIp>` & `simple-001`
      * Click "Allow these inbound sources only"
    * You should now see connection options. We only need a single line from the connection string tab:
      * Please note this has been altered:
      * `postgresql://doadmin:PASSWORD@simple-db-do-user-6458891-0.db.ondigitalocean.com:25060/defaultdb?sslmode=require`
      * Copy the connection string and add it into your .env file under the env varaible name `SIMPLE_DATABASE_URL`
        * I.E. `SIMPLE_DATABASE_URL=postgresql://doadmin:PASSWORD@simple-db-do-user-6458891-0.db.ondigitalocean.com:25060/defaultdb?sslmode=require`
      * Click "Continue"
    * Click "Great, I'm done"
  * The last thing we need to setup is update our knexfile.js to reflect the new .env changes:
    * We are adding a requirement to use Dotenv and setting the env variable to use when connecting. Copy and paste the following over knexfile.js:
    ```
    require('dotenv').config()
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
        connection: process.env.SIMPLE_DATABASE_URL,
        ssl: true,
        pool: {
          min: 2,
          max: 10
        },
        migrations: {
            directory: __dirname + '/db/migrations',
        },
        seeds: {
            directory: __dirname + '/db/seeds',
        }
      }

    };
    ```
  * Lets test the connection to the Cluster using our local API:
    * We need to run NPM in production mode so it uses the connection string to our Cluster from .env.
    * `npm run start`
    * Then call the database API `localhost:5000/api/database/examples`
    * Make sure to git add and git commit. You'll have to pull these changes in the droplet soon.

## Connecting our Droplet (Cloud based API) to our Cluster (Cloud based PostgreSQL Database)
  * Now that both of our cloud based operations are setup, let's make them talk to each other!
  * You had to use a `.env` to keep the connection URL secure on your local API, and now we'll need to do the same thing to the Droplet API.
  * In your local terminal connect to the droplet using SSH (You can also do this via the connection via console on Digital Ocean, but I chose to do it this way.):
    * `ssh -i <pathToSSHKey> <user/root>@<dropletIP>`
  * Enter the directory for your API:
    * `cd <AppName>`
  * Create a .env file:
    * `touch .env`
  * Open the .env file using Nano (or VIM):
    * `nano .env`
  * Once in the Nano editor, add the same line for the Database Url you did in your local API (Use your own, this one wont work for you):
    ```
    SIMPLE_DATABASE_URL=postgresql://doadmin:PASSWORD@simple-db-do-user-6458891-0.db.ondigitalocean.com:25060/defaultdb?sslmode=require
    ```
    * Save the file using `Ctrl + O`
    * Confirm the save with `Enter`
    * You should see a message with `[ Wrote ___ lines ]`. This means it was successful.
    * Leave the Nano editor with `Ctrl + X`
  * Now that the .env file is setup, our API will try to connect to our PostgreSQL Database when we load in production mode:
    * First, remember to pull the new master: `git pull origin master`
    * Then start the server: `npm run start`
  * Moment of truth. Upon startup, the migrations and seeds should have run. Now we want to call the seeded data via the API using POSTman:
    * `<DropletIp>:5000/api/database/examples`
  * Voila! You have successfully setup both an API and a PostgreSQL Database in the cloud!

## Ensuring the API continues to run on restarts and crashes
  * So now that everything is connected, we have to make sure it stays functional in worst case scenarios.
  * In the API directory, using the droplets terminal, install pm2 (Program Manager 2)[https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/]
    * `npm install pm2`
  * Now we need to run it with specific instructions to use OUR package.json script, not the pm2 default:
    * `pm2 start npm -- start`
    * `pm2 start npm -- [ScriptName]`
  * Check the API using POSTman (make sure to check the database connection, thats the important bit)
  * Provided everything works, we now neet to tell pm2 to start back up on restarts or crashes:
    * `pm2 startup systemd`
    * This will tell pm2 that this process should never be offline.
  * A list of useful commands to keep the app running using only basics:
    * Start pm2 using a specific package.json script:
      * `pm2 start npm -- start`
    * Set the currently running 'app' to reload on restart or crash:
      * `pm2 startup systemd`
    * Monitor the usage and console of any running pm2 apps:
      * `pm2 monit`
    * Stop an app / all apps:
      * `pm2 kill [name/id]`
    * Show the last 15 lines of logs for pm2 tailing, and for npm output [optional increase to 200 lines]:
      * `pm2 logs [--lines 200]`
    * Restart the selected pm2 app:
      * `pm2 restart (appName)`
  * That should do it. App safely running with 'minimal' chance of failure! A+!
