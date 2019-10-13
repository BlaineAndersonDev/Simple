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
