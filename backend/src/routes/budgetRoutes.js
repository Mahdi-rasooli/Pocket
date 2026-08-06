const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { list, upsert, remove } = require('../controllers/budgetController');

const router = express.Router();
router.use(auth);

router.get('/', asyncHandler(list));
router.post('/', asyncHandler(upsert));
router.delete('/:category', asyncHandler(remove));

module.exports = router;
