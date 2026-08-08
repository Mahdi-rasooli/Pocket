const mongoose = require('mongoose');

// A malformed :id (or :userId) route param — anything not a valid ObjectId —
// otherwise reaches Mongoose and throws a CastError, which the generic error
// handler turns into a 500 with a raw driver error message. This catches it
// upstream as a clean 400 instead.
function validateObjectIdParam(paramName) {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return res.status(400).json({ error: `Invalid ${paramName}` });
    }
    next();
  };
}

// Validates req.body (or req.query) against a zod schema, replacing it with the
// parsed/coerced result on success. Centralizing this here means every mutating
// route gets consistent type-checking instead of ad-hoc `if (!x) return 400`
// checks — those miss type confusion (e.g. `{"email": {"$ne": null}}` sailing
// through a truthiness check as a non-empty object) that zod rejects outright.
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0]?.message || 'Invalid request body' });
    }
    req.body = result.data;
    next();
  };
}

function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0]?.message || 'Invalid query parameters' });
    }
    req.query = result.data;
    next();
  };
}

module.exports = { validateBody, validateQuery, validateObjectIdParam };
