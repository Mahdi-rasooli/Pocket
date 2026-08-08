const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const { validateBody, validateObjectIdParam } = require('../middleware/validate');
const schemas = require('../schemas/incomeSchemas');
const { list, create, replace, deactivate, remove, exportCSV, importCSV } = require('../controllers/incomeController');

const router = express.Router();
router.use(auth);

router.get('/', asyncHandler(list));
router.get('/export', asyncHandler(exportCSV));
router.post('/import', validateBody(schemas.importCsv), asyncHandler(importCSV));
router.post('/', validateBody(schemas.create), asyncHandler(create));
router.put('/:id/replace', validateObjectIdParam('id'), validateBody(schemas.replace), asyncHandler(replace));
router.patch('/:id/deactivate', validateObjectIdParam('id'), validateBody(schemas.deactivate), asyncHandler(deactivate));
router.delete('/:id', validateObjectIdParam('id'), asyncHandler(remove));

module.exports = router;
