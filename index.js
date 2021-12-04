const { ObjectId } = require('mongodb');
const { RequestHandler } = require('express');

function newError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * Validates an ObjectId that is part of the path
 * and adds the validated ObjectId to the request.
 *
 * Calls the next middleware if ObjectId is valid.
 * Sends a 404 response if the ObjectId is invalid.
 *
 * @param {string} paramName the name of the path parameter
 * @returns {RequestHandler} a middleware
 */
function validId(paramName) {
  return (req, res, next) => {
    const paramValue = req.params[paramName];
    try {
      if (!paramValue) {
        throw new Error('parameter not provided');
      } else {
        req[paramName] = new ObjectId(paramValue);
        return next();
      }
    } catch (err) {
      return next(
        newError(404, `${paramName} "${paramValue}" is not a valid ObjectId.`)
      );
    }
  };
}

module.exports = validId;
