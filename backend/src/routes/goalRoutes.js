const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const auth = require('../middleware/auth');
const {
  list, create, update, remove, projections, addCollaborator, removeCollaborator,
} = require('../controllers/goalController');

const router = express.Router();
router.use(auth);

router.get('/', asyncHandler(list));
router.post('/', asyncHandler(create));
router.put('/:id', asyncHandler(update));
router.delete('/:id', asyncHandler(remove));
router.get('/:id/projections', asyncHandler(projections));
router.post('/:id/collaborators', asyncHandler(addCollaborator));
router.delete('/:id/collaborators/:userId', asyncHandler(removeCollaborator));

module.exports = router;
