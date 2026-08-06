const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { list, create, update, deactivate, remove } = require('../controllers/expenseController');

const router = express.Router();
router.use(auth);

router.get('/', asyncHandler(list));
router.post('/', asyncHandler(create));
router.put('/:id', asyncHandler(update));
router.patch('/:id/deactivate', asyncHandler(deactivate));
router.delete('/:id', asyncHandler(remove));

module.exports = router;
