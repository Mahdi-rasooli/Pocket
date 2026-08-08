const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { validateBody, validateQuery, validateObjectIdParam } = require('../middleware/validate');
const schemas = require('../schemas/expenseSchemas');
const { list, create, update, deactivate, remove, exportCSV, importCSV } = require('../controllers/expenseController');

const router = express.Router();
router.use(auth);

router.get('/', validateQuery(schemas.listQuery), asyncHandler(list));
router.get('/export', asyncHandler(exportCSV));
router.post('/import', validateBody(schemas.importCsv), asyncHandler(importCSV));
router.post('/', validateBody(schemas.create), asyncHandler(create));
router.put('/:id', validateObjectIdParam('id'), validateBody(schemas.update), asyncHandler(update));
router.patch('/:id/deactivate', validateObjectIdParam('id'), validateBody(schemas.deactivate), asyncHandler(deactivate));
router.delete('/:id', validateObjectIdParam('id'), asyncHandler(remove));

module.exports = router;
