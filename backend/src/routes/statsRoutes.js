const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { validateQuery } = require('../middleware/validate');
const schemas = require('../schemas/statsSchemas');
const { daily, monthly, categories, trend } = require('../controllers/statsController');

const router = express.Router();
router.use(auth);

router.get('/daily', validateQuery(schemas.dailyQuery), asyncHandler(daily));
router.get('/monthly', validateQuery(schemas.monthlyQuery), asyncHandler(monthly));
router.get('/categories', validateQuery(schemas.categoriesQuery), asyncHandler(categories));
router.get('/trend', validateQuery(schemas.trendQuery), asyncHandler(trend));

module.exports = router;
