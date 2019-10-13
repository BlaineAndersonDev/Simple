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
