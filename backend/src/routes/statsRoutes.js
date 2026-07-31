const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { daily, monthly, categories, trend } = require('../controllers/statsController');

const router = express.Router();
router.use(auth);

router.get('/daily', asyncHandler(daily));
router.get('/monthly', asyncHandler(monthly));
router.get('/categories', asyncHandler(categories));
router.get('/trend', asyncHandler(trend));

module.exports = router;
