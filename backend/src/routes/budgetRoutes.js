const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const schemas = require('../schemas/budgetSchemas');
const { list, upsert, remove } = require('../controllers/budgetController');

const router = express.Router();
router.use(auth);

router.get('/', asyncHandler(list));
router.post('/', validateBody(schemas.upsert), asyncHandler(upsert));
router.delete('/:category', asyncHandler(remove));

module.exports = router;
