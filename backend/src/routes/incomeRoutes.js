const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { list, create, replace, deactivate, remove, exportCSV, importCSV } = require('../controllers/incomeController');

const router = express.Router();
router.use(auth);

router.get('/', asyncHandler(list));
router.get('/export', asyncHandler(exportCSV));
router.post('/import', asyncHandler(importCSV));
router.post('/', asyncHandler(create));
router.put('/:id/replace', asyncHandler(replace));
router.patch('/:id/deactivate', asyncHandler(deactivate));
router.delete('/:id', asyncHandler(remove));

module.exports = router;
