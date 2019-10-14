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
