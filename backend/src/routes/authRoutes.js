const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { validateBody } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiters');
const schemas = require('../schemas/authSchemas');
const { register, login } = require('../controllers/authController');

const router = express.Router();
router.use(authLimiter);

router.post('/register', validateBody(schemas.register), asyncHandler(register));
router.post('/login', validateBody(schemas.login), asyncHandler(login));

module.exports = router;
